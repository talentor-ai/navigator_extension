import { CustomizableComponent } from '@common/models';
import Icons from '../Icons';

type ButtonFontWeight = 'normal' | 'medium' | 'semibold';
type ButtonTextSize = 'small' | 'medium' | 'large';

interface IButtonProps extends CustomizableComponent {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  fontWeight?: ButtonFontWeight;
  textSize?: ButtonTextSize;
  onClick?: () => void;
  disabled?: boolean;
}

const FONT_WEIGHT_CLASSES: Record<ButtonFontWeight, string> = {
  normal: 'tai:font-normal',
  medium: 'tai:font-medium',
  semibold: 'tai:font-semibold',
};

const TEXT_SIZE_CLASSES: Record<ButtonTextSize, string> = {
  small: 'tai:text-small',
  medium: 'tai:text-medium',
  large: 'tai:text-large',
};

const Button = ({
  children,
  type = 'button',
  icon,
  fontWeight = 'semibold',
  textSize = 'medium',
  onClick = () => {},
  disabled = false,
  className = '',
  style = {},
}: IButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      style={style}
      className={`tai:relative tai:flex tai:justify-center
         tai:items-center tai:gap-2 tai:h-boxHeight tai:rounded-xl
         tai:text-primary ${FONT_WEIGHT_CLASSES[fontWeight]} ${TEXT_SIZE_CLASSES[textSize]} tai:cursor-pointer 
         tai:hover:scale-[1.02] tai:w-fit tai:px-3 tai:disabled:bg-txt3 ${className}`}
      onClick={onClick}
    >
      {icon && <Icons iconType={icon} />}
      {children}
    </button>
  );
};

export default Button;
