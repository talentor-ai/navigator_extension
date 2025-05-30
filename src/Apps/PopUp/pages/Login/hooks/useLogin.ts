import { useMutation } from '@tanstack/react-query';
import { loginApi } from '@popup:api';
import { useSessionStore } from '@popup:store';
import { ILoginRequest, IUserSessionInfo } from '@popup:models/model.session';
import { useNavigate } from 'react-router-dom';
import { MAIN_PATH } from '@popup:constants/paths';
import { isEmpty } from 'lodash';

interface IUseSessionResponse {
  response: {
    user: IUserSessionInfo;
    token: string;
  };
}

const useLogin = () => {
  const { setSession, setToken } = useSessionStore();
  const navigate = useNavigate();

  return useMutation({
    // @ts-expect-error - Not 100% sure why this is throwing an error
    mutationFn: (data: ILoginRequest) => loginApi(data),
    onSuccess: ({ response }: IUseSessionResponse) => {
      if (isEmpty(response?.user) || !response?.token) return;
      setSession(response.user);
      setToken(response.token);
      navigate(MAIN_PATH);
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error('Login error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    },
  });
};

export default useLogin;
