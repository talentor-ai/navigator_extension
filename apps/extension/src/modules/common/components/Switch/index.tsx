import type { InputHTMLAttributes } from 'react';
import type { CustomizableComponent } from '@common/models';

export interface SwitchProps
  extends
    CustomizableComponent,
    Omit<
      InputHTMLAttributes<HTMLInputElement>,
      'type' | 'checked' | 'onChange' | 'children'
    > {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  label: string;
}

const Switch = ({
  checked,
  onCheckedChange,
  label,
  disabled = false,
  className = '',
  id,
  ...rest
}: SwitchProps) => (
  <label
    htmlFor={id}
    className={`tai:inline-flex tai:items-center tai:gap-2 ${
      disabled ? 'tai:cursor-not-allowed tai:opacity-50' : 'tai:cursor-pointer'
    } ${className}`}
  >
    <input
      id={id}
      type="checkbox"
      role="switch"
      aria-label={label}
      className="tai:peer tai:sr-only"
      checked={checked}
      disabled={disabled}
      onChange={(event) => onCheckedChange(event.target.checked)}
      {...rest}
    />
    <span
      aria-hidden="true"
      className={`tai:inline-flex tai:h-6 tai:w-11 tai:items-center tai:rounded-full tai:px-0.5 tai:transition-colors ${
        checked ? 'tai:bg-tertiary' : 'tai:bg-txt3'
      }`}
    >
      <span
        className={`tai:block tai:h-5 tai:w-5 tai:rounded-full tai:bg-white tai:transition-transform ${
          checked ? 'tai:translate-x-5' : 'tai:translate-x-0'
        }`}
      />
    </span>
  </label>
);

export default Switch;
