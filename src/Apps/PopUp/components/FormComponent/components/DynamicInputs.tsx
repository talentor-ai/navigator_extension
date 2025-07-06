import { FieldConfig } from '@popup:models/model.form';
import {
  useFieldArray,
  Control,
  UseFormRegister,
  FieldErrors,
} from 'react-hook-form';
import { Input, Textarea } from './index';
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
    'ik-px-3 ik-py-1 ik-rounded-md ik-text-sm ik-transition-colors';
  const variantClasses = {
    primary: 'ik-bg-primary ik-text-white hover:ik-bg-primary/80',
    danger: 'ik-text-red-500 hover:ik-text-red-700',
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
    const newField = subFormFields.reduce((acc, subFormField) => {
      acc[subFormField.name] = '';
      return acc;
    }, {} as Record<string, any>);
    append(newField);
  };

  const removeField = (index: number) => {
    remove(index);
  };

  return (
    <div className="ik-w-full">
      <div className="ik-flex ik-justify-between ik-items-center ik-my-4">
        <label className="ik-text-txt2 ik-block">
          {subFormFields[0]?.label || 'Dynamic Fields'}
        </label>
        <Button onClick={addNewField} variant="primary">
          + Agregar
        </Button>
      </div>

      {fields.map((field, index) => (
        <div
          key={field.id}
          className="ik-border ik-border-gray-200 ik-p-4 ik-rounded-md ik-mb-3"
        >
          <div className="ik-flex ik-justify-between ik-items-center ik-mb-3">
            <span className="ik-text-sm ik-text-gray-600">
              {subFormFields[0]?.label} #{index + 1}
            </span>
            <Button onClick={() => removeField(index)} variant="danger">
              Eliminar
            </Button>
          </div>

          <div className="ik-space-y-3">
            {subFormFields.map((subFormField) => (
              <div key={subFormField.name}>
                {subFormField.fields.map((fieldConfig) => {
                  const fieldName = `${name}.${index}.${fieldConfig.name}`;
                  const errorMessage = (errors[name] as any)?.[index]?.[
                    fieldConfig.name
                  ]?.message as string;

                  // Add default validation rules if none provided
                  const validationRules = fieldConfig.validationRules || {
                    required: 'Este campo es obligatorio',
                  };

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
        <div className="ik-text-center ik-text-gray-500 ik-py-4 ik-border ik-border-dashed ik-border-gray-300 ik-rounded-md">
          No hay elementos agregados. Haga clic en "Agregar" para comenzar.
        </div>
      )}
    </div>
  );
};

export default DynamicInputs;
