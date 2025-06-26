import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY || process.env.DIFY_API_KEY;
const DIFY_API_URL = process.env.NEXT_PUBLIC_DIFY_API_URL || process.env.DIFY_API_URL;

if (!DIFY_API_KEY) {
  console.warn('Peringatan: Kunci API Dify (DIFY_API_KEY) tidak disetel di environment variables.');
}
if (!DIFY_API_URL) {
  console.warn('Peringatan: Api URL Dify (DIFY_API_URL) tidak disetel di environment variables.');
}

const difyClient: AxiosInstance = axios.create({
  baseURL: DIFY_API_URL,
  headers: {
    Authorization: `Bearer ${DIFY_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

difyClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error: AxiosError) => {
    console.error('Dify Request Error:', error);
    return Promise.reject(error);
  },
);

difyClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    console.error(
      'Dify Response Error:',
      error.response?.status,
      error.response?.data || error.message,
    );
    return Promise.reject(error);
  },
);

export default difyClient;
