import { z } from 'zod';

export const UpdateApplicantRequestDTO = z.object({
    fullName: z.string().min(1, { message: "Full name is required" }).optional(),
    email: z.string().email({ message: "Invalid email address" }).optional(),
    phone: z.string().optional(),
    resumeUrl: z.string().url({ message: "Invalid URL format" }).optional(),
});

export type UpdateApplicantRequestDTO = z.infer<typeof UpdateApplicantRequestDTO>;
