import { z } from 'zod';

export const CreateApplicationRequestDTO = z.object({
  jobPostId: z.number(),
  fullName: z.string().min(1, { message: 'Full name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().optional(),
  documentIds: z.array(z.number()),
  expectedSalary: z
    .string()
    .regex(/^\d+$/, { message: 'Please enter a valid number without commas or dots' }),
  notes: z.string().optional(),
});

export type CreateApplicationRequestDTO = z.infer<typeof CreateApplicationRequestDTO>;
