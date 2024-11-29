import { FieldConfig, InputFieldType } from '@popup:models/model.form';

export const loginFormSchema: FieldConfig[] = [
  {
    name: 'username',
    label: 'Username',
    type: InputFieldType.text,
    placeholder: 'Nombre de usuario',
    validationRules: {
      required: 'Este campo es requerido',
    },
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: InputFieldType.password,
    placeholder: 'Ingrese la contraseña',
    validationRules: {
      required: 'Este campo es requerido',
    },
  },
];

export const registerFormSchema: FieldConfig[] = [
  {
    name: 'email',
    label: 'Correo electrónico',
    type: InputFieldType.email,
    placeholder: 'Ingrese su correo electrónico',
    validationRules: {
      required: 'Este campo es requerido',
      pattern: {
        value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        message: 'Ingrese un correo electrónico válido',
      },
    },
  },
  {
    name: 'username',
    label: 'Username',
    type: InputFieldType.text,
    placeholder: 'Nombre de usuario',
    validationRules: {
      required: 'Este campo es requerido',
    },
  },
  {
    name: 'password',
    label: 'Contraseña',
    type: InputFieldType.password,
    placeholder: 'Ingrese la contraseña',
    validationRules: {
      required: 'Este campo es requerido',
    },
  },
  {
    name: 'firstName',
    label: 'Nombres',
    type: InputFieldType.text,
    placeholder: 'Ingrese su nombre',
    validationRules: {
      required: 'Este campo es requerido',
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: 'Solo se permiten letras',
      },
    },
  },
  {
    name: 'lastName',
    label: 'Apellidos',
    type: InputFieldType.text,
    placeholder: 'Ingrese su apellido',
    validationRules: {
      required: 'Este campo es requerido',
      pattern: {
        value: /^[A-Za-z ]+$/,
        message: 'Solo se permiten letras',
      },
    },
  },
];
