import { Badge } from '@/components/ui/badge';
import { EmploymentType, getEmploymentTypeLabel } from '@/constants/enums/employment-type';
import { JobStatus, getJobPostStatusLabel } from '@/constants/enums/job-status';

export function JobBadge({ status }: { status: JobStatus }) {
  switch (status) {
    case JobStatus.PUBLISHED:
      return (
        <Badge variant="default" className="bg-green-500/10 text-green-400">
          {getJobPostStatusLabel(status)}
        </Badge>
      );
    case JobStatus.DRAFT:
      return <Badge variant="secondary">{getJobPostStatusLabel(status)}</Badge>;
    default:
      return <Badge variant="secondary">{getJobPostStatusLabel(status)}</Badge>;
  }
}

export function EmploymentTypeBadge({ employmentType }: { employmentType: EmploymentType }) {
  switch (employmentType) {
    case EmploymentType.FULL_TIME:
      return (
        <Badge variant="default" className="bg-blue-500/10 text-blue-400">
          {getEmploymentTypeLabel(employmentType)}
        </Badge>
      );
    case EmploymentType.PART_TIME:
      return (
        <Badge variant="default" className="bg-purple-500/10 text-purple-400">
          {getEmploymentTypeLabel(employmentType)}
        </Badge>
      );
    case EmploymentType.CONTRACT:
      return (
        <Badge variant="default" className="bg-orange-500/10 text-orange-400">
          {getEmploymentTypeLabel(employmentType)}
        </Badge>
      );
    case EmploymentType.INTERNSHIP:
      return (
        <Badge variant="default" className="bg-teal-500/10 text-teal-400">
          {getEmploymentTypeLabel(employmentType)}
        </Badge>
      );
    case EmploymentType.FREELANCE:
      return (
        <Badge variant="default" className="bg-pink-500/10 text-pink-400">
          {getEmploymentTypeLabel(employmentType)}
        </Badge>
      );
    default:
      return <Badge variant="secondary">{getEmploymentTypeLabel(employmentType)}</Badge>;
  }
}
