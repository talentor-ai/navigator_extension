import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@popup:api';
import { useSessionStore } from '@popup:store';
import { ILoginRequest, IUserSessionInfo } from '@popup:models/model.session';

const useSession = () => {
  const { setSession } = useSessionStore();

  return useMutation({
    // @ts-expect-error - Not 100% sure why this is throwing an error
    mutationFn: (data: ILoginRequest) => loginApi(data),
    onSuccess: (data: IUserSessionInfo) => {
      setSession(data);
    },
    onError: (error) => {
      console.error('Login error', error);
    },
  });
};

export default useSession;
