import { z } from 'zod';
import { Stage } from '@prisma/client';
import { ApplicantResponseDTO } from '../applicant';

export const ApplicationResponseDTO = z.object({
  id: z.number(),
  jobPostId: z.number(),
  currentStage: z.nativeEnum(Stage),
  expectedSalary: z.string(),
  appliedAt: z.date(),
  notes: z.string().nullable(),
});

export type ApplicationResponseDTO = z.infer<typeof ApplicationResponseDTO>;
