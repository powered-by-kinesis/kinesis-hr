import { ScrollArea } from '@/components/ui/scroll-area';
import { Session } from 'next-auth';
import { ChatMessage } from '@/types/chat';
import { ChatMessage as ChatMessageComponent } from '@/components/molecules/chat-message';
import { Skeleton } from '@/components/ui/skeleton';
import { useEffect, useRef } from 'react';

interface ChatMessageListProps {
  messages: ChatMessage[];
  session: Session;
  isMessageLoading: boolean;
  isThinking: boolean;
}

export function ChatMessageList({
  messages,
  session,
  isMessageLoading,
  isThinking,
}: ChatMessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages]);

  useEffect(() => {
    if (isThinking) {
      scrollToBottom();
    }
  }, [isThinking]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-card h-full">
      <ScrollArea className="h-full w-full" ref={scrollAreaRef}>
        <div className="flex-1 flex flex-col w-full lg:max-w-4xl mx-auto py-6 lg:px-12 px-4 mb-4 mt-4">
          <div className="space-y-6 pr-2">
            {isMessageLoading ? (
              <Skeleton className="h-[65dvh] w-full" />
            ) : (
              messages.map((message, index) => (
                <ChatMessageComponent
                  isThinking={isThinking}
                  key={index}
                  message={message} // Pass the entire message object
                  userImage={session?.user?.image || undefined}
                  userName={session?.user?.name || 'User'}
                />
              ))
            )}
          </div>
          <div ref={scrollRef} style={{ height: '1px' }} />
        </div>
      </ScrollArea>
    </div>
  );
}
