import { Applicant, Stage } from '@prisma/client';

export type Candidate = Applicant & {
    stage: Stage;
    resumeUrl: string | null;
};
