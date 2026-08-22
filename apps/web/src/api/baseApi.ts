import type { AxiosRequestConfig } from 'axios';
import { api } from './client';

export type BaseApiOptions<TData = unknown> = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: TData;
  params?: AxiosRequestConfig['params'];
} & Omit<AxiosRequestConfig, 'url' | 'method' | 'data' | 'params'>;

/**
 * Multipurpose typed wrapper reusing the shared singleton `api`.
 * Delegates to `api.request` so auth refresh / envelope / error lifecycle stays single.
 * Mirrors extension `baseApi` shape without creating a second axios instance.
 */
export async function baseApi<TResponse, TData = unknown>({
  url,
  method = 'GET',
  data,
  params,
  ...rest
}: BaseApiOptions<TData>): Promise<TResponse> {
  return api.request<TResponse>({
    url,
    method,
    data,
    params,
    ...rest,
  });
}
