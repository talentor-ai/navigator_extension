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
        className={`ik-border ${borderColor()} ik-px-4 ik-text-txt1 ik-flex ik-justify-between 
         ik-items-center ik-h-boxHeight ik-bg-secondary ik-rounded-md`}
      >
        <Controller
          name={name}
          control={control}
          rules={validationRules}
          render={({ field }) => (
            <AntDatePicker
              id={name}
              className="ik-w-full ik-border-none ik-bg-transparent"
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
        <span className="ik-text-errorColor ik-text-small ik-absolute ik-top-[100%] ik-right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
