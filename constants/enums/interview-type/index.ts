export enum InterviewType {
  BASIC = 'BASIC',
  ADVANCED = 'ADVANCED',
  TECHNICAL = 'TECHNICAL',
  BEHAVIORAL = 'BEHAVIORAL',
}

export const getInterviewTypeLabel = (interviewType: InterviewType): string => {
  switch (interviewType) {
    case InterviewType.BASIC:
      return 'Basic';
    case InterviewType.ADVANCED:
      return 'Advanced';
    case InterviewType.TECHNICAL:
      return 'Technical';
    case InterviewType.BEHAVIORAL:
      return 'Behavioral';
    default:
      return 'Basic';
  }
};

export const INTERVIEW_TYPE_OPTIONS = [
  { value: InterviewType.BASIC, label: getInterviewTypeLabel(InterviewType.BASIC) },
  { value: InterviewType.ADVANCED, label: getInterviewTypeLabel(InterviewType.ADVANCED) },
  { value: InterviewType.TECHNICAL, label: getInterviewTypeLabel(InterviewType.TECHNICAL) },
  { value: InterviewType.BEHAVIORAL, label: getInterviewTypeLabel(InterviewType.BEHAVIORAL) },
] as const;
