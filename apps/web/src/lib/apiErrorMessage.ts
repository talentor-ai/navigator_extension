import { ApiError } from '@talentor/api-client';

const DEFAULT_FALLBACK = 'Something went wrong. Please try again.';

const MESSAGES = {
  network: 'Unable to reach the server. Check your connection and try again.',
  tooLarge: 'That file is too large.',
  unsupported: 'Upload a PDF or Word (.doc, .docx) file.',
  validationFallback: 'Some fields need your review.',
  busy: 'Resume processing is busy. Please try again shortly.',
  conflictFallback: 'That name is already in use.',
  server: 'Resume processing failed. Please try again.',
} as const;

const MAX_LENGTH = 300;

function cap(text: string): string {
  const trimmed = text.trim();
  if (trimmed.length <= MAX_LENGTH) return trimmed;
  return trimmed.slice(0, MAX_LENGTH);
}

function getSafeDetail(error: ApiError): string | null {
  const raw = error.message ?? '';
  const trimmed = raw.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith('Request failed with status')) return null;
  if (trimmed.length > MAX_LENGTH) return null;
  return trimmed;
}

export function toUserMessage(
  error: unknown,
  fallback = DEFAULT_FALLBACK,
): string {
  const safeFallback = cap(
    fallback && fallback.trim() ? fallback : DEFAULT_FALLBACK,
  );

  if (!(error instanceof ApiError)) {
    return safeFallback;
  }

  const status = error.status;

  switch (status) {
    case 0:
      return MESSAGES.network;
    case 413:
      return MESSAGES.tooLarge;
    case 415:
      return MESSAGES.unsupported;
    case 422: {
      const detail = getSafeDetail(error);
      if (detail) return cap(detail);
      return MESSAGES.validationFallback;
    }
    case 429:
      return MESSAGES.busy;
    case 409: {
      const detail = getSafeDetail(error);
      if (detail) return cap(detail);
      return MESSAGES.conflictFallback;
    }
    default:
      break;
  }

  if (status >= 500 && status <= 599) {
    return MESSAGES.server;
  }

  return safeFallback;
}
