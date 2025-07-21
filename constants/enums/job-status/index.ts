export enum JobStatus {
  PUBLISHED = 'PUBLISHED',
  DRAFT = 'DRAFT',
}

export const JOB_STATUS_LABELS = {
  [JobStatus.PUBLISHED]: 'Published',
  [JobStatus.DRAFT]: 'Draft',
} as const;

export const JOB_STATUS_OPTIONS = [
  { value: JobStatus.PUBLISHED, label: JOB_STATUS_LABELS[JobStatus.PUBLISHED] },
  { value: JobStatus.DRAFT, label: JOB_STATUS_LABELS[JobStatus.DRAFT] },
] as const;

export const getJobPostStatusLabel = (jobPostStatus: JobStatus) => {
  return JOB_STATUS_LABELS[jobPostStatus];
};
