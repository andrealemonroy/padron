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
    
    const response = await axios.get<Role[]>(`/roles`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching users:', error.response || error);
        throw error;
    });

 
  return response.data;
};

export const createRol = async (userData: Omit<Role, 'id'>): Promise<Role> => {
  const response = await axios.post<Role>(`${import.meta.env.VITE_API_URL}/users`, userData);
  return response.data;
};

// Puedes agregar más funciones para editar, eliminar, etc.
