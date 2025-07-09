'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useAIAssistant } from '@/hooks/use-ai-assistant/use-ai-assistant';

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

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({
  className,
}) => {
  const { isMinimized, minimize, maximize } = useAIAssistant();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi there! 👋 I'm your AI assistant. I'm ready to answer any of your HR questions.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: "I'm a demo AI assistant. In the real app, I'll provide helpful HR-related answers!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  if (isMinimized) {
    return (
      <motion.div
        className="fixed lg:right-6 lg:bottom-6 right-4 bottom-4 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", bounce: 0.5 }}
      >
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="relative cursor-pointer lg:h-12 lg:w-12 h-10 w-10 rounded-full bg-primary"
            onClick={maximize}
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.2, 0.8, 1]
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
          'fixed lg:right-0 lg:top-0 right-0 bottom-0 lg:h-screen h-[85vh] w-full lg:w-96 bg-card border-l border-t lg:border-t-0  z-50 flex flex-col',
          'shadow-2xl',
          className,
        )}
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", bounce: 0.2 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b  bg-card">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-white text-sm">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">Ask KinesisHR Assistant</h3>
              <Badge variant="secondary" className="text-xs bg-primary text-primary-foreground hover:bg-primary">
                beta
              </Badge>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={minimize}
            className="text-gray-400 cursor-pointer hover:text-white hover:bg-card p-1 h-8 w-8"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Quick Questions */}
        <div className="p-4 border-b  bg-card">
          <div className="space-y-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="w-full justify-start text-left h-auto py-2 px-3 bg-card  text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col min-h-0">
          <ScrollArea className="flex-1 p-4">
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
                      <AvatarFallback className="text-white text-sm">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-[80%] rounded-lg p-3 text-sm',
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-gray-100 border ',
                    )}
                  >
                    {message.content}
                  </div>
                  {message.type === 'user' && (
                    <Avatar className="h-8 w-8  flex-shrink-0">
                      <AvatarFallback className="text-white text-sm">
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8  flex-shrink-0">
                    <AvatarFallback className="text-white text-sm">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-card text-gray-100 border  rounded-lg p-3 text-sm">
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

          {/* Input Area */}
          <div className="p-4 border-t  bg-card">
            {/* Disclaimer */}
            <div className="mb-3 p-2 bg-card rounded-lg border ">
              <div className="flex items-start gap-2">
                <div className="text-orange-500 text-xs mt-0.5">⚠️</div>
                <div className="text-xs text-gray-400 leading-relaxed">
                  Just FYI... You are interacting with an artificial intelligence system and not a
                  human being. KinesisHR Assistant can make mistakes. Consider double checking
                  important information. HR can access your chat history.
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask a question..."
                className="flex-1 bg-card  text-white placeholder:text-gray-400 focus:border-primary focus:ring-primary"
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
