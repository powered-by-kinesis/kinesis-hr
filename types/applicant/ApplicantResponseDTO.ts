import { z } from 'zod';
import { Applicant, Application } from '@prisma/client';
import { ApplicationResponseDTO } from '../application';

export const TApplicantResponseDTO = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  resumeUrl: z.string().nullable(),
  appliedAt: z.date(),
  applications: z.array(ApplicationResponseDTO).optional(), // Add applications array
});

export type ApplicantResponseDTO = Applicant & {
  applications?: Application[];
}
