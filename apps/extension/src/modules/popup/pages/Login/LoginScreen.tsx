import { FormComponent, Link, SocialMedia } from '@modules/popup/components';
import { H1 } from '@modules/popup/components';
import { WEB_URL } from '@modules/popup/api';
import { IconSize } from '@common/models';
import styles from './login.module.css';
import { loginFormSchema } from './constants';
import { useLogin } from './hooks';
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { t } = useTranslation();
  const { isPending, mutate: login } = useLogin();

  // ----------------------------- Handlers
  const handleSubmit = async (data: any) => {
    await login({
      username: data.username,
      password: data.password,
    });
  };

  return (
    <div className={styles.main}>
      <H1>{t('login.login')}</H1>
      <section className={styles.socialMediasection}>
        <SocialMedia socialMedia="google" size={IconSize.medium} />
        <SocialMedia socialMedia="facebook" size={IconSize.medium} />
        <SocialMedia socialMedia="linkedin" size={IconSize.medium} />
      </section>
      <FormComponent
        className="tai:my-8 tai:w-72 tai:flex tai:flex-col tai:justify-center"
        fieldProps={loginFormSchema}
        onSubmit={handleSubmit}
        submitLabel="Iniciar sesión"
        isLoading={isPending}
      />
      <Link
        href={`${WEB_URL}/register`}
        target="_blank"
        rel="noopener noreferrer"
        className="tai:mt-2 tai:text-medium"
      >
        {t('login.signUp')}
      </Link>
    </div>
  );
};

export default LoginScreen;
