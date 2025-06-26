export interface ChatMessage {
  query?: string;
  answer?: {
    reasoning: string;
    answer: string;
  };
}

export interface ChatResponseDTO {
  id: number;
  contextId: number;
  difyConversationId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface SelectedChat {
  difyConversationId: string;
  contextId: number;
}
