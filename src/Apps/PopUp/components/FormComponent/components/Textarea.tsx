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
    if (errorMessage) return 'ik-border-errorColor';
    if (isFocused) return 'ik-border-tertiary';
    return 'ik-border-transparent';
  };

  return (
    <div className="ik-relative ik-w-full">
      <label htmlFor={name} className="ik-text-txt2 ik-block ik-mb-1.5">
        {label}
        {validationRules?.required && (
          <span className="ik-text-errorColor"> *</span>
        )}
      </label>
      <div
        className={`ik-border ${borderColor()} ik-text-txt1 ik-flex ik-justify-between 
         ik-items-center ik-bg-secondary ik-rounded-2xl ik-rounded-ee-none`}
      >
        <textarea
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="ik-w-full ik-h-full ik-py-4 ik-px-4 ik-border-none ik-bg-transparent ik-outline-none ik-resize-y
            ik-min-h-10 ik-max-h-60"
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
        <span className="ik-text-errorColor ik-text-small ik-absolute ik-top-[100%] ik-right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Textarea;
