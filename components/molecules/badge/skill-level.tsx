import { Badge } from '@/components/ui/badge';
import { getSkillLevelLabel, SkillLevel } from '@/constants/enums/skill-level';

export function SkillLevelBadge({ level }: { level: SkillLevel }) {
  switch (level) {
    case SkillLevel.BEGINNER:
      return (
        <Badge variant="default" className="bg-gray-500/10 text-gray-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
    case SkillLevel.INTERMEDIATE:
      return (
        <Badge variant="default" className="bg-blue-500/10 text-blue-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
    case SkillLevel.PROFICIENT:
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
    case SkillLevel.ADVANCED:
      return (
        <Badge variant="default" className="bg-yellow-500/10 text-yellow-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
    case SkillLevel.EXPERT:
      return (
        <Badge variant="default" className="bg-red-500/10 text-red-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
    default:
      return (
        <Badge variant="default" className="bg-gray-500/10 text-gray-400">
          {getSkillLevelLabel(level)}
        </Badge>
      );
  }
}
