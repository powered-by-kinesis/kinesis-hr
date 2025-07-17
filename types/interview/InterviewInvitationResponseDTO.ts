import { Interview, InterviewInvitation } from '@prisma/client';
import { ApplicantResponseDTO } from '../applicant';
import { SkillLevel } from '@/constants/enums/skill-level';

export type InterviewInvitationResponseDTO = InterviewInvitation & {
  applicant: ApplicantResponseDTO & {
    skills?: {
      name: string;
      level: SkillLevel;
    }[];
  };
  interview: Interview;
};
