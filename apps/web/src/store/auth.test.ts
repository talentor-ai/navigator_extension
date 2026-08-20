import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act } from '@testing-library/react';

// Mock api client
vi.mock('../api/client', () => ({
  api: {
    auth: {
      login: vi.fn(),
      register: vi.fn(),
      refresh: vi.fn(),
      logout: vi.fn(),
      getSession: vi.fn(),
    },
    clearAuth: vi.fn(),
    getAccessToken: vi.fn(() => null),
    setAccessToken: vi.fn(),
  },
}));

import { api } from '../api/client';
import { useAuthStore } from './auth';

describe('auth store', () => {
  beforeEach(() => {
    // Reset store to loading
    useAuthStore.setState({ status: 'loading', user: null });
    vi.clearAllMocks();
    // Reset module-level bootstrapPromise by re-importing? We need to reset the closure
    // The store's bootstrapPromise is module-level, we can reset by setting status to loading and clearing promise via hack
    // Access via private: we can't directly, but we can ensure no pending promise by waiting
  });

  it('bootstrap success sets authenticated', async () => {
    const mockUser = {
      id: '1',
      email: 'a@b.com',
      username: 'user',
      accountVerified: false,
      role: 'USER',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    vi.mocked(api.auth.refresh).mockResolvedValue({
      token: 't',
      user: mockUser,
    } as never);

    await act(async () => {
      await useAuthStore.getState().bootstrap();
    });

    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('bootstrap failure sets anonymous', async () => {
    vi.mocked(api.auth.refresh).mockRejectedValue(new Error('no cookie'));
    await act(async () => {
      await useAuthStore.getState().bootstrap();
    });
    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(useAuthStore.getState().user).toBeNull();
  });

  it('bootstrap is single-flight under StrictMode', async () => {
    let callCount = 0;
    vi.mocked(api.auth.refresh).mockImplementation(async () => {
      callCount++;
      await new Promise((r) => setTimeout(r, 10));
      return {
        token: 't',
        user: {
          id: '1',
          email: 'a@b.com',
          username: 'u',
          accountVerified: false,
          role: 'USER',
          createdAt: '',
          updatedAt: '',
        },
      } as never;
    });

    // Simulate StrictMode double mount
    const p1 = useAuthStore.getState().bootstrap();
    const p2 = useAuthStore.getState().bootstrap();
    await act(async () => {
      await Promise.all([p1, p2]);
    });
    expect(callCount).toBe(1);
  });

  it('login updates state', async () => {
    const mockUser = {
      id: '1',
      email: 'a@b.com',
      username: 'user',
      accountVerified: false,
      role: 'USER',
      createdAt: '',
      updatedAt: '',
    };
    vi.mocked(api.auth.login).mockResolvedValue({
      token: 't',
      user: mockUser,
    } as never);
    await act(async () => {
      await useAuthStore
        .getState()
        .login({ username: 'user', password: 'pass' });
    });
    expect(useAuthStore.getState().status).toBe('authenticated');
    expect(useAuthStore.getState().user).toEqual(mockUser);
  });

  it('logout clears state', async () => {
    // First set authenticated
    useAuthStore.setState({
      status: 'authenticated',
      user: {
        id: '1',
        email: 'a@b.com',
        username: 'u',
        accountVerified: false,
        role: 'USER',
        createdAt: '',
        updatedAt: '',
      },
    });
    vi.mocked(api.auth.logout).mockResolvedValue(undefined as never);
    await act(async () => {
      await useAuthStore.getState().logout();
    });
    expect(useAuthStore.getState().status).toBe('anonymous');
    expect(useAuthStore.getState().user).toBeNull();
    expect(api.clearAuth).toHaveBeenCalled();
  });
});
