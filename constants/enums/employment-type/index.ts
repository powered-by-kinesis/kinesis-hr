export enum EmploymentType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  CONTRACT = 'CONTRACT',
  INTERNSHIP = 'INTERNSHIP',
  FREELANCE = 'FREELANCE',
}

export const EMPLOYMENT_TYPE_LABELS = {
  [EmploymentType.FULL_TIME]: 'Full-Time',
  [EmploymentType.PART_TIME]: 'Part-Time',
  [EmploymentType.CONTRACT]: 'Contract',
  [EmploymentType.INTERNSHIP]: 'Internship',
  [EmploymentType.FREELANCE]: 'Freelance',
} as const;

export const EMPLOYMENT_TYPE_OPTIONS = [
  { value: EmploymentType.FULL_TIME, label: EMPLOYMENT_TYPE_LABELS[EmploymentType.FULL_TIME] },
  { value: EmploymentType.PART_TIME, label: EMPLOYMENT_TYPE_LABELS[EmploymentType.PART_TIME] },
  { value: EmploymentType.CONTRACT, label: EMPLOYMENT_TYPE_LABELS[EmploymentType.CONTRACT] },
  { value: EmploymentType.INTERNSHIP, label: EMPLOYMENT_TYPE_LABELS[EmploymentType.INTERNSHIP] },
  { value: EmploymentType.FREELANCE, label: EMPLOYMENT_TYPE_LABELS[EmploymentType.FREELANCE] },
] as const;
