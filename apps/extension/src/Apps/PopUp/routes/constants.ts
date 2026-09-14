import { PROFILE_SETTINGS_PATH } from '@popup:constants/paths';
import i18n from '@popup/lang/i18n';

export const authenticatedRoutes = [
  {
    path: PROFILE_SETTINGS_PATH,
    label: i18n.t('menu.profile'),
  },
];
