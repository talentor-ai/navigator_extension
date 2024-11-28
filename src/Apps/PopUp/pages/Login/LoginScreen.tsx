import { SocialMedia } from '@popup/components';
import { H1 } from '@popup/components';
import { IconSize } from '@popup/models/model.icons';
import styles from './login.module.css';

const LoginScreen = () => {
  return (
    <div className={styles.main}>
      <H1>Iniciar sesión</H1>
      <section className={styles.socialMediasection}>
        <SocialMedia socialMedia="google" size={IconSize.medium} />
        <SocialMedia socialMedia="facebook" size={IconSize.medium} />
        <SocialMedia socialMedia="linkedin" size={IconSize.medium} />
      </section>
    </div>
  );
};

export default LoginScreen;
