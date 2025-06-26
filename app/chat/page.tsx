'use client';

import { ChatLayout } from '@/components/templates/chat-layout';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { Session } from 'next-auth';
import { RequireAuth } from '@/components/auth/require-auth';

export default function ChatPage() {
  const { data: session } = useSession();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <RequireAuth>
      <ChatLayout
        isSidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        session={session as Session}
      />
    </RequireAuth>
  );
}
