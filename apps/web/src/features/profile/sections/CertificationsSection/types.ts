import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Certification = components['schemas']['Certification'];

export type CertificationsSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

export type CertificationItemProps = {
  item: Certification;
  pending?: boolean;
  readOnly?: boolean;
  onNameSubmit: (value: string) => void | Promise<void>;
  onIssuerSubmit: (value: string) => void | Promise<void>;
  onIssueDateSubmit: (value: string) => void | Promise<void>;
  onExpirationDateSubmit: (value: string) => void | Promise<void>;
};
