import { Icons } from '@popup:components';

interface ButtonIconProps {
   icon?: string;
}

const ButtonIcon = ({ icon }: ButtonIconProps) => {
   return (
      <button className="w-boxHeight h-boxHeight border border-transparent border-solid
            flex justify-center items-center text-txt2 cursor-pointer rounded-full bg-secondary
            hover:border-tertiary duration-200">
         {icon && <Icons iconType={icon} className='text-icon' />}
      </button>
   );
};

export default ButtonIcon;
