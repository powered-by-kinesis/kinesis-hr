import { z } from 'zod';

export const ApplicantResponseDTO = z.object({
    id: z.number(),
    fullName: z.string(),
    email: z.string(),
    phone: z.string().nullable(),
    resumeUrl: z.string().nullable(),
    appliedAt: z.date(),
});

export type ApplicantResponseDTO = z.infer<typeof ApplicantResponseDTO>;
