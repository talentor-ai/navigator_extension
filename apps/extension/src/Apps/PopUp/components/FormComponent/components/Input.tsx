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
    if (errorMessage) return 'tai:border-errorColor';
    if (isFocused) return 'tai:border-tertiary';
    return 'tai:border-transparent';
  };

  return (
    <div className="tai:relative tai:w-full">
      {type !== InputFieldType.hidden && (
        <label htmlFor={name} className="tai:text-txt2 tai:block tai:mb-1.5">
          {label}
          {validationRules?.required && (
            <span className="tai:text-errorColor"> *</span>
          )}
        </label>
      )}
      <div
        className={`tai:border ${borderColor()} tai:px-4 tai:text-txt1 tai:flex tai:justify-between 
         tai:items-center tai:h-boxHeight tai:bg-secondary tai:rounded-md ${
           type === InputFieldType.hidden &&
           'tai:h-0 tai:border-none tai:absolute tai:pointer-events-none tai:opacity-0'
         }`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="tai:w-full tai:border-none tai:bg-transparent tai:outline-none"
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
        <span className="tai:text-errorColor tai:text-small tai:absolute tai:top-[100%] tai:right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
