import axios from './api';

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
}

interface FormStatus {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface FormType {
  id: number;
  description: string;
  created_at: string;
  updated_at: string;
}

interface FormData {
  id: number;
  description: string;
  user_id: number;
  form_status_id: number;
  form_type_id: number;
  created_at: string;
  updated_at: string;
  user: User;
  form_status: FormStatus;
  form_type: FormType;
}

export const fetchFormUsers = async (): Promise<FormData[]> => {
    
  const response = await axios.get<FormData[]>(`/user-form-api`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching user-form-api:', error.response || error);
      throw error;
  });


return response.data;
};

export const createFormUser = async (userData: Omit<FormData, 'id'>): Promise<FormData> => {
  const response = await axios.post<FormData>(`${import.meta.env.VITE_API_URL}/user-form-api`, {...userData, status: '1' });
  return response.data;
};

export const editFormUser = async (userData: Omit<FormData, 'id'>, id: number): Promise<FormData> => {
  const response = await axios.put<FormData>(`${import.meta.env.VITE_API_URL}/user-form-api/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteFormUser = async (id: number): Promise<FormData> => {
  const response = await axios.delete<FormData>(`${import.meta.env.VITE_API_URL}/user-form-api/${id}`);
  return response.data;
};

export const fetchFormUser = async (id): Promise<FormData> => {
  console.log(id);
  const response = await axios.get<FormData>(`/user-form-api/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching user-form-api:', error.response || error);
      throw error;
  });
return response.data;
};

