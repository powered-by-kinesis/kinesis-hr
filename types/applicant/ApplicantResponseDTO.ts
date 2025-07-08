import { z } from 'zod';
import { Applicant, Application } from '@prisma/client';
import { TApplicationResponseDTO } from '../application';


export const TApplicantResponseDTO = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  resumeUrl: z.string().nullable(),
  appliedAt: z.date(),
  applications: z.array(TApplicationResponseDTO).optional(), // Add applications array
});

export type ApplicantResponseDTO = Applicant & {
  applications?: Application[];
}
