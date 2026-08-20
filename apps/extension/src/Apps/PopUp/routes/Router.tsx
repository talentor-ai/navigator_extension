import { Routes, Route } from 'react-router-dom';
import {
  GENERATE_MANUALLY_PATH,
  HISTORY_PATH,
  ID,
  LOGIN_PATH,
  MAIN_PATH,
  PROFILE_CONFIG_PATH,
  PROFILE_SETTINGS_PATH,
  SIGNUP_PATH,
} from '@popup:constants/paths';
import {
  Home,
  LoginScreen,
  RegisterScreen,
  Profile,
  History,
} from '@popup:pages';
import ConditionalRedirect from '@popup/hoc/RenderAuthComponent';
import { GeneratePost, NoJobPostMessage } from '@popup/pages/Home/screens';
import { EditProfileList, ProfileList } from '@popup/pages/Profile/Screens';

const Router = () => {
  return (
    <Routes>
      <Route
        path={MAIN_PATH}
        element={
          <ConditionalRedirect>
            <Home />
          </ConditionalRedirect>
        }
      >
        <Route
          index
          element={
            <ConditionalRedirect>
              <NoJobPostMessage />
            </ConditionalRedirect>
          }
        />
        <Route
          path={GENERATE_MANUALLY_PATH}
          element={
            <ConditionalRedirect>
              <GeneratePost />
            </ConditionalRedirect>
          }
        />
      </Route>
      <Route path={HISTORY_PATH} element={<History />} />
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
      <Route path={SIGNUP_PATH} element={<RegisterScreen />} />
    </Routes>
  );
};

export default Router;
