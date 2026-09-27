import type { FormValues } from './types';

export const EMAIL_RE = /^\S+@\S+\.\S+$/;

export const INITIAL_VALUES: FormValues = {
  name: '',
  fullName: '',
  email: '',
  locale: '',
};
