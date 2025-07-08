import { z } from 'zod';
import { ApplicationResponseDTO } from '../application';

export const ApplicantResponseDTO = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  resumeUrl: z.string().nullable(),
  appliedAt: z.date(),
  applications: z.array(ApplicationResponseDTO).optional(),
});

export type ApplicantResponseDTO = z.infer<typeof ApplicantResponseDTO>;
