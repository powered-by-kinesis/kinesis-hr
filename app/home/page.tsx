'use client';

import { AppSidebar } from '@/components/organisms/app-sidebar';
import { SiteHeader } from '@/components/organisms/site-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { AIAssistantSidebar } from '@/components/organisms/ai-assistant-sidebar';
import { useState } from 'react';

export default function HomePage() {
  const [isMinimized, setIsMinimized] = useState(false);
  return (
    <div className="relative">
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 72)',
            '--header-height': 'calc(var(--spacing) * 12)',
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 mx-auto mr-96 pr-4">
                <h1 className="text-2xl font-bold">Welcome To HomePage</h1>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    This is the home page with AI Assistant sidebar on the right.
                  </p>
                  <p className="text-muted-foreground">
                    The AI Assistant is fixed and always visible to help you with HR-related
                    questions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>

      <AIAssistantSidebar
        isMinimized={isMinimized}
        onMinimize={() => setIsMinimized(true)}
        onMaximize={() => setIsMinimized(false)}
      />
    </div>
  );
}
