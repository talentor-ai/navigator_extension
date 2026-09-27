import type { components } from '@talentor/contracts';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type CreateProfileRequest = components['schemas']['CreateProfileRequest'];

export type CreateProfileFormValues = {
  name: string;
  fullName: string;
  email: string;
  locale: string;
};

export function buildCreateProfilePayload(
  values: CreateProfileFormValues,
): CreateProfileRequest {
  return {
    name: values.name,
    profile: {
      schemaVersion: 1,
      locale: values.locale,
      personalInfo: {
        fullName: values.fullName,
        email: values.email,
        links: [],
      },
      defaultRole: null,
      baseSummary: null,
      experience: [],
      skills: [],
      languages: [],
      education: [],
      projects: [],
      certifications: [],
    } as CandidateProfileV1,
  };
}
