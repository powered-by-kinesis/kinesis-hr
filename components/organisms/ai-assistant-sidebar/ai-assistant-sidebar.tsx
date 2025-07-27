'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { AssistantMessage } from './assistent-message';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantSidebarProps {
  className?: string;
}

const quickQuestions = [
  'What are the best practices for conducting interviews?',
  'How do I create an effective job posting?',
  'What are common HR compliance issues?',
  'How to improve employee retention?',
];

const SESSION_KEY = 'kinesis-ai-assistant-messages';
const MAX_MESSAGES = 50;

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({ className }) => {
  const { isMinimized, minimize, maximize } = useAIAssistant();

  // Load messages from sessionStorage if available
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem(SESSION_KEY);
        if (stored) {
          // Parse and revive Date objects
          return (JSON.parse(stored) as Message[]).map((msg: Message) => ({
            ...msg,
            timestamp: new Date(msg.timestamp),
          }));
        }
      } catch {
        // Ignore parse errors
      }
    }
    return [
      {
        id: '1',
        type: 'assistant',
        content:
          "Answer:Hi there! 👋 I'm your AI assistant. I'm ready to answer any of your HR questions.",
        timestamp: new Date(),
      },
    ];
  });

  // Save messages to sessionStorage on every update
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Limit to MAX_MESSAGES
        const limited = messages.slice(-MAX_MESSAGES);
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(limited));
      } catch {
        // Ignore storage errors
      }
    }
  }, [messages]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversationId, setConversationId] = useState<string | null>(null); // State for conversation ID

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;

    let currentConversationId = conversationId;
    if (!currentConversationId) {
      currentConversationId = Date.now().toString();
      setConversationId(currentConversationId);
    }

    const newUserMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: trimmedInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chats/v2/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: trimmedInput,
          conversation_id: currentConversationId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Failed to get response body reader.');
      }

      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        const buffer = decoder.decode(value, { stream: true });

        const parts = buffer.split('\n\n')
        for (const part of parts) {
          const lines = part.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = line.replace('data: ', '').trim();
                const jsonData = JSON.parse(data);
                if (jsonData['type'] == 'message') {
                  setMessages((prevMessages) => {
                    const updated = [...prevMessages]
                    const lastIndex = updated.length - 1;
                    if (updated[lastIndex].type === 'assistant') {
                      updated[lastIndex] = {
                        ...updated[lastIndex],
                        content: updated[lastIndex].content + jsonData['content'],
                      };
                    } else {
                      const newMessage: Message = {
                        id: Date.now().toString(),
                        type: 'assistant',
                        content: jsonData['content'],
                        timestamp: new Date(),
                      };
                      updated.push(newMessage);
                    }
                    return updated;
                  });
                  setIsLoading(false);
                }
              } catch (error) {
                console.error('Error parsing data:', error);
              }

            }
          }
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error sending message or processing stream:', error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        type: 'assistant',
        content: `Error: ${error.message || 'Failed to get response from AI assistant.'}`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  }, [inputValue, conversationId]);

  const handleQuickQuestion = useCallback((question: string) => {
    setInputValue(question);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage();
      }
    },
    [handleSendMessage],
  );

  if (isMinimized) {
    return (
      <motion.div
        className="fixed lg:right-6 lg:bottom-6 right-4 bottom-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.2, 0.8, 1],
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer lg:h-12 lg:w-12 h-10 w-10 rounded-full bg-primary text-white"
            onClick={maximize}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
                times: [0, 0.2, 0.8, 1],
              }}
            >
              <Bot className="lg:h-6 lg:w-6 h-5 w-5" />
            </motion.div>
          </Button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className={cn(
          // Make sidebar take full height and use flex-col for layout
          'fixed lg:right-0 lg:top-0 right-0 bottom-0 lg:h-screen h-[85vh] w-full lg:w-96 bg-card border-l border-t lg:border-t-0 z-50 flex flex-col h-full',
          'shadow-2xl custom-scrollbar focus:outline-none',
          className,
        )}
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', bounce: 0.2 }}
        tabIndex={0}
      >
        {/* Header - sticky */}
        <div className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-primary text-sm">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-foreground font-semibold text-sm">Ask Kinesis HR Assistant</h3>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={minimize}
            className="text-gray-400 cursor-pointer hover:text-primary hover:bg-card p-1 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Messages Area - only this scrolls */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 max-h-full custom-scrollbar p-4 pb-20">
            {/* Quick Questions */}
            <div className="border-b bg-card mb-4 pb-4">
              <div className="space-y-2">
                {quickQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full justify-start text-left h-auto py-2 px-3 cursor-pointer bg-card text-primary hover:bg-primary/10 hover:text-primary text-xs"
                  >
                    {question}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex gap-3',
                    message.type === 'user' ? 'justify-end' : 'justify-start',
                  )}
                >
                  {message.type === 'assistant' && (
                    <Avatar className="h-8 w-8  flex-shrink-0">
                      <AvatarFallback className="text-primary text-sm">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3 text-sm',
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-gray-500 border ',
                    )}
                  >
                    {
                      message.type === 'user' ? (
                        <ReactMarkdown>{message.content}</ReactMarkdown>
                      ) : (
                        <AssistantMessage content={message.content} />
                      )
                    }
                  </div>
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8  flex-shrink-0">
                      <AvatarFallback className="text-primary text-sm">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8  flex-shrink-0">
                    <AvatarFallback className="text-primary text-sm">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card text-gray-500 border  rounded-lg p-3 text-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.1s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input Area - sticky bottom */}
          <div className="p-4 border-t bg-card sticky bottom-0 z-10">
            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 bg-card  text-gray-500 placeholder:text-gray-400 focus:border-primary focus:ring-primary"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
