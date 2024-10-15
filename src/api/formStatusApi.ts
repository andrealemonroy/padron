import axios from './api';

interface FormStatus {
    id: number;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchFormStatus = async (): Promise<FormStatus[]> => {
    
    const response = await axios.get<FormStatus[]>(`/form-status`)
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

