export const YEAR_MONTH_REGEX = /^[0-9]{4}-(0[1-9]|1[0-2])$/;
export const LOCALE_REGEX = /^[a-zA-Z]{2,3}(?:-[A-Z]{2})?$/;
export const COUNTRY_CODE_REGEX = /^[A-Z]{2}$/;
export const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

export const YEAR_MONTH_PATTERN = YEAR_MONTH_REGEX;
export const LOCALE_PATTERN = LOCALE_REGEX;
export const COUNTRY_CODE_PATTERN = COUNTRY_CODE_REGEX;

export function validateNonBlank(
  value: string,
  label = 'Value',
): string | null {
  if (value.trim() === '') return `${label} is required`;
  return null;
}

export function validateEmail(value: string): string | null {
  if (!EMAIL_REGEX.test(value.trim())) return 'Enter a valid email';
  return null;
}

export function validateBcp47Locale(value: string): string | null {
  if (!LOCALE_REGEX.test(value.trim())) return 'Use a locale like en-US';
  return null;
}

export function validateCountryCode(value: string): string | null {
  if (!COUNTRY_CODE_REGEX.test(value.trim()))
    return 'Use a 2-letter country code (e.g. US)';
  return null;
}

export function validateHttpUrl(value: string): string | null {
  const trimmed = value.trim();
  if (trimmed === '') return 'Enter a valid http(s) URL';
  try {
    const url = new URL(trimmed);
    if (url.protocol !== 'http:' && url.protocol !== 'https:')
      return 'Enter a valid http(s) URL';
    if (!url.hostname) return 'Enter a valid http(s) URL';
  } catch {
    return 'Enter a valid http(s) URL';
  }
  return null;
}

export function validateYearMonth(value: string): string | null {
  if (!YEAR_MONTH_REGEX.test(value.trim())) return 'Use YYYY-MM';
  return null;
}

export function validateOptionalCountryCode(value: string): string | null {
  if (value.trim() === '') return null;
  return validateCountryCode(value);
}

export function validateOptionalHttpUrl(value: string): string | null {
  if (value.trim() === '') return null;
  return validateHttpUrl(value);
}

export function validateOptionalYearMonth(value: string): string | null {
  if (value.trim() === '') return null;
  return validateYearMonth(value);
}
