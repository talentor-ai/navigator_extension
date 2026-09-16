import { baseApi, LOGIN_PATH } from '@modules/popup/api';
import { ILoginRequest } from '@modules/popup/models/model.session';

export const loginApi = async (data: ILoginRequest) => {
  const response = await baseApi({ url: LOGIN_PATH, method: 'POST', data });
  return response;
};
