import { axios } from './axios.ts';
import { articleUpdate } from './updateArticle.ts';
import { ArticleResponse } from './getArticle.ts';

export type newArticle = Omit<articleUpdate, 'postId'>;

export const createArticle = async (article: newArticle): Promise<ArticleResponse> => {
  const response = await axios.post(
    `/posts`,
    { title: article.title, content: article.content, published: article.published },
    {
      headers: {
        Authorization: article.token,
      },
    },
  );
  return response.data;
};
