import { PROFILE_SETTINGS_PATH } from '@modules/popup/constants/paths';
import i18n from '@modules/popup/lang/i18n';

export const authenticatedRoutes = [
  {
    path: PROFILE_SETTINGS_PATH,
    label: i18n.t('menu.profile'),
  },
];
