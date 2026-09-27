import { FieldConfig, InputFieldType } from '@modules/popup/models/model.form';
import { Input, Textarea } from './components';
import { UseFormRegister } from 'react-hook-form';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: UseFormRegister<any>;
}

const InputFieldRender = ({
  type,
  name,
  register,
  errorMessage,
  ...rest
}: IFieldProps) => {
  if (type === InputFieldType.textarea) {
    return <Textarea type={type} name={name} register={register} {...rest} />;
  }

  if (type in InputFieldType) {
    return (
      <Input
        type={type}
        name={name}
        register={register}
        errorMessage={errorMessage}
        {...rest}
      />
    );
  }

  return <p>No type found: [ {type} ]</p>;
};

export default InputFieldRender;
