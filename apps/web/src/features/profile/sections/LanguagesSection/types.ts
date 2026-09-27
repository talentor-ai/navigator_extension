import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Language = components['schemas']['Language'];
export type LanguageProficiency = components['schemas']['LanguageProficiency'];

export type LanguagesSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};
