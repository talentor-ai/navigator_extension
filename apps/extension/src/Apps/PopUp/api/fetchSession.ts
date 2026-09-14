import { baseApi, LOGIN_PATH } from '@popup:api';
import { ILoginRequest } from '@popup:models/model.session';

export const loginApi = async (data: ILoginRequest) => {
  const response = await baseApi({ url: LOGIN_PATH, method: 'POST', data });
  return response;
};
