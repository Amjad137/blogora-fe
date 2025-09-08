import { useAuthStore } from '@/stores/auth.store';
import axios from 'axios';
import { environment } from './env.config';

const Axios = axios.create({
  baseURL: environment.apiURL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});

Axios.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) return config;

    try {
      const token = useAuthStore.getState().token; // Get the user from the auth store

      config.headers.Authorization = `Bearer ${token}`;
    } catch (error) {
      console.warn('Token retrieval error:', error);
    }

    return config;
  },
  (error) => Promise.reject(new Error(error)),
);

export default Axios;
