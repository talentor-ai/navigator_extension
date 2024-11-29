import { Routes, Route } from 'react-router-dom';
import {
  GENERATE_MANUALLY_PATH,
  HISTORY_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  SETTINGS_PATH,
  SIGNUP_PATH,
} from '@popup:constants/paths';
import { Home, LoginScreen, RegisterScreen } from '@popup:pages';
import ConditionalRedirect from '@popup/hoc/RenderAuthComponent';
import { GeneratePost, NoJobPostMessage } from '@popup/pages/Home/screens';

const authenticatedComponent = (path: string) => {
  let ComponentToRender: any = LoginScreen;
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
      <Route path={MAIN_PATH} element={authenticatedComponent(MAIN_PATH)}>
        <Route index element={<NoJobPostMessage />} />
        <Route path={GENERATE_MANUALLY_PATH} element={<GeneratePost />} />
      </Route>
      <Route path={HISTORY_PATH} element={<p>History</p>} />
      <Route path={SETTINGS_PATH} element={<p>Settings</p>} />

      <Route path={LOGIN_PATH} index element={<LoginScreen />} />
      <Route path={SIGNUP_PATH} element={<RegisterScreen />} />
    </Routes>
  );
};

export default Router;
