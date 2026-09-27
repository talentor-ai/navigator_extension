import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { CustomizableComponent } from '@common/models';

export interface ButtonIconProps
  extends
    CustomizableComponent,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  children: ReactNode;
}

const ButtonIcon = ({
  children,
  type = 'button',
  className = '',
  style,
  ...rest
}: ButtonIconProps) => (
  <button
    type={type}
    style={style}
    className={`tai:flex tai:items-center tai:justify-center tai:rounded-full tai:disabled:cursor-not-allowed ${className}`}
    {...rest}
  >
    {children}
  </button>
);

export default ButtonIcon;
