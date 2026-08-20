import {
  HISTORY_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  PROFILE_SETTINGS_PATH,
  SIGNUP_PATH,
} from '@popup:constants/paths';
import i18n from '@popup/lang/i18n';

export const authenticatedRoutes = [
  {
    path: MAIN_PATH,
    label: i18n.t('menu.generate'),
  },
  {
    path: HISTORY_PATH,
    label: i18n.t('menu.history'),
  },
  {
    path: PROFILE_SETTINGS_PATH,
    label: i18n.t('menu.profile'),
  },
];

export const noLoginRoutes = [
  {
    path: LOGIN_PATH,
    label: i18n.t('login.login'),
  },
  {
    path: SIGNUP_PATH,
    label: i18n.t('login.signUp'),
  },
];
