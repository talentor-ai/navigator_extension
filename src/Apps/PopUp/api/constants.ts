// ---------------------------------------- Service path
export const SERVICE_PATH = import.meta.env.REACT_APP_BACKEND_URL || '/';

// ---------------------------------------- API paths
// auth
export const AUTH_PATH = '/auth';
export const LOGIN_PATH = AUTH_PATH + '/login';
export const REGISTER_PATH = AUTH_PATH + '/register';

// Jobs paths
export const JOBS_PATH = '/jobs';
export const APPLY_PATH = JOBS_PATH + '/apply';
