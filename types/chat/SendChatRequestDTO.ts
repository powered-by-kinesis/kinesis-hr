export type SendChatRequestDTO = {
  contextId: number;
  title?: string; // Made optional
  responseMode: 'streaming' | 'blocking';
  query: string;
  conversationId?: string;
  fn_call?: 'candidate-rank';
};
