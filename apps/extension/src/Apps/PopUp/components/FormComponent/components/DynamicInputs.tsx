import { FieldConfig } from '@popup:models/model.form';
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import { Input, Textarea, DatePicker } from './index';
import { InputFieldType } from '@popup:models/model.form';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
  className?: string;
}

const Button = ({
  onClick,
  children,
  variant = 'primary',
  className = '',
}: ButtonProps) => {
  const baseClasses =
    'tai:px-3 tai:py-1 tai:rounded-md tai:text-sm tai:transition-colors';
  const variantClasses = {
    primary: 'tai:bg-primary tai:text-white tai:hover:bg-primary/80',
    danger: 'tai:text-red-500 tai:hover:text-red-700',
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

interface DynamicInputsProps {
  name: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  subFormFields: {
    formId: string;
    name: string;
    label: string;
    fields: FieldConfig[];
  }[];
}

const DynamicInputs = ({
  name,
  control,
  register,
  errors,
  subFormFields,
}: DynamicInputsProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
  });

  const addNewField = () => {
    const newField = subFormFields.reduce(
      (acc, subFormField) => {
        acc[subFormField.name] = '';
        return acc;
      },
      {} as Record<string, any>,
    );
    append(newField);
  };

  const removeField = (index: number) => {
    remove(index);
  };

  return (
    <div className="tai:w-full">
      <div className="tai:flex tai:justify-between tai:items-center tai:my-4">
        <label className="tai:text-txt2 tai:block">
          {subFormFields[0]?.label || 'Dynamic Fields'}
        </label>
        <Button onClick={addNewField} variant="primary">
          + Agregar
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="tai:border tai:border-gray-200 tai:p-4 tai:rounded-md tai:mb-3"
        >
          <div className="tai:flex tai:justify-between tai:items-center tai:mb-3">
            <span className="tai:text-sm tai:text-gray-600">
              {subFormFields[0]?.label} #{index + 1}
            </span>
            <Button onClick={() => removeField(index)} variant="danger">
              Eliminar
            </Button>
          </div>

          <div className="tai:space-y-3">
            {subFormFields.map((subFormField) => (
              <div key={subFormField.name}>
                {subFormField.fields.map((fieldConfig) => {
                  const fieldName = `${name}.${index}.${fieldConfig.name}`;
                  const errorMessage = (errors[name] as any)?.[index]?.[
                    fieldConfig.name
                  ]?.message as string;

                  // Add default validation rules if none provided
                  const validationRules = fieldConfig.validationRules || {};

                  if (fieldConfig.type === InputFieldType.textarea) {
                    return (
                      <Textarea
                        key={fieldConfig.name}
                        {...fieldConfig}
                        name={fieldName}
                        register={register}
                        errorMessage={errorMessage}
                        validationRules={validationRules}
                      />
                    );
                  }

                  if (fieldConfig.type === InputFieldType.date) {
                    return (
                      <DatePicker
                        key={fieldConfig.name}
                        {...fieldConfig}
                        name={fieldName}
                        control={control}
                        errorMessage={errorMessage}
                        validationRules={validationRules}
                      />
                    );
                  }

                  return (
                    <Input
                      key={fieldConfig.name}
                      {...fieldConfig}
                      name={fieldName}
                      register={register}
                      errorMessage={errorMessage}
                      validationRules={validationRules}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}

      {fields.length === 0 && (
        <div className="tai:text-center tai:text-gray-500 tai:py-4 tai:border tai:border-dashed tai:border-gray-300 tai:rounded-md">
          No hay elementos agregados. Haga clic en "Agregar" para comenzar.
        </div>
      )}
    </div>
  );
};

export default DynamicInputs;
