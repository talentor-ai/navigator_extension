import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { ApiError } from '@talentor/api-client';
import type { components } from '@talentor/contracts';
import {
  profileKeys,
  useProfiles,
  useProfile,
  useCreateProfile,
  useUpdateProfile,
  useProfileVersions,
  useProfileVersion,
  useActivateProfileVersion,
} from './profile.api';
import { api } from '@/api/client';

type ProfileSnapshot = components['schemas']['ProfileSnapshot'];
type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

const PROFILE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';

function makeSnapshot(overrides?: Partial<ProfileSnapshot>): ProfileSnapshot {
  const base: ProfileSnapshot = {
    id: PROFILE_ID,
    name: 'Test Profile',
    currentVersion: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    profile: {
      schemaVersion: 1,
      locale: 'en-US',
      personalInfo: {
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        links: [],
      },
      experience: [],
      skills: [],
      languages: [],
      education: [],
      projects: [],
      certifications: [],
    } as CandidateProfileV1,
  } as ProfileSnapshot;
  return { ...base, ...overrides } as ProfileSnapshot;
}

function createWrapper() {
  const qc = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
  return { qc, Wrapper };
}

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('profileKeys', () => {
  it('produces stable keys', () => {
    expect(profileKeys.all).toEqual(['profiles']);
    expect(profileKeys.lists()).toEqual(['profiles', 'list']);
    expect(profileKeys.detail(PROFILE_ID)).toEqual([
      'profiles',
      'detail',
      PROFILE_ID,
    ]);
    expect(profileKeys.versions(PROFILE_ID)).toEqual([
      'profiles',
      'versions',
      PROFILE_ID,
    ]);
    expect(profileKeys.version(PROFILE_ID, 3)).toEqual([
      'profiles',
      'version',
      PROFILE_ID,
      3,
    ]);
  });
});

