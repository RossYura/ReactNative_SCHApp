import axios from 'axios';
import { API_URL } from '@env';

export const getApiUrl = () => {
  const envApiUrl = (process.env as any).API_URL;
  if (envApiUrl && envApiUrl.length) {
    return envApiUrl;
  }
  console.warn('No process.env.API_URL present, falling back to API url from .env file');
  return API_URL;
};

const api = axios.create({
  baseURL: getApiUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
