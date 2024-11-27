import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faCaretDown,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faGoogle,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { CustomizableComponent } from '../../models';
interface iProps extends CustomizableComponent {
  iconType?: string;
}

const Icons = ({ iconType = '', className = '' }: iProps) => {
  const iconPack = {
    itemMenu: faEllipsis,
    arrowDown: faCaretDown,
    user: faUser,
    linkedin: faLinkedinIn,
    facebook: faFacebookF,
    google: faGoogle,
  };

  return (
    <FontAwesomeIcon
      icon={iconPack[iconType] ?? iconPack.itemMenu}
      className={className}
    />
  );
};

export default Icons;
