import axios from './api';

interface FamilyRelationshipType {
  id: number;
  code: string;
  description: string;
}


export const fetchFamilyRelationshipTypes = async (): Promise<FamilyRelationshipType[]> => {
    
  const response = await axios.get<FamilyRelationshipType[]>(`${import.meta.env.VITE_API_URL}/family-relationship-types`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching family-relationship-types:', error.response || error);
      throw error;
  });


return response.data;
};

export const createFamilyRelationshipType = async (userData: Omit<FamilyRelationshipType, 'id'>): Promise<FamilyRelationshipType> => {
  const response = await axios.post<FamilyRelationshipType>(`${import.meta.env.VITE_API_URL}/family-relationship-types`, {...userData, status: '1' });
  return response.data;
};

export const editFamilyRelationshipType = async (userData: Omit<FamilyRelationshipType, 'id'>, id: number): Promise<FamilyRelationshipType> => {
  const response = await axios.put<FamilyRelationshipType>(`${import.meta.env.VITE_API_URL}/family-relationship-types/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteFamilyRelationshipType = async (id: number): Promise<FamilyRelationshipType> => {
  const response = await axios.delete<FamilyRelationshipType>(`${import.meta.env.VITE_API_URL}/family-relationship-types/${id}`);
  return response.data;
};

export const fetchFamilyRelationshipType = async (id): Promise<FamilyRelationshipType> => {
  console.log(id);
  const response = await axios.get<FamilyRelationshipType>(`${import.meta.env.VITE_API_URL}/family-relationship-types/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching family-relationship-types:', error.response || error);
      throw error;
  });
return response.data;
};

