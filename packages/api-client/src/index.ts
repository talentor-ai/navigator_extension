import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

import { ApiError, extractDetail } from './errors';
import { createProfiles } from './profiles';
import type {
  ApiClient,
  ApiEnvelope,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from './types';

// Re-export public API exactly as before
export { ApiError } from './errors';
export type {
  ApiEnvelope,
  ApiClient,
  AuthResponse,
  UserResponse,
  LoginRequest,
  RegisterRequest,
  ProfileMetadata,
  ProfileSnapshot,
  ProfileVersionMetadata,
  ProfileVersionSnapshot,
  CandidateProfileV1,
  CreateProfileRequest,
  UpdateProfileRequest,
} from './types';

const NO_RETRY_PATHS = [
  '/api/v1/auth/login',
  '/api/v1/auth/register',
  '/api/v1/auth/refresh',
  '/api/v1/auth/logout',
  '/health',
];
const isNoRetryPath = (url?: string) =>
  !!url && NO_RETRY_PATHS.some((p) => url.includes(p));

/**
 * Build a typed HTTP client for the Talentor API.
 *
 * - Strips the `{ message, status, date, response }` envelope on success.
 * - Maps backend `{ detail }` errors to `ApiError`.
 * - Manages in-memory access token and single-flight refresh.
 * - Uses `withCredentials: true` for HttpOnly refresh cookies.
 */
export function createApiClient(baseUrl: string): ApiClient {
  let accessToken: string | null = null;
  let refreshPromise: Promise<void> | null = null;

  const instance: AxiosInstance = axios.create({
    baseURL: baseUrl,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers = config.headers || {};
      const headers = config.headers as Record<string, string> & {
        set?: (k: string, v: string) => void;
      };
      if (typeof headers.set === 'function') {
        headers.set('Authorization', `Bearer ${accessToken}`);
      } else {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<{ detail?: unknown }>) => {
      const originalRequest = error.config as AxiosRequestConfig & {
        _retry?: boolean;
      };
      const status = error.response?.status;
      const url = originalRequest?.url as string | undefined;

      const shouldRefresh =
        status === 401 && !originalRequest._retry && !isNoRetryPath(url);

      if (shouldRefresh) {
        if (!refreshPromise) {
          refreshPromise = (async () => {
            const doRefresh = async () => {
              const resp = await instance.post<ApiEnvelope<AuthResponse>>(
                '/api/v1/auth/refresh',
              );
              const newToken = resp.data.response?.token;
              if (!newToken) throw new Error('No token in refresh response');
              accessToken = newToken;
            };
            try {
              const locks = (
                globalThis as unknown as {
                  navigator?: {
                    locks?: {
                      request: (
                        name: string,
                        fn: () => Promise<void>,
                      ) => Promise<void>;
                    };
                  };
                }
              ).navigator?.locks;
              if (locks) {
                await locks.request('talentor-refresh', doRefresh);
              } else {
                await doRefresh();
              }
            } catch (e) {
              accessToken = null;
              throw e;
            } finally {
              refreshPromise = null;
            }
          })();
        }
        try {
          await refreshPromise;
        } catch {
          const detail = extractDetail(error.response?.data);
          throw new ApiError(status ?? 0, detail);
        }
        originalRequest._retry = true;
        if (accessToken) {
          const h = originalRequest.headers as Record<string, string> & {
            set?: (k: string, v: string) => void;
          };
          if (h && typeof h.set === 'function') {
            h.set('Authorization', `Bearer ${accessToken}`);
          } else {
            originalRequest.headers = {
              ...(originalRequest.headers as Record<string, string>),
              Authorization: `Bearer ${accessToken}`,
            };
          }
        }
        return instance(originalRequest);
      }

      const detail = extractDetail(error.response?.data);
      throw new ApiError(status ?? 0, detail);
    },
  );

  const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response = await instance.request<ApiEnvelope<T>>(config);
    if (response.status === 204) {
      return undefined as T;
    }
    return response.data.response as T;
  };

  const setAccessToken = (token: string | null) => {
    accessToken = token;
  };

  const getAccessToken = () => accessToken;

  const clearAuth = () => {
    accessToken = null;
  };

  return {
    request,
    get: <T>(path: string, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'GET', url: path }),
    post: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'POST', url: path, data: body }),
    put: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PUT', url: path, data: body }),
    patch: <T>(path: string, body?: unknown, config?: AxiosRequestConfig) =>
      request<T>({ ...config, method: 'PATCH', url: path, data: body }),
    delete: async (path: string, config?: AxiosRequestConfig) => {
      await request<null>({ ...config, method: 'DELETE', url: path });
    },
    getAccessToken,
    setAccessToken,
    clearAuth,
    auth: {
      register: async (data: RegisterRequest) => {
        const resp = await request<AuthResponse>({
          method: 'POST',
          url: '/api/v1/auth/register',
          data,
        });
        if (resp.token) accessToken = resp.token;
        return resp;
      },
      login: async (data: LoginRequest) => {
        const resp = await request<AuthResponse>({
          method: 'POST',
          url: '/api/v1/auth/login',
          data,
        });
        if (resp.token) accessToken = resp.token;
        return resp;
      },
      refresh: async () => {
        const resp = await request<AuthResponse>({
          method: 'POST',
          url: '/api/v1/auth/refresh',
        });
        if (resp.token) accessToken = resp.token;
        return resp;
      },
      logout: async () => {
        await request<null>({ method: 'POST', url: '/api/v1/auth/logout' });
        accessToken = null;
      },
      getSession: () =>
        request<UserResponse>({ method: 'GET', url: '/api/v1/session' }),
    },
    profiles: createProfiles(request),
  };
}
