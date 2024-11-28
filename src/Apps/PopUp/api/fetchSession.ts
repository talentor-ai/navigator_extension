import { baseApi, REGISTER_PATH } from '@popup:api';
import { LOGIN_PATH } from '@popup:constants/paths';
import { ILoginRequest, IUserSessionInfo } from '@popup:models/model.session';

export const loginApi = (data: ILoginRequest) =>
  baseApi({ url: LOGIN_PATH, method: 'POST', data });

export const registerApi = (data: IUserSessionInfo) =>
  baseApi({ url: REGISTER_PATH, method: 'POST', data });
