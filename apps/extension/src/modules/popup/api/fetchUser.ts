import { USER_PATH } from './constants';
import { baseApi } from './baseApi';

export const getUserApi = async () => {
  const response = await baseApi({ url: USER_PATH, method: 'GET' });
  return response;
};
