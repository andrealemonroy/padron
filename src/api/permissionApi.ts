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
    
    const response = await axios.get<Permission[]>(`/permissions`)
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
/*
export const createUser = async (userData: Omit<User, 'id'>): Promise<User> => {
  const response = await axios.post<User>(`${import.meta.env.VITE_API_URL}/users`, {...userData, status_id: 1, password: '12345678' });
  return response.data;
};

export const editUser = async (userData: Omit<User, 'id'>, id: number): Promise<User> => {
    const response = await axios.put<User>(`${import.meta.env.VITE_API_URL}/users/${id}`, {...userData, status_id: 1, password: '12345678' });
    return response.data;
};

export const deleteUser = async (id: number): Promise<User> => {
    const response = await axios.delete<User>(`${import.meta.env.VITE_API_URL}/users/${id}`);
    return response.data;
};

export const fetchUser = async (id): Promise<User> => {
    console.log(id);
    const response = await axios.get<User>(`/users/${id}`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching users:', error.response || error);
        throw error;
    });
  return response.data;
};
*/
// Puedes agregar más funciones para editar, eliminar, etc.
