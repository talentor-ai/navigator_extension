import type { components } from '@talentor/contracts';
import { baseApi } from './baseApi';
import { PROFILES_PATH } from './constants';

export type ProfilesEnvelope =
  components['schemas']['ApiResponse_list_ProfileMetadata__'];

export const getProfilesApi = async (): Promise<ProfilesEnvelope> => {
  const response = await baseApi({ url: PROFILES_PATH, method: 'GET' });
  return response as unknown as ProfilesEnvelope;
};
