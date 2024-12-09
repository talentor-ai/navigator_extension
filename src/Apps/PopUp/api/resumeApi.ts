import { baseApi } from './baseApi';
import { PROFILE_ID, RESUME_HISTORY_BY_PROFILE_PATH } from './constants';

export const getResumeHistory = async (jobProfileId: string) => {
  const response = await baseApi({
    url: RESUME_HISTORY_BY_PROFILE_PATH.replace(PROFILE_ID, jobProfileId),
    method: 'GET',
  });
  return response;
};
