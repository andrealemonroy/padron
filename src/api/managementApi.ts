import axios from './api';

export const fetchManagement = async (id): Promise<any> => {
    const response = await axios.get<any>(`${import.meta.env.VITE_API_URL}/user-status/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching Management:', error.response || error);
        throw error;
    });
  return response.data;
  };
  

  export const editManagement = async (userData: Omit<any, 'id'>, id: number): Promise<any> => {
    const response = await axios.put<any>(`${import.meta.env.VITE_API_URL}/user-status/${id}`, userData);
    return response.data;
  };