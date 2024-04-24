import { axios } from './axios.ts';

export type articleUpdate = {
  title: string;
  content: string;
  published: boolean;
  postId: string;
  token: string;
};

export type updateResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    post?: {
      id: string;
      path: string;
    };
    message?: string;
  };
};

export const updateArticle = async (article: articleUpdate): Promise<updateResponse> => {
  const response = await axios.put(
    `/posts/${article.postId}`,
    { title: article.title, content: article.content, published: article.published },
    {
      headers: {
        Authorization: article.token,
      },
    },
  );
  return response.data;
};
