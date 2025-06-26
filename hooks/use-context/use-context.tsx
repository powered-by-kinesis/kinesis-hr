import { ContextResponseDTO } from '@/types/context/ContextResponseDTO';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export const useContext = () => {
  const [isContextLoading, setIsContextLoading] = useState(false);

  const getContextById = useCallback((contextId: number, chatHistory: ContextResponseDTO[]) => {
    return chatHistory.find((chat) => chat.id === contextId);
  }, []);

  const updateContext = async (
    contextId: number,
    updates: Partial<ContextResponseDTO>,
    updateChatHistory: (contextId: number, updatedContext: ContextResponseDTO) => void,
  ) => {
    setIsContextLoading(true);
    try {
      const updatedContext = await fetch(`/api/contexts/${contextId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (!updatedContext.ok) throw new Error('Failed to update context');
      const updatedContextData = await updatedContext.json();

      updateChatHistory(contextId, updatedContextData);
      toast.success('Context updated successfully');
    } catch (error) {
      console.error('Error updating context:', error);
      toast.error('Failed to update context');
    } finally {
      setIsContextLoading(false);
    }
  };

  return {
    isContextLoading,
    getContextById,
    updateContext,
  };
};
