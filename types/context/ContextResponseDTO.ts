import { DocumentResponseDTO } from '../document/DocumentResponseDTO';
import { ChatResponseDTO } from '../chat';
import { CandidateRankingResponseDTO } from '../candidate-ranking';

export type ContextResponseDTO = {
  id: number;
  name: string;
  jobDescription: string;
  localLanguage: 'indonesian' | 'japanese' | 'english';
  userId: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  documents: ContextDocument[];
  chats: ChatResponseDTO[];
  candidates: CandidateRankingResponseDTO[];
  createdAt: string;
  updatedAt: string;
};

export interface ContextDocument {
  document: DocumentResponseDTO;
}
