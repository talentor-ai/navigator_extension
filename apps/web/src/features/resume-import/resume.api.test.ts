import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { components } from '@talentor/contracts';

vi.mock('@/api/baseApi', () => ({
  baseApi: vi.fn(),
}));

import { baseApi } from '@/api/baseApi';
import { confirmResume, uploadResume } from './resume.api';

type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];

const mockedBaseApi = vi.mocked(baseApi);

beforeEach(() => {
  vi.clearAllMocks();
});

describe('resume.api', () => {
  it('uploadResume posts FormData with file and locale, no manual Content-Type', async () => {
    mockedBaseApi.mockResolvedValue({
      profile: {} as CandidateProfileV1,
      warnings: [],
    } as never);
    const file = new File(['hello'], 'resume.pdf', { type: 'application/pdf' });

    await uploadResume(file, 'en-US');

    expect(mockedBaseApi).toHaveBeenCalledTimes(1);
    const callArg = mockedBaseApi.mock.calls[0][0] as {
      url: string;
      method: string;
      data: FormData;
      headers?: Record<string, string>;
    };
    expect(callArg.url).toBe('/api/v1/profiles/resume-import/draft');
    expect(callArg.method).toBe('POST');
    expect(callArg.data).toBeInstanceOf(FormData);
    expect(callArg.data.get('file')).toBe(file);
    expect(callArg.data.get('locale')).toBe('en-US');
    // no manual multipart Content-Type
    if (callArg.headers) {
      const ct =
        callArg.headers['Content-Type'] ?? callArg.headers['content-type'];
      expect(ct).toBeUndefined();
    }
  });

  it('uploadResume uses default locale en-US when not provided', async () => {
    mockedBaseApi.mockResolvedValue({
      profile: {} as CandidateProfileV1,
      warnings: [],
    } as never);
    const file = new File(['hi'], 'resume.docx', {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    await uploadResume(file);

    const callArg = mockedBaseApi.mock.calls[0][0] as { data: FormData };
    expect((callArg.data as FormData).get('locale')).toBe('en-US');
  });

  it('uploadResume does not set Content-Type header manually', async () => {
    mockedBaseApi.mockResolvedValue({
      profile: {} as CandidateProfileV1,
      warnings: [],
    } as never);
    const file = new File(['hi'], 'resume.pdf', { type: 'application/pdf' });

    await uploadResume(file);

    const arg = mockedBaseApi.mock.calls[0][0] as Record<string, unknown>;
    const headers = arg.headers as Record<string, string> | undefined;
    expect(headers?.['Content-Type']).toBeUndefined();
    expect(headers?.['content-type']).toBeUndefined();
  });

  it('confirmResume posts name and profile to confirm endpoint', async () => {
    const profile = {
      schemaVersion: 1,
      locale: 'en-US',
      personalInfo: { fullName: 'Ada', email: 'ada@example.com', links: [] },
      experience: [],
      skills: [],
      languages: [],
      education: [],
      projects: [],
      certifications: [],
    } as unknown as CandidateProfileV1;

    const snapshot = {
      id: 'id-1',
      name: 'Backend',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      profile,
    } as components['schemas']['ProfileSnapshot'];

    mockedBaseApi.mockResolvedValue(snapshot as never);

    const result = await confirmResume('Backend', profile);

    expect(mockedBaseApi).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/profiles/resume-import/confirm',
        method: 'POST',
        data: { name: 'Backend', profile },
      }),
    );
    expect(result).toEqual(snapshot);
  });

  it('confirmResume forwards exact edited profile object', async () => {
    mockedBaseApi.mockResolvedValue({} as never);
    const profile = {
      schemaVersion: 1,
      locale: 'en-US',
      personalInfo: {
        fullName: 'Grace',
        email: 'grace@example.com',
        links: [],
      },
      defaultRole: 'Engineer',
      baseSummary: 'edited summary',
      experience: [],
      skills: [],
      languages: [],
      education: [],
      projects: [],
      certifications: [],
    } as unknown as CandidateProfileV1;

    await confirmResume(' My Profile ', profile);

    // confirmResume should pass name as provided (trim handled by caller); we pass trimmed in hook but api keeps exact
    expect(mockedBaseApi).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { name: ' My Profile ', profile },
      }),
    );
  });
});
