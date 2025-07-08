export enum SalaryType {
  YEARLY = 'YEARLY',
  MONTHLY = 'MONTHLY',
  HOURLY = 'HOURLY',
}

export const SalaryTypeOptions = [
  {
    label: 'Yearly',
    value: SalaryType.YEARLY,
  },
  {
    label: 'Monthly',
    value: SalaryType.MONTHLY,
  },
  {
    label: 'Hourly',
    value: SalaryType.HOURLY,
  },
];

export const getSalaryTypeLabel = (salaryType: SalaryType) => {
  switch (salaryType) {
    case SalaryType.YEARLY:
      return 'Yearly';
    case SalaryType.MONTHLY:
      return 'Monthly';
    case SalaryType.HOURLY:
      return 'Hourly';
    default:
      return 'Unknown';
  }
};
