import axios from './api';

interface QualityRatings {
  id: number;
  code: string;
  description: string;
}


export const fetchQuality = async (): Promise<QualityRatings[]> => {
    
  const response = await axios.get<QualityRatings[]>(`${import.meta.env.VITE_API_URL}/qualirfication`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching qualirfication:', error.response || error);
      throw error;
  });


return response.data;
};

export const createQuality= async (userData: Omit<QualityRatings, 'id'>): Promise<QualityRatings> => {
  const response = await axios.post<QualityRatings>(`${import.meta.env.VITE_API_URL}/qualirfication`, {...userData, status: '1' });
  return response.data;
};

export const editQuality = async (userData: Omit<QualityRatings, 'id'>, id: number): Promise<QualityRatings> => {
  const response = await axios.put<QualityRatings>(`${import.meta.env.VITE_API_URL}/qualirfication/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteQuality = async (id: number): Promise<QualityRatings> => {
  const response = await axios.delete<QualityRatings>(`${import.meta.env.VITE_API_URL}/qualirfication/${id}`);
  return response.data;
};

export const fetchQualitys = async (id): Promise<QualityRatings> => {
  const response = await axios.get<QualityRatings>(`${import.meta.env.VITE_API_URL}/qualirfication/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching qualirfication:', error.response || error);
      throw error;
  });
return response.data;
};

