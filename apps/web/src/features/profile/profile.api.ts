import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@talentor/api-client';
import type { components } from '@talentor/contracts';
import { api } from '@/api/client';

type ProfileMetadata = components['schemas']['ProfileMetadata'];
type ProfileSnapshot = components['schemas']['ProfileSnapshot'];
type ProfileVersionMetadata = components['schemas']['ProfileVersionMetadata'];
type ProfileVersionSnapshot = components['schemas']['ProfileVersionSnapshot'];
type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
type CreateProfileRequest = components['schemas']['CreateProfileRequest'];

export const profileKeys = {
  all: ['profiles'] as const,
  lists: () => [...profileKeys.all, 'list'] as const,
  details: () => [...profileKeys.all, 'detail'] as const,
  detail: (profileId: string) => [...profileKeys.details(), profileId] as const,
  versions: (profileId: string) =>
    [...profileKeys.all, 'versions', profileId] as const,
  version: (profileId: string, version: number) =>
    [...profileKeys.all, 'version', profileId, version] as const,
};

export function useProfiles() {
  return useQuery<ProfileMetadata[]>({
    queryKey: profileKeys.lists(),
    queryFn: () => api.profiles.list(),
  });
}

export function useProfile(profileId: string | undefined) {
  return useQuery<ProfileSnapshot>({
    queryKey: profileId
      ? profileKeys.detail(profileId)
      : ([...profileKeys.all, 'detail', 'disabled'] as const),
    queryFn: () => api.profiles.get(profileId!),
    enabled: Boolean(profileId),
  });
}

export function useProfileVersions(profileId: string | undefined) {
  return useQuery<ProfileVersionMetadata[]>({
    queryKey: profileId
      ? profileKeys.versions(profileId)
      : ([...profileKeys.all, 'versions', 'disabled'] as const),
    queryFn: () => api.profiles.listVersions(profileId!),
    enabled: Boolean(profileId),
  });
}

export function useProfileVersion(
  profileId: string | undefined,
  version: number | undefined | null,
) {
  return useQuery<ProfileVersionSnapshot>({
    queryKey:
      profileId && version != null
        ? profileKeys.version(profileId, version)
        : ([...profileKeys.all, 'version', 'disabled'] as const),
    queryFn: () => api.profiles.getVersion(profileId!, version!),
    enabled: Boolean(profileId && version != null),
  });
}

export function useCreateProfile() {
  const qc = useQueryClient();
  return useMutation<ProfileSnapshot, Error, CreateProfileRequest>({
    mutationFn: (data) => api.profiles.create(data),
    onSuccess: (snapshot) => {
      qc.setQueryData<ProfileSnapshot>(
        profileKeys.detail(snapshot.id),
        snapshot,
      );
      qc.invalidateQueries({ queryKey: profileKeys.lists() });
    },
  });
}

export function useUpdateProfile(profileId: string | undefined) {
  const qc = useQueryClient();
  return useMutation<
    ProfileSnapshot,
    Error,
    CandidateProfileV1,
    { previous?: ProfileSnapshot }
  >({
    mutationFn: (next) => {
      if (!profileId) {
        throw new Error('Missing profileId: cannot update without id');
      }
      const cached = qc.getQueryData<ProfileSnapshot>(
        profileKeys.detail(profileId),
      );
      const expectedVersion = cached?.currentVersion;
      if (expectedVersion == null) {
        throw new Error('Missing expectedVersion: no cached profile snapshot');
      }
      return api.profiles.update(profileId, {
        expectedVersion,
        profile: next,
      });
    },
    onMutate: async (next) => {
      if (!profileId) {
        throw new Error('Missing profileId: cannot update without id');
      }
      await qc.cancelQueries({ queryKey: profileKeys.detail(profileId) });
      const previous = qc.getQueryData<ProfileSnapshot>(
        profileKeys.detail(profileId),
      );
      if (previous) {
        qc.setQueryData<ProfileSnapshot>(profileKeys.detail(profileId), {
          ...previous,
          profile: next,
        });
      }
      return { previous };
    },
    onError: (error, _next, context) => {
      if (!profileId) return;
      if (context?.previous) {
        qc.setQueryData(profileKeys.detail(profileId), context.previous);
      }
      if (error instanceof ApiError && error.status === 409) {
        qc.invalidateQueries({ queryKey: profileKeys.detail(profileId) });
        qc.invalidateQueries({ queryKey: profileKeys.versions(profileId) });
      }
    },
    onSuccess: (snapshot) => {
      if (!profileId) return;
      qc.setQueryData<ProfileSnapshot>(profileKeys.detail(profileId), snapshot);
      if (snapshot.id !== profileId) {
        qc.setQueryData<ProfileSnapshot>(
          profileKeys.detail(snapshot.id),
          snapshot,
        );
      }
      qc.invalidateQueries({ queryKey: profileKeys.lists() });
      qc.invalidateQueries({ queryKey: profileKeys.versions(profileId) });
    },
  });
}

export function useActivateProfileVersion(profileId: string | undefined) {
  const qc = useQueryClient();
  return useMutation<ProfileSnapshot, Error, number>({
    mutationFn: (version) => {
      if (!profileId) {
        throw new Error('Missing profileId for activate mutation');
      }
      return api.profiles.activateVersion(profileId, version);
    },
    onSuccess: (snapshot) => {
      if (!profileId) return;
      qc.setQueryData<ProfileSnapshot>(profileKeys.detail(profileId), snapshot);
      qc.setQueryData<ProfileSnapshot>(
        profileKeys.detail(snapshot.id),
        snapshot,
      );
      qc.invalidateQueries({ queryKey: profileKeys.lists() });
      qc.invalidateQueries({ queryKey: profileKeys.versions(profileId) });
      if (profileId !== snapshot.id) {
        qc.invalidateQueries({ queryKey: profileKeys.versions(snapshot.id) });
      }
    },
  });
}
