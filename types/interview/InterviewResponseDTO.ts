import { Interview, JobPost, InterviewInvitation } from '@prisma/client';
import { InterviewInvitationResponseDTO } from './InterviewInvitationResponseDTO';

export type InterviewResponseDTO = Interview & {
    jobPost?: JobPost | null;
    invitations?: InterviewInvitationResponseDTO[];
};
