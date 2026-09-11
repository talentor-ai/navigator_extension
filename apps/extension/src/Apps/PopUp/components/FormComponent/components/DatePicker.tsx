import { DatePicker as AntDatePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { FieldConfig } from '@popup:models/model.form';
import { Controller } from 'react-hook-form';

interface DatePickerProps extends FieldConfig {
  errorMessage?: string;
  validationRules?: any;
  control: any;
}

const DatePicker = ({
  name,
  label,
  placeholder = 'Select date',
  errorMessage = '',
  validationRules,
  control,
}: DatePickerProps) => {
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
        className={`tai:border ${borderColor()} tai:px-4 tai:text-txt1 tai:flex tai:justify-between 
         tai:items-center tai:h-boxHeight tai:bg-secondary tai:rounded-md`}
      >
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => (
            <AntDatePicker
              id={name}
              className="tai:w-full tai:border-none tai:bg-transparent"
              placeholder={placeholder}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                const isoString = date ? date.toISOString() : '';
                field.onChange(isoString);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              format="YYYY-MM-DD"
              size="small"
              style={{
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                width: '100%',
              }}
            />
          )}
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

export default DatePicker;
