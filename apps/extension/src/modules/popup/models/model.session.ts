import type { components } from '@talentor/contracts';
import type { UserJobProfile } from './model.user';

export type IUserSessionInfo = components['schemas']['UserResponse'] & {
  userJobProfile?: UserJobProfile[];
};

export type ILoginRequest = components['schemas']['LoginRequest'];
