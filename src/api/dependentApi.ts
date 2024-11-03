import axios from './api';

interface UserDependent {
  user_id: number;
  document_type: string;
  document_number: string;
  document_country: string;
  birth_date: string;
  last_name_father: string;
  last_name_mother: string;
  first_name: string;
  gender: string;
  family_relationship: string;
  relationship_document_type: string;
  relationship_document_number: string;
  conception_month: string;
  created_by: number;
  updated_by: number;
  deleted_by?: number; // Opcional si puede ser null
  status: string;
}


interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  status_id: number;
  created_at: string;
  updated_at: string;
  entry_status: string;
  document_type: string | null;
  document_number: string | null;
  birth_date: string | null;
  project: string | null;
  dependent: UserDependent | null;
}


export const fetchDependents = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/dependent`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching dependent:', error.response || error);
      throw error;
  });


return response.data;
};

export const editDependent = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/dependent/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchDependent= async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/dependent/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching dependent:', error.response || error);
      throw error;
  });
return response.data;
};

