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
          className="ik-fixed ik-z-10 ik-top-0 ik-left-0 ik-right-0 ik-bottom-0"
          onClick={onClose}
        />
        <ul
          className="ik-bg-secondary ik-w-fit ik-rounded-md ik-absolute ik-top-[80%] ik-right-0 ik-z-20 ik-border
             ik-border-opacity-50 ik-border-txt3"
        >
          {!isEmpty(options) &&
            options.map(({ icon, label, action }: IOption, index: number) => (
              <li
                key={index}
                className="ik-px-4 ik-py-2 ik-border-b ik-border-txt3 ik-border-opacity-50 ik-last:border-none
               hover:text-txt2 cursor-pointer"
                onClick={() => {
                  action();
                  onClose();
                }}
              >
                {icon && <Icons iconType={icon} className="ik-mr-2" />}
                {t(label)}
              </li>
            ))}
        </ul>
      </>
    )
  );
};

export default KebabMenu;
