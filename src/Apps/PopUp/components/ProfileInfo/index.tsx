import styles from './profile_info.module.css';
import { Box, H2, Icons } from '../';
import logoImage from '@popup/assets/logo.png';
import { useSessionStore } from '@popup:store';

const DEFAULT_TITLE = 'Talentor AI';
const DEFAULT_DESCRIPTION =
  "Genera multiples CV's en segundos con IA con un solo click!";

const ProfileInfo = () => {
  const { session, token } = useSessionStore();

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileInfo}>
        <div className={`${styles.image} bg-primary`}>
          <img src={logoImage} alt="Profile" />
        </div>
        <div className={styles.textContainer}>
          <H2 className="text-txt2">
            {token ? `${session.firstName} ${session.lastName}` : DEFAULT_TITLE}
          </H2>
          <p>{token ? session.email : DEFAULT_DESCRIPTION}</p>
        </div>
      </div>
      <Box boxType="icon" className="w-8 h-8" containerMode>
        <Icons iconType="itemMenu" />
      </Box>
    </div>
  );
};

export default ProfileInfo;
