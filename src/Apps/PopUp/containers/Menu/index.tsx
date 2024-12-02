import { noLoginRoutes, authenticatedRoutes } from '@popup/routes';
import { Box } from '../../components';
import useMenu from './hooks/useMenu';
import styles from './menu.module.css';
import { useSessionStore } from '@popup:store';

const Menu = () => {
  const { picked, width, left } = useMenu();
  const { token } = useSessionStore();
  const routes = token ? authenticatedRoutes : noLoginRoutes;

  return (
    <Box className={styles.menuList} id="menuContainer" containerMode>
      {routes.length > 0 &&
        routes.map(({ path, label }, index) => (
          <Box
            id={'menu-' + path}
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
