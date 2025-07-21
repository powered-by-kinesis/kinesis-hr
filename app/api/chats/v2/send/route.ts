import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { Readable } from 'stream';

interface ExternalLLMPayload {
  query: string;
  conversation_id: string;
}

export async function POST(req: NextRequest) {
  try {
    // Parse the request body
    const body = await req.json();
    console.log('Received chat request for external LLM:', body);

    // Validate the payload based on the user's provided structure
    if (!body.query || !body.conversation_id) {
      return NextResponse.json(
        { error: 'Missing required fields: query and conversation_id' },
        { status: 400 },
      );
    }

    const payload: ExternalLLMPayload = body;

    const axiosResponse = await axios.post<Readable>(
      `${process.env.API_URL}/api/v1/conversations/stream`,
      payload,
      {
        responseType: 'stream',
      },
    );

    const nodeStream = axiosResponse.data;

    const webStream = new ReadableStream({
      start(controller) {
        nodeStream.on('data', (chunk: Buffer | string) => {
          controller.enqueue(new TextEncoder().encode(chunk.toString()));
        });
        nodeStream.on('end', () => {
          controller.close();
        });
        nodeStream.on('error', (err: Error) => {
          console.error('Error from external LLM stream:', err);
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
  } catch (error) {
    console.error('Error in POST /api/chats/v2/send:', error);

    if (axios.isAxiosError(error)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const axiosError = error as any;
      const errorMessage =
        axiosError.response?.data?.error || axiosError.message || 'An unknown error occurred';
      const statusCode = axiosError.response?.status || 500;
      return NextResponse.json(
        { error: 'Failed to communicate with external LLM', details: errorMessage },
        { status: statusCode },
      );
    } else {
      return NextResponse.json(
        { error: 'Internal server error', details: (error as Error).message },
        { status: 500 },
      );
    }
  }
}
