import axios from './api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportUsersData = async (data): Promise<any> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-users-data`, data)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching import-users-data:', error.response || error);
        throw error;
    });

 
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportWorkData = async (data): Promise<any> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-worker-data`, data)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching import-worker-data:', error.response || error);
        throw error;
    });

  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportUserBanks = async (data): Promise<any> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-user-banks`, data)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching import-worker-data:', error.response || error);
        throw error;
    });

  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportPensionSystem = async (data): Promise<any> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-pensio-system`, data)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching import-worker-data:', error.response || error);
        throw error;
    });

  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportMasterData = async (data): Promise<any> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-master-data`, data)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching import-users-data:', error.response || error);
      throw error;
  });


return response.data;
};
