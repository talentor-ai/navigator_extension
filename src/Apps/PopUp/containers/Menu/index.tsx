import { noLoginRoutes } from '@popup/routes';
import { Box } from '../../components';
import useMenu from './hooks/useMenu';
import styles from './menu.module.css';

const Menu = () => {
  const { picked, width, left, handleClick } = useMenu();

  return (
    <Box className={styles.menuList} id="menuContainer" containerMode>
      {noLoginRoutes.map(({ path, label }, index) => (
        <Box
          onClick={(e) => handleClick(e, index)}
          key={path + index}
          boxType="navLink"
          className={`${styles.menuLink} ${
            picked === index && styles.linkActive
          }`}
          to={path}
        >
          {label}
        </Box>
      ))}
      <Box
        style={{ width, left }}
        className={styles.menuSelected}
        containerMode
      />
    </Box>
  );
};

export default Menu;
