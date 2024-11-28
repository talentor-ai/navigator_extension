import { FieldConfig } from '@popup:models/model.form';
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';

interface DynamicFormProps {
  schema: FieldConfig[];
  onSubmit: SubmitHandler<Record<string, any>>;
}

const FormRender: React.FC<DynamicFormProps> = ({ schema, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {schema.map((field) => (
        <div key={field.name} style={{ marginBottom: '1rem' }}>
          <label
            htmlFor={field.name}
            style={{ display: 'block', marginBottom: '.5rem' }}
          >
            {field.label}
            {field.required && <span style={{ color: 'red' }}> *</span>}
          </label>
          <input
            id={field.name}
            type={field.type}
            placeholder={field.placeholder}
            {...register(field.name, { required: field.required })}
            style={{
              width: '100%',
              padding: '.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
            }}
          />
          {errors[field.name] && (
            <span style={{ color: 'red', fontSize: '.8rem' }}>
              {field.label} is required
            </span>
          )}
        </div>
      ))}
      <button
        type="submit"
        style={{
          padding: '.5rem 1rem',
          borderRadius: '4px',
          background: 'blue',
          color: 'white',
        }}
      >
        Submit
      </button>
    </form>
  );
};

export default FormRender;
