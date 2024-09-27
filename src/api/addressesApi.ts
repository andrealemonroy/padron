import axios from './api';

interface Address {
  id: number;
  user_id: number;
  address_type: string;
  address_name: string;
  address_number: string;
  department_number: string;
  interior: string;
  block: string;
  lot: string;
  km: string;
  stage: string;
  zone_type: string;
  zone_name: string;
  reference: string;
  department: number;
  province: number;
  district: number;
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
  document_type: string | null;
  document_number: string | null;
  birth_date: string | null;
  project: string | null;
  address: Address;
}


export const fetchAddressess = async (): Promise<User[]> => {
    
    const response = await axios.get<User[]>(`/addresses`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching addresses:', error.response || error);
        throw error;
    });

 
  return response.data;
};

export const createAddresses = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post<User>(`${import.meta.env.VITE_API_URL}/addresses`, {...userData, guard_name: 'web' });
  return response.data;
};

export const editAddresses = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
    const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/addresses/${id}`, {...userData, status: '1' });
    return response.data;
};

export const deleteAddresses = async (id: number): Promise<User> => {
    const response = await axios.delete<User>(`${import.meta.env.VITE_API_URL}/addresses/${id}`);
    return response.data;
};

export const fetchAddresses = async (id): Promise<User> => {
    console.log(id);
    const response = await axios.get<User>(`/addresses/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching addresses:', error.response || error);
        throw error;
    });
  return response.data;
};

