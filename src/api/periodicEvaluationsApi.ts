import axios from './api';

interface PeriodicEvaluations {
  id: number;
  user_id: number;
  period: string;
  date: string;
  rating: string;
  development_quality: number;
  software_management: number;
  learning_capacity: number;
  process_compliance: number;
  coordinator_id: number;
  status: string;
}


export const fetchPeriodicEvaluations = async (): Promise<PeriodicEvaluations[]> => {
    
  const response = await axios.get<PeriodicEvaluations[]>(`/periodic-evaluations`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching PeriodicEvaluations:', error.response || error);
      throw error;
  });


return response.data;
};

export const createPeriodicEvaluation = async (userData: Omit<PeriodicEvaluations, 'id'>): Promise<PeriodicEvaluations> => {
  const response = await axios.post<PeriodicEvaluations>(`${import.meta.env.VITE_API_URL}/periodic-evaluations`, {...userData, status: '1' });
  return response.data;
};

export const editPeriodicEvaluation = async (userData: Omit<PeriodicEvaluations, 'id'>, id: number): Promise<PeriodicEvaluations> => {
  const response = await axios.put<PeriodicEvaluations>(`${import.meta.env.VITE_API_URL}/periodic-evaluations/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deletePeriodicEvaluation = async (id: number): Promise<PeriodicEvaluations> => {
  const response = await axios.delete<PeriodicEvaluations>(`${import.meta.env.VITE_API_URL}/periodic-evaluations/${id}`);
  return response.data;
};

export const fetchPeriodicEvaluation = async (id): Promise<PeriodicEvaluations> => {
  console.log(id);
  const response = await axios.get<PeriodicEvaluations>(`/periodic-evaluations/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching periodic-evaluations:', error.response || error);
      throw error;
  });
return response.data;
};

