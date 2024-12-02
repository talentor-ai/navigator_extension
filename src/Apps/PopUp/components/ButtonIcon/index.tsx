import { Icons } from '@popup:components';

interface ButtonIconProps {
  icon?: string;
  disabled?: boolean;
}

const ButtonIcon = ({ icon, disabled = false }: ButtonIconProps) => {
  return (
    <button
      disabled={disabled}
      className="w-boxHeight h-boxHeight border border-transparent border-solid
            flex justify-center items-center text-txt2 cursor-pointer rounded-full bg-secondary
            hover:border-tertiary duration-200 disabled:text-txt3 disabled:cursor-not-allowed"
    >
      {icon && <Icons iconType={icon} className="text-icon" />}
    </button>
  );
};

export default ButtonIcon;
