import { Applicant, InterviewInvitation } from "@prisma/client";

export type ValidationResponseDTO = {
    success: boolean;
    data: InterviewInvitation & {
        applicant: Applicant
    }
}