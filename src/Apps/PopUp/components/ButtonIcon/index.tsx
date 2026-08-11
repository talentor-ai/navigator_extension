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
      className={`ik-w-boxHeight ik-h-boxHeight ik-border ik-border-transparent ik-border-solid
            ik-flex ik-justify-center ik-items-center ik-text-txt2 ik-cursor-pointer ik-rounded-full ik-bg-secondary
            hover:ik-border-tertiary ik-duration-200 disabled:ik-text-txt3 disabled:ik-cursor-not-allowed
            ${className}`}
      onClick={onClick}
    >
      {icon && <Icons iconType={icon} className="ik-text-icon" />}
    </button>
  );
};

export default ButtonIcon;
