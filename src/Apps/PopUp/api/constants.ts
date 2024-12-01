// ---------------------------------------- Service path
export const SERVICE_PATH = import.meta.env.VITE_SERVICE_URL || '/';
export const BASE_PATH = '/api/v1';

// ---------------------------------------- API paths
// auth
export const AUTH_PATH = BASE_PATH + '/auth';
export const LOGIN_PATH = AUTH_PATH + '/login';
export const REGISTER_PATH = AUTH_PATH + '/register';

// Jobs paths
export const JOBS_PATH = '/jobs';
export const APPLY_PATH = JOBS_PATH + '/apply';

// User paths
export const USER_PATH = BASE_PATH + '/user';
