import axios from './api';

interface MenuItem {
    title: string;
    icon: string;
    route?: string;
    permission?: string;
    children?: MenuItem[];
  }
  
interface MenuStructure {
    configuration: {
      title: string;
      icon: string;
      children: {
        users: MenuItem;
        tables: MenuItem;
        notifications: MenuItem;
      };
    };
    pages: {
      title: string;
      icon: string;
      children: {
        worker: MenuItem;
        rrhh: MenuItem;
        nominas: MenuItem;
        contratos: MenuItem;
        evaluacion: MenuItem;
      };
    };
    reports: {
      title: string;
      icon: string;
      children: {
        reports: MenuItem;
      };
    };
  }

export const fetchMenu = async (): Promise<MenuStructure[]> => {
    
    const response = await axios.get<MenuStructure[]>(`${import.meta.env.VITE_API_URL}/menu`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching Sex:', error.response || error);
        throw error;
    });

 
  return response.data;
};