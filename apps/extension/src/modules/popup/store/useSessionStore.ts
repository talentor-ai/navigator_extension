import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUserSessionInfo } from '@modules/popup/models/model.session';

interface State {
  session: IUserSessionInfo;
  token: string;
  setSession: (session: IUserSessionInfo) => void;
  setToken: (token: string) => void;
  resetSession: () => void;
}

// Default values for the session
const sessionInitialState: IUserSessionInfo = {
  id: '',
  email: '',
  username: '',
  accountVerified: false,
  role: 'USER',
  createdAt: '',
  updatedAt: '',
};

// Store configuration
const useSessionStore = create<State>()(
  persist(
    (set) => ({
      token: '',
      session: sessionInitialState,
      setSession: (session: IUserSessionInfo) =>
        set((state: State) => ({ ...state, session })),
      setToken: (token: string) => {
        set((state: State) => ({ ...state, token }));
      },

      // To reset everything
      resetSession: () => {
        set(() => ({
          session: sessionInitialState,
          token: '',
        }));
      },
    }),
    { name: 'session' },
  ),
);

export default useSessionStore;
