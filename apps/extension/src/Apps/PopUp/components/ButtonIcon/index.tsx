import { Icons } from '@popup:components';
import { CustomizableComponent } from '@popup:models/default.components';

interface ButtonIconProps extends CustomizableComponent {
  icon?: string;
  disabled?: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
}

const ButtonIcon = ({
  icon,
  disabled = false,
  onClick = () => {
    console.warn('Click event not implemented');
  },
  className = '',
}: ButtonIconProps) => {
  return (
    <button
      disabled={disabled}
      className={`tai:w-boxHeight tai:h-boxHeight tai:border tai:border-transparent tai:border-solid
            tai:flex tai:justify-center tai:items-center tai:text-txt2 tai:cursor-pointer tai:rounded-full tai:bg-secondary
            tai:hover:border-tertiary tai:duration-200 tai:disabled:text-txt3 tai:disabled:cursor-not-allowed
            ${className}`}
      onClick={onClick}
    >
      {icon && <Icons iconType={icon} className="tai:text-icon" />}
    </button>
  );
};

export default ButtonIcon;
