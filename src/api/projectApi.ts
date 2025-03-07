import axios from './api';

interface Project {
  id: number;
  code: string;
  name: string;
  client: string;
  start_date: string;
  end_date: string;
}


export const fetchProjects = async (): Promise<Project[]> => {
    
  const response = await axios.get<Project[]>(`/projects`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching projects:', error.response || error);
      throw error;
  });


return response.data;
};

export const fetchLines = async (): Promise<any[]> => {
    
  const response = await axios.get<any[]>(`/code-line`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching projects:', error.response || error);
      throw error;
  });


return response.data;
};

export const createProject = async (userData: Omit<Project, 'id'>): Promise<Project> => {
  const response = await axios.post<Project>(`${import.meta.env.VITE_API_URL}/projects`, {...userData, status: '1' });
  return response.data;
};

export const editProject = async (userData: Omit<Project, 'id'>, id: number): Promise<Project> => {
  const response = await axios.put<Project>(`${import.meta.env.VITE_API_URL}/projects/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteProject = async (id: number): Promise<Project> => {
  const response = await axios.delete<Project>(`${import.meta.env.VITE_API_URL}/projects/${id}`);
  return response.data;
};

export const fetchProject = async (id): Promise<Project> => {
  console.log(id);
  const response = await axios.get<Project>(`${import.meta.env.VITE_API_URL}/projects/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching projects:', error.response || error);
      throw error;
  });
return response.data;
};

