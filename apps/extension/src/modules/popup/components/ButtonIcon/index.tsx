import Icons from '../Icons';
import BaseButtonIcon from '@common/components/ButtonIcon';
import type { CustomizableComponent } from '@common/models';

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
}: ButtonIconProps) => (
  <BaseButtonIcon
    disabled={disabled}
    onClick={onClick}
    className={`tai:h-boxHeight tai:w-boxHeight tai:cursor-pointer tai:border tai:border-solid tai:border-transparent tai:bg-secondary tai:text-txt2 tai:duration-200 tai:hover:border-tertiary tai:disabled:text-txt3 ${className}`}
  >
    {icon && <Icons iconType={icon} className="tai:text-icon" />}
  </BaseButtonIcon>
);

export default ButtonIcon;
