import { EMAIL_RE } from './constants';
import type { FieldErrors, FormValues } from './types';

export const validate = (values: FormValues): FieldErrors => {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const fullName = values.fullName.trim();
  const email = values.email.trim();
  const locale = values.locale.trim();

  if (!name) {
    errors.name = 'Profile name is required';
  } else if (name.length > 120) {
    errors.name = 'Profile name must be at most 120 characters';
  }

  if (!fullName) {
    errors.fullName = 'Full name is required';
  }

  if (!email) {
    errors.email = 'Email is required';
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Enter a valid email';
  }

  if (!locale) {
    errors.locale = 'Locale is required';
  }

  return errors;
};
