import { FieldConfig, InputFieldType } from '@popup:models/model.form';
import { useState } from 'react';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: any;
}

const Input = ({
  name,
  label,
  type,
  placeholder,
  errorMessage = '',
  register,
  validationRules,
}: IFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = () => {
    if (errorMessage) return 'ik-border-errorColor';
    if (isFocused) return 'ik-border-tertiary';
    return 'ik-border-transparent';
  };

  return (
    <div className="ik-relative ik-w-full">
      {type !== InputFieldType.hidden && (
        <label htmlFor={name} className="ik-text-txt2 ik-block ik-mb-1.5">
          {label}
          {validationRules?.required && (
            <span className="ik-text-errorColor"> *</span>
          )}
        </label>
      )}
      <div
        className={`ik-border ${borderColor()} ik-px-4 ik-text-txt1 ik-flex ik-justify-between 
         ik-items-center ik-h-boxHeight ik-bg-secondary ik-rounded-md ${
           type === InputFieldType.hidden &&
           'ik-h-0 ik-border-none ik-absolute ik-pointer-events-none ik-opacity-0'
         }`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="ik-w-full ik-border-none ik-bg-transparent ik-outline-none"
          autoComplete="off"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
      </div>
      {errorMessage && type !== InputFieldType.hidden && (
        <span className="ik-text-errorColor ik-text-small ik-absolute ik-top-[100%] ik-right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
