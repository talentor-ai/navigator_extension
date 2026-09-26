import {
  FOCUS_TASKS_PATH,
  HIGHLIGHTER_PATH,
  PROFILE_SETTINGS_PATH,
} from '@modules/popup/constants/paths';
import i18n from '@lang/i18n';

export const authenticatedRoutes = [
  {
    path: PROFILE_SETTINGS_PATH,
    label: i18n.t('menu.profile'),
  },
  {
    path: HIGHLIGHTER_PATH,
    label: i18n.t('menu.highlighter'),
  },
  {
    path: FOCUS_TASKS_PATH,
    label: i18n.t('menu.focusTasks'),
  },
];
