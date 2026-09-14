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
