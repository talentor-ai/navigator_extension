import { FieldConfig, InputType } from '@popup:models/model.form';
import Input from './Input';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: any;
}

const InputFieldRender = ({ type, ...rest }: IFieldProps) => {
  if (type in InputType) {
    return <Input type={type} {...rest} />;
  }
};

export default InputFieldRender;
