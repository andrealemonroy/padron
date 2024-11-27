import axios from './api';

interface Contract {
  id: number;
  code: string;
  name: string;
  client: string;
  start_date: string;
  end_date: string;
  status: number;
}


export const fetchContracts = async (): Promise<Contract[]> => {
    
  const response = await axios.get<Contract[]>(`/contracts`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching Contracts:', error.response || error);
      throw error;
  });


return response.data;
};

export const createContract = async (userData: Omit<Contract, 'id'>): Promise<Contract> => {
  const response = await axios.post<Contract>(`${import.meta.env.VITE_API_URL}/contracts`, {...userData, status: '1' });
  return response.data;
};

export const editContract = async (userData: Omit<Contract, 'id'>, id: number): Promise<Contract> => {
  const response = await axios.put<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteContract = async (id: number): Promise<Contract> => {
  const response = await axios.delete<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`);
  return response.data;
};

export const fetchContract = async (id): Promise<Contract> => {
  console.log(id);
  const response = await axios.get<Contract>(`${import.meta.env.VITE_API_URL}/contracts/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching Contracts:', error.response || error);
      throw error;
  });
return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchHealthEntity = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/health-entity`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching fetchHealthEntity:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchTypeWorker = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/type-worker`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching fetchTypeWorker:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchWorkLine = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/work-line`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching fetchwork-line:', error.response || error);
      throw error;
  });


return response.data;
};



// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchHealthType = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/health-type`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching health-type:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchcessationReasons = async (): Promise<any[]> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.get<any[]>(`/cessation-reasons`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching reasons:', error.response || error);
      throw error;
  });


return response.data;
};


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchImportData = async (data): Promise<any> => {
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const response = await axios.post<any>(`${import.meta.env.VITE_API_URL}/import-contract-data`, data)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching import-contract-data:', error.response || error);
      throw error;
  });


return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchDownload = async (id, type: number): Promise<any> => {
  console.log(id);
  
  try {
    const response = await axios.get(`${import.meta.env.VITE_API_URL}/contract-${type}/${id}`, {
      responseType: 'blob', // Asegúrate de que la respuesta se maneje como Blob
    });

    // Verifica que la respuesta sea un PDF
    if (response.headers['content-type'] !== 'application/pdf') {
      throw new Error('El archivo descargado no es un PDF.');
    }

    return response.data; // Devuelve el Blob
  } catch (error) {
    console.error('No se pudo descargar el archivo:', error.response || error);
    throw error; // Lanza el error para manejarlo en la función que llama
  }
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchRporte = async (data): Promise<any> => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/reports`, data, {
      responseType: 'blob', // Asegúrate de que la respuesta se maneje como Blob
    });

    // Obtener el tipo de contenido
    const contentType = response.headers['content-type'];
    console.log('Content-Type:', contentType); // Verificar el tipo de archivo

    // Verificar si el tipo de contenido incluye formatos esperados
    if (!contentType.includes('application/pdf') &&
        !contentType.includes('spreadsheet') &&
        !contentType.includes('text/csv')) {
      throw new Error('El archivo descargado no es del tipo esperado.');
    }

    return response.data; // Devuelve el Blob
  } catch (error) {
    console.error('No se pudo descargar el archivo:', error.response || error);
    throw error; // Lanza el error para manejarlo en la función que llama
  }
};



