import {
  validateBcp47Locale,
  validateEmail,
} from '@/features/profile/validation';
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
  } else {
    const err = validateEmail(email);
    if (err) errors.email = err;
  }

  if (!locale) {
    errors.locale = 'Locale is required';
  } else {
    const err = validateBcp47Locale(locale);
    if (err) errors.locale = err;
  }

  return errors;
};