describe('useProfiles', () => {
  it('fetches list', async () => {
    const meta = {
      id: PROFILE_ID,
      name: 'Test',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    } as components['schemas']['ProfileMetadata'];
    vi.spyOn(api.profiles, 'list').mockResolvedValue([meta]);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfiles(), { wrapper: Wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([meta]);
  });
});

describe('useProfile', () => {
  it('disabled when no id', () => {
    const spy = vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(undefined), {
      wrapper: Wrapper,
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
  });

  it('uses explicit disabled key rather than detail with empty id', () => {
    vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    const { qc, Wrapper } = createWrapper();
    renderHook(() => useProfile(undefined), { wrapper: Wrapper });
    // disabled key should be present, empty detail key must not be used
    expect(
      qc.getQueryState([...profileKeys.all, 'detail', 'disabled'] as const),
    ).toBeDefined();
    expect(qc.getQueryState(profileKeys.detail(''))).toBeUndefined();
  });

  it('disabled for empty string id with disabled key', () => {
    const spy = vi.spyOn(api.profiles, 'get').mockResolvedValue(makeSnapshot());
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(''), { wrapper: Wrapper });
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
    expect(
      qc.getQueryState([...profileKeys.all, 'detail', 'disabled'] as const),
    ).toBeDefined();
  });

  it('enabled when id present', async () => {
    const snap = makeSnapshot();
    vi.spyOn(api.profiles, 'get').mockResolvedValue(snap);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfile(PROFILE_ID), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(snap);
  });
});

describe('useProfileVersions', () => {
  it('disabled when no id uses disabled key', () => {
    const spy = vi
      .spyOn(api.profiles, 'listVersions')
      .mockResolvedValue([] as any);
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfileVersions(undefined), {
      wrapper: Wrapper,
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
    expect(
      qc.getQueryState([...profileKeys.all, 'versions', 'disabled'] as const),
    ).toBeDefined();
    expect(qc.getQueryState(profileKeys.versions(''))).toBeUndefined();
  });

  it('disabled for empty string id', () => {
    const spy = vi
      .spyOn(api.profiles, 'listVersions')
      .mockResolvedValue([] as any);
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfileVersions(''), {
      wrapper: Wrapper,
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
    expect(
      qc.getQueryState([...profileKeys.all, 'versions', 'disabled'] as const),
    ).toBeDefined();
  });

  it('fetches versions', async () => {
    const versions = [
      {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-01-01T00:00:00.000Z',
        isCurrent: false,
      },
    ] as components['schemas']['ProfileVersionMetadata'][];
    vi.spyOn(api.profiles, 'listVersions').mockResolvedValue(versions);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfileVersions(PROFILE_ID), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(versions);
  });
});

describe('useProfileVersion', () => {
  it('disabled unless profileId and version exist', () => {
    const spy = vi
      .spyOn(api.profiles, 'getVersion')
      .mockResolvedValue({} as components['schemas']['ProfileVersionSnapshot']);
    const { Wrapper } = createWrapper();
    const { result: r1 } = renderHook(() => useProfileVersion(undefined, 1), {
      wrapper: Wrapper,
    });
    const { result: r2 } = renderHook(
      () => useProfileVersion(PROFILE_ID, undefined),
      { wrapper: Wrapper },
    );
    const { result: r3 } = renderHook(
      () => useProfileVersion(PROFILE_ID, null),
      { wrapper: Wrapper },
    );
    expect(r1.current.fetchStatus).toBe('idle');
    expect(r2.current.fetchStatus).toBe('idle');
    expect(r3.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
  });

  it('disabled for empty string profileId with consistent truthy check', () => {
    const spy = vi
      .spyOn(api.profiles, 'getVersion')
      .mockResolvedValue({} as any);
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfileVersion('', 1), {
      wrapper: Wrapper,
    });
    expect(result.current.fetchStatus).toBe('idle');
    expect(spy).not.toHaveBeenCalled();
    expect(
      qc.getQueryState([...profileKeys.all, 'version', 'disabled'] as const),
    ).toBeDefined();
    expect(qc.getQueryState(profileKeys.version('', 1))).toBeUndefined();
  });

  it('uses disabled key when either param missing', () => {
    const spy = vi
      .spyOn(api.profiles, 'getVersion')
      .mockResolvedValue({} as any);
    const { qc, Wrapper } = createWrapper();
    renderHook(() => useProfileVersion(undefined, undefined), {
      wrapper: Wrapper,
    });
    expect(spy).not.toHaveBeenCalled();
    expect(
      qc.getQueryState([...profileKeys.all, 'version', 'disabled'] as const),
    ).toBeDefined();
  });

  it('enabled when both present', async () => {
    const snap = {
      profileId: PROFILE_ID,
      name: 'Test',
      version: {
        id: 'v1',
        versionNumber: 1,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-01-01T00:00:00.000Z',
        isCurrent: false,
      },
      profile: makeSnapshot().profile,
    } as components['schemas']['ProfileVersionSnapshot'];
    vi.spyOn(api.profiles, 'getVersion').mockResolvedValue(snap);
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useProfileVersion(PROFILE_ID, 1), {
      wrapper: Wrapper,
    });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(snap);
  });
});

describe('useCreateProfile', () => {
  it('sets detail cache and invalidates list', async () => {
    const snap = makeSnapshot();
    vi.spyOn(api.profiles, 'create').mockResolvedValue(snap);
    const { qc, Wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');
    const { result } = renderHook(() => useCreateProfile(), {
      wrapper: Wrapper,
    });
    await result.current.mutateAsync({
      name: 'New',
      profile: snap.profile,
    } as components['schemas']['CreateProfileRequest']);
    expect(qc.getQueryData(profileKeys.detail(snap.id))).toEqual(snap);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.lists(),
    });
  });
});

describe('useUpdateProfile', () => {
  it('optimistically updates, replaces with server response, invalidates list/history', async () => {
    const initial = makeSnapshot({ currentVersion: 2 });
    const nextProfile: CandidateProfileV1 = {
      ...initial.profile,
      baseSummary: 'updated summary',
    };
    const serverSnapshot = makeSnapshot({
      currentVersion: 3,
      profile: nextProfile,
    } as Partial<ProfileSnapshot>);

    let captured: unknown = null;
    vi.spyOn(api.profiles, 'update').mockImplementation(
      async (_id: string, body) => {
        captured = body;
        await new Promise((r) => setTimeout(r, 300));
        return serverSnapshot;
      },
    );

    const { qc, Wrapper } = createWrapper();
    qc.setQueryData(profileKeys.detail(PROFILE_ID), initial);
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateProfile(PROFILE_ID), {
      wrapper: Wrapper,
    });

    const promise = result.current.mutateAsync(nextProfile);

    // optimistic: profile replaced, version not incremented
    await waitFor(() => {
      const cached = qc.getQueryData<ProfileSnapshot>(
        profileKeys.detail(PROFILE_ID),
      );
      expect(cached?.profile).toEqual(nextProfile);
      expect(cached?.currentVersion).toBe(2);
    });

    await promise;
    expect(captured).toEqual({
      expectedVersion: 2,
      profile: nextProfile,
    });
    // after success, exact server response replaces cache, never assume increment
    expect(qc.getQueryData(profileKeys.detail(PROFILE_ID))).toEqual(
      serverSnapshot,
    );
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.versions(PROFILE_ID),
    });
  });

  it('rolls back on error and invalidates detail and versions on 409', async () => {
    const initial = makeSnapshot({ currentVersion: 2 });
    const nextProfile: CandidateProfileV1 = {
      ...initial.profile,
      baseSummary: 'bad update',
    };

    vi.spyOn(api.profiles, 'update').mockRejectedValue(
      new ApiError(409, 'Stale version'),
    );

    const { qc, Wrapper } = createWrapper();
    qc.setQueryData(profileKeys.detail(PROFILE_ID), initial);
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateProfile(PROFILE_ID), {
      wrapper: Wrapper,
    });

    await expect(
      result.current.mutateAsync(nextProfile),
    ).rejects.toBeInstanceOf(ApiError);

    // rolled back
    expect(qc.getQueryData(profileKeys.detail(PROFILE_ID))).toEqual(initial);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.detail(PROFILE_ID),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.versions(PROFILE_ID),
    });
  });

  it('rolls back on generic error without detail refetch if not 409', async () => {
    const initial = makeSnapshot({ currentVersion: 2 });
    const nextProfile: CandidateProfileV1 = {
      ...initial.profile,
      baseSummary: 'fail',
    };
    vi.spyOn(api.profiles, 'update').mockRejectedValue(
      new ApiError(500, 'err'),
    );

    const { qc, Wrapper } = createWrapper();
    qc.setQueryData(profileKeys.detail(PROFILE_ID), initial);
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useUpdateProfile(PROFILE_ID), {
      wrapper: Wrapper,
    });
    await expect(
      result.current.mutateAsync(nextProfile),
    ).rejects.toBeInstanceOf(ApiError);
    expect(qc.getQueryData(profileKeys.detail(PROFILE_ID))).toEqual(initial);
    // should not invalidate detail on non-409 (only rollback)
    const detailInvalidations = invalidateSpy.mock.calls.filter(
      (c) =>
        Array.isArray(c[0]?.queryKey) &&
        c[0].queryKey.join(',').includes('detail'),
    );
    expect(detailInvalidations.length).toBe(0);
    const versionInvalidations = invalidateSpy.mock.calls.filter(
      (c) =>
        Array.isArray(c[0]?.queryKey) &&
        c[0].queryKey.join(',').includes('versions'),
    );
    expect(versionInvalidations.length).toBe(0);
  });

  it('guards missing profileId before cache/path access', async () => {
    const spy = vi
      .spyOn(api.profiles, 'update')
      .mockResolvedValue(makeSnapshot());
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useUpdateProfile(undefined), {
      wrapper: Wrapper,
    });
    await expect(
      result.current.mutateAsync(makeSnapshot().profile),
    ).rejects.toThrow(/Missing profileId/);
    expect(spy).not.toHaveBeenCalled();
    expect(qc.getQueryData(profileKeys.detail(''))).toBeUndefined();
  });

  it('keeps normal missing-cache Error, not 409', async () => {
    const nextProfile = makeSnapshot().profile;
    vi.spyOn(api.profiles, 'update').mockResolvedValue(makeSnapshot());
    const { Wrapper } = createWrapper();
    // no cached snapshot set
    const { result } = renderHook(() => useUpdateProfile(PROFILE_ID), {
      wrapper: Wrapper,
    });
    await expect(result.current.mutateAsync(nextProfile)).rejects.toThrow(
      /Missing expectedVersion/,
    );
    await expect(
      result.current.mutateAsync(nextProfile),
    ).rejects.not.toBeInstanceOf(ApiError);
  });
});

