export enum Stage {
  APPLIED = 'APPLIED',
  AI_SCREENING = 'AI_SCREENING',
  REVIEW = 'REVIEW',
  OFFER = 'OFFER',
  HIRED = 'HIRED',
  REJECTED = 'REJECTED',
}

export const StageOptions = [
  {
    label: 'Applied',
    value: Stage.APPLIED,
  },
  {
    label: 'AI Screening',
    value: Stage.AI_SCREENING,
  },
  {
    label: 'Review',
    value: Stage.REVIEW,
  },
  {
    label: 'Offer',
    value: Stage.OFFER,
  },
  {
    label: 'Hired',
    value: Stage.HIRED,
  },
];

export const getStageLabel = (stage: Stage) => {
  switch (stage) {
    case Stage.APPLIED:
      return 'Applied';
    case Stage.AI_SCREENING:
      return 'AI Screening';
    case Stage.REVIEW:
      return 'Review';
    case Stage.OFFER:
      return 'Offer';
    case Stage.HIRED:
      return 'Hired';
    case Stage.REJECTED:
      return 'Rejected';
    default:
      return 'Unknown';
  }
};
