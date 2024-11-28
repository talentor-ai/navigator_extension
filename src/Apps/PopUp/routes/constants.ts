import {
  HISTORY_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  SETTINGS_PATH,
  SIGNUP_PATH,
} from '@popup:constants/paths';

export const routes = [
  {
    path: MAIN_PATH,
    label: 'Generate',
  },
  {
    path: HISTORY_PATH,
    label: 'History',
  },
  {
    path: SETTINGS_PATH,
    label: 'Settings',
  },
];

export const noLoginRoutes = [
  {
    path: LOGIN_PATH,
    label: 'Login',
  },
  {
    path: SIGNUP_PATH,
    label: 'Sign Up',
  },
];
