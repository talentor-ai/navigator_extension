import { Routes, Route, Navigate } from 'react-router-dom';
import {
  FOCUS_TASKS_PATH,
  HIGHLIGHTER_CONFIG_PATH,
  LOGIN_PATH,
  MAIN_PATH,
  PROFILE_SETTINGS_PATH,
} from '@modules/popup/constants/paths';
import {
  FocusTasks,
  Highlighter,
  LoginScreen,
  Profile,
} from '@modules/popup/pages';
import ConditionalRedirect from '@modules/popup/hoc/RenderAuthComponent';
import { ProfileList } from '@modules/popup/pages/Profile/Screens';

const Router = () => {
  return (
    <Routes>
      <Route
        path={MAIN_PATH}
        element={<Navigate to={PROFILE_SETTINGS_PATH} replace />}
      />
      <Route path={PROFILE_SETTINGS_PATH} element={<Profile />}>
        <Route
          index
          element={
            <ConditionalRedirect>
              <ProfileList />
            </ConditionalRedirect>
          }
        />
        <Route
          path={HIGHLIGHTER_CONFIG_PATH}
          element={
            <ConditionalRedirect>
              <Highlighter />
            </ConditionalRedirect>
          }
        />
      </Route>
      <Route
        path={FOCUS_TASKS_PATH}
        element={
          <ConditionalRedirect>
            <FocusTasks />
          </ConditionalRedirect>
        }
      />

      <Route path={LOGIN_PATH} index element={<LoginScreen />} />

      {/* Retired or unknown paths (e.g. the old `/profile/config` routes). */}
      <Route
        path="*"
        element={<Navigate to={PROFILE_SETTINGS_PATH} replace />}
      />
    </Routes>
  );
};

export default Router;
