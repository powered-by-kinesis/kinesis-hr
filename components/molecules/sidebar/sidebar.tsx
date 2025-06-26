import { Logo } from '@/components/atoms/logo';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { TooltipContent } from '@/components/ui/tooltip';
import { TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { LogOut, PanelLeftClose, Plus, UserIcon } from 'lucide-react';
import { MessageSquare, EllipsisVertical } from 'lucide-react';
import { useState } from 'react';
import { DeleteChatModal } from '@/components/organisms/delete-chat-modal';
import { SelectedChat } from '@/types/chat/chat';
import { Skeleton } from '@/components/ui/skeleton';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { Session } from 'next-auth';
import { AvatarUser } from '../avatar-user';

interface SidebarProps {
  chatHistory: ContextResponseDTO[];
  onClose: () => void;
  onDeleteChat: (id: number) => void;
  onSelectChat: (difyConversationId: string, contextId: number) => void;
  onNewChat: () => void;
  selectedChat: SelectedChat | null;
  isChatLoading: boolean;
  isDeleteLoading: boolean;
  isSelectChatLoading: boolean;
  logout: () => void;
  session: Session;
}

export function Sidebar({
  chatHistory,
  onClose,
  onDeleteChat,
  onSelectChat,
  onNewChat,
  selectedChat,
  isChatLoading,
  isDeleteLoading,
  isSelectChatLoading,
  logout,
  session,
}: SidebarProps) {
  const [isDeleteChatModalOpen, setIsDeleteChatModalOpen] = useState(false);
  const [deletedId, setDeletedId] = useState<number | null>(null);
  const handleDeleteChat = (id: number) => {
    setDeletedId(id);
    setIsDeleteChatModalOpen(true);
  };

  const handleNewChat = () => {
    onNewChat();
  };

  const handleSelectChat = (difyConversationId: string, contextId: number) => {
    if (!contextId) {
      console.error('Context ID is required');
      return;
    }

    if (!isSelectChatLoading) {
      onSelectChat(difyConversationId, contextId);
    }
  };

  const skeletonChatHistory = Array.from({ length: 3 }, (_, index) => (
    <Skeleton key={index} className="h-[50px] w-full" />
  ));

  return (
    <div className="flex h-full flex-col space-y-4 py-1 bg-card/80">
      <div className="px-4 py-2 flex flex-col gap-4">
        <div className="lg:flex items-center justify-between hidden">
          <Logo textClassName="hidden" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="group cursor-pointer transition-colors duration-200 hover:bg-blue-500/5 "
                onClick={onClose}
                size="icon"
              >
                <PanelLeftClose
                  className="text-muted-foreground group-hover:text-blue-500 transition-colors duration-200"
                  style={{ width: '24px', height: '24px' }}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Close Sidebar</TooltipContent>
          </Tooltip>
        </div>
        <Button
          className="w-full justify-center cursor-pointer gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
          onClick={handleNewChat}
        >
          <Plus className="h-5 w-5" />
          New Chat
        </Button>
      </div>

      <Separator className="opacity-50" />

      <ScrollArea className="flex-1 px-4 h-[calc(100dvh-220px)]">
        <div className="space-y-2">
          {isChatLoading
            ? skeletonChatHistory
            : chatHistory?.map((context) => {
                const chat = context.chats?.[0];
                return (
                  <Button
                    disabled={isSelectChatLoading || isDeleteLoading}
                    key={context.id}
                    variant="ghost"
                    className={`w-full group justify-start gap-2 px-3 py-6 hover:bg-blue-500/5 transition-colors duration-200 rounded-lg ${
                      selectedChat?.contextId === context.id ? 'bg-blue-500/5 text-blue-500' : ''
                    }`}
                    onClick={() =>
                      handleSelectChat(
                        chat?.difyConversationId,
                        context.id ?? selectedChat?.contextId,
                      )
                    }
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                        <span className="truncate group-hover:text-blue-500 transition-colors duration-200 max-w-[150px] inline-block">
                          {context.jobDescription}
                        </span>
                      </div>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isDeleteLoading) {
                            handleDeleteChat(context.id);
                          }
                        }}
                        className="cursor-pointer"
                      >
                        <EllipsisVertical className="h-5 w-5 group-hover:text-blue-500 transition-colors duration-200" />
                      </div>
                    </div>
                  </Button>
                );
              })}
        </div>
      </ScrollArea>

      <Separator className="opacity-50" />

      <div className="px-4 pb-4 flex justify-center w-full gap-2 items-start flex-col">
        <div className="w-full">
          <Button
            variant="ghost"
            className="hover:bg-blue-500/5 cursor-pointer group transition-all duration-200 justify-start w-full"
            onClick={() => logout()}
          >
            <LogOut className="text-muted-foreground group-hover:text-blue-500 transition-colors duration-200" />
            <span className="text-muted-foreground group-hover:text-blue-500 transition-colors duration-200">
              Logout
            </span>
          </Button>
        </div>
        <div className="flex items-center gap-2 w-full">
          <AvatarUser
            avatar={session?.user?.image || <UserIcon className="text-blue-500" />}
            name={session?.user?.name || 'User'}
          />
          <div className="flex flex-col">
            <span className="text-muted-foreground text-sm group-hover:text-blue-500 transition-colors duration-200">
              {session?.user?.name || 'User'}
            </span>
            <span className="text-muted-foreground text-xs group-hover:text-blue-500 transition-colors duration-200">
              {session?.user?.email || 'User'}
            </span>
          </div>
        </div>
      </div>

      <DeleteChatModal
        isOpen={isDeleteChatModalOpen}
        onOpenChange={setIsDeleteChatModalOpen}
        onDeleteChat={onDeleteChat}
        id={deletedId ?? 0}
        isDeleteLoading={isDeleteLoading}
      />
    </div>
  );
}
