import { JobPost, Stage } from '@prisma/client';

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

export interface ApplicationWithDetailsDTO {
  id: number;
  currentStage: Stage;
  expectedSalary: string;
  appliedAt: Date;
  notes?: string | null;
  applicant: {
    id: number;
    fullName: string;
    email: string;
    phone?: string | null;
    resumeUrl?: string | null;
  };
  stageHistory: ApplicationStageHistoryDTO[];
}

export type JobPostResponseDTO = JobPost & {
  applications?: ApplicationWithDetailsDTO[];
};
