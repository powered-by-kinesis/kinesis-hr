import { JobPost, Stage, Applicant } from '@prisma/client';

export interface DocumentDTO {
  id: number;
  fileName: string;
  filePath: string;
}

export interface ApplicationStageHistoryDTO {
  id: number;
  stage: Stage;
  changedAt: Date;
  notes?: string | null;
  changedBy?: {
    id: number;
    name: string | null;
    email: string;
  } | null;
}

export interface ApplicationDocumentDTO {
  id: number;
  document: DocumentDTO;
}

export interface ApplicationWithDetailsDTO {
  id: number;
  currentStage: Stage;
  expectedSalary: string;
  appliedAt: Date;
  notes?: string | null;
  applicant: Applicant;
  documents: ApplicationDocumentDTO[];
  stageHistory: ApplicationStageHistoryDTO[];
}

export type JobPostResponseDTO = JobPost & {
  applications?: ApplicationWithDetailsDTO[];
};
