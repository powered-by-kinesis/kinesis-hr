import { Currency, CURRENCY_LOCALE_MAP } from '@/constants/enums/currency';
import { getSalaryTypeLabel, SalaryType } from '@/constants/enums/salary-type';

/**
 * Formats a salary range into a readable string.
 *
 * This function takes salary components and constructs a formatted string,
 * such as "$50,000 - $70,000 per year" or "IDR 15,000,000 / month".
 * It handles currency formatting and localization.
 *
 * @param salaryMin - The minimum salary amount (optional).
 * @param salaryMax - The maximum salary amount (optional).
 * @param currency - The currency code (e.g., 'USD', 'IDR').
 * @param salaryType - The type of salary period (e.g., 'YEARLY', 'MONTHLY').
 * @returns A formatted salary string, or null if no salary info is provided.
 */
export const formatSalary = (
  salaryMin?: number | string | null,
  salaryMax?: number | string | null,
  currency?: string | null,
  salaryType?: string | null,
): string | null => {
  if (!salaryMin && !salaryMax) {
    return null; // No salary information to display
  }

  const min = typeof salaryMin === 'string' ? parseFloat(salaryMin) : salaryMin;
  const max = typeof salaryMax === 'string' ? parseFloat(salaryMax) : salaryMax;
  const ccy = currency as Currency;
  const type = salaryType as SalaryType;

  const currencyOptions: Intl.NumberFormatOptions = {
    style: 'currency',
    currency: ccy || Currency.USD, // Default to USD if not provided
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  };

  const formatter = new Intl.NumberFormat(CURRENCY_LOCALE_MAP[ccy] || 'en-US', currencyOptions);

  let formattedSalary = '';

  if (min && max) {
    formattedSalary = `${formatter.format(min)} - ${formatter.format(max)}`;
  } else if (min) {
    formattedSalary = formatter.format(min);
  } else if (max) {
    formattedSalary = formatter.format(max);
  }

  if (type) {
    formattedSalary += ` ${getSalaryTypeLabel(type)}`;
  }

  return formattedSalary.trim();
};
