// c:\Users\hamdan\Documents\GitHub\hackathon2505_018_agusheryanto182\fullstack\services\dify\chat-service.ts
import { AxiosResponse } from 'axios';
import difyClient from '../../lib/dify-client';
import { DifyChatMessageRequest, DifyChatCompletionResponse } from './interfaces/chat-message';

type ReadableStream = NodeJS.ReadableStream;

/**
 * Sends a chat message to the Dify API.
 *
 * @param request The chat message request object.
 * @returns A promise that resolves to:
 *          - `DifyChatCompletionResponse` if `response_mode` is 'blocking'.
 *          - `AxiosResponse<ReadableStream>` if `response_mode` is 'streaming',
 *            allowing the caller to process the Server-Sent Events stream.
 * @throws Will throw an error if the API request fails.
 */
export const sendChatMessageToDify = async (
  request: DifyChatMessageRequest,
): Promise<DifyChatCompletionResponse | AxiosResponse<ReadableStream>> => {
  try {
    // The Dify documentation does not explicitly state the endpoint for chat messages.
    // '/chat-messages' is a common convention and used here as a placeholder.
    // Please verify the correct endpoint from the official Dify API documentation.
    const endpoint = '/chat-messages';

    if (request.response_mode === 'streaming') {
      const response = await difyClient.post<ReadableStream>(endpoint, request, {
        responseType: 'stream',
      });
      return response;
    } else {
      const response = await difyClient.post<DifyChatCompletionResponse>(endpoint, request);
      return response.data;
    }
  } catch (error) {
    // The difyClient's interceptor already logs the error.
    // Re-throwing the error allows the caller to handle it appropriately.
    console.error('Error during Dify chat message service call');
    throw error;
  }
};
