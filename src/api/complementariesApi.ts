import axios from './api';

interface UserComplementary {
  id: number;
  user_id: number;
  labor_regime: string;
  occupation: string;
  disability: number;
  sctr_pension: number;
  contract_type: string;
  subject_to_atypical_regime: number;
  maximum_working_day: number;
  night_shift: number;
  union: number;
  remuneration_period: string;
  salary: string;
  situation: string;
  exempt_from_5th_income: number;
  special_situation: number;
  payment_type: string;
  occupational_category: string;
  double_taxation_treaty: number;
  cost_sub_center: string;
  cost_center: string;
  cost_sub_sub_center: string;
  area: string;
  payroll_position: string;
  status: string;
  created_by: number;
  updated_by: number;
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
  document_type: string | null;
  document_number: string | null;
  birth_date: string | null;
  project: string | null;
  complementary: UserComplementary | null;
}


export const fetchComplementaries = async (): Promise<User[]> => {
    
  const response = await axios.get<User[]>(`${import.meta.env.VITE_API_URL}/complementaries`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching complementaries:', error.response || error);
      throw error;
  });


return response.data;
};

export const editComplementary = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
  const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/complementaries/${id}`, {...userData, status: '1' });
  return response.data;
};

export const fetchComplementary = async (id): Promise<User> => {
  console.log(id);
  const response = await axios.get<User>(`${import.meta.env.VITE_API_URL}/complementaries/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching complementaries:', error.response || error);
      throw error;
  });
return response.data;
};

