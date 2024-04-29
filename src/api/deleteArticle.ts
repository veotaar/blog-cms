import { axios } from './axios.ts';

type articleDelete = {
  postId: string;
  token: string;
};

type deleteResponse = {
  status: 'success' | 'fail' | 'error';
  data?: null;
  message?: string;
};

export const deleteArticle = async (article: articleDelete): Promise<deleteResponse> => {
  const response = await axios.delete(`/posts/${article.postId}`, {
    headers: {
      Authorization: article.token,
    },
  });
  return response.data;
};
