/**
 * Utility functions for the application
 */

/**
 * Format a number as currency (USD)
 * @param amount - The amount in major USD units (dollars, e.g., 100.50 for $100.50)
 * @param options - Formatting options
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  options: {
    locale?: string;
    currency?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const {
    locale = "en-US",
    currency = "USD",
    minimumFractionDigits = 0,
    maximumFractionDigits = minimumFractionDigits,
  } = options;

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(amount);
}

/**
 * Format a large number with commas
 * @param num - The number to format
 * @returns Formatted number string
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

/**
 * Calculate percentage of a value
 * @param value - The value
 * @param total - The total
 * @returns Percentage value (0-100)
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

/**
 * Format a phone number for tel: href attribute
 * Removes all whitespace and formatting characters
 * @param phone - The phone number string
 * @returns Cleaned phone number suitable for tel: href
 */
export function formatTelHref(phone: string): string {
  return phone.replace(/\s/g, "");
}
