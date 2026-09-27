import { DateTime } from 'luxon';

/**
 * Format ISO string to deterministic UTC string `yyyy-MM-dd HH:mm UTC`.
 * Returns original input for invalid ISO to preserve fallback behavior.
 */
export function formatDate(iso: string): string {
  const dt = DateTime.fromISO(iso, { zone: 'utc' });
  if (!dt.isValid) return iso;
  return `${dt.toFormat('yyyy-MM-dd HH:mm')} UTC`;
}
