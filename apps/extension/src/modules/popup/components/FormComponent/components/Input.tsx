import { FieldConfig } from '@modules/popup/models/model.form';
import { useState } from 'react';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  disabled?: boolean;
  textSize?: 'small' | 'medium';
  register: any;
}

const TEXT_SIZE_CLASSES: Record<'small' | 'medium', string> = {
  small: 'tai:text-small',
  medium: 'tai:text-medium',
};

const Input = ({
  name,
  label,
  type,
  placeholder,
  errorMessage = '',
  disabled = false,
  textSize = 'medium',
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
      {label && (
        <label htmlFor={name} className="tai:text-txt2 tai:block tai:mb-1.5">
          {label}
          {validationRules?.required && (
            <span className="tai:text-errorColor"> *</span>
          )}
        </label>
      )}
      <div
        className={`tai:border ${borderColor()} tai:px-4 tai:text-txt1 tai:flex tai:justify-between 
         tai:items-center tai:h-boxHeight tai:bg-secondary tai:rounded-md`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          {...register(name, validationRules)}
          className={`tai:w-full tai:border-none tai:bg-transparent tai:outline-none tai:disabled:cursor-not-allowed tai:disabled:text-txt3 ${TEXT_SIZE_CLASSES[textSize]}`}
          autoComplete="off"
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
        />
      </div>
      {errorMessage && (
        <span className="tai:text-errorColor tai:text-small tai:absolute tai:top-[100%] tai:right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
