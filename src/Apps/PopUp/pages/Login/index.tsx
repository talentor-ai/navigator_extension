import { H1, SocialMedia } from '@popup/components';
import styles from './login.module.css';
import { IconSize } from '@popup/models/model.icons';

const Login = () => {
  return (
    <div className={styles.main}>
      <H1>Login</H1>
      <section className={styles.socialMediasection}>
        <SocialMedia socialMedia="google" size={IconSize.medium} />
        <SocialMedia socialMedia="facebook" size={IconSize.medium} />
        <SocialMedia socialMedia="linkedin" size={IconSize.medium} />
      </section>
    </div>
  );
};

export default Login;
