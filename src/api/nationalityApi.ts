import axios from './api';

interface Nationality {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchNationality = async (): Promise<Nationality[]> => {
    
    const response = await axios.get<Nationality[]>(`${import.meta.env.VITE_API_URL}/nationality`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching nationality:', error.response || error);
        throw error;
    });

 
  return response.data;
};

