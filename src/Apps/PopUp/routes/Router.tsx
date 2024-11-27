import { Routes, Route } from 'react-router-dom';
import { Login } from '../pages';
import {
  HISTORY_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  SETTINGS_PATH,
  SIGNUP_PATH,
} from '../constants/paths';

export const routes = [
  {
    path: MAIN_PATH,
    label: 'Generate',
  },
  {
    path: HISTORY_PATH,
    label: 'History',
  },
  {
    path: SETTINGS_PATH,
    label: 'Settings',
  },
];

export const noLoginRoutes = [
  {
    path: LOGIN_PATH,
    label: 'Login',
  },
  {
    path: SIGNUP_PATH,
    label: 'Sign Up',
  },
];

const Router = () => {
  return (
    <Routes>
      <Route path={MAIN_PATH} element={<Login />} />
      {/* <Route index element={<Home />} /> */}
      <Route path={HISTORY_PATH} element={<p>History</p>} />
      <Route path={SETTINGS_PATH} element={<p>Settings</p>} />

      <Route path={LOGIN_PATH} element={<Login />} />
      <Route path={SIGNUP_PATH} element={<Login />} />
    </Routes>
  );
};

export default Router;
