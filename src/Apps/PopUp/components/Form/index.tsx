import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { get } from 'lodash';
import { FieldConfig } from '@popup:models/model.form';
import InputFieldRender from './InputFieldRender';
import { Button } from '@popup:components';
import { CustomizableComponent } from '@popup:models/default.components';

interface DynamicFormProps extends CustomizableComponent {
  fieldProps: FieldConfig[];
  submitLabel?: string;
  onSubmit: SubmitHandler<Record<string, any>>;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
}

const Form: React.FC<DynamicFormProps> = ({
  fieldProps,
  onSubmit,
  onCancel,
  className = '',
  isLoading = false,
  submitLabel = 'Enviar',
  cancelLabel = 'Cancelar',
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  // ------------------------- Handlers -------------------------
  const handleCancel = () => {
    if (onCancel) {
      reset();
      onCancel();
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${className} flex flex-col justify-center gap-2`}
    >
      {fieldProps.map((field: FieldConfig) => (
        <InputFieldRender
          key={field.name}
          {...field}
          register={register}
          errorMessage={get(errors, `${field.name}.message`, '').toString()}
        />
      ))}
      <div className="flex justify-center items-center gap-4 mt-4">
        <Button className="bg-tertiary" type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
        {!!onCancel && (
          <Button className="bg-errorColor" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default Form;
