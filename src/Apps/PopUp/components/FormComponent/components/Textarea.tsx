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
        className={`border ${borderColor()} text-txt1 flex justify-between 
         items-center bg-secondary rounded-2xl rounded-ee-none`}
      >
        <textarea
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name, validationRules)}
          className="w-full h-full py-4 px-4 border-none bg-transparent outline-none resize-y
            min-h-10 max-h-60"
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

export default Textarea;
