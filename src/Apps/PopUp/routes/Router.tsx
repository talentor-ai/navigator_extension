import { Routes, Route, Navigate } from 'react-router-dom';
import {
  AUTH_PATH,
  HISTORY_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  SETTINGS_PATH,
  SIGNUP_PATH,
} from '@popup:constants/paths';
import { Home, LoginScreen, RegisterScreen } from '@popup:pages';
import ConditionalRedirect from '@popup/hoc/RenderAuthComponent';

const authenticatedComponent = (path: string) => {
  let ComponentToRender = LoginScreen;
  switch (path) {
    case MAIN_PATH:
      ComponentToRender = Home;
      break;
    default:
      ComponentToRender = LoginScreen;
      break;
  }
  return (
    <ConditionalRedirect>
      <ComponentToRender />
    </ConditionalRedirect>
  );
};

const Router = () => {
  return (
    <Routes>
      <Route
        path={MAIN_PATH}
        index
        element={authenticatedComponent(MAIN_PATH)}
      />
      <Route path={HISTORY_PATH} element={<p>History</p>} />
      <Route path={SETTINGS_PATH} element={<p>Settings</p>} />

      <Route path={LOGIN_PATH} index element={<LoginScreen />} />
      <Route path={SIGNUP_PATH} element={<RegisterScreen />} />
    </Routes>
  );
};

export default Router;
