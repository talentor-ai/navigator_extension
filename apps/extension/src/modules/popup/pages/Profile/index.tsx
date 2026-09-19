import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { isEmpty } from 'lodash';
import { useProfile } from '@modules/popup/hooks';
import { useSessionStore } from '@modules/popup/store';
import { IUserSessionInfo } from '@modules/popup/models/model.session';

const Profile = () => {
  const setSession = useSessionStore((s) => s.setSession);
  const storedSession = useSessionStore((s) => s.session);
  const storedId = storedSession?.id;
  const { data } = useProfile();

  const response = (data as { response?: IUserSessionInfo } | undefined)
    ?.response;
  const responseId = response?.id ?? '';

  useEffect(() => {
    if (isEmpty(response) || isEmpty(responseId)) return;
    if (storedId === responseId) return;
    setSession({ ...storedSession, ...response } as IUserSessionInfo);
  }, [response, responseId, storedId, storedSession, setSession]);

  return <Outlet />;
};

export default Profile;
