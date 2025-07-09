import { z } from 'zod';
import { Stage } from '@prisma/client';
import { ApplicantResponseDTO } from '../applicant';

export const ApplicationResponseDTO = z.object({
  id: z.number(),
  jobPostId: z.number(),
  applicantId: z.number(),
  currentStage: z.nativeEnum(Stage),
  expectedSalary: z.string(),
  appliedAt: z.date(),
  notes: z.string().nullable(),
  jobPost: z
    .object({
      id: z.number(),
      title: z.string(),
      description: z.string(),
      location: z.string().nullable(),
      employmentType: z.string(),
      status: z.string(),
      department: z.string(),
      salaryMin: z.number().nullable(),
      salaryMax: z.number().nullable(),
      currency: z.string().nullable(),
      salaryType: z.string().nullable(),
    })
    .nullable(),
  documents: z.array(
    z.object({
      id: z.number(),
      document: z.object({
        filePath: z.string(),
      }),
    }),
  ),
});

export type ApplicationResponseDTO = z.infer<typeof ApplicantResponseDTO>;
