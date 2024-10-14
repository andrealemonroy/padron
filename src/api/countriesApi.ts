import axios from './api';

interface Countries {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchCountries = async (): Promise<Countries[]> => {
    
    const response = await axios.get<Countries[]>(`/country`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching Countries:', error.response || error);
        throw error;
    });

 
  return response.data;
};