import axios from './api';

interface EducationDetails {
  user_id: number;
  graduation_year: number;
  educational_level: string;
  study_center: string;
  profession_name: string;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
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
  educations: EducationDetails;
}

export const fetchEducations = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/educations`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching educations:', error.response || error);
      throw error;
  });


return response.data;
};


export const editEducation = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/educations/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchEducation = async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/educations/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching educations:', error.response || error);
      throw error;
  });
return response.data;
};

