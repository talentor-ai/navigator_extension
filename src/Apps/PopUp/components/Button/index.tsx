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
}: IButtonProps) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`relative flex justify-center
         items-center h-boxHeight rounded-2xl
         text-primary font-semibold text-medium cursor-pointer 
         hover:scale-[1.02] w-fit px-6 disabled:bg-txt3 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
