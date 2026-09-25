import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsis,
  faCaretDown,
  faGlobe,
  faPrint,
  faXmark,
  faBriefcase,
  faWandMagicSparkles,
  faArrowsToCircle,
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
    github: faGithub,
    portfolio: faGlobe,
    print: faPrint,
    briefcase: faBriefcase,
    magic: faWandMagicSparkles,
    aim: faArrowsToCircle,
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
