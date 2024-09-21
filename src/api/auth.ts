import axios from 'axios';

interface SignInResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    roles: any[];
    permissions: any[];
  };
}

export const signIn = async (
  email: string,
  password: string
): Promise<SignInResponse> => {
  const response = await axios.post<SignInResponse>(
    `${import.meta.env.VITE_API_URL}/login-form`, 
    { email, password }
  );
  
  // Store token in localStorage
  const { token, user } = response.data;
  localStorage.setItem('token', token);  // Store the token

  return response.data;
};