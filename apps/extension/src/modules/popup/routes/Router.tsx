import { Routes, Route, Navigate } from 'react-router-dom';
import {
  ID,
  LOGIN_PATH,
  MAIN_PATH,
  PROFILE_CONFIG_PATH,
  PROFILE_SETTINGS_PATH,
} from '@modules/popup/constants/paths';
import { LoginScreen, Profile } from '@modules/popup/pages';
import ConditionalRedirect from '@modules/popup/hoc/RenderAuthComponent';
import {
  EditProfileList,
  ProfileList,
} from '@modules/popup/pages/Profile/Screens';

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
          path={PROFILE_CONFIG_PATH}
          element={
            <ConditionalRedirect>
              <EditProfileList />
            </ConditionalRedirect>
          }
        />
        <Route
          path={`${PROFILE_CONFIG_PATH}/${ID}`}
          element={
            <ConditionalRedirect>
              <EditProfileList />
            </ConditionalRedirect>
          }
        />
      </Route>

      <Route path={LOGIN_PATH} index element={<LoginScreen />} />
    </Routes>
  );
};

export default Router;
