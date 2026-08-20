import { create } from 'zustand';
import { api } from '../api/client';
import { queryClient } from '../queryClient';
import type { components } from '@talentor/contracts';

let authChannel: BroadcastChannel | null = null;

function getAuthChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!authChannel) {
    authChannel = new BroadcastChannel('talentor-auth');
  }
  return authChannel;
}

function broadcastAuth(type: 'login' | 'logout') {
  try {
    getAuthChannel()?.postMessage({ type });
  } catch {
    // ignore
  }
}

type UserResponse = components['schemas']['UserResponse'];
type LoginRequest = components['schemas']['LoginRequest'];
type RegisterRequest = components['schemas']['RegisterRequest'];

type AuthStatus = 'loading' | 'authenticated' | 'anonymous';

interface AuthState {
  status: AuthStatus;
  user: UserResponse | null;
  bootstrap: () => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  clearSession: () => void;
  setUser: (user: UserResponse) => void;
}

// Module-level single-flight for StrictMode double mount
let bootstrapPromise: Promise<void> | null = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  user: null,

  bootstrap: async () => {
    if (bootstrapPromise) return bootstrapPromise;
    const { status } = get();
    if (status === 'authenticated') return;

    // Allow bootstrap from both 'loading' (initial) and 'anonymous' (cross-tab login)
    bootstrapPromise = (async () => {
      // If already authenticated while waiting, skip
      if (get().status === 'authenticated') return;
      // Mark loading if was anonymous
      if (get().status === 'anonymous') {
        set({ status: 'loading' });
      }
      try {
        const auth = await api.auth.refresh();
        set({ status: 'authenticated', user: auth.user });
      } catch {
        set({ status: 'anonymous', user: null });
        api.clearAuth();
      } finally {
        bootstrapPromise = null;
      }
    })();
    return bootstrapPromise;
  },

  login: async (data: LoginRequest) => {
    const auth = await api.auth.login(data);
    set({ status: 'authenticated', user: auth.user });
    broadcastAuth('login');
  },

  register: async (data: RegisterRequest) => {
    const auth = await api.auth.register(data);
    set({ status: 'authenticated', user: auth.user });
    broadcastAuth('login');
  },

  logout: async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore server errors, still clear local state
    } finally {
      get().clearSession();
      broadcastAuth('logout');
    }
  },

  clearSession: () => {
    api.clearAuth();
    try {
      queryClient.clear();
    } catch {
      // ignore
    }
    set({ status: 'anonymous', user: null });
  },

  setUser: (user: UserResponse) => set({ user }),
}));

// Helper to use outside React (e.g., for BroadcastChannel)
export const getAuthState = () => useAuthStore.getState();

// Cross-tab synchronization
if (typeof BroadcastChannel !== 'undefined') {
  try {
    const channel = getAuthChannel();
    channel?.addEventListener(
      'message',
      (event: MessageEvent<{ type: string }>) => {
        const type = event.data?.type;
        if (type === 'logout') {
          useAuthStore.getState().clearSession();
        } else if (type === 'login') {
          const { status } = useAuthStore.getState();
          if (status === 'anonymous') {
            void useAuthStore.getState().bootstrap();
          }
        }
      },
    );
  } catch {
    // ignore
  }
}
