import type {
  CreateProfileRequest,
  ProfileMetadata,
  ProfileSnapshot,
  ProfileVersionMetadata,
  ProfileVersionSnapshot,
  RequestFn,
  UpdateProfileRequest,
} from './types';

export type ProfilesNamespace = {
  list(): Promise<ProfileMetadata[]>;
  get(profileId: string): Promise<ProfileSnapshot>;
  create(data: CreateProfileRequest): Promise<ProfileSnapshot>;
  update(
    profileId: string,
    data: UpdateProfileRequest,
  ): Promise<ProfileSnapshot>;
  listVersions(profileId: string): Promise<ProfileVersionMetadata[]>;
  getVersion(
    profileId: string,
    version: number,
  ): Promise<ProfileVersionSnapshot>;
  activateVersion(profileId: string, version: number): Promise<ProfileSnapshot>;
};

export function createProfiles(request: RequestFn): ProfilesNamespace {
  return {
    list: () =>
      request<ProfileMetadata[]>({ method: 'GET', url: '/api/v1/profiles' }),
    get: (profileId: string) =>
      request<ProfileSnapshot>({
        method: 'GET',
        url: `/api/v1/profiles/${encodeURIComponent(profileId)}`,
      }),
    create: (data: CreateProfileRequest) =>
      request<ProfileSnapshot>({
        method: 'POST',
        url: '/api/v1/profiles',
        data,
      }),
    update: (profileId: string, data: UpdateProfileRequest) =>
      request<ProfileSnapshot>({
        method: 'PUT',
        url: `/api/v1/profiles/${encodeURIComponent(profileId)}`,
        data,
      }),
    listVersions: (profileId: string) =>
      request<ProfileVersionMetadata[]>({
        method: 'GET',
        url: `/api/v1/profiles/${encodeURIComponent(profileId)}/versions`,
      }),
    getVersion: (profileId: string, version: number) =>
      request<ProfileVersionSnapshot>({
        method: 'GET',
        url: `/api/v1/profiles/${encodeURIComponent(profileId)}/versions/${encodeURIComponent(String(version))}`,
      }),
    activateVersion: (profileId: string, version: number) =>
      request<ProfileSnapshot>({
        method: 'POST',
        url: `/api/v1/profiles/${encodeURIComponent(profileId)}/versions/${encodeURIComponent(String(version))}/activate`,
      }),
  };
}
