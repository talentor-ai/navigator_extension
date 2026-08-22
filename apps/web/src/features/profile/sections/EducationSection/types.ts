import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Education = components['schemas']['Education'];

export type EducationSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

export type EducationItemProps = {
  item: Education;
  pending?: boolean;
  readOnly?: boolean;
  onInstitutionSubmit: (value: string) => void | Promise<void>;
  onDegreeSubmit: (value: string) => void | Promise<void>;
  onFieldOfStudySubmit: (value: string) => void | Promise<void>;
  onCitySubmit: (value: string) => void | Promise<void>;
  onRegionSubmit: (value: string) => void | Promise<void>;
  onCountryCodeSubmit: (value: string) => void | Promise<void>;
  onStartDateSubmit: (value: string) => void | Promise<void>;
  onEndDateSubmit: (value: string) => void | Promise<void>;
};
