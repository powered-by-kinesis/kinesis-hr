import { z } from 'zod';
import { Stage } from '@prisma/client';

export const UpdateApplicationRequestDTO = z.object({
    currentStage: z.nativeEnum(Stage),
    notes: z.string().optional(),
});

export type UpdateApplicationRequestDTO = z.infer<typeof UpdateApplicationRequestDTO>;
