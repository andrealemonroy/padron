import axios from './api';

interface Role {
    id: number;
    name: string;
    guard_name: string;
    created_at: string;
    updated_at: string;
    pivot: RolePivot;
    permissions: Permission[];
}

interface RolePivot {
    model_type: string;
    model_id: number;
    role_id: number;
}

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


export const fetchRoles = async (): Promise<Role[]> => {
    
    const response = await axios.get<Role[]>(`${import.meta.env.VITE_API_URL}/roles`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching users:', error.response || error);
        throw error;
    });

 
  return response.data;
};

export const fetchRol = async (id): Promise<Role> => {
    const response = await axios.get<Role>(`${import.meta.env.VITE_API_URL}/roles/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching users:', error.response || error);
        throw error;
    });
  return response.data;
};

export const createRol = async (data: Omit<Role, 'id'>): Promise<Role> => {
  const response = await axios.post<Role>(`${import.meta.env.VITE_API_URL}/roles`, {...data, guard_name: 'web'});
  return response.data;
};

export const editRol = async (userData: Omit<Role, 'id'>, id: number): Promise<Role> => {
    const response = await axios.put<Role>(`${import.meta.env.VITE_API_URL}/roles/${id}`, {...userData, guard_name: 'web' });
    return response.data;
};

export const deleteRol = async (id: number): Promise<Role> => {
    const response = await axios.delete<Role>(`${import.meta.env.VITE_API_URL}/roles/${id}`);
    return response.data;
};

