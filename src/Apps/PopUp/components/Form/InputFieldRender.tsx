import { FieldConfig, InputFieldType } from '@popup:models/model.form';
import { Input, Textarea } from './components';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: any;
}

const InputFieldRender = ({ type, ...rest }: IFieldProps) => {
  if (type === InputFieldType.datetime) {
    return <Input type={type} {...rest} />;
  }

  if (type === InputFieldType.textarea) {
    return <Textarea type={type} {...rest} />;
  }

  if (type in InputFieldType) {
    return <Input type={type} {...rest} />;
  }

  return <p>No type found: [ {type} ]</p>;
};

export default InputFieldRender;
