import { describe, it, expect } from 'vitest';
import { formatDate } from './date';

describe('formatDate', () => {
  it('formats valid ISO UTC to yyyy-MM-dd HH:mm UTC', () => {
    expect(formatDate('2025-03-10T14:30:00.000Z')).toBe('2025-03-10 14:30 UTC');
  });

  it('formats ISO with timezone offset converted to UTC', () => {
    // 16:30+02:00 == 14:30 UTC
    expect(formatDate('2025-03-10T16:30:00+02:00')).toBe(
      '2025-03-10 14:30 UTC',
    );
  });

  it('pads single-digit month/day/hour/minute', () => {
    expect(formatDate('2025-01-05T03:04:00.000Z')).toBe('2025-01-05 03:04 UTC');
  });

  it('returns original input for invalid ISO', () => {
    expect(formatDate('not-a-date')).toBe('not-a-date');
    expect(formatDate('')).toBe('');
    expect(formatDate('2025-13-40')).toBe('2025-13-40');
  });

  it('handles ISO without milliseconds', () => {
    expect(formatDate('2025-03-10T14:30:00Z')).toBe('2025-03-10 14:30 UTC');
  });

  it('is deterministic regardless of local TZ (UTC)', () => {
    // midnight edge
    expect(formatDate('2025-12-31T23:59:00.000Z')).toBe('2025-12-31 23:59 UTC');
    expect(formatDate('2025-01-01T00:00:00.000Z')).toBe('2025-01-01 00:00 UTC');
  });
});
