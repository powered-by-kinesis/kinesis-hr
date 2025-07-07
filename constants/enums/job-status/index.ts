import { CheckCircle2, FileText } from 'lucide-react';

export enum JobStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export const JOB_STATUS_LABELS = {
  [JobStatus.PUBLISHED]: 'Published',
  [JobStatus.DRAFT]: 'Draft',
} as const;

export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.PUBLISHED, label: JOB_STATUS_LABELS[JobStatus.PUBLISHED], icon: CheckCircle2 },
  { value: JobStatus.DRAFT, label: JOB_STATUS_LABELS[JobStatus.DRAFT], icon: FileText },
] as const;
