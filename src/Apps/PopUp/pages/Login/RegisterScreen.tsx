import { Form, H1, SocialMedia } from '@popup/components';
import styles from './login.module.css';
import { IconSize } from '@popup:models/model.icons';
import { registerFormSchema } from './constants';

const RegisterScreen = () => {
  const handleSubmit = async (data: any) => {
    console.log('data', data);
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
        className="mt-8 flex flex-col justify-center"
        fieldProps={registerFormSchema}
        onSubmit={handleSubmit}
        submitLabel="Iniciar sesión"
        isLoading={false}
      />
    </div>
  );
};

export default RegisterScreen;