import { baseApi } from '@popup:api';
import { UserJobProfile } from '@popup:models/model.user';
import { USER_JOB_PROFILE_PATH } from './constants';

export const updateJobProfileApi = async (data: UserJobProfile) => {
  const response = await baseApi({
    url: USER_JOB_PROFILE_PATH,
    method: 'PUT',
    data,
  });
  return response;
};

export const createJobProfileApi = async (data: UserJobProfile) => {
  const response = await baseApi({
    url: USER_JOB_PROFILE_PATH,
    method: 'POST',
    data,
  });
  return response;
};
