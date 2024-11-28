import axios from 'axios';
import { SERVICE_PATH } from '@popup:api';
import { ApiClientOptions } from '@popup:models/model.api';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: SERVICE_PATH, // Replace with your API base URL
  timeout: 10000, // Optional: Set a timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor (optional: add tokens, etc.)
axiosInstance.interceptors.request.use(
  (config) => {
    // Add authentication token or any custom headers here
    // config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor (optional: handle global responses or errors)
axiosInstance.interceptors.response.use(
  (response) => {
    return response.data; // Return only the data for cleaner API calls
  },
  (error) => {
    // Handle errors globally
    const customError = {
      message: error.response?.data?.message || 'Something went wrong',
      status: error.response?.status,
      data: error.response?.data,
    };
    return Promise.reject(customError);
  },
);

/**
 * Generic query function for TanStack Query
 * @param {string} url - The API endpoint
 * @param {Object} options - Optional Axios configuration (method, data, params)
 * @returns {Promise<any>}
 */
const baseApi = async ({
  url,
  method = 'GET',
  data,
  params,
}: ApiClientOptions) => {
  const response = await axiosInstance({
    url,
    method,
    data: data || {},
    params: params || {},
  });
  return response; // Response is already unpacked in axiosInstance
};

export { baseApi };
