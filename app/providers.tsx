'use client';

import { SessionProvider } from 'next-auth/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import * as React from 'react';
import { AIAssistantProvider } from '@/hooks/use-ai-assistant/use-ai-assistant';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SessionProvider>
        <AIAssistantProvider>{children}</AIAssistantProvider>
      </SessionProvider>
    </NextThemesProvider>
  );
}
