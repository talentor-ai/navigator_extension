import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faCaretDown,
  faPlus,
  faPenToSquare,
  faTrashCan,
  faGlobe,
  faPrint,
  faXmark,
  faBriefcase,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebookF,
  faGithub,
  faGoogle,
  faLinkedin,
  faLinkedinIn,
} from '@fortawesome/free-brands-svg-icons';
import { CustomizableComponent } from '@common/models';
interface iProps extends CustomizableComponent {
  iconType?: string;
}

const Icons = ({ iconType = '', className = '' }: iProps) => {
  const iconPack: { [key: string]: any } = {
    default: faEllipsis,
    arrowDown: faCaretDown,
    linkedin: faLinkedin,
    linkedIn: faLinkedinIn,
    facebook: faFacebookF,
    google: faGoogle,
    plus: faPlus,
    edit: faPenToSquare,
    delete: faTrashCan,
    github: faGithub,
    portfolio: faGlobe,
    print: faPrint,
    briefcase: faBriefcase,
    close: faXmark,
  };

  return (
    <FontAwesomeIcon
      icon={iconPack[iconType] ?? iconPack.default}
      className={className}
    />
  );
};

export default Icons;
