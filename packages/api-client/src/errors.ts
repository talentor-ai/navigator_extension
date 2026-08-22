/**
 * Error thrown when the API returns a non-2xx status.
 * The backend error shape is `{ detail: string }` for most endpoints,
 * but FastAPI validation (422) returns `{ detail: ValidationError[] }`.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    detail: string | null,
  ) {
    super(detail ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

export function normalizeDetail(detail: unknown): string | null {
  if (detail === null || detail === undefined) return null;
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    const parts: string[] = [];
    for (const item of detail) {
      if (!item || typeof item !== 'object' || Array.isArray(item)) continue;
      const loc = (item as { loc?: unknown }).loc;
      const msg = (item as { msg?: unknown }).msg;
      if (typeof msg !== 'string') continue;
      let locStr: string | null = null;
      if (Array.isArray(loc)) {
        const filtered = loc.filter(
          (v): v is string | number =>
            typeof v === 'string' || typeof v === 'number',
        );
        if (filtered.length > 0) {
          const start = filtered[0] === 'body' ? 1 : 0;
          const sliced = filtered.slice(start);
          if (sliced.length > 0) locStr = sliced.map(String).join('.');
        }
      } else if (typeof loc === 'string' && loc) {
        locStr = loc;
      }
      if (locStr) parts.push(`${locStr}: ${msg}`);
      else parts.push(msg);
    }
    if (parts.length > 0) return parts.join('; ');
    return null;
  }
  return null;
}

export function extractDetail(data: unknown): string | null {
  if (!data || typeof data !== 'object' || Array.isArray(data)) return null;
  const detail = (data as { detail?: unknown }).detail;
  return normalizeDetail(detail);
}
