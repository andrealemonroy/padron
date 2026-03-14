import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// 1. Obtener todas las plantillas (Para la tabla principal)
export const fetchTemplates = async () => {
    const response = await axios.get(`${API_URL}/templates`);
    return response.data;
};

// 2. Obtener UNA sola plantilla por su ID (Para rellenar el formulario en modo Edición)
export const fetchTemplate = async (id: number | string) => {
    const response = await axios.get(`${API_URL}/templates/${id}`);
    return response.data;
};

// 3. Crear una nueva plantilla (FormData porque incluye el archivo .docx)
export const createTemplate = async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/templates`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 4. Editar una plantilla existente
export const editTemplate = async (formData: FormData, id: number | string) => {
    // OJO AQUÍ: Cuando envías archivos (FormData) para actualizar en Laravel, 
    // no se puede usar axios.put() directamente. Se usa axios.post() y 
    // Laravel detecta el '_method', 'PUT' que ya agregamos en el componente.
    const response = await axios.post(`${API_URL}/templates/${id}`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// 5. Eliminar una plantilla
export const deleteTemplate = async (id: number | string) => {
    const response = await axios.delete(`${API_URL}/templates/${id}`);
    return response.data;
};

// Mantenemos esta por si la usas en otro lado (hace lo mismo que createTemplate)
export const uploadTemplate = async (formData: FormData) => {
    const response = await axios.post(`${API_URL}/templates/upload`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};