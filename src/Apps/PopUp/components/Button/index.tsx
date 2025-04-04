import { CustomizableComponent } from '@popup:models/default.components';

interface IButtonProps extends CustomizableComponent {
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
  icon?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  children,
  type = 'button',
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
      className={`ik-relative ik-flex ik-justify-center
         ik-items-center ik-h-boxHeight ik-rounded-2xl
         ik-text-primary ik-font-semibold ik-text-medium ik-cursor-pointer 
         hover:ik-scale-[1.02] ik-w-fit ik-px-6 disabled:ik-bg-txt3 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
