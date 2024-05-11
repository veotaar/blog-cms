import { axios } from './axios.ts';

export type CommentsResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    allowComments: boolean;
  };
};

export const getCommentStatus = async (): Promise<CommentsResponse> => {
  const response = await axios.get('/settings/comments');
  return response.data;
};
