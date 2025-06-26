import { ChatMessageList } from '@/components/molecules/chat-message';
import { Sidebar } from '@/components/molecules/sidebar';
import { ChatHeader } from '@/components/organisms/chat-header';
import { ChatInput } from '@/components/organisms/chat-input';
import { Session } from 'next-auth';
import { useChat } from '@/hooks/use-chat/use-chat';
import { StartupModal } from '@/components/organisms/startup-modal';
import { useEffect, useState } from 'react';
import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { SideContent } from '@/components/organisms/side-content';
import { Logo } from '@/components/atoms/logo';
import { SelectedChat } from '@/types/chat/chat';
import { toast } from 'sonner';
import { Loading } from '@/components/molecules/loading';
import { useContext } from '@/hooks/use-context/use-context';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface ChatLayoutProps {
  isSidebarOpen: boolean;
  onSidebarToggle: () => void;
  session: Session;
}

export function ChatLayout({ isSidebarOpen, onSidebarToggle, session }: ChatLayoutProps) {
  const { logout, isAuthLoading } = useAuth();
  const {
    messages,
    chatHistory,
    error,
    startupModalOpen,
    isChatLoading,
    isMessageLoading,
    isThinking,
    isDeleteLoading,
    handleSubmit,
    setContextAndTitle,
    getChatHistory,
    getConversationHistoryMessages,
    deleteContext,
    handleNewChat,
    handleStartupModalOpenChange,
    setContextId,
    setMessages,
    setStartupModalOpen,
    updateChatHistory,
  } = useChat();
  const { getContextById, isContextLoading, updateContext } = useContext();
  const [selectedChat, setSelectedChat] = useState<SelectedChat | null>(null);
  const [isSelectChatLoading, setIsSelectChatLoading] = useState(false);
  const [isSideContentOpen, setIsSideContentOpen] = useState(false);

  useEffect(() => {
    getChatHistory();
  }, [getChatHistory]);

  const handleCompleteStartup = async (context: ContextResponseDTO) => {
    setContextId(context.id);
    setContextAndTitle(context.id, context.jobDescription);
    handleStartupModalOpenChange(false);
    await getChatHistory();
    setSelectedChat({ difyConversationId: '', contextId: context.id });
  };

  const handleDeleteChat = async (id: number) => {
    await deleteContext(id);
    setSelectedChat(null);
  };

  const handleSelectChat = async (difyConversationId: string, contextId: number) => {
    setIsSelectChatLoading(true);
    try {
      setSelectedChat({ difyConversationId, contextId });
      setContextId(contextId);

      if (difyConversationId) {
        await getConversationHistoryMessages(difyConversationId, contextId);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error('Error selecting chat:', error);
      toast.error('Failed to select chat');
      setSelectedChat(null);
      setContextId(null);
    } finally {
      setIsSelectChatLoading(false);
    }
  };

  const handleNewChatWithReset = () => {
    handleNewChat();
    setSelectedChat(null);
    setStartupModalOpen(true);
  };

  const handleOnSideContent = () => {
    setIsSideContentOpen(!isSideContentOpen);
  };

  const currentContext = selectedChat ? getContextById(selectedChat.contextId, chatHistory) : null;

  return (
    <>
      {isDeleteLoading || (isAuthLoading && <Loading />)}
      <StartupModal
        isOpen={startupModalOpen}
        onOpenChange={handleStartupModalOpenChange}
        onComplete={handleCompleteStartup}
      />
      <div className="flex h-[100dvh] overflow-hidden bg-gradient-to-br from-background via-background/95 to-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex">
          {isSidebarOpen && (
            <div className="w-64 border-r">
              <Sidebar
                isSelectChatLoading={isSelectChatLoading}
                isDeleteLoading={isDeleteLoading}
                isChatLoading={isChatLoading}
                onNewChat={handleNewChatWithReset}
                onClose={onSidebarToggle}
                chatHistory={chatHistory}
                onDeleteChat={handleDeleteChat}
                onSelectChat={handleSelectChat}
                selectedChat={selectedChat}
                logout={logout}
                session={session as Session}
              />
            </div>
          )}
        </div>

        {/* Main content */}

        <div className="flex-1 flex flex-col overflow-hidden bg-card">
          {/* Header */}
          <ChatHeader
            isChatLoading={isChatLoading}
            isDeleteLoading={isDeleteLoading}
            isSelectChatLoading={isSelectChatLoading}
            onNewChat={handleNewChatWithReset}
            isSidebarOpen={isSidebarOpen}
            onSidebarToggle={onSidebarToggle}
            session={session as Session}
            chatHistory={chatHistory}
            onClose={onSidebarToggle}
            onDeleteChat={handleDeleteChat}
            onSelectChat={handleSelectChat}
            selectedChat={selectedChat}
            logout={logout}
            onSideContent={handleOnSideContent}
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
            <div
              className="flex flex-col flex-1 relative h-[calc(100dvh-4rem)]"
              style={{
                borderRight: '0.8px solid var(--border)',
              }}
            >
              {messages.length === 0 ? (
                <div className="flex items-center justify-center w-full h-full bg-transparent px-4">
                  <div className="flex flex-col items-center justify-center w-full gap-6 sm:gap-8">
                    <Logo
                      textClassName="hidden"
                      logoClassName="w-12 h-12 sm:w-16 sm:h-16 lg:w-24 lg:h-24"
                    />
                    <div className="w-full max-w-4xl">
                      {error && (
                        <div className="text-red-500 text-center p-2 mb-4 text-sm">
                          Error: {error}
                        </div>
                      )}
                      <ChatInput onSubmit={handleSubmit} isMessageLoading={isMessageLoading} />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto pb-2 sm:pb-4">
                    <ChatMessageList
                      isThinking={isThinking}
                      isMessageLoading={isMessageLoading}
                      messages={messages}
                      session={session as Session}
                    />
                  </div>

                  <div className="relative bg-card">
                    {error && (
                      <div className="text-red-500 text-center p-2 text-sm">Error: {error}</div>
                    )}
                    <ChatInput onSubmit={handleSubmit} isMessageLoading={isMessageLoading} />
                  </div>
                </>
              )}
            </div>
            <SideContent
              isContextLoading={isContextLoading}
              context={currentContext || ({} as ContextResponseDTO)}
              updateContext={(contextId, updates) =>
                updateContext(contextId, updates, updateChatHistory)
              }
              onNewChat={handleNewChatWithReset}
              updateChatHistory={updateChatHistory}
              getChatHistory={getChatHistory}
              className="hidden lg:block"
            />
          </div>
        </div>
      </div>
      <Sheet open={isSideContentOpen} onOpenChange={setIsSideContentOpen}>
        <SheetContent side="right" className="w-full bg-card">
          <SheetHeader>
            <VisuallyHidden>
              <SheetTitle>Side Content</SheetTitle>
            </VisuallyHidden>
          </SheetHeader>
          <SideContent
            isContextLoading={isContextLoading}
            context={currentContext || ({} as ContextResponseDTO)}
            updateContext={(contextId, updates) =>
              updateContext(contextId, updates, updateChatHistory)
            }
            onNewChat={handleNewChatWithReset}
            updateChatHistory={updateChatHistory}
            getChatHistory={getChatHistory}
            className="block lg:hidden"
          />
        </SheetContent>
      </Sheet>
    </>
  );
}
