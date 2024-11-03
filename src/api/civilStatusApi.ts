import axios from './api';

interface ICivilStatus {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchCivilStatus = async (): Promise<ICivilStatus[]> => {
    
    const response = await axios.get<ICivilStatus[]>(`${import.meta.env.VITE_API_URL}/civilstatus`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching CivilStatus:', error.response || error);
        throw error;
    });

 
  return response.data;
};