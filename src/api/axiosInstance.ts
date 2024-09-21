import axios from 'axios';
import { RootState } from '../app/store'; // Use your correct path for the store
import { useSelector } from 'react-redux';

const api = axios.create({
  baseURL: 'https://api.yourservice.com', // Replace with your API base URL
});

export const useAxiosWithAuth = () => {
  const token = useSelector((state: RootState) => state.auth.token);

  api.interceptors.request.use((config) => {
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });

  return api;
};