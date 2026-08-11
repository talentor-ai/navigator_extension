import { baseApi } from '@popup:api';
import { JOB_PROFILE_ID, USER_JOB_PROFILE_PATH_SELECTED } from './constants';

export const deleteJobProfileApi = async (jobProfileId: string) => {
  const response = await baseApi({
    url: USER_JOB_PROFILE_PATH_SELECTED.replace(JOB_PROFILE_ID, jobProfileId),
    method: 'DELETE',
  });
  return response;
};
