import axios from './api';

interface FormType {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchFormType = async (): Promise<FormType[]> => {
    
    const response = await axios.get<FormType[]>(`${import.meta.env.VITE_API_URL}/form-type`)
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

