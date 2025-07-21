'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of the context data
interface AIAssistantContextType {
  isMinimized: boolean;
  toggle: () => void;
  minimize: () => void;
  maximize: () => void;
}

// Create the context with a default value (will throw an error if used outside a provider)
const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

const SESSION_KEY = 'kinesis-ai-assistant-minimized';

// Define the props for the provider component
interface AIAssistantProviderProps {
  children: ReactNode;
}

/**
 * Provides the AI Assistant's state (minimized/maximized) to its children components.
 * It encapsulates the state logic for managing the sidebar's visibility.
 */
export const AIAssistantProvider = ({ children }: AIAssistantProviderProps) => {
  // Load isMinimized from sessionStorage if available
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored !== null) {
        return stored === 'true';
      }
    }
    return false;
  });

  // Save isMinimized to sessionStorage on every update
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_KEY, isMinimized ? 'true' : 'false');
    }
  }, [isMinimized]);

  const toggle = () => setIsMinimized((prev) => !prev);
  const minimize = () => setIsMinimized(true);
  const maximize = () => setIsMinimized(false);

  const value = { isMinimized, toggle, minimize, maximize };

  return <AIAssistantContext.Provider value={value}>{children}</AIAssistantContext.Provider>;
};

/**
 * Custom hook to easily access the AI Assistant's state and actions.
 * Throws an error if used outside of an AIAssistantProvider, ensuring safe usage.
 */
export const useAIAssistant = (): AIAssistantContextType => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistant must be used within an AIAssistantProvider');
  }
  return context;
};
