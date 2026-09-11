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
          className="tai:fixed tai:z-10 tai:top-0 tai:left-0 tai:right-0 tai:bottom-0"
          onClick={onClose}
        />
        <ul
          className="tai:bg-secondary tai:w-fit tai:rounded-md tai:absolute tai:top-[80%] tai:right-0 tai:z-20 tai:border
             tai:border-opacity-50 tai:border-txt3"
        >
          {!isEmpty(options) &&
            options.map(({ icon, label, action }: IOption, index: number) => (
              <li
                key={index}
                className="tai:px-4 tai:py-2 tai:border-b tai:border-txt3 tai:border-opacity-50 tai:last:border-none
               tai:hover:text-txt2 tai:cursor-pointer"
                onClick={() => {
                  action();
                  onClose();
                }}
              >
                {icon && <Icons iconType={icon} className="tai:mr-2" />}
                {t(label)}
              </li>
            ))}
        </ul>
      </>
    )
  );
};

export default KebabMenu;
