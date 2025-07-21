export enum SkillLevel {
  BEGINNER = 'BEGINNER', // 0-5.9
  INTERMEDIATE = 'INTERMEDIATE', // 6.0-7.4
  PROFICIENT = 'PROFICIENT', // 7.5-8.4
  ADVANCED = 'ADVANCED', // 8.5-9.2
  EXPERT = 'EXPERT', // 9.3-10
}

export const getSkillLevelLabel = (skillLevel: SkillLevel): string => {
  switch (skillLevel) {
    case SkillLevel.BEGINNER:
      return 'Beginner';
    case SkillLevel.INTERMEDIATE:
      return 'Intermediate';
    case SkillLevel.PROFICIENT:
      return 'Proficient';
    case SkillLevel.ADVANCED:
      return 'Advanced';
    case SkillLevel.EXPERT:
      return 'Expert';
    default:
      return 'Beginner';
  }
};
/**
 * Returns a human-readable description of the skill level
 * @param level - SkillLevel enum value
 * @returns Description string
 */
export function getSkillLevelDescription(level: SkillLevel): string {
  const descriptions = {
    [SkillLevel.BEGINNER]: 'Basic understanding with room for growth',
    [SkillLevel.INTERMEDIATE]: 'Solid foundation with developing competency',
    [SkillLevel.PROFICIENT]: 'Strong capability with consistent performance',
    [SkillLevel.ADVANCED]: 'High expertise with proven excellence',
    [SkillLevel.EXPERT]: 'Exceptional mastery and industry-leading skills',
  };

  return descriptions[level];
}

export const SKILL_LEVEL_OPTIONS = [
  { value: SkillLevel.BEGINNER, label: getSkillLevelLabel(SkillLevel.BEGINNER) },
  { value: SkillLevel.INTERMEDIATE, label: getSkillLevelLabel(SkillLevel.INTERMEDIATE) },
  { value: SkillLevel.PROFICIENT, label: getSkillLevelLabel(SkillLevel.PROFICIENT) },
  { value: SkillLevel.ADVANCED, label: getSkillLevelLabel(SkillLevel.ADVANCED) },
  { value: SkillLevel.EXPERT, label: getSkillLevelLabel(SkillLevel.EXPERT) },
] as const;
