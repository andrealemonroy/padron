import axios from './api';

interface PersonalInformation {
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
  entry_status: string;
  document_type: number | null;
  document_number: string | null;
  birth_date: string | null;
  project: string | null;
  personal_information: PersonalInformation | null;
}

  


export const fetchPersonalInformations = async (): Promise<User[]> => {
    
    const response = await axios.get<User[]>(`/personal-information`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching personal-information:', error.response || error);
        throw error;
    });

 
  return response.data;
};

export const createPersonalInformation = async (userData: Omit<PersonalInformation, 'id'>): Promise<PersonalInformation> => {
  const response = await axios.post<PersonalInformation>(`${import.meta.env.VITE_API_URL}/personal-information`, {...userData, guard_name: 'web' });
  return response.data;
};

export const editPersonalInformation = async (userData: Omit<PersonalInformation, 'id'>, id: number): Promise<PersonalInformation> => {
    const response = await axios.put<PersonalInformation>(`${import.meta.env.VITE_API_URL}/personal-information/${id}`, {...userData, status: '1' });
    return response.data;
};

export const deletePersonalInformation = async (id: number): Promise<PersonalInformation> => {
    const response = await axios.delete<PersonalInformation>(`${import.meta.env.VITE_API_URL}/personal-information/${id}`);
    return response.data;
};

export const fetchPersonalInformation = async (id): Promise<User> => {
    console.log(id);
    const response = await axios.get<User>(`/personal-information/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching personal-information:', error.response || error);
        throw error;
    });
  return response.data;
};

