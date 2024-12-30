import axios from './api';

interface WorkCondition {
  user_id: number;
  adequate_home_environment: number;
  remote_work_condition: string;
  computer_type: string;
  work_type: string;
  internet_connection: string;
  home_furniture: string;
  status: string;
  updated_at: string;
  created_at: string;
  id: number;
}

export interface PersonalInformation {
  id: number;
  user_id: number;
  document_type: number | null;
  document_number: string | null;
  document_country: string | null;
  birth_date: string | null;
  last_name_father: string | null;
  last_name_mother: string | null;
  first_name: string | null;
  second_name: string | null;
  third_name: string | null;
  gender: number | null;
  blood_group: string | null;
  civil_status: string | null;
  nationality: number | null;
  phone_number: string | null;
  emergency_phone_number: string | null;
  has_children_under_18: boolean;
  number_of_children_under_18: number | null;
  photo_url: string | null;
  status: string;
  created_by: number;
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
  workCondition: WorkCondition;
  personal_information: PersonalInformation | null;
}

export const fetchWorkExperiences = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/work-experiences`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching work-experiences:', error.response || error);
      throw error;
  });


return response.data;
};


export const editWorkExperiences = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/work-experiences/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchWorkExperience = async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/work-experiences/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching work-experiences:', error.response || error);
      throw error;
  });
return response.data;
};

