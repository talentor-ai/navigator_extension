import { useTranslation } from 'react-i18next';
import { Icons } from '@popup:components';
import { isEmpty } from 'lodash';

interface IOption {
  label: string;
  icon: string;
  action: () => void;
}
interface iProps {
  icon?: string;
  isOpen?: boolean;
  options?: IOption[];
  onClose: () => void;
}

const KebabMenu = ({ isOpen, onClose, options = [] }: iProps) => {
  const { t } = useTranslation();

  return (
    isOpen && (
      <>
        <div
          className="fixed z-10 top-0 left-0 right-0 bottom-0"
          onClick={onClose}
        />
        <ul
          className="bg-secondary w-fit rounded-md absolute top-[80%] right-0 z-20 border
             border-opacity-50 border-txt3"
        >
          {!isEmpty(options) &&
            options.map(({ icon, label, action }: IOption, index: number) => (
              <li
                key={index}
                className="px-4 py-2 border-b border-txt3 border-opacity-50 last:border-none
               hover:text-txt2 cursor-pointer"
                onClick={() => {
                  action();
                  onClose();
                }}
              >
                {icon && <Icons iconType={icon} className="mr-2" />}
                {t(label)}
              </li>
            ))}
        </ul>
      </>
    )
  );
};

export default KebabMenu;
