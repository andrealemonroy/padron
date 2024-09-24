import axios from './api';

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
    roles: Role[];
}

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


export const fetchUsers = async (): Promise<User[]> => {
    
    const response = await axios.get<User[]>(`/users`)
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

export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post<User>(`${import.meta.env.VITE_API_URL}/users`, userData);
  return response.data;
};

// Puedes agregar más funciones para editar, eliminar, etc.
