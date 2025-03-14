import axios from './api';

interface PensionSystem {
  id: number;
  user_id: number;
  pension_system: string;
  commission_type: string;
  cuspp: string;
  status: string;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status_id: number;
  created_at: string;
  updated_at: string;
  entry_status: string | null;
  document_type: string | null;
  document_number: string | null;
  birth_date: string | null;
  project: string | null;
  pension_system: PensionSystem;
}



export const fetchPensionSystemses = async (): Promise<User[]> => {
    
    const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/pension-systems`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching pension-systems:', error.response || error);
        throw error;
    });

 
  return response.data;
};


export const editPensionSystems = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
    const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/pension-systems/${id}`, {...userData, status: '1' });
    return response.data;
};

export const fetchPensionSystems = async (id): Promise<User> => {
    console.log(id);
    const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/pension-systems/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching pension-systems:', error.response || error);
        throw error;
    });
  return response.data;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchPensionLine = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`${import.meta.env.VITE_API_URL}/pension-line`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching pension-line:', error.response || error);
      throw error;
  });


return response.data;
};