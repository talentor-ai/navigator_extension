import { useForm, SubmitHandler } from 'react-hook-form';
import { debounce, get, isEqual } from 'lodash';
import { FieldConfig } from '@popup:models/model.form';
import InputFieldRender from './InputFieldRender';
import { Button } from '@popup:components';
import { CustomizableComponent } from '@popup:models/default.components';
import { useCallback, useEffect } from 'react';

interface DynamicFormProps extends CustomizableComponent {
  fieldProps: FieldConfig[];
  submitLabel?: string;
  onSubmit: SubmitHandler<Record<string, any>>;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
  onWatch?: (data: Record<string, any>) => void;
  defaultValues?: Record<string, any>;
}

const FormComponent = ({
  fieldProps,
  onSubmit,
  onCancel,
  className = '',
  isLoading = false,
  submitLabel = 'Enviar',
  cancelLabel = 'Cancelar',
  onWatch,
  defaultValues = {},
}: DynamicFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
  });

  const debouncedSetFormData = useCallback(
    debounce((data) => {
      if (!onWatch) return;
      return onWatch(data);
    }, 300), // Adjust debounce delay as needed
    [onWatch],
  );

  const watchedValues = watch();

  // ------------------------- Handlers -------------------------
  const handleCancel = () => {
    if (onCancel) {
      reset();
      onCancel();
    }
  };

  useEffect(() => {
    if (isEqual(watchedValues, {})) return;
    debouncedSetFormData(watchedValues);
  }, [watchedValues, debouncedSetFormData]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${className} ik-flex ik-flex-col ik-justify-center ik-gap-2`}
    >
      {fieldProps.map((field: FieldConfig) => (
        <InputFieldRender
          key={field.name}
          {...field}
          register={register}
          errorMessage={get(errors, `${field.name}.message`, '').toString()}
        />
      ))}
      <div className="ik-flex ik-justify-center ik-items-center ik-gap-4 ik-mt-4">
        <Button className="ik-bg-tertiary" type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
        {!!onCancel && (
          <Button className="ik-bg-errorColor" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormComponent;
