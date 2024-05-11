import { axios } from './axios.ts';

export type SettingsResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    settings: {
      allowSignups: boolean;
      allowComments: boolean;
    };
  };
};

export type SettingsUpdate = {
  allowSignups: boolean;
  allowComments: boolean;
  token: string;
};

export const getSettings = async (token: string): Promise<SettingsResponse> => {
  const response = await axios.get('/admin/settings', {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};

export const updateSettings = async (settings: SettingsUpdate): Promise<SettingsResponse> => {
  const response = await axios.put(
    '/admin/settings',
    {
      allowSignups: settings.allowSignups,
      allowComments: settings.allowComments,
    },
    {
      headers: {
        Authorization: settings.token,
      },
    },
  );
  return response.data;
};
