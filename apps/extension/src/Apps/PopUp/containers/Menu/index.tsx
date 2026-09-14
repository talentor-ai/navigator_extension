import { authenticatedRoutes } from '@popup/routes';
import { Box } from '../../components';
import useMenu from './hooks/useMenu';
import styles from './menu.module.css';
import { useSessionStore } from '@popup:store';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const Menu = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { picked, width, left } = useMenu();
  const { token } = useSessionStore();
  const routes = authenticatedRoutes;
  const restoredPath = useRef(false);

  // Redirect to the last visited page
  useEffect(() => {
    if (!token) return;
    const timeoutId = window.setTimeout(() => {
      try {
        localStorage.setItem('current-path', pathname);
      } catch (e) {
        console.error(e);
      }
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname, token]);

  useEffect(() => {
    if (restoredPath.current) return;
    if (!token) return;
    restoredPath.current = true;

    const lastPath = localStorage.getItem('current-path');
    if (
      lastPath &&
      lastPath !== pathname &&
      authenticatedRoutes.some((r) => r.path === lastPath)
    ) {
      navigate(lastPath);
    }
  }, [navigate, pathname, token]);

  if (!token) return null;

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
