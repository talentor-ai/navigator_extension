import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faCaretDown,
  faUser,
  faPlus,
  faPenToSquare,
  faTrashCan,
  faGlobe,
  faArrowRightFromBracket,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faGithub,
  faGoogle,
  faLinkedin,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { CustomizableComponent } from '../../models';
interface iProps extends CustomizableComponent {
  iconType?: string;
}

const Icons = ({ iconType = '', className = '' }: iProps) => {
  const iconPack: { [key: string]: any } = {
    itemMenu: faEllipsis,
    arrowDown: faCaretDown,
    user: faUser,
    linkedin: faLinkedin,
    linkedIn: faLinkedinIn,
    facebook: faFacebookF,
    google: faGoogle,
    plus: faPlus,
    edit: faPenToSquare,
    delete: faTrashCan,
    github: faGithub,
    portfolio: faGlobe,
    logout: faArrowRightFromBracket,
    print: faPrint,
  };

  return (
    <FontAwesomeIcon
      icon={iconPack[iconType] ?? iconPack.itemMenu}
      className={className}
    />
  );
};

export default Icons;
