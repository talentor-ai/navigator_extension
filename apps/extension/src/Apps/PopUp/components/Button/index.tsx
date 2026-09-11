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
      className={`tai:relative tai:flex tai:justify-center
         tai:items-center tai:h-boxHeight tai:rounded-2xl
         tai:text-primary tai:font-semibold tai:text-medium tai:cursor-pointer 
         tai:hover:scale-[1.02] tai:w-fit tai:px-6 tai:disabled:bg-txt3 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
