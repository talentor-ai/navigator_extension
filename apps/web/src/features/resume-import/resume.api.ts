import { baseApi } from '@/api/baseApi';
import type { components } from '@talentor/contracts';
import type { ResumeDraft } from './types';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type ProfileSnapshot = components['schemas']['ProfileSnapshot'];

export async function uploadResume(
  file: File,
  locale = 'en-US',
): Promise<ResumeDraft> {
  const form = new FormData();
  form.append('file', file);
  form.append('locale', locale);
  return baseApi<ResumeDraft>({
    url: '/api/v1/profiles/resume-import/draft',
    method: 'POST',
    data: form,
  });
}

export async function confirmResume(
  name: string,
  profile: CandidateProfileV1,
): Promise<ProfileSnapshot> {
  return baseApi<ProfileSnapshot>({
    url: '/api/v1/profiles/resume-import/confirm',
    method: 'POST',
    data: { name, profile },
  });
}
