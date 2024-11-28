export interface FieldConfig {
  name: string;
  label?: string;
  type: formInputType;
  placeholder?: string;
  defaultValue?: string | number;
  required?: boolean;
}

export type formInputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'datetime';
