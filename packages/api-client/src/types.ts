import type { AxiosRequestConfig } from 'axios';
import type { components } from '@talentor/contracts';

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

export type AuthResponse = components['schemas']['AuthResponse'];
export type UserResponse = components['schemas']['UserResponse'];
export type LoginRequest = components['schemas']['LoginRequest'];
export type RegisterRequest = components['schemas']['RegisterRequest'];

export type ProfileMetadata = components['schemas']['ProfileMetadata'];
export type ProfileSnapshot = components['schemas']['ProfileSnapshot'];
export type ProfileVersionMetadata =
  components['schemas']['ProfileVersionMetadata'];
export type ProfileVersionSnapshot =
  components['schemas']['ProfileVersionSnapshot'];
export type CandidateProfileV1 = components['schemas']['CandidateProfileV1'];
export type CreateProfileRequest =
  components['schemas']['CreateProfileRequest'];
export type UpdateProfileRequest =
  components['schemas']['UpdateProfileRequest'];

export type RequestFn = <T>(config: AxiosRequestConfig) => Promise<T>;

export interface ApiClient {
  request<T>(config: AxiosRequestConfig): Promise<T>;
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
  // Auth state
  getAccessToken(): string | null;
  setAccessToken(token: string | null): void;
  clearAuth(): void;
  auth: {
    register(data: RegisterRequest): Promise<AuthResponse>;
    login(data: LoginRequest): Promise<AuthResponse>;
    refresh(): Promise<AuthResponse>;
    logout(): Promise<void>;
    getSession(): Promise<UserResponse>;
  };
  profiles: {
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
    activateVersion(
      profileId: string,
      version: number,
    ): Promise<ProfileSnapshot>;
  };
}
