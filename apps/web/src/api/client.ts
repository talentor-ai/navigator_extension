import { createApiClient } from '@talentor/api-client';
import { API_URL } from '../env';

export const api = createApiClient(API_URL);
