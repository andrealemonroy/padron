import axios from './api';

interface Contract {
  id: number;
  code: string;
  name: string;
  client: string;
  start_date: string;
  end_date: string;
  status: number;
}


export const fetchContracts = async (): Promise<Contract[]> => {
    
  const response = await axios.get<Contract[]>(`/contracts`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching Contracts:', error.response || error);
      throw error;
  });


return response.data;
};

export const createContract = async (userData: Omit<Contract, 'id'>): Promise<Contract> => {
  const response = await axios.post<Contract>(`${import.meta.env.VITE_API_URL}/contracts`, {...userData, status: '1' });
  return response.data;
};

export const editContract = async (userData: Omit<Contract, 'id'>, id: number): Promise<Contract> => {
  const response = await axios.put<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteContract = async (id: number): Promise<Contract> => {
  const response = await axios.delete<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`);
  return response.data;
};

export const fetchContract = async (id): Promise<Contract> => {
  console.log(id);
  const response = await axios.get<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching Contracts:', error.response || error);
      throw error;
  });
return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchHealthEntity = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/health-entity`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching fetchHealthEntity:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTypeWorker = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/type-worker`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching fetchTypeWorker:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchHealthType = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/health-type`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching health-type:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchcessationReasons = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/cessation-reasons`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching reasons:', error.response || error);
      throw error;
  });


return response.data;
};
