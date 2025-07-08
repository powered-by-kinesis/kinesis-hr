import { z } from 'zod';

export const CreateInterviewRequestDTO = z.object({
    interviewName: z.string().min(1, { message: 'Interview name is required' }),
    skills: z.array(z.object({
        name: z.string().min(1, { message: 'Skill name is required' }),
        description: z.string().min(1, { message: 'Skill description is required' }),
    })).optional(),
    customQuestionList: z.array(z.object({
        question: z.string(),
        time: z.number(),
    })).optional(),
    jobPostId: z.number().optional(),
    applicantIds: z.array(z.number()).optional(),
});

export type CreateInterviewRequestDTO = z.infer<typeof CreateInterviewRequestDTO>;
