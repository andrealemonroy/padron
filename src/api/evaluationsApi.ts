import axios from './api';

interface Evaluations {
  id: number;
  user_id: number;
  evaluation_date: string;
  predefined_options: string;
  details: string;
  coordinator_id: number;
  status: string;
}


export const fetchEvaluations = async (): Promise<Evaluations[]> => {
    
  const response = await axios.get<Evaluations[]>(`${import.meta.env.VITE_API_URL}/evaluations`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching Evaluations:', error.response || error);
      throw error;
  });


return response.data;
};

export const createEvaluation = async (userData: Omit<Evaluations, 'id'>): Promise<Evaluations> => {
  const response = await axios.post<Evaluations>(`${import.meta.env.VITE_API_URL}/evaluations`, {...userData, status: '1' });
  return response.data;
};

export const editEvaluation = async (userData: Omit<Evaluations, 'id'>, id: number): Promise<Evaluations> => {
  const response = await axios.put<Evaluations>(`${import.meta.env.VITE_API_URL}/evaluations/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteEvaluation = async (id: number): Promise<Evaluations> => {
  const response = await axios.delete<Evaluations>(`${import.meta.env.VITE_API_URL}/evaluations/${id}`);
  return response.data;
};

export const fetchEvaluation = async (id): Promise<Evaluations> => {
  console.log(id);
  const response = await axios.get<Evaluations>(`${import.meta.env.VITE_API_URL}/evaluations/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching evaluations:', error.response || error);
      throw error;
  });
return response.data;
};

