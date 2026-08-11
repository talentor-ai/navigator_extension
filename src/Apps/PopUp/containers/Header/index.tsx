import { ProfileInfo } from '../../components';
import Menu from '../Menu';

const Header = () => {
  return (
    <header>
      <ProfileInfo />
      <div className="ik-block">
        <Menu />
      </div>
    </header>
  );
};

export default Header;
