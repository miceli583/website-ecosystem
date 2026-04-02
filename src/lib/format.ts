/**
 * Shared formatting utilities.
 * Single source of truth for currency and date formatting across the app.
 */

/**
 * Format an amount in cents to a currency string.
 * @example formatCents(100000, "usd") => "$1,000.00"
 */
export function formatCents(cents: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

/**
 * Format a date to a short human-readable string.
 * @example formatDate("2026-04-01") => "Apr 1, 2026"
 */
export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Format a Unix timestamp (seconds) to a short date string.
 * @example formatUnixDate(1711929600) => "Apr 1, 2024"
 */
export function formatUnixDate(timestamp: number): string {
  return formatDate(new Date(timestamp * 1000));
}
