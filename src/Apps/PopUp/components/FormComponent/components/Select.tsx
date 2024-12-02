import { CustomizableComponent } from '@popup:models/default.components';
import { Select as SelectComponent } from 'antd';

interface SelectProps extends CustomizableComponent {
  options: { value: string; label: JSX.Element }[];
  placeholder?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | null;
}

const Select = ({
  options,
  placeholder = 'Select',
  onChange,
  className = '',
  defaultValue = 'Select',
}: SelectProps) => {
  // ------------------------ Handlers
  const handleChange = (value: string) => {
    if (onChange) onChange(value);
  };

  return (
    <div className="">
      <SelectComponent
        className={`w-full ${className}`}
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
