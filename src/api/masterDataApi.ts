import axios from './api';

interface MasterData {
  id: number;
  codeid: string;
  surname1: string;
  surname2: string;
  name1: string;
  name2: string;
  name3: string;
  DNINumber: string;
  DNIType: string;
  birthDate: Date;
  correlative: number;
  apellidosy1Nombre: string;
  apellidosy2Nombres: string;
  apellidosy3Nombres: string;
  apellidos: string;
  name: string;
}


export const fetchMasterDatas = async (): Promise<MasterData[]> => {
    
  const response = await axios.get<MasterData[]>(`${import.meta.env.VITE_API_URL}/masterdata`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching masterdata:', error.response || error);
      throw error;
  });


return response.data;
};

export const createMasterData = async (userData: Omit<MasterData, 'id'>): Promise<MasterData> => {
  const response = await axios.post<MasterData>(`${import.meta.env.VITE_API_URL}/masterdata`, {...userData, status: '1' });
  return response.data;
};

export const editMasterData = async (userData: Omit<MasterData, 'id'>, id: number): Promise<MasterData> => {
  const response = await axios.put<MasterData>(`${import.meta.env.VITE_API_URL}/masterdata/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteMasterData= async (id: number): Promise<MasterData> => {
  const response = await axios.delete<MasterData>(`${import.meta.env.VITE_API_URL}/masterdata/${id}`);
  return response.data;
};

export const fetchMasterData = async (id): Promise<MasterData> => {
  console.log(id);
  const response = await axios.get<MasterData>(`${import.meta.env.VITE_API_URL}/masterdata/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching masterdata:', error.response || error);
      throw error;
  });
return response.data;
};

