import axios from './api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportUsersData = async (data): Promise<any> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`/import-users-data`, data)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching import-users-data:', error.response || error);
        throw error;
    });

 
  return response.data;
};

