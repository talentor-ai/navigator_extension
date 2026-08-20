import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useProfile } from '@popup:hooks';
import { useSessionStore } from '@popup:store';
import { IUserSessionInfo } from '@popup:models/model.session';

const Profile = () => {
  const { setSession } = useSessionStore();
  const { data, handleFetchUser, isLoading } = useProfile();

  useEffect(() => {
    if (isLoading) return;
    const fetchUserFromToken = async () => {
      await handleFetchUser();
      // @ts-expect-error - Possibly undefined
      const response: IUserSessionInfo = data?.response;
      await setSession(response);
    };
    fetchUserFromToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  return <Outlet />;
};

export default Profile;
