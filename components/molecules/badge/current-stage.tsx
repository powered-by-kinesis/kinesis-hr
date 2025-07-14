import { Badge } from '@/components/ui/badge';
import { Stage, getStageLabel } from '@/constants/enums/stage';

export function CurrentStageBadge({ stage }: { stage: Stage }) {
  switch (stage) {
    case Stage.APPLIED:
      return (
        <Badge variant="default" className="bg-sky-500/10 text-sky-400">
          {getStageLabel(stage)}
        </Badge>
      );
    case Stage.AI_SCREENING:
      return (
        <Badge variant="secondary" className="bg-blue-500/10 text-blue-400">
          {getStageLabel(stage)}
        </Badge>
      );
    case Stage.OFFER:
      return (
        <Badge variant="default" className="bg-purple-500/10 text-purple-400">
          {getStageLabel(stage)}
        </Badge>
      );
    case Stage.REVIEW:
      return (
        <Badge variant="default" className="bg-orange-500/10 text-orange-400">
          {getStageLabel(stage)}
        </Badge>
      );
    case Stage.HIRED:
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-400">
          {getStageLabel(stage)}
        </Badge>
      );
    case Stage.REJECTED:
      return <Badge variant="destructive">{getStageLabel(stage)}</Badge>;
    default:
      return (
        <Badge variant="default" className="bg-gray-500/10 text-gray-400">
          {getStageLabel(stage)}
        </Badge>
      );
  }
}
