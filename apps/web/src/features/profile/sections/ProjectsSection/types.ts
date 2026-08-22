import type { components } from '@talentor/contracts';

export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type Project = components['schemas']['Project'];

export type ProjectsSectionProps = {
  profile: CandidateProfileV1;
  onProfileChange: (next: CandidateProfileV1) => void | Promise<void>;
  pending?: boolean;
  readOnly?: boolean;
};

export type ProjectItemProps = {
  item: Project;
  pending?: boolean;
  readOnly?: boolean;
  onNameSubmit: (value: string) => void | Promise<void>;
  onRoleSubmit: (value: string) => void | Promise<void>;
  onDescriptionSubmit: (value: string) => void | Promise<void>;
  onStartDateSubmit: (value: string) => void | Promise<void>;
  onEndDateSubmit: (value: string) => void | Promise<void>;
  onUrlSubmit: (value: string) => void | Promise<void>;
  onRepositorySubmit: (value: string) => void | Promise<void>;
  onAchievementSubmit: (index: number, value: string) => void | Promise<void>;
};
