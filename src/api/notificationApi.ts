import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchNotificationRules = async () => {
    const response = await axios.get(`${API_URL}/notification-rules`);
    return response.data;
};

export const fetchNotificationRule = async (id: number) => {
    const response = await axios.get(`${API_URL}/notification-rules/${id}`);
    return response.data;
};

export const createNotificationRule = async (data: any) => {
    const response = await axios.post(`${API_URL}/notification-rules`, data);
    return response.data;
};

export const updateNotificationRule = async (id: number, data: any) => {
    const response = await axios.put(`${API_URL}/notification-rules/${id}`, data);
    return response.data;
};

export const deleteNotificationRule = async (id: number) => {
    const response = await axios.delete(`${API_URL}/notification-rules/${id}`);
    return response.data;
};

// Y la función para obtener el color del semáforo para la tabla de contratos:
export const fetchEmployeeSemaphore = async (userId: number) => {
    const response = await axios.get(`${API_URL}/users/${userId}/semaphore`);
    return response.data;
};