import { z } from 'zod';

export const UpdateJobPostRequestDTO = z.object({
  title: z.string().min(1, { message: 'Title is required' }).optional(),
  description: z.string().min(1, { message: 'Description is required' }).optional(),
  location: z.string().optional(),
  employmentType: z.string().min(1, { message: 'Employment type is required' }).optional(),
  status: z.string().min(1, { message: 'Status is required' }).optional(),
  department: z.string().min(1, { message: 'Department is required' }).optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryType: z.string().min(1, { message: 'Salary type is required' }).optional(),
  currency: z.string().min(1, { message: 'Currency is required' }).optional(),
});

export type UpdateJobPostRequestDTO = z.infer<typeof UpdateJobPostRequestDTO>;
