import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// baseURL: 'http://172.18.2.16:3000', // AG
// baseURL: "http://172.18.2.17:3001", // Ashok
// baseURL: 'http://localhost:3000', // Vinit

// export const BASE_URL = 'http://172.18.2.16:3000';
// export const BASE_URL = 'http://localhost:3000';
export const BASE_URL = import.meta.env.VITE_API_URL;
console.log('Base url', BASE_URL);

const apiClient = axios.create({
  baseURL: `${BASE_URL}`,
  withCredentials: true,
});

export const useAxiosWithAuth = () => {
  const { token } = useAuth();

  apiClient.interceptors.request.use(
    (config) => {
      if (token) {
        config.withCredentials = true;
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  apiClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
  );

  return apiClient;
};

export default apiClient;
