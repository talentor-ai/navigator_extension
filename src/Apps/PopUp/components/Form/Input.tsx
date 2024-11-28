import { FieldConfig } from '@popup:models/model.form';
import { useState } from 'react';

interface IFieldProps extends FieldConfig {
  errorMessage?: string;
}

const Input = ({
  name,
  label,
  type,
  placeholder,
  required,
  errorMessage = '',
}: IFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = () => {
    if (errorMessage) return 'border-errorColor';
    if (isFocused) return 'border-tertiary';
    return 'border-border1';
  };

  return (
    <div className="relative w-full mb-4">
      <label htmlFor={name} className="text-txt2 block mb-1.5">
        {label}
        {required && <span className="text-errorColor"> *</span>}
      </label>
      <div
        className={`border ${borderColor()} px-4 text-txt1 flex justify-between 
         items-center h-boxHeight bg-primary rounded-2xl`}
      >
        <input
          id={name}
          type={type}
          placeholder={placeholder}
          //   {...register(name, { required: required })}
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
