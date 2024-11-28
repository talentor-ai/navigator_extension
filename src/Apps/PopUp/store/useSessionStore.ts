import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { IUserSessionInfo, UserRole } from '@popup/models/model.session';

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
  role: UserRole.USER,
  isAccountNonExpired: true,
  isAccountNonLocked: true,
  isCredentialsNonExpired: true,
  isEnabled: true,
  firstName: '',
  lastName: '',
  birthDate: undefined,
  profileUrl: '',
  address: '',
  phoneNumber: '',
  gender: '',
  country: '',
  identificationNumber: '',
  identificationType: '',
  userJobProfile: [],
  authorities: [],
};

const token: string = localStorage.getItem('token') || '';

// Store configuration
const useSessionStore = create<State>()(
  devtools(
    persist(
      (set) => ({
        token,
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
  ),
);

export default useSessionStore;
