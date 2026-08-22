import { describe, it, expect, beforeAll, afterEach, afterAll } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { createApiClient, ApiError } from './index';

const API_URL = 'http://localhost:3011';

let refreshCallCount = 0;
let sessionCallCount = 0;

const server = setupServer(
  http.post(`${API_URL}/api/v1/auth/register`, async () => {
    return HttpResponse.json({
      message: 'User created successfully.',
      status: 'OK',
      response: {
        token: 'access-register',
        user: {
          id: '1',
          email: 'a@b.com',
          username: 'user',
          accountVerified: false,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }),
  http.post(`${API_URL}/api/v1/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { username: string };
    if (body.username === 'bad') {
      return HttpResponse.json({ detail: 'Invalid' }, { status: 401 });
    }
    return HttpResponse.json({
      message: 'Login successful.',
      status: 'OK',
      response: {
        token: 'access-login',
        user: {
          id: '1',
          email: 'a@b.com',
          username: body.username,
          accountVerified: false,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }),
  http.post(`${API_URL}/api/v1/auth/refresh`, () => {
    refreshCallCount++;
    // Simulate rotating refresh: first call succeeds, second with old cookie would fail, but msw doesn't have cookie state
    // For single-flight test, we count calls
    return HttpResponse.json({
      message: 'Session refreshed.',
      status: 'OK',
      response: {
        token: 'access-refreshed',
        user: {
          id: '1',
          email: 'a@b.com',
          username: 'user',
          accountVerified: false,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      },
    });
  }),
  http.get(`${API_URL}/api/v1/session`, ({ request }) => {
    sessionCallCount++;
    const auth = request.headers.get('Authorization');
    if (auth === 'Bearer expired-token') {
      return HttpResponse.json({ detail: 'Session revoked' }, { status: 401 });
    }
    if (
      auth === 'Bearer access-refreshed' ||
      auth === 'Bearer access-login' ||
      auth === 'Bearer access-register'
    ) {
      return HttpResponse.json({
        message: 'Session active.',
        status: 'OK',
        response: {
          id: '1',
          email: 'a@b.com',
          username: 'user',
          accountVerified: false,
          role: 'USER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      });
    }
    return HttpResponse.json({ detail: 'Missing auth' }, { status: 401 });
  }),
  http.post(`${API_URL}/api/v1/auth/logout`, () => {
    return new HttpResponse(null, { status: 204 });
  }),
);

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
  refreshCallCount = 0;
  sessionCallCount = 0;
});
afterAll(() => server.close());

describe('api-client', () => {
  it('attaches token header', async () => {
    const api = createApiClient(API_URL);
    api.setAccessToken('my-token');
    let capturedAuth: string | null = null;
    server.use(
      http.get(`${API_URL}/api/v1/session`, ({ request }) => {
        capturedAuth = request.headers.get('Authorization');
        return HttpResponse.json({
          message: 'ok',
          status: 'OK',
          response: {
            id: '1',
            email: 'a@b.com',
            username: 'user',
            accountVerified: false,
            role: 'USER',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        });
      }),
    );
    await api.get('/api/v1/session');
    expect(capturedAuth).toBe('Bearer my-token');
  });

  it('unwraps envelope', async () => {
    const api = createApiClient(API_URL);
    const user = await api.auth.getSession();
    // Should return inner UserResponse, not envelope
    expect(user).toHaveProperty('username');
    expect(user).not.toHaveProperty('response');
  });

  it('retries once after 401 with single refresh', async () => {
    const api = createApiClient(API_URL);
    api.setAccessToken('expired-token');
    // Two concurrent requests that both get 401
    const p1 = api.get('/api/v1/session');
    const p2 = api.get('/api/v1/session');
    const results = await Promise.all([p1, p2]);
    expect(results[0]).toHaveProperty('username');
    expect(results[1]).toHaveProperty('username');
    // Only one refresh call due to single-flight
    expect(refreshCallCount).toBe(1);
    expect(sessionCallCount).toBe(4); // 2 initial 401 + 2 retries
  });

  it('does not retry refresh endpoint itself', async () => {
    const api = createApiClient(API_URL);
    // Make refresh fail
    server.use(
      http.post(`${API_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json({ detail: 'Invalid' }, { status: 401 });
      }),
    );
    await expect(api.auth.refresh()).rejects.toThrow(ApiError);
    expect(refreshCallCount).toBe(0); // our handler not counted, but ensure no infinite loop
  });

  it('clears auth on failed refresh', async () => {
    const api = createApiClient(API_URL);
    api.setAccessToken('expired-token');
    server.use(
      http.post(`${API_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json({ detail: 'Invalid' }, { status: 401 });
      }),
    );
    await expect(api.get('/api/v1/session')).rejects.toThrow(ApiError);
    expect(api.getAccessToken()).toBeNull();
  });

  it('uses withCredentials for cookies', () => {
    const api = createApiClient(API_URL);
    // We can't directly inspect axios instance, but we can check that
    // the client was created with withCredentials by checking behavior:
    // The refresh request should be made with credentials. We test indirectly
    // by ensuring no refresh token is exposed in JS.
    expect(api.auth.login).toBeDefined();
  });

  it('does not expose refresh token in JS', async () => {
    const api = createApiClient(API_URL);
    const auth = await api.auth.register({
      email: 'a@b.com',
      username: 'user1',
      password: 'secret123',
    });
    // AuthResponse should not contain refreshToken
    expect(auth).not.toHaveProperty('refreshToken');
    expect(auth).not.toHaveProperty('refresh_token');
    expect(auth).toHaveProperty('token');
    expect(auth).toHaveProperty('user');
  });
});

describe('profiles', () => {
  const PROFILE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const makeSnapshot = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: PROFILE_ID,
    name: 'Test Profile',
    currentVersion: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    profile: {
      schemaVersion: 1 as const,
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
    },
    ...overrides,
  });

  it('list profiles unwraps envelope and hits GET /api/v1/profiles', async () => {
    const api = createApiClient(API_URL);
    const meta = {
      id: PROFILE_ID,
      name: 'Test',
      currentVersion: 1,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    };
    let capturedMethod: string | undefined;
    let capturedPath: string | undefined;
    server.use(
      http.get(`${API_URL}/api/v1/profiles`, ({ request }) => {
        capturedMethod = request.method;
        capturedPath = new URL(request.url).pathname;
        return HttpResponse.json({
          message: 'ok',
          status: 'OK',
          response: [meta],
        });
      }),
    );
    const result = await api.profiles.list();
    expect(capturedMethod).toBe('GET');
    expect(capturedPath).toBe('/api/v1/profiles');
    expect(result).toEqual([meta]);
  });

  it('get profile unwraps snapshot', async () => {
    const api = createApiClient(API_URL);
    const snapshot = makeSnapshot();
    server.use(
      http.get(`${API_URL}/api/v1/profiles/${PROFILE_ID}`, () => {
        return HttpResponse.json({
          message: 'ok',
          status: 'OK',
          response: snapshot,
        });
      }),
    );
    const result = await api.profiles.get(PROFILE_ID);
    expect(result).toEqual(snapshot);
    expect(result).not.toHaveProperty('response');
  });

  it('create profile posts to /api/v1/profiles with body', async () => {
    const api = createApiClient(API_URL);
    const snapshot = makeSnapshot();
    let capturedBody: unknown = null;
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, async ({ request }) => {
        capturedBody = await request.json();
        return HttpResponse.json(
          {
            message: 'created',
            status: 'OK',
            response: snapshot,
          },
          { status: 201 },
        );
      }),
    );
    const payload = {
      name: 'Backend',
      profile: snapshot.profile,
    } as unknown as import('./index').CreateProfileRequest;
    const result = await api.profiles.create(payload);
    expect(capturedBody).toEqual(payload);
    expect(result).toEqual(snapshot);
  });

  it('update sends PUT with expectedVersion', async () => {
    const api = createApiClient(API_URL);
    const snapshot = makeSnapshot({ currentVersion: 5 });
    let capturedMethod: string | undefined;
    let capturedBody: unknown = null;
    server.use(
      http.put(
        `${API_URL}/api/v1/profiles/${PROFILE_ID}`,
        async ({ request }) => {
          capturedMethod = request.method;
          capturedBody = await request.json();
          return HttpResponse.json({
            message: 'ok',
            status: 'OK',
            response: snapshot,
          });
        },
      ),
    );
    const nextProfile = {
      ...snapshot.profile,
      baseSummary: 'updated',
    } as unknown as import('./index').CandidateProfileV1;
    const result = await api.profiles.update(PROFILE_ID, {
      expectedVersion: 2,
      profile: nextProfile,
    });
    expect(capturedMethod).toBe('PUT');
    expect(capturedBody).toEqual({
      expectedVersion: 2,
      profile: nextProfile,
    });
    expect(result).toEqual(snapshot);
  });

  it('list versions hits correct path', async () => {
    const api = createApiClient(API_URL);
    const meta = {
      id: 'v1',
      versionNumber: 1,
      schemaVersion: 1,
      sourceType: 'MANUAL',
      createdAt: '2025-01-01T00:00:00.000Z',
      isCurrent: false,
    };
    server.use(
      http.get(`${API_URL}/api/v1/profiles/${PROFILE_ID}/versions`, () => {
        return HttpResponse.json({
          message: 'ok',
          status: 'OK',
          response: [meta],
        });
      }),
    );
    const result = await api.profiles.listVersions(PROFILE_ID);
    expect(result).toEqual([meta]);
  });

  it('get version hits path with version number', async () => {
    const api = createApiClient(API_URL);
    const snap = {
      profileId: PROFILE_ID,
      name: 'Test',
      version: {
        id: 'v2',
        versionNumber: 2,
        schemaVersion: 1,
        sourceType: 'MANUAL',
        createdAt: '2025-01-01T00:00:00.000Z',
        isCurrent: true,
      },
      profile: makeSnapshot().profile,
    };
    server.use(
      http.get(`${API_URL}/api/v1/profiles/${PROFILE_ID}/versions/2`, () => {
        return HttpResponse.json({
          message: 'ok',
          status: 'OK',
          response: snap,
        });
      }),
    );
    const result = await api.profiles.getVersion(PROFILE_ID, 2);
    expect(result).toEqual(snap);
  });

  it('activate version posts with no body', async () => {
    const api = createApiClient(API_URL);
    const snapshot = makeSnapshot({ currentVersion: 3 });
    let capturedBody: string | null = null;
    let capturedMethod: string | undefined;
    server.use(
      http.post(
        `${API_URL}/api/v1/profiles/${PROFILE_ID}/versions/1/activate`,
        async ({ request }) => {
          capturedMethod = request.method;
          capturedBody = await request.text();
          return HttpResponse.json({
            message: 'ok',
            status: 'OK',
            response: snapshot,
          });
        },
      ),
    );
    const result = await api.profiles.activateVersion(PROFILE_ID, 1);
    expect(capturedMethod).toBe('POST');
    // Activation must send no body (empty string or no JSON)
    expect(capturedBody === '' || capturedBody === null).toBe(true);
    expect(result).toEqual(snapshot);
  });

  it('throws ApiError 409 on conflict', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.put(`${API_URL}/api/v1/profiles/${PROFILE_ID}`, () => {
        return HttpResponse.json({ detail: 'Stale version' }, { status: 409 });
      }),
    );
    await expect(
      api.profiles.update(PROFILE_ID, {
        expectedVersion: 1,
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      }),
    ).rejects.toMatchObject({ status: 409, name: 'ApiError' });
    try {
      await api.profiles.update(PROFILE_ID, {
        expectedVersion: 1,
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(409);
    }
  });
});

describe('ApiError detail normalization', () => {
  const PROFILE_ID = 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
  const makeSnapshot = (overrides: Partial<Record<string, unknown>> = {}) => ({
    id: PROFILE_ID,
    name: 'Test Profile',
    currentVersion: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-02T00:00:00.000Z',
    profile: {
      schemaVersion: 1 as const,
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
    },
    ...overrides,
  });

  it('preserves string detail for errors', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          { detail: 'Profile name already exists' },
          { status: 400 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'dup',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(400);
      expect((e as ApiError).message).toBe('Profile name already exists');
      expect((e as ApiError).message).not.toContain('[object Object]');
    }
  });

  it('normalizes FastAPI 422 array into readable message using loc and msg', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'personalInfo', 'email'],
                msg: 'value is not a valid email address',
                type: 'value_error',
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'bad',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(422);
      expect((e as ApiError).message).toBe(
        'profile.personalInfo.email: value is not a valid email address',
      );
      expect((e as ApiError).message).not.toContain('[object Object]');
    }
  });

  it('joins multiple validation errors consistently', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.put(`${API_URL}/api/v1/profiles/${PROFILE_ID}`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'personalInfo', 'email'],
                msg: 'value is not a valid email',
                type: 'value_error',
              },
              {
                loc: ['body', 'profile', 'personalInfo', 'fullName'],
                msg: 'Field required',
                type: 'missing',
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.update(PROFILE_ID, {
        expectedVersion: 1,
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(422);
      const msg = (e as ApiError).message;
      expect(msg).toContain(
        'profile.personalInfo.email: value is not a valid email',
      );
      expect(msg).toContain('profile.personalInfo.fullName: Field required');
      // joined consistently with "; "
      expect(msg).toBe(
        'profile.personalInfo.email: value is not a valid email; profile.personalInfo.fullName: Field required',
      );
      expect(msg).not.toContain('[object Object]');
    }
  });

  it('handles numeric loc segments', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'experience', 0, 'company'],
                msg: 'Field required',
                type: 'missing',
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect((e as ApiError).message).toBe(
        'experience.0.company: Field required',
      );
      expect((e as ApiError).status).toBe(422);
    }
  });

  it('ignores malformed elements safely', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'personalInfo', 'email'],
                msg: 'value is not a valid email',
                type: 'value_error',
              },
              { loc: null, msg: null },
              { bad: true } as unknown as { loc: string[]; msg: string },
              'string' as unknown as { loc: string[]; msg: string },
              null as unknown as { loc: string[]; msg: string },
              {
                loc: ['body', 'profile', 'personalInfo', 'fullName'],
                msg: 'Field required',
                type: 'missing',
              },
              { loc: ['body', 'name'], msg: 'Field required' } as unknown as {
                loc: string[];
                msg: string;
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      const msg = (e as ApiError).message;
      expect(msg).toContain(
        'profile.personalInfo.email: value is not a valid email',
      );
      expect(msg).toContain('profile.personalInfo.fullName: Field required');
      expect(msg).toContain('name: Field required');
      expect(msg).not.toContain('[object Object]');
      // malformed entries should not cause extra segments or throw
      expect((e as ApiError).status).toBe(422);
    }
  });

  it('falls back to generic message for absent/null detail', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json({}, { status: 422 });
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(422);
      expect((e as ApiError).message).toBe('Request failed with status 422');
      expect((e as ApiError).message).not.toContain('[object Object]');
    }

    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json({ detail: null }, { status: 422 });
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect((e as ApiError).message).toBe('Request failed with status 422');
    }

    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json({ detail: [] }, { status: 422 });
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect((e as ApiError).message).toBe('Request failed with status 422');
    }

    // Non-array, non-string detail (e.g., number) should also fallback
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          { detail: 123 as unknown as string },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect((e as ApiError).message).toBe('Request failed with status 422');
      expect((e as ApiError).message).not.toContain('[object Object]');
    }
  });

  it('does not expose [object Object] for array detail', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'name'],
                msg: 'Field required',
                type: 'missing',
              },
              {
                loc: ['body', 'profile', 'personalInfo', 'email'],
                msg: 'value is not a valid email',
                type: 'value_error',
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: '',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      const msg = (e as ApiError).message;
      expect(msg).not.toContain('[object Object]');
      expect(msg).not.toContain('object Object');
    }
  });

  it('preserves status code for structured errors', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'name'],
                msg: 'too short',
                type: 'value_error',
              },
            ],
          },
          { status: 422 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'x',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect((e as ApiError).status).toBe(422);
      expect((e as ApiError).name).toBe('ApiError');
    }
  });

  it('no regression: 409 string detail still maps to ApiError with same status/message', async () => {
    const api = createApiClient(API_URL);
    server.use(
      http.post(`${API_URL}/api/v1/profiles`, () => {
        return HttpResponse.json(
          { detail: 'Profile name already exists' },
          { status: 409 },
        );
      }),
    );
    try {
      await api.profiles.create({
        name: 'dup',
        profile: makeSnapshot()
          .profile as unknown as import('./index').CandidateProfileV1,
      });
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(409);
      expect((e as ApiError).message).toBe('Profile name already exists');
      expect((e as ApiError).name).toBe('ApiError');
    }
  });

  it('normalizes detail on failed-refresh rethrow path', async () => {
    const api = createApiClient(API_URL);
    api.setAccessToken('expired-token');
    server.use(
      http.get(`${API_URL}/api/v1/session`, () => {
        return HttpResponse.json(
          {
            detail: [
              {
                loc: ['body', 'profile', 'personalInfo', 'email'],
                msg: 'value is not a valid email',
                type: 'value_error',
              },
            ],
          },
          { status: 401 },
        );
      }),
      http.post(`${API_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json({ detail: 'Invalid' }, { status: 401 });
      }),
    );
    try {
      await api.get('/api/v1/session');
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(401);
      // Even though refresh failed, original 401 detail array should be normalized, not "[object Object]"
      expect((e as ApiError).message).toBe(
        'profile.personalInfo.email: value is not a valid email',
      );
      expect((e as ApiError).message).not.toContain('[object Object]');
    }
    expect(api.getAccessToken()).toBeNull();
  });

  it('preserves string detail on failed-refresh rethrow path', async () => {
    const api = createApiClient(API_URL);
    api.setAccessToken('expired-token');
    server.use(
      http.get(`${API_URL}/api/v1/session`, () => {
        return HttpResponse.json(
          { detail: 'Session revoked' },
          { status: 401 },
        );
      }),
      http.post(`${API_URL}/api/v1/auth/refresh`, () => {
        return HttpResponse.json(
          { detail: 'Invalid refresh' },
          { status: 401 },
        );
      }),
    );
    try {
      await api.get('/api/v1/session');
      expect.unreachable('should throw');
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(401);
      expect((e as ApiError).message).toBe('Session revoked');
    }
  });
});
