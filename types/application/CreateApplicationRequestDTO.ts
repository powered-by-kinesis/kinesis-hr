import { z } from 'zod';

export const CreateApplicationRequestDTO = z.object({
    jobPostId: z.number(),
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    phone: z.string().optional(),
    resumeUrl: z.string().url({ message: "Invalid URL format" }).optional(),
    expectedSalary: z.string(),
    notes: z.string().optional(),
});

export type CreateApplicationRequestDTO = z.infer<typeof CreateApplicationRequestDTO>;
