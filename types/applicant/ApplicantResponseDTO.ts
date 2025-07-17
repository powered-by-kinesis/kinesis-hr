import { z } from 'zod';
import { Applicant, Application, Document, Stage } from '@prisma/client';
import { TApplicationResponseDTO } from '../application';
import { SkillLevel } from '@/constants/enums/skill-level';

export const TApplicantResponseDTO = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  phone: z.string().nullable(),
  summary: z.string().optional(),
  skills: z
    .array(
      z.object({
        name: z.string(),
        level: z.nativeEnum(SkillLevel),
      }),
    )
    .optional(),
  experience: z
    .array(
      z.object({
        company: z.string(),
        role: z.string(),
        startDate: z.date(),
        endDate: z.date(),
        description: z.string(),
      }),
    )
    .optional(),
  languages: z
    .array(
      z.object({
        language: z.string(),
        proficiency: z.string(),
      }),
    )
    .optional(),
  location: z.string().optional(),
  education: z
    .array(
      z.object({
        institution: z.string(),
        degree: z.string(),
        startDate: z.date(),
        endDate: z.date(),
      }),
    )
    .optional(),
  appliedAt: z.date(),
  applications: z.array(TApplicationResponseDTO).optional(), // Add applications array
});

import { JobPost } from '@prisma/client';

export type ApplicantResponseDTO = Applicant & {
  applications?: (Application & {
    documents: {
      document: Document;
    }[];
    jobPost: JobPost;
  })[];
};
