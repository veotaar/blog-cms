import { axios } from './axios.ts';

export type loginCredentials = {
  username: string;
  password: string;
};

export type loginResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    user?: {
      id: string;
      username: string;
      roles: string[];
    };
    jwt?: {
      token: string;
      expires: string;
    };
    message?: string;
  };
};

export const loginWithUsernameAndPassword = async (credentials: loginCredentials): Promise<loginResponse> => {
  const response = await axios.post('/login', credentials);
  return response.data;
};

export const registerNewUser = async (credentials: loginCredentials): Promise<loginResponse> => {
  const response = await axios.post('/users', credentials);
  return response.data;
};
