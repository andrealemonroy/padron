import axios from './api';

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
interface Hobbie {
  hobby_id: number;
  code: number;
  description: string;
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
  hobbies: Hobbie[];
  personal_information: PersonalInformation | null;
}

export const fetchHobbies = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/hobby-users`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching hobby-users:', error.response || error);
      throw error;
  });


return response.data;
};


export const editHobbie = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/hobby-users/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchHobbie = async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/hobby-users/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching hobby-users:', error.response || error);
      throw error;
  });
return response.data;
};

export const fetchHobbiesList = async (): Promise<Hobbie[]> => {
    
  const response = await axios.get<Hobbie[]>(`${import.meta.env.VITE_API_URL}/hobby`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching hobby:', error.response || error);
      throw error;
  });


return response.data;
};