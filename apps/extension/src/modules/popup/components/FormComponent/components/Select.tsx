import type { ReactNode } from 'react';
import { CustomizableComponent } from '@common/models';
import { Select as SelectComponent } from 'antd';

interface SelectProps extends CustomizableComponent {
  options: { value: string; label: ReactNode }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | null;
  value?: string | null;
}

const Select = ({
  options,
  placeholder = 'Select',
  onChange,
  className = '',
  defaultValue = 'Select',
  value,
}: SelectProps) => {
  // ------------------------ Handlers
  const handleChange = (value: string) => {
    if (onChange) onChange(value);
  };

  if (value !== undefined) {
    return (
      <div className="">
        <SelectComponent
          className={`tai:w-full ${className}`}
          size="small"
          style={{ height: '2.3rem' }}
          placeholder={placeholder}
          value={value ?? undefined}
          options={options}
          onChange={handleChange}
        />
      </div>
    );
  }

  return (
    <div className="">
      <SelectComponent
        className={`tai:w-full ${className}`}
        size="small"
        style={{ height: '2.3rem' }}
        placeholder={placeholder}
        defaultValue={defaultValue}
        options={options}
        onChange={handleChange}
      />
    </div>
  );
};

export default Select;
