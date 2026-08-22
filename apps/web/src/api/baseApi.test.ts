import { describe, it, expect, vi, beforeEach } from 'vitest';
import { baseApi } from './baseApi';
import { api } from './client';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('web baseApi', () => {
  it('delegates to api.request with url and default GET method', async () => {
    const spy = vi
      .spyOn(api, 'request')
      .mockResolvedValue({ ok: true } as unknown as never);
    const result = await baseApi<{ ok: boolean }>({ url: '/api/v1/ping' });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/ping', method: 'GET' }),
    );
    expect(result).toEqual({ ok: true });
  });

  it('respects explicit method and forwards data', async () => {
    const spy = vi
      .spyOn(api, 'request')
      .mockResolvedValue({ id: '1' } as unknown as never);
    await baseApi<{ id: string }, { name: string }>({
      url: '/api/v1/profiles',
      method: 'POST',
      data: { name: 'Test' },
    });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/profiles',
        method: 'POST',
        data: { name: 'Test' },
      }),
    );
  });

  it('forwards params via config', async () => {
    const spy = vi
      .spyOn(api, 'request')
      .mockResolvedValue({ ok: true } as unknown as never);
    await baseApi<{ ok: boolean }>({
      url: '/api/v1/search',
      params: { q: 'hello', page: 2 },
    });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/search',
        params: { q: 'hello', page: 2 },
      }),
    );
  });

  it('forwards headers, signal and remaining config to api.request', async () => {
    const spy = vi
      .spyOn(api, 'request')
      .mockResolvedValue({ ok: true } as unknown as never);
    const controller = new AbortController();
    await baseApi<{ ok: boolean }>({
      url: '/api/v1/secure',
      method: 'GET',
      headers: { 'x-custom': 'value' },
      signal: controller.signal,
      timeout: 5000,
    });
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        url: '/api/v1/secure',
        method: 'GET',
        headers: { 'x-custom': 'value' },
        signal: controller.signal,
        timeout: 5000,
      }),
    );
  });

  it('returns whatever api.request returns and propagates errors', async () => {
    vi.spyOn(api, 'request').mockResolvedValue({
      pong: true,
    } as unknown as never);
    const ok = await baseApi<{ pong: boolean }>({ url: '/api/v1/ping' });
    expect(ok).toEqual({ pong: true });

    const error = new Error('network');
    vi.spyOn(api, 'request').mockRejectedValue(error);
    await expect(baseApi({ url: '/api/v1/fail' })).rejects.toThrow('network');
  });

  it('reuses singleton api.request – no second axios instance', async () => {
    // Verify source does not create axios instance; delegation is via api.request
    const spy = vi
      .spyOn(api, 'request')
      .mockResolvedValue(null as unknown as never);
    await baseApi({ url: '/api/v1/check', method: 'DELETE' });
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({ url: '/api/v1/check', method: 'DELETE' }),
    );
  });
});
