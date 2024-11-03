import axios from './api';

interface Permission {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: PermissionPivot;
}

interface PermissionPivot {
    role_id: number;
    permission_id: number;
}


export const fetchPermissions = async (): Promise<Permission[]> => {
    
    const response = await axios.get<Permission[]>(`${import.meta.env.VITE_API_URL}/permissions`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching permissions:', error.response || error);
        throw error;
    });

 
  return response.data;
};

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
    const response = await axios.get<Permission>(`${import.meta.env.VITE_API_URL}/permissions/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching permissions:', error.response || error);
        throw error;
    });
  return response.data;
};

