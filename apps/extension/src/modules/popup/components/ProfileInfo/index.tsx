import { useTranslation } from 'react-i18next';
import styles from './profile_info.module.css';
import { H2 } from '../';
import logoImage from '@modules/popup/assets/logo.png';
import { useSessionStore } from '@modules/popup/store';

const ProfileInfo = () => {
  const { t } = useTranslation();
  const { session, token } = useSessionStore();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <div className={`${styles.image} tai:bg-primary`}>
          <img src={logoImage} alt="Profile" />
        </div>
        <div className={styles.textContainer}>
          <H2 className="tai:text-txt2">
            {token ? session?.username : t('header.title')}
          </H2>
          <p>{token ? session?.email : t('header.subtitle')}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
