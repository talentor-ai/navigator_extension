import { validateEmail, validateNonBlank } from '@/features/profile/validation';
import {
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZE,
  MAX_PROFILE_NAME_LENGTH,
} from './constants';
import type { CandidateProfileV1 } from './types';

export function getFileExtension(name: string): string {
  const idx = name.lastIndexOf('.');
  if (idx === -1) return '';
  return name.slice(idx).toLowerCase();
}

export function validateResumeFile(file: File): string | null {
  const ext = getFileExtension(file.name);
  if (
    !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])
  ) {
    return 'Unsupported file type. Only PDF, DOC, DOCX are allowed';
  }
  if (file.size === 0) {
    return 'File is empty';
  }
  if (file.size > MAX_FILE_SIZE) {
    return 'File too large. Maximum size is 5 MiB';
  }
  return null;
}

export function validateProfileName(name: string): string | null {
  const trimmed = name.trim();
  if (trimmed.length === 0) return 'Profile name is required';
  if (trimmed.length > MAX_PROFILE_NAME_LENGTH) {
    return 'Profile name must be at most 120 characters';
  }
  return null;
}

export function validateDraftProfile(profile: CandidateProfileV1): {
  fullName: string | null;
  email: string | null;
} {
  const fullNameError = validateNonBlank(
    profile.personalInfo.fullName ?? '',
    'Full name',
  );
  const emailRaw = profile.personalInfo.email ?? '';
  let emailError: string | null;
  if (emailRaw.trim() === '') {
    emailError = 'Email is required';
  } else {
    emailError = validateEmail(emailRaw);
  }
  return { fullName: fullNameError, email: emailError };
}

export function isDraftProfileValid(profile: CandidateProfileV1): boolean {
  const { fullName, email } = validateDraftProfile(profile);
  return !fullName && !email;
}
