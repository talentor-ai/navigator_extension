import { DatePicker as AntDatePicker } from 'antd';
import { useState } from 'react';
import dayjs from 'dayjs';
import { FieldConfig, InputFieldType } from '@modules/popup/models/model.form';
import { Controller } from 'react-hook-form';

interface DatePickerProps extends FieldConfig {
  errorMessage?: string;
  validationRules?: any;
  control: any;
}

const DatePicker = ({
  name,
  label,
  type,
  placeholder,
  errorMessage = '',
  validationRules,
  control,
}: DatePickerProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const isMonth = type === InputFieldType.month;
  const format = isMonth ? 'YYYY-MM' : 'YYYY-MM-DD';
  const inputPlaceholder =
    placeholder ?? (isMonth ? 'Seleccione el mes y año' : 'Select date');

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
              placeholder={inputPlaceholder}
              picker={isMonth ? 'month' : undefined}
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => {
                const value = date
                  ? isMonth
                    ? date.format('YYYY-MM')
                    : date.toISOString()
                  : '';
                field.onChange(value);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              format={format}
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
        <span className="tai:text-errorColor tai:text-small tai:absolute tai:top-full tai:right-0">
          {errorMessage}
        </span>
      )}
    </div>
  );
};

export default DatePicker;
