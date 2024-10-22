import axios from './api';

interface Incidence {
  id: number;
  user_id: number;
  code: string;
  days: number;
  hours: string;
  amount: string;
  month: string;
  year: string;
  status: string;
  created_by: number;
  updated_by: number;
  deleted_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
  user: User;
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
}

export const fetchIncidences = async (): Promise<Incidence[]> => {
    
  const response = await axios.get<Incidence[]>(`${import.meta.env.VITE_API_URL}/incidences`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching incidences:', error.response || error);
      throw error;
  });


return response.data;
};

export const createIncidence = async (data: Omit<Incidence, 'id'>): Promise<Incidence> => {
  const response = await axios.post<Incidence>(`${import.meta.env.VITE_API_URL}/incidences`, {...data, status: 'A' });
  return response.data;
};

export const editIncidence = async (data: Omit<Incidence, 'id'>, id: number): Promise<Incidence> => {
  const response = await axios.put<Incidence>(`${import.meta.env.VITE_API_URL}/incidences/${id}`, {...data, status: 'A' });
  return response.data;
};

export const deleteIncidence= async (id: number): Promise<Incidence> => {
  const response = await axios.delete<Incidence>(`${import.meta.env.VITE_API_URL}/incidences/${id}`);
  return response.data;
};

export const fetchIncidence = async (id): Promise<Incidence> => {
  console.log(id);
  const response = await axios.get<Incidence>(`${import.meta.env.VITE_API_URL}/incidences/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching incidences:', error.response || error);
      throw error;
  });
return response.data;
};

