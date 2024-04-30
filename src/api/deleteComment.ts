import { axios } from './axios.ts';

type commentDelete = {
  commentId: string;
  token: string;
};

type deleteResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    message: string;
  } | null;
};

export const deleteComment = async (comment: commentDelete): Promise<deleteResponse> => {
  const response = await axios.delete(`/comments/${comment.commentId}`, {
    headers: {
      Authorization: comment.token,
    },
  });
  return response.data;
};
