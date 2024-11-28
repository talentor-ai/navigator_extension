import { RecursiveObject } from './default.components';

export interface ApiClientOptions {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  data?: RecursiveObject;
  params?: RecursiveObject;
}
