import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Skill = components['schemas']['Skill'];

export type SkillsSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};
