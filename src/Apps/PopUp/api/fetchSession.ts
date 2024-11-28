import { baseApi, LOGIN_PATH, REGISTER_PATH } from '@popup:api';
import { ILoginRequest, IUserSessionInfo } from '@popup:models/model.session';

export const loginApi = async (data: ILoginRequest) => {
  const response = await baseApi({ url: LOGIN_PATH, method: 'POST', data });
  return response;
};

export const registerApi = (data: IUserSessionInfo) =>
  baseApi({ url: REGISTER_PATH, method: 'POST', data });
