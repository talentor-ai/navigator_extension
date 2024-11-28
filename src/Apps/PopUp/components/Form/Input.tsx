import { FieldConfig } from '@popup:models/model.form';
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
    if (errorMessage) return 'border-errorColor';
    if (isFocused) return 'border-tertiary';
    return 'border-transparent';
  };

  return (
    <div className="relative w-full">
      <label htmlFor={name} className="text-txt2 block mb-1.5">
        {label}
        {validationRules?.required && (
          <span className="text-errorColor"> *</span>
        )}
      </label>
      <div
        className={`border ${borderColor()} px-4 text-txt1 flex justify-between 
         items-center h-boxHeight bg-secondary rounded-2xl`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="w-full border-none bg-transparent outline-none"
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
        <span className="text-errorColor text-small absolute top-[100%] right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default Input;
