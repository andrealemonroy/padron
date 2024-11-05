import axios from './api';

interface IOccupations {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchOccupations = async (): Promise<IOccupations[]> => {
    
    const response = await axios.get<IOccupations[]>(`${import.meta.env.VITE_API_URL}/occupation`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching Occupations:', error.response || error);
        throw error;
    });

 
  return response.data;
};