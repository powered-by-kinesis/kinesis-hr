'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface AIAssistantSidebarProps {
    className?: string;
}

export const AIAssistantSidebar: React.FC<AIAssistantSidebarProps> = ({ className }) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            type: 'assistant',
            content: 'Hi there! 👋 I\'m your AI assistant. I\'m ready to answer any of your HR questions.',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    // const [isMinimized, setIsMinimized] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto scroll to bottom when new message is added
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Handle sending message
    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        // Simulate AI response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'assistant',
                content: 'I understand your question. Let me help you with that. This is a simulated response from the AI assistant.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, assistantMessage]);
            setIsLoading(false);
        }, 1000);
    };

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Quick questions
    const quickQuestions = [
        "What is my job title?",
        "What is my PTO balance?",
        "Who's out today?"
    ];

    const handleQuickQuestion = (question: string) => {
        setInputValue(question);
    };

    return (
        <div className={cn(
            "fixed right-0 top-0 h-screen w-96 bg-card border-l border-gray-800 z-50 flex flex-col overflow-auto",
            "shadow-2xl",
            className
        )}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-800 bg-card">
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Avatar className="h-8 w-8 bg-blue-600">
                            <AvatarFallback className="text-white text-sm">
                                <Bot className="h-4 w-4" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border-2 border-gray-900"></div>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm">Ask KinesisHR Assistant</h3>
                        <Badge variant="secondary" className="text-xs bg-blue-600 text-white hover:bg-blue-600">
                            beta
                        </Badge>
                    </div>
                </div>
                {/* <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMinimized(!isMinimized)}
                        className="text-gray-400 hover:text-white hover:bg-card p-1 h-8 w-8"
                    >
                        {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
                    </Button>
                </div> */}
            </div>

            {/* {!isMinimized && ( */}
            <>
                {/* Quick Questions */}
                <div className="p-4 border-b border-gray-800 bg-card">
                    <div className="space-y-2">
                        {quickQuestions.map((question, index) => (
                            <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickQuestion(question)}
                                className="w-full justify-start text-left h-auto py-2 px-3 bg-card border-gray-700 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
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
                                        "flex gap-3",
                                        message.type === 'user' ? 'justify-end' : 'justify-start'
                                    )}
                                >
                                    {message.type === 'assistant' && (
                                        <Avatar className="h-8 w-8 bg-blue-600 flex-shrink-0">
                                            <AvatarFallback className="text-white text-sm">
                                                <Bot className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div
                                        className={cn(
                                            "max-w-[80%] rounded-lg p-3 text-sm",
                                            message.type === 'user'
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-card text-gray-100 border border-gray-700'
                                        )}
                                    >
                                        {message.content}
                                    </div>
                                    {message.type === 'user' && (
                                        <Avatar className="h-8 w-8 bg-blue-600 flex-shrink-0">
                                            <AvatarFallback className="text-white text-sm">
                                                <User className="h-4 w-4" />
                                            </AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex gap-3 justify-start">
                                    <Avatar className="h-8 w-8 bg-blue-600 flex-shrink-0">
                                        <AvatarFallback className="text-white text-sm">
                                            <Bot className="h-4 w-4" />
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="bg-card text-gray-100 border border-gray-700 rounded-lg p-3 text-sm">
                                        <div className="flex gap-1">
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                    </ScrollArea>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-800 bg-card">
                        {/* Disclaimer */}
                        <div className="mb-3 p-2 bg-card rounded-lg border border-gray-700">
                            <div className="flex items-start gap-2">
                                <div className="text-orange-500 text-xs mt-0.5">⚠️</div>
                                <div className="text-xs text-gray-400 leading-relaxed">
                                    Just FYI... You are interacting with an artificial intelligence system and not a human being.
                                    KinesisHR Assistant can make mistakes. Consider double checking important information.
                                    HR can access your chat history.
                                </div>
                            </div>
                        </div>

                        {/* Input */}
                        <div className="flex gap-2 ">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Ask a question..."
                                className="flex-1 bg-card border-gray-700 text-white placeholder:text-gray-400 focus:border-blue-500"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3"
                            >
                                <Send className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </>
            {/* )} */}

            {/* {isMinimized && (
                <div className="p-4">
                    <p className="text-gray-400 text-sm text-center">Assistant minimized</p>
                </div>
            )} */}
        </div>
    );
}; 