describe('useActivateProfileVersion', () => {
  it('replaces detail cache and invalidates list/history with number-only', async () => {
    const snap = makeSnapshot({ currentVersion: 4 });
    vi.spyOn(api.profiles, 'activateVersion').mockResolvedValue(snap);

    const { qc, Wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(qc, 'invalidateQueries');

    const { result } = renderHook(() => useActivateProfileVersion(PROFILE_ID), {
      wrapper: Wrapper,
    });

    await result.current.mutateAsync(1);

    expect(qc.getQueryData(profileKeys.detail(PROFILE_ID))).toEqual(snap);
    expect(qc.getQueryData(profileKeys.detail(snap.id))).toEqual(snap);
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.lists(),
    });
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: profileKeys.versions(PROFILE_ID),
    });
  });

  it('supports hook-level profileId with version number', async () => {
    const snap = makeSnapshot({ currentVersion: 5 });
    vi.spyOn(api.profiles, 'activateVersion').mockResolvedValue(snap);
    const { qc, Wrapper } = createWrapper();
    const { result } = renderHook(() => useActivateProfileVersion(PROFILE_ID), {
      wrapper: Wrapper,
    });
    await result.current.mutateAsync(2);
    expect(qc.getQueryData(profileKeys.detail(PROFILE_ID))).toEqual(snap);
  });

  it('guards missing profileId before activation', async () => {
    const spy = vi
      .spyOn(api.profiles, 'activateVersion')
      .mockResolvedValue(makeSnapshot());
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useActivateProfileVersion(undefined), {
      wrapper: Wrapper,
    });
    await expect(result.current.mutateAsync(1)).rejects.toThrow(
      /Missing profileId/,
    );
    expect(spy).not.toHaveBeenCalled();
  });

  it('rejects when profileId is empty string', async () => {
    const spy = vi
      .spyOn(api.profiles, 'activateVersion')
      .mockResolvedValue(makeSnapshot());
    const { Wrapper } = createWrapper();
    const { result } = renderHook(() => useActivateProfileVersion(''), {
      wrapper: Wrapper,
    });
    await expect(result.current.mutateAsync(1)).rejects.toThrow(
      /Missing profileId/,
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
