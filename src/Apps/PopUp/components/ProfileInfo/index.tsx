import { useTranslation } from 'react-i18next';
import styles from './profile_info.module.css';
import { ButtonIcon, H2 } from '../';
import logoImage from '@popup/assets/logo.png';
import { useSessionStore } from '@popup:store';
import { KebabMenu } from '@popup:components';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PROFILE_SETTINGS_PATH } from '@popup:constants/paths';

const ProfileInfo = () => {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const { session, token, resetSession } = useSessionStore();
  const navigate = useNavigate();

  // Kebab menu options
  const menuOptions = [
    {
      label: 'menu.profile',
      action: () => navigate(PROFILE_SETTINGS_PATH),
      icon: 'user',
    },
    {
      label: 'login.logout',
      action: () => resetSession(),
      icon: 'logout',
    },
  ];

  // -------------------------------------- Handlers
  const handleOpenMenu = () => {
    setMenuOpen(true);
  };
  const handleCloseMenu = () => {
    setMenuOpen(false);
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <div className={`${styles.image} bg-primary`}>
          <img src={logoImage} alt="Profile" />
        </div>
        <div className={styles.textContainer}>
          <H2 className="text-txt2">
            {token
              ? `${session?.firstName} ${session?.lastName}`
              : t('header.title')}
          </H2>
          <p>{token ? session?.email : t('header.subtitle')}</p>
        </div>
      </div>
      {token && (
        <ButtonIcon
          icon="itemMenu"
          className="hover:border-transparent hover:bg-secondary bg-transparent"
          onClick={handleOpenMenu}
        />
      )}
      {menuOpen && (
        <KebabMenu
          isOpen={true}
          onClose={handleCloseMenu}
          options={menuOptions}
        />
      )}
    </div>
  );
};

export default ProfileInfo;
