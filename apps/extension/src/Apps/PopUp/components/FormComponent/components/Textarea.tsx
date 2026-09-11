import { FieldConfig } from '@popup:models/model.form';
import { useState } from 'react';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
  register: any;
}

const Textarea = ({
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
      <label htmlFor={name} className="tai:text-txt2 tai:block tai:mb-1.5">
        {label}
        {validationRules?.required && (
          <span className="tai:text-errorColor"> *</span>
        )}
      </label>
      <div
        className={`tai:border ${borderColor()} tai:text-txt1 tai:flex tai:justify-between 
         tai:items-center tai:bg-secondary tai:rounded-2xl tai:rounded-ee-none`}
      >
        <textarea
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="tai:w-full tai:h-full tai:py-4 tai:px-4 tai:border-none tai:bg-transparent tai:outline-none tai:resize-y
            tai:min-h-10 tai:max-h-60"
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

export default Textarea;
