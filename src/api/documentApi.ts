import axios from './api';

interface Document {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchDocument = async (): Promise<Document[]> => {
    
    const response = await axios.get<Document[]>(`/document`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching document:', error.response || error);
        throw error;
    });

 
  return response.data;
};

/*
export const createPermissions = async (userData: Omit<Permission, 'id'>): Promise<Permission> => {
  const response = await axios.post<Permission>(`${import.meta.env.VITE_API_URL}/permissions`, {...userData, guard_name: 'web' });
  return response.data;
};

export const editPermissions = async (userData: Omit<Permission, 'id'>, id: number): Promise<Permission> => {
    const response = await axios.put<Permission>(`${import.meta.env.VITE_API_URL}/permissions/${id}`, {...userData, guard_name: 'web' });
    return response.data;
};

export const deletePermissions = async (id: number): Promise<Permission> => {
    const response = await axios.delete<Permission>(`${import.meta.env.VITE_API_URL}/permissions/${id}`);
    return response.data;
};

export const fetchPermission = async (id): Promise<Permission> => {
    console.log(id);
    const response = await axios.get<Permission>(`/permissions/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching permissions:', error.response || error);
        throw error;
    });
  return response.data;
};
*/

