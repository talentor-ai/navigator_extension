// ---------------------------------------- Service path
export const SERVICE_PATH = import.meta.env.VITE_SERVICE_URL || '/';
export const WEB_URL = import.meta.env.VITE_WEB_URL || 'http://localhost:5173';
export const BASE_PATH = '/api/v1';

// Params to replace in the path
export const JOB_PROFILE_ID = ':jobProfileId';

// ---------------------------------------- API paths
// auth
export const AUTH_PATH = BASE_PATH + '/auth';
export const LOGIN_PATH = AUTH_PATH + '/login';

// User paths
export const USER_PATH = BASE_PATH + '/user';
export const USER_JOB_PROFILE_PATH = USER_PATH + '/job-profile';
export const USER_JOB_PROFILE_PATH_SELECTED =
  USER_PATH + '/job-profile/' + JOB_PROFILE_ID;

// Profiles paths
export const PROFILES_PATH = BASE_PATH + '/profiles';
