import { axios } from './axios.ts';

export type SignupsResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    allowSignups: boolean;
  };
};

export const getSignupStatus = async (): Promise<SignupsResponse> => {
  const response = await axios.get('/settings/signups');
  return response.data;
};
