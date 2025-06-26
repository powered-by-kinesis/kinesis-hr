import { NextResponse, NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { sendChatMessageToDify } from '@/services/dify/chat-service';
import {
  DifyChatMessageRequest,
  DifyChatCompletionResponse,
  DifyChatFileParameter,
  DifyChunkChatCompletionResponse,
} from '@/services/dify/interfaces/chat-message';
import { AxiosError, AxiosResponse } from 'axios';
import { Readable } from 'stream';
import { SendChatRequestDTO } from '@/types/chat/SendChatRequestDTO';
import prisma from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const userId = session.user.id;

    const body: SendChatRequestDTO = await req.json();
    console.log('Received chat request:', body);

    if (!body.query || !body.responseMode || !body.contextId) {
      return NextResponse.json(
        { error: 'Missing required fields: query, responseMode, and contextId' },
        { status: 400 },
      );
    }

    if (body.responseMode !== 'streaming' && body.responseMode !== 'blocking') {
      return NextResponse.json(
        { error: "Invalid responseMode: must be 'streaming' or 'blocking'" },
        { status: 400 },
      );
    }

    // get context
    const context = await prisma.context.findUnique({
      where: { id: body.contextId },
      include: { documents: { include: { document: true } } },
    });
    if (!context) {
      return NextResponse.json({ error: 'Context not found' }, { status: 404 });
    }

    const cvFiles: DifyChatFileParameter[] = context.documents.map((doc) => ({
      type: 'document',
      transfer_method: 'remote_url',
      url: doc.document.filePath,
    }));

    const difyApiRequest: DifyChatMessageRequest = {
      query: body.query,
      user: userId.toString(),
      response_mode: body.responseMode,
      conversation_id: body.conversationId, // Optional, can be undefined
      inputs: {
        job_descriptions: context.jobDescription,
        local_language: context.localLanguage,
        cv_files: cvFiles,
        fn_call: body.fn_call || undefined,
      },
    };

    const difyServiceResponse = await sendChatMessageToDify(difyApiRequest);

    if (difyApiRequest.response_mode === 'streaming') {
      const axiosStreamResponse = difyServiceResponse as AxiosResponse<Readable>;
      const nodeStream = axiosStreamResponse.data;

      let tempConversationId: string | undefined;
      let serverBuffer = ''; // Buffer for data from Dify stream

      const webStream = new ReadableStream({
        start(controller) {
          nodeStream.on('data', (chunk: Buffer | string) => {
            serverBuffer += typeof chunk === 'string' ? chunk : chunk.toString('utf8');

            // Process complete SSE events from the serverBuffer
            while (serverBuffer.includes('\n\n')) {
              const eventEndIndex = serverBuffer.indexOf('\n\n');
              const event = serverBuffer.substring(0, eventEndIndex); // A single SSE line, e.g., "data: {...}"
              serverBuffer = serverBuffer.substring(eventEndIndex + 2); // Consume the event and the delimiter

              if (event.startsWith('data: ')) {
                try {
                  const jsonData = JSON.parse(event.substring(6));
                  const difyChunk = jsonData as DifyChunkChatCompletionResponse;

                  if (
                    difyChunk.event === 'message_end' &&
                    'conversation_id' in difyChunk &&
                    difyChunk.conversation_id
                  ) {
                    tempConversationId = difyChunk.conversation_id;
                  }
                  controller.enqueue(new TextEncoder().encode(event + '\n\n'));
                } catch (parseError) {
                  console.error(
                    'Error parsing Dify stream chunk on server:',
                    parseError,
                    'Malformed JSON string:',
                    event.substring(6),
                  );
                  controller.enqueue(new TextEncoder().encode(event + '\n\n'));
                }
              } else if (event.trim() !== '') {
                // Forward other SSE lines (like 'event: type', comments, etc.)
                controller.enqueue(new TextEncoder().encode(event + '\n\n'));
              }
            }
          });
          nodeStream.on('end', async () => {
            // Handle any remaining data in serverBuffer (e.g. if stream didn't end with \n\n)
            if (serverBuffer.trim() !== '') {
              console.warn(
                "Dify stream ended with remaining data in server's buffer:",
                serverBuffer,
              );
            }

            if (tempConversationId && !body.conversationId) {
              await prisma.chat.create({
                data: {
                  contextId: body.contextId,
                  title: body.title || 'New Chat',
                  difyConversationId: tempConversationId,
                },
              });
              console.log(`Created new chat with Dify conversation ID: ${tempConversationId}`);
            }
            controller.close();
          });
          nodeStream.on('error', (err: Error) => {
            console.error('Error from Dify stream:', err);
            controller.error(err);
          });
        },
        cancel() {
          const nodeJsStreamToDestroy: Readable = nodeStream;
          nodeJsStreamToDestroy.destroy();
        },
      });

      const headers = new Headers({
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      });

      return new NextResponse(webStream, {
        headers,
        status: 200,
      });
    } else {
      const difyResponse = difyServiceResponse as DifyChatCompletionResponse;

      // If it's a new conversation, create the chat entity now
      if (
        !body.conversationId &&
        difyResponse.conversation_id &&
        body.fn_call !== 'candidate-rank'
      ) {
        await prisma.chat.create({
          data: {
            contextId: body.contextId,
            title: body.title || 'New Chat',
            difyConversationId: difyResponse.conversation_id,
          },
        });
        console.log(`Created new chat with Dify conversation ID: ${difyResponse.conversation_id}`);
      }

      return NextResponse.json(difyResponse, { status: 200 });
    }
  } catch (error) {
    console.error('Error in POST /api/chat:', error);
    if (error instanceof AxiosError) {
      return NextResponse.json(
        { error: 'Dify API error', details: error.response?.data || error.message },
        { status: error.response?.status || 500 },
      );
    }
    return NextResponse.json(
      { error: 'Internal server error', details: (error as Error).message },
      { status: 500 },
    );
  }
}
