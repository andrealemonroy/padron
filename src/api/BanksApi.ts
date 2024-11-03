import axios from './api';

interface Bank {
  id: number;
  code: number;
  description: string;
}

export const fetchBanks = async (): Promise<Bank[]> => {
    
    const response = await axios.get<Bank[]>(`${import.meta.env.VITE_API_URL}/banks`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching banks:', error.response || error);
        throw error;
    });

 
  return response.data;
};

