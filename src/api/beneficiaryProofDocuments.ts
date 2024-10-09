import axios from './api';

interface BeneficiaryProofDocuments {
  id: number;
  code: string;
  description: string;
}


export const fetchBeneficiaryProofDocuments = async (): Promise<BeneficiaryProofDocuments[]> => {
    
  const response = await axios.get<BeneficiaryProofDocuments[]>(`/beneficiary-proof-documents`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching beneficiary-proof-documents:', error.response || error);
      throw error;
  });


return response.data;
};

export const createBeneficiaryProofDocument = async (userData: Omit<BeneficiaryProofDocuments, 'id'>): Promise<BeneficiaryProofDocuments> => {
  const response = await axios.post<BeneficiaryProofDocuments>(`${import.meta.env.VITE_API_URL}/beneficiary-proof-documents`, {...userData, status: '1' });
  return response.data;
};

export const editBeneficiaryProofDocument = async (userData: Omit<BeneficiaryProofDocuments, 'id'>, id: number): Promise<BeneficiaryProofDocuments> => {
  const response = await axios.put<BeneficiaryProofDocuments>(`${import.meta.env.VITE_API_URL}/beneficiary-proof-documents/${id}`, {...userData, status: '1' });
  return response.data;
};

export const deleteBeneficiaryProofDocument = async (id: number): Promise<BeneficiaryProofDocuments> => {
  const response = await axios.delete<BeneficiaryProofDocuments>(`${import.meta.env.VITE_API_URL}/beneficiary-proof-documents/${id}`);
  return response.data;
};

export const fetchBeneficiaryProofDocument = async (id): Promise<BeneficiaryProofDocuments> => {
  console.log(id);
  const response = await axios.get<BeneficiaryProofDocuments>(`/beneficiary-proof-documents/${id}`)
  .then(response => {
      return response;
  })
  .catch(error => {
      console.error('Error fetching beneficiary-proof-documents:', error.response || error);
      throw error;
  });
return response.data;
};

