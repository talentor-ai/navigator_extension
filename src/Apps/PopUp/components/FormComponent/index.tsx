import { useForm, SubmitHandler } from 'react-hook-form';
import { debounce, get } from 'lodash';
import { FieldConfig } from '@popup:models/model.form';
import InputFieldRender from './InputFieldRender';
import { Button } from '@popup:components';
import { CustomizableComponent } from '@popup:models/default.components';
import { useCallback, useEffect, useRef } from 'react';

// Constants
const DEBOUNCE_DELAY = 300;
const DEFAULT_SUBMIT_LABEL = 'Enviar';
const DEFAULT_CANCEL_LABEL = 'Cancelar';

interface FormComponentProps extends CustomizableComponent {
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
  submitLabel = DEFAULT_SUBMIT_LABEL,
  cancelLabel = DEFAULT_CANCEL_LABEL,
  onWatch,
  defaultValues = {},
}: FormComponentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues,
  });

  const debouncedSetFormDataRef = useRef<ReturnType<typeof debounce> | null>(
    null,
  );

  const debouncedSetFormData = useCallback(
    (data: Record<string, any>) => {
      if (!onWatch) return;
      onWatch(data);
    },
    [onWatch],
  );

  // Create debounced function with cleanup
  useEffect(() => {
    debouncedSetFormDataRef.current = debounce(
      debouncedSetFormData,
      DEBOUNCE_DELAY,
    );

    return () => {
      if (debouncedSetFormDataRef.current) {
        debouncedSetFormDataRef.current.cancel();
      }
    };
  }, [debouncedSetFormData]);

  const watchedValues = watch();

  // ------------------------- Handlers -------------------------
  const handleCancel = useCallback(() => {
    if (onCancel) {
      reset();
      onCancel();
    }
  }, [onCancel, reset]);

  useEffect(() => {
    const hasValues = Object.keys(watchedValues).length > 0;
    if (!hasValues) return;

    if (debouncedSetFormDataRef.current) {
      debouncedSetFormDataRef.current(watchedValues);
    }
  }, [watchedValues]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${className} ik-flex ik-flex-col ik-justify-center ik-gap-2`}
    >
      {fieldProps.map((field) => (
        <InputFieldRender
          key={field.name}
          {...field}
          register={register}
          errorMessage={String(get(errors, `${field.name}.message`, ''))}
        />
      ))}
      <div className="ik-flex ik-justify-center ik-items-center ik-gap-4 ik-mt-4">
        <Button className="ik-bg-tertiary" type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button className="ik-bg-errorColor" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormComponent;
