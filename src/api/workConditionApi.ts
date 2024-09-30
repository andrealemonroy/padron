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
}

export const fetchWorkConditions = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`/work-conditions`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching work-conditions:', error.response || error);
      throw error;
  });


return response.data;
};


export const editWorkCondition = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/work-conditions/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchWorkCondition = async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`/work-conditions/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching work-conditions:', error.response || error);
      throw error;
  });
return response.data;
};
