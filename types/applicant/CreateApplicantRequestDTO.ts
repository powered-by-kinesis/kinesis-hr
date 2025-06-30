import { z } from 'zod';

export const CreateApplicantRequestDTO = z.object({
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  resumeUrl: z.string().url({ message: 'Invalid URL format' }).optional(),
});

export type CreateApplicantRequestDTO = z.infer<typeof CreateApplicantRequestDTO>;
