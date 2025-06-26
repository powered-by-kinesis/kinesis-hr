import { ChatActionButton } from '@/components/atoms/button/chat-action-button';
import { Input } from '@/components/atoms/input';
import { Send } from 'lucide-react';
import { useState } from 'react';

interface ChatInputProps {
  isMessageLoading: boolean;
  onSubmit: (message: string) => void;
}

export function ChatInput({ onSubmit, isMessageLoading }: ChatInputProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isMessageLoading) return;

    onSubmit(value.trim());
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="w-full px-4 pb-4 bg-transparent">
      <div className="max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center gap-2 bg-transparent border border-border rounded-2xl p-3 shadow-lg hover:border-blue-500/50 focus-within:border-blue-500 transition-all duration-200"
        >
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message here..."
            disabled={isMessageLoading}
            className="flex-1 border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base placeholder:text-muted-foreground/60"
          />
          <div className="flex-shrink-0">
            <ChatActionButton
              icon={Send}
              tooltip="Send Message"
              disabled={!value.trim() || isMessageLoading}
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
