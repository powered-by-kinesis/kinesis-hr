import { SkillLevel } from '@/constants/enums/skill-level';

export interface CandidateSkills {
  hardSkills: SkillLevel;
  softSkills: SkillLevel;
  technicalSkills: SkillLevel;
  overallLevel: SkillLevel;
}
