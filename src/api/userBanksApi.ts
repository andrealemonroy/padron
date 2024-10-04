import axios from './api';

interface UserBank {
  id: number;
  user_id: number;
  bank_code: string;
  account_number: string;
  interbank_code: string;
  status: string;
  created_by: number;
  updated_by: number;
  deleted_by: number;
  created_at: string;
  updated_at: string;
  deleted_at: string;
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
  user_bank: UserBank;
}



export const fetchUserBanks = async (): Promise<User[]> => {
    
    const response = await axios.get<User[]>(`/user-banks`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching user-banks:', error.response || error);
        throw error;
    });

 
  return response.data;
};


export const editUserBank = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
    const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/user-banks/${id}`, {...userData, status: '1' });
    return response.data;
};

export const fetchUserBank = async (id): Promise<User> => {
    console.log(id);
    const response = await axios.get<User>(`/user-banks/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching user-banks:', error.response || error);
        throw error;
    });
  return response.data;
};

