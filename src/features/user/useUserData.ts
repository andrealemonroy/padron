import { useQuery } from 'react-query';
import { useAxiosWithAuth } from '../../api/axiosInstance';

const fetchUserData = async () => {
  const api = useAxiosWithAuth();
  const { data } = await api.get('/user');
  return data;
};

export const useUserData = () => {
  return useQuery('user', fetchUserData);
};