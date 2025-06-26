import { Logo } from '@/components/atoms/logo';
import { Sidebar } from '@/components/molecules/sidebar';
import { Button } from '@/components/ui/button';
import { SheetContent, SheetHeader, SheetTrigger } from '@/components/ui/sheet';
import { Sheet, SheetTitle } from '@/components/ui/sheet';
import { TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@/components/ui/tooltip';
import { Menu, PanelLeftOpen, SquarePen } from 'lucide-react';
import { Session } from 'next-auth';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { SelectedChat } from '@/types/chat/chat';
import { PanelRight } from 'lucide-react';

interface ChatHeaderProps {
  isChatLoading: boolean;
  isDeleteLoading: boolean;
  isSelectChatLoading: boolean;
  isSidebarOpen: boolean;
  session: Session;
  chatHistory: ContextResponseDTO[];
  selectedChat: SelectedChat | null;
  onNewChat: () => void;
  onDeleteChat: (id: number) => void;
  onSelectChat: (difyConversationId: string, contextId: number) => void;
  onSidebarToggle: () => void;
  logout: () => void;
  onClose: () => void;
  onSideContent: () => void;
}

export function ChatHeader({
  isChatLoading,
  isDeleteLoading,
  isSelectChatLoading,
  isSidebarOpen,
  selectedChat,
  session,
  chatHistory,
  onSidebarToggle,
  onNewChat,
  onDeleteChat,
  onSelectChat,
  logout,
  onClose,
  onSideContent,
}: ChatHeaderProps) {
  return (
    <header className="border-b px-4 py-3 flex items-center shrink-0 bg-card">
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden mr-3">
            <Menu style={{ width: '24px', height: '24px' }} />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-card">
          <SheetHeader className="h-14 px-4 flex py-3.5">
            <SheetTitle className="m-0 p-0">
              <Logo />
            </SheetTitle>
          </SheetHeader>
          <Sidebar
            chatHistory={chatHistory}
            onClose={onClose}
            onDeleteChat={onDeleteChat}
            onSelectChat={onSelectChat}
            onNewChat={onNewChat}
            selectedChat={selectedChat}
            isChatLoading={isChatLoading}
            isDeleteLoading={isDeleteLoading}
            isSelectChatLoading={isSelectChatLoading}
            logout={logout}
            session={session}
          />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2 justify-between w-full mr-4">
        <div className="flex items-center gap-4">
          {!isSidebarOpen && (
            <div className="flex items-center gap-2">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-500/5 cursor-pointer group transition-all duration-200"
                    onClick={onSidebarToggle}
                  >
                    <PanelLeftOpen
                      style={{ width: '24px', height: '24px' }}
                      className=" text-muted-foreground group-hover:text-blue-500 transition-colors duration-200"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Open Sidebar</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-blue-500/5 cursor-pointer group transition-all duration-200"
                    onClick={onNewChat}
                  >
                    <SquarePen
                      style={{ width: '24px', height: '24px' }}
                      className=" text-muted-foreground group-hover:text-blue-500 transition-colors duration-200"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>New Chat</TooltipContent>
              </Tooltip>
            </div>
          )}
          <Logo logoClassName="hidden" textClassName="text-lg" />
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={onSideContent}>
          <PanelRight
            style={{ width: '24px', height: '24px' }}
            className=" text-muted-foreground group-hover:text-blue-500 transition-colors duration-200"
          />
        </Button>
      </div>
    </header>
  );
}
