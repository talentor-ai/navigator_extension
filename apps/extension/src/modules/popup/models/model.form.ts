export interface FieldConfig {
  formId?: string;
  name: string;
  label?: string;
  type: InputFieldType;
  placeholder?: string;
  defaultValue?: string | number;
  checked?: boolean;
  validationRules?: {
    required?: boolean | string; // Custom error message
    minLength?: { value: number; message: string };
    maxLength?: { value: number; message: string };
    min?: { value: number; message: string }; // For numbers
    max?: { value: number; message: string }; // For numbers
    pattern?: { value: RegExp; message: string }; // For regex validation
  };
}

export enum InputFieldType {
  text = 'text',
  password = 'password',

  textarea = 'textarea',

  multiselect = 'multiselect',

  // subForm is a special type of field that will render a sub-form
  subForm = 'subForm',
}
