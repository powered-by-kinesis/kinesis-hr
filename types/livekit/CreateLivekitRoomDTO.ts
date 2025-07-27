import { z } from 'zod';

export const CreateLivekitRoomDto = z.object({
  invitationInterviewId: z.number(),
  roomName: z.string(),
});

export type TCreateLivekitRoomDto = z.infer<typeof CreateLivekitRoomDto>;
