import { FormComponent, SocialMedia } from '@popup/components';
import { H1 } from '@popup/components';
import { IconSize } from '@popup/models/model.icons';
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
        className="my-8 w-72 flex flex-col justify-center"
        fieldProps={loginFormSchema}
        onSubmit={handleSubmit}
        submitLabel="Iniciar sesión"
        isLoading={isPending}
      />
    </div>
  );
};

export default LoginScreen;
