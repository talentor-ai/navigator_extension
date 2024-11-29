import { Form, H1, SocialMedia } from '@popup/components';
import styles from './login.module.css';
import { IconSize } from '@popup:models/model.icons';
import { registerFormSchema } from './constants';
import { useRegister } from './hooks';

const RegisterScreen = () => {
  const { isPending, mutate: register } = useRegister();

  // ----------------------------- Handlers
  const handleSubmit = async (data: any) => {
    await register(data);
  };

  return (
    <div className={styles.main}>
      <H1>Registrarse</H1>
      <section className={styles.socialMediasection}>
        <SocialMedia socialMedia="google" size={IconSize.medium} />
        <SocialMedia socialMedia="facebook" size={IconSize.medium} />
        <SocialMedia socialMedia="linkedin" size={IconSize.medium} />
      </section>
      <Form
        className="my-8 w-72 flex flex-col justify-center"
        fieldProps={registerFormSchema}
        onSubmit={handleSubmit}
        submitLabel="Iniciar sesión"
        isLoading={isPending}
      />
    </div>
  );
};

export default RegisterScreen;
