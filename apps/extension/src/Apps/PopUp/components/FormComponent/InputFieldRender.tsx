import { FieldConfig, InputFieldType } from '@popup:models/model.form';
import { Input, Textarea, DatePicker } from './components';
import { isEmpty } from 'lodash';
import {
  Control,
  UseFormRegister,
  FieldErrors,
  UseFormSetValue,
} from 'react-hook-form';
import DynamicInputs from './components/DynamicInputs';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: UseFormRegister<any>;
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  errors: FieldErrors<any>;
}

const InputFieldRender = ({
  type,
  name,
  control,
  register,
  setValue,
  errors,
  ...rest
}: IFieldProps) => {
  if (type === InputFieldType.datetime) {
    return <Input type={type} name={name} register={register} {...rest} />;
  }

  if (type === InputFieldType.date || type === InputFieldType.month) {
    return <DatePicker type={type} name={name} control={control} {...rest} />;
  }

  if (type === InputFieldType.hidden) {
    return <Input type={type} name={name} register={register} {...rest} />;
  }

  if (type === InputFieldType.textarea) {
    return <Textarea type={type} name={name} register={register} {...rest} />;
  }

  if (type === InputFieldType.subForm && !isEmpty(rest.subFormFields)) {
    return (
      <DynamicInputs
        name={name}
        control={control}
        register={register}
        setValue={setValue}
        errors={errors}
        subFormFields={rest.subFormFields || []}
      />
    );
  }

  if (type in InputFieldType) {
    return <Input type={type} name={name} register={register} {...rest} />;
  }

  return <p>No type found: [ {type} ]</p>;
};

export default InputFieldRender;
