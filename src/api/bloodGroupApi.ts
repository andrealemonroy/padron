import axios from './api';

interface IBloodGroup {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchBloodGroup = async (): Promise<IBloodGroup[]> => {
    
    const response = await axios.get<IBloodGroup[]>(`/bloodgroup`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching BloodGroup:', error.response || error);
        throw error;
    });

 
  return response.data;
};