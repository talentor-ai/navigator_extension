export interface FieldConfig {
  name: string;
  label?: string;
  type: InputType | RestInputType;
  placeholder?: string;
  defaultValue?: string | number;
  options?: string[];
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

export enum InputType {
  text = 'text',
  email = 'email',
  password = 'password',
  number = 'number',
  datetime = 'datetime',
}

export enum RestInputType {
  textarea = 'textarea',
  select = 'select',
  radio = 'radio',
  checkbox = 'checkbox',
}
