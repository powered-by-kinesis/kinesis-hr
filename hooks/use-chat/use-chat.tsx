import { ChatMessage } from '@/types/chat/chat';
import { SendChatRequestDTO } from '@/types/chat/SendChatRequestDTO';
import { useState, useCallback } from 'react';
import {
  DifyChunkChatCompletionResponse,
  DifyMessageEndStreamEvent,
  DifyMessageStreamEvent,
} from '@/services/dify/interfaces/chat-message';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { toast } from 'sonner';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [contextId, setContextId] = useState<number | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [title, setTitle] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ContextResponseDTO[]>([]);
  const [startupModalOpen, setStartupModalOpen] = useState(true);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const setContextAndTitle = useCallback((newContextId: number, newTitle: string) => {
    setContextId(newContextId);
    setTitle(newTitle);
    setMessages([]);
    setConversationId(null);
  }, []);

  const handleSubmit = async (message: string) => {
    if (!message.trim() || !contextId) {
      setStartupModalOpen(true);
      return;
    }

    setIsThinking(true);
    setError(null);

    const userMessage: ChatMessage = {
      query: message.trim(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const isStartingNewChat = !conversationId;

    try {
      const requestBody: SendChatRequestDTO = {
        query: userMessage.query as string,
        responseMode: 'streaming',
        contextId: contextId,
        conversationId: conversationId || undefined,
        title: title || undefined,
      };

      const response = await fetch('/api/chats/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get readable stream from response.');
      }

      let assistantResponseContent = '';
      setMessages((prevMessages) => [
        ...prevMessages,
        { answer: { reasoning: '', answer: '' } }, // Placeholder for assistant's response
      ]);

      let buffer = '';
      const decoder = new TextDecoder('utf-8');

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value, { stream: true });

        // Process complete events separated by \n\n
        while (buffer.includes('\n\n')) {
          const eventEndIndex = buffer.indexOf('\n\n');
          const eventString = buffer.substring(0, eventEndIndex);
          buffer = buffer.substring(eventEndIndex + 2); // Remove processed event and delimiter from buffer

          if (eventString.startsWith('data: ')) {
            const jsonString = eventString.substring(6);
            if (jsonString.trim() !== '') {
              // Ensure there's actual data
              try {
                const difyChunk = JSON.parse(jsonString) as DifyChunkChatCompletionResponse;

                if (difyChunk.event === 'message') {
                  const messageEvent = difyChunk as DifyMessageStreamEvent;
                  assistantResponseContent += messageEvent.answer;
                  setMessages((prevMessages) => {
                    const lastMessage = prevMessages[prevMessages.length - 1];
                    if (lastMessage && lastMessage.answer && lastMessage.query === undefined) {
                      return [
                        ...prevMessages.slice(0, -1),
                        {
                          ...lastMessage,
                          answer: {
                            ...lastMessage.answer,
                            answer: assistantResponseContent,
                          },
                        },
                      ];
                    }
                    return prevMessages;
                  });
                } else if (difyChunk.event === 'message_end') {
                  const messageEndEvent = difyChunk as DifyMessageEndStreamEvent;
                  if (messageEndEvent.conversation_id) {
                    setConversationId(messageEndEvent.conversation_id);
                  }
                }
              } catch (parseError) {
                console.error(
                  'Error parsing Dify stream chunk:',
                  parseError,
                  'Malformed JSON string:',
                  jsonString,
                );
              }
            }
          } else if (eventString.trim() !== '') {
            // Handle other SSE lines if necessary (e.g., comments, event type declarations)
            console.log('Received non-data SSE line:', eventString);
          }
        }

        if (done) {
          if (buffer.trim() !== '') {
            console.warn('Stream ended with unprocessed data in buffer:', buffer);
          }
          break;
        }
      }

      if (isStartingNewChat) {
        await getChatHistory();
      }
    } catch (err) {
      console.error('Chat API error:', err);
      setError((err as Error).message || 'An unexpected error occurred.');
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => !(msg.query === undefined && msg.answer?.answer === '')),
      );
    } finally {
      setIsThinking(false);
    }
  };

  const getChatHistory = useCallback(async () => {
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/chats');
      const data = await response.json();
      setChatHistory(data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsChatLoading(false);
    }
  }, []);

  const getConversationHistoryMessages = async (difyConversationId: string, contextId: number) => {
    setIsMessageLoading(true);
    try {
      const response = await fetch(`/api/chats/${difyConversationId}`);
      if (!response.ok) throw new Error('Failed to fetch conversation history');

      const result = await response.json();

      const transformedMessages: ChatMessage[] = result.data.data.map((msg: ChatMessage) => ({
        query: msg.query || undefined,
        answer: msg.answer ? { reasoning: '', answer: msg.answer } : undefined,
      }));

      setContextId(contextId);
      setMessages(transformedMessages);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  const deleteContext = async (id: number) => {
    setIsDeleteLoading(true);
    toast.loading('Deleting context...');
    try {
      const response = await fetch(`/api/contexts/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete context');
      setChatHistory((prevChatHistory) => prevChatHistory.filter((chat) => chat.id !== id));
      setMessages([]);
      setContextId(null);
      setConversationId(null);
      setTitle(null);
      toast.dismiss();
      toast.success('Context deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to delete context');
    } finally {
      setIsDeleteLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setContextId(null);
    setConversationId(null);
    setTitle(null);
  };

  const handleStartupModalOpenChange = (open: boolean) => {
    setStartupModalOpen(open);
  };

  const updateChatHistory = useCallback((contextId: number, updatedContext: ContextResponseDTO) => {
    setChatHistory((prevChatHistory) =>
      prevChatHistory.map((chat) =>
        chat.id === contextId ? { ...chat, ...updatedContext } : chat,
      ),
    );
  }, []);

  return {
    messages,
    chatHistory,
    error,
    contextId,
    conversationId,
    title,
    startupModalOpen,
    isChatLoading,
    isMessageLoading,
    isThinking,
    isDeleteLoading,
    setContextId,
    handleSubmit,
    setContextAndTitle,
    getChatHistory,
    getConversationHistoryMessages,
    deleteContext,
    handleNewChat,
    handleStartupModalOpenChange,
    setMessages,
    setStartupModalOpen,
    updateChatHistory,
  };
}
