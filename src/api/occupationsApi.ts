import axios from './api';

interface IOccupations {
    id: number;
    code: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export const fetchOccupations = async (): Promise<IOccupations[]> => {
    
    const response = await axios.get<IOccupations[]>(`${import.meta.env.VITE_API_URL}/occupation`)
    .then(response => {
        //console.log(response.data);
        return response;
    })
    .catch(error => {
        console.error('Error fetching Occupations:', error.response || error);
        throw error;
    });

 
  return response.data;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fetchContractType = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/contract-type`)
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
export const fetchPaymentPeriod = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/payment-period`)
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
export const fetchPaymentType = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/payment-type`)
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
export const fetchOccupationalCategory = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/occupational-category`)
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
export const fetchCen = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/cen`)
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
export const fetchSit = async (): Promise<any[]> => {
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await axios.get<any[]>(`/sit`)
    .then(response => {
        return response;
    })
    .catch(error => {
        console.error('Error fetching fetchTypeWorker:', error.response || error);
        throw error;
    });
  
  
  return response.data;
};
