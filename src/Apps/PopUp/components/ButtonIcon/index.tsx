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
  onClick,
  className = '',
}: ButtonIconProps) => {
  return (
    <button
      disabled={disabled}
      className={`w-boxHeight h-boxHeight border border-transparent border-solid
            flex justify-center items-center text-txt2 cursor-pointer rounded-full bg-secondary
            hover:border-tertiary duration-200 disabled:text-txt3 disabled:cursor-not-allowed
            ${className}`}
      onClick={onClick}
    >
      {icon && <Icons iconType={icon} className="text-icon" />}
    </button>
  );
};

export default ButtonIcon;
