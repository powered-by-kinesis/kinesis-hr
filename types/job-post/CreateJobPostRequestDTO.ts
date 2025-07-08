import { z } from 'zod';
import { CurrencyOptions } from '@/constants/enums/currency';
import { SalaryTypeOptions } from '@/constants/enums/salary-type';

export const CreateJobPostRequestDTO = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  location: z.string().optional(),
  employmentType: z.string().min(1, { message: 'Employment type is required' }),
  status: z.string().min(1, { message: 'Status is required' }),
  department: z.string().min(1, { message: 'Department is required' }),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  currency: z
    .string()
    .optional()
    .refine((val) => CurrencyOptions.some((option) => option.value === val), {
      message: 'Invalid currency',
    }),
  salaryType: z
    .string()
    .optional()
    .refine((val) => SalaryTypeOptions.some((option) => option.value === val), {
      message: 'Invalid salary type',
    }),
});

export type CreateJobPostRequestDTO = z.infer<typeof CreateJobPostRequestDTO>;
