import { axios } from './axios.ts';

export type ArticleResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    post: {
      id: string;
      author: {
        username: string;
        id: string;
      };
      title: string;
      content: string;
      commentCount: number;
      published: boolean;
      createdAt: string;
      updatedAt: string;
      comments: {
        id: string;
        parent: string;
        author: string;
        content: string;
        createdAt: string;
        updatedAt: string;
      }[];
    };
  };
};

export const getArticle = async (postId: string, token: string): Promise<ArticleResponse> => {
  const response = await axios.get(`/admin/posts/${postId}`, {
    headers: {
      Authorization: token,
    },
  });
  return response.data;
};
