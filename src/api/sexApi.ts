import axios from './api';

interface Sex {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchSex = async (): Promise<Sex[]> => {
    
    const response = await axios.get<Sex[]>(`${import.meta.env.VITE_API_URL}/sex`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching Sex:', error.response || error);
        throw error;
    });

 
  return response.data;
};