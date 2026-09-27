import { useForm, SubmitHandler } from 'react-hook-form';
import { get } from 'lodash';
import { FieldConfig } from '@modules/popup/models/model.form';
import InputFieldRender from './InputFieldRender';
import { Button } from '@modules/popup/components';
import { CustomizableComponent } from '@common/models';

// Constants
const DEFAULT_SUBMIT_LABEL = 'Enviar';
const DEFAULT_CANCEL_LABEL = 'Cancelar';

interface FormComponentProps extends CustomizableComponent {
  fieldProps: FieldConfig[];
  submitLabel?: string;
  onSubmit: SubmitHandler<Record<string, any>>;
  cancelLabel?: string;
  onCancel?: () => void;
  isLoading?: boolean;
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
  defaultValues = {},
}: FormComponentProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues,
  });

  // ------------------------- Handlers -------------------------
  const handleCancel = () => {
    if (!onCancel) return;
    reset();
    onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`${className} tai:flex tai:flex-col tai:justify-center tai:gap-2`}
    >
      {fieldProps.map((field) => (
        <InputFieldRender
          key={field.name}
          {...field}
          register={register}
          errorMessage={String(get(errors, `${field.name}.message`, ''))}
        />
      ))}
      <div className="tai:flex tai:justify-center tai:items-center tai:gap-4 tai:mt-4">
        <Button className="tai:bg-tertiary" type="submit" disabled={isLoading}>
          {submitLabel}
        </Button>
        {onCancel && (
          <Button className="tai:bg-errorColor" onClick={handleCancel}>
            {cancelLabel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default FormComponent;
