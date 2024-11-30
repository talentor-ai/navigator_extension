import { useTranslation } from 'react-i18next';
import styles from './profile_info.module.css';
import { Box, H2, Icons } from '../';
import logoImage from '@popup/assets/logo.png';
import { useSessionStore } from '@popup:store';

const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session, token } = useSessionStore();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <div className={`${styles.image} bg-primary`}>
          <img src={logoImage} alt="Profile" />
        </div>
        <div className={styles.textContainer}>
          <H2 className="text-txt2">
            {token
              ? `${session.firstName} ${session.lastName}`
              : t('header.title')}
          </H2>
          <p>{token ? session.email : t('header.subtitle')}</p>
        </div>
      </div>
      <Box boxType="icon" className="w-8 h-8" containerMode>
        <Icons iconType="itemMenu" />
      </Box>
    </div>
  );
};

export default ProfileInfo;
