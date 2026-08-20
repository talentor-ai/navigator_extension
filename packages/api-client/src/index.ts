import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

/**
 * Error thrown when the API returns a non-2xx status.
 * The backend error shape is `{ detail: string }`.
 */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    detail: string | null,
  ) {
    super(detail ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

/**
 * Wire envelope used by the backend. Every successful response unwraps to
 * `response`; `204` responses carry no body.
 */
export interface ApiEnvelope<T> {
  message: string;
  status: string;
  date?: string;
  response: T | null;
}

export interface ApiClient {
  get<T>(path: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  put<T>(path: string, body?: unknown, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(
    path: string,
    body?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<T>;
  delete(path: string, config?: AxiosRequestConfig): Promise<void>;
}

/**
 * Build a typed HTTP client for the Talentor API.
 *
 * - Strips the `{ message, status, date, response }` envelope on success.
 * - Maps backend `{ detail }` errors to `ApiError`.
 * - Auth refresh/retry behavior is added in the next slice.
 */
export function createApiClient(
  baseUrl: string,
  tokenProvider?: () => string | null,
): ApiClient {
  const instance: AxiosInstance = axios.create({ baseURL: baseUrl });

  instance.interceptors.request.use((config) => {
    const token = tokenProvider?.();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  });

  const request = async <T>(config: AxiosRequestConfig): Promise<T> => {
    let response;
    try {
      response = await instance.request<ApiEnvelope<T>>(config);
    } catch (error) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      const status = axiosError.response?.status ?? 0;
      const detail = axiosError.response?.data?.detail ?? null;
      throw new ApiError(status, detail);
    }
    if (response.status === 204) {
      return undefined as T;
    }
    return response.data.response as T;
  };

  return {
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
  };
}
