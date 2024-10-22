import axios from './api';

interface QualityRatings {
  id: number;
  code: string;
  description: string;
}


export const fetchQualityRatings = async (): Promise<QualityRatings[]> => {
    
  const response = await axios.get<QualityRatings[]>(`${import.meta.env.VITE_API_URL}/quality-ratings`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching quality-ratings:', error.response || error);
      throw error;
  });


return response.data;
};

export const createQualityRating = async (userData: Omit<QualityRatings, 'id'>): Promise<QualityRatings> => {
  const response = await axios.post<QualityRatings>(`${import.meta.env.VITE_API_URL}/quality-ratings`, {...userData, status: '1' });
  return response.data;
};

export const editQualityRating = async (userData: Omit<QualityRatings, 'id'>, id: number): Promise<QualityRatings> => {
  const response = await axios.put<QualityRatings>(`${import.meta.env.VITE_API_URL}/quality-ratings/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteQualityRating = async (id: number): Promise<QualityRatings> => {
  const response = await axios.delete<QualityRatings>(`${import.meta.env.VITE_API_URL}/quality-ratings/${id}`);
  return response.data;
};

export const fetchQualityRating = async (id): Promise<QualityRatings> => {
  const response = await axios.get<QualityRatings>(`${import.meta.env.VITE_API_URL}/quality-ratings/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching quality-ratings:', error.response || error);
      throw error;
  });
return response.data;
};

