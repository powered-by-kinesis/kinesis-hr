import { z } from 'zod';

export const UpdateInterviewRequestDTO = z.object({
    interviewName: z.string().min(1, { message: 'Interview name is required' }).optional(),
    skills: z.array(z.object({
        name: z.string(),
        description: z.string(),
    })).optional(),
    customQuestionList: z.array(z.object({
        question: z.string(),
        time: z.number(),
    })).optional(),
    jobPostId: z.number().optional(),
});

export type UpdateInterviewRequestDTO = z.infer<typeof UpdateInterviewRequestDTO>;
