import { Logo } from '@/components/atoms/logo';
import { AvatarUser } from '@/components/molecules/avatar-user';
import { UserIcon } from '@/components/icon/user';
import { ChatMessage as ChatMessageType } from '@/types/chat/chat'; // Renamed to avoid conflict
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatMessageProps {
  message: ChatMessageType;
  userImage?: string;
  userName?: string;
  isThinking: boolean;
}

export function ChatMessage({ message, userImage, userName, isThinking }: ChatMessageProps) {
  return (
    <div className="flex items-start  justify-start gap-8 flex-col animate-fadeIn px-2 lg:px-4">
      {message && (
        <>
          {message.query && (
            <div className="flex items-start gap-4">
              <AvatarUser
                avatar={userImage || <UserIcon className="text-blue-500" />}
                name={userName || 'User'}
              />
              <p>{message.query}</p>
            </div>
          )}
          {message.answer && (
            <div className="flex items-start gap-4">
              <Logo
                textClassName="hidden"
                logoClassName={isThinking && !message.answer?.answer ? 'animate-spin' : ''}
              />
              <div>
                {isThinking && !message.answer?.answer && (
                  <div className="text-gray-500 text-sm mb-2">
                    <strong>Thinking...</strong>
                  </div>
                )}
                {message.answer?.reasoning && (
                  <div className="text-gray-500 text-sm mb-2">
                    <strong>Reasoning:</strong> {message.answer.reasoning}
                  </div>
                )}
                {message.answer?.answer && (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.answer.answer}</ReactMarkdown>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
