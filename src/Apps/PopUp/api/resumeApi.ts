import { baseApi } from './baseApi';
import {
  APPLY_PATH,
  PROFILE_ID,
  RESUME_HISTORY_BY_PROFILE_PATH,
} from './constants';

export interface IApplyToJob {
  jobProfileId: string;
  jobPost: any;
}

export const getResumeHistory = async (jobProfileId: string) => {
  const response = await baseApi({
    url: RESUME_HISTORY_BY_PROFILE_PATH.replace(PROFILE_ID, jobProfileId),
    method: 'GET',
  });
  return response;
};

export const applyToJob = async (body: IApplyToJob) => {
  const response = await baseApi({
    url: APPLY_PATH,
    data: { ...body, name: body?.jobPost?.title || "CV" },
    method: 'POST',
  });
  return response;
};
