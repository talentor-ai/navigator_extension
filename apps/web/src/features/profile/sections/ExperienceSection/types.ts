import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Experience = components['schemas']['Experience'];

export type ExperienceSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

export type ExperienceItemProps = {
  item: Experience;
  pending?: boolean;
  readOnly?: boolean;
  onCompanySubmit: (value: string) => void | Promise<void>;
  onPositionSubmit: (value: string) => void | Promise<void>;
  onEmploymentTypeSubmit: (value: string) => void | Promise<void>;
  onLocationTypeSubmit: (value: string) => void | Promise<void>;
  onStartDateSubmit: (value: string) => void | Promise<void>;
  onEndDateSubmit: (value: string) => void | Promise<void>;
  onSummarySubmit: (value: string) => void | Promise<void>;
  onResponsibilitySubmit: (
    index: number,
    value: string,
  ) => void | Promise<void>;
  onAchievementSubmit: (index: number, value: string) => void | Promise<void>;
};
