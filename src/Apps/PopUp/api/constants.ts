// ---------------------------------------- Service path
export const SERVICE_PATH = import.meta.env.VITE_SERVICE_URL || '/';
export const BASE_PATH = '/api/v1';

// Params to replace in the path
export const PROFILE_ID = ':profileId';
export const JOB_PROFILE_ID = ':jobProfileId';

// ---------------------------------------- API paths
// auth
export const AUTH_PATH = BASE_PATH + '/auth';
export const LOGIN_PATH = AUTH_PATH + '/login';
export const REGISTER_PATH = AUTH_PATH + '/register';

// Jobs paths
export const JOBS_PATH = BASE_PATH + '/jobs';
export const APPLY_PATH = JOBS_PATH + '/apply';

// User paths
export const USER_PATH = BASE_PATH + '/user';
export const USER_JOB_PROFILE_PATH = USER_PATH + '/job-profile';
export const USER_JOB_PROFILE_PATH_SELECTED =
  USER_PATH + '/job-profile/' + JOB_PROFILE_ID;

// Resume paths
export const RESUME_PATH = BASE_PATH + '/resume';
export const RESUME_HISTORY_BY_PROFILE_PATH =
  RESUME_PATH + '/history/' + PROFILE_ID;
export const RESUME_DOWNLOAD_PATH = RESUME_PATH + '/download/' + PROFILE_ID;
