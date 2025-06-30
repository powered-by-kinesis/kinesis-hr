import { z } from 'zod';

export const CreateJobPostRequestDTO = z.object({
    title: z.string().min(1, { message: 'Title is required' }),
    description: z.string().min(1, { message: 'Description is required' }),
    location: z.string().optional(),
    employmentType: z.string().min(1, { message: 'Employment type is required' }),
    status: z.string().min(1, { message: 'Status is required' }),
});

export type CreateJobPostRequestDTO = z.infer<typeof CreateJobPostRequestDTO>;
