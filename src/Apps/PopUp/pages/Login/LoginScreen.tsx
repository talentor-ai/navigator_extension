import { Form, SocialMedia } from '@popup/components';
import { H1 } from '@popup/components';
import { IconSize } from '@popup/models/model.icons';
import styles from './login.module.css';
import { loginFormSchema } from './constants';
import { useSession } from '@popup:hooks';

const LoginScreen = () => {
  const { data: response, isPending, mutate: login } = useSession();

  // ----------------------------- Handlers
  const handleSubmit = async (data: any) => {
    await login({
      username: data.username,
      password: data.password,
    });
    console.log('data', response);
  };

  return (
    <div className={styles.main}>
      <H1>Iniciar sesión</H1>
      <section className={styles.socialMediasection}>
        <SocialMedia socialMedia="google" size={IconSize.medium} />
        <SocialMedia socialMedia="facebook" size={IconSize.medium} />
        <SocialMedia socialMedia="linkedin" size={IconSize.medium} />
      </section>
      <Form
        className="mt-6"
        fieldProps={loginFormSchema}
        onSubmit={handleSubmit}
        onCancel={() => console.log('cancel')}
        submitLabel="Iniciar sesión"
        isLoading={isPending}
      />
    </div>
  );
};

export default LoginScreen;
