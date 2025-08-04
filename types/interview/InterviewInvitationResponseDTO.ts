import { Interview, InterviewInvitation } from '@prisma/client';
import { ApplicantResponseDTO } from '../applicant';
import { SkillLevel } from '@/constants/enums/skill-level';

export type InterviewInvitationResponseDTO = InterviewInvitation & {
  applicant: ApplicantResponseDTO & {
    skills?: {
      skill_name: string;
      skill_level: SkillLevel;
      assessment_notes: string;
    }[];
  };
  interview: Interview;
};
