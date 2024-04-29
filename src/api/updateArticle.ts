import { axios } from './axios.ts';
import { ArticleResponse } from './getArticle.ts';

export type articleUpdate = {
  title: string;
  content: string;
  published: boolean;
  postId: string;
  token: string;
};

// export type updateResponse = {
//   status: 'success' | 'fail' | 'error';
//   data: {
//     post?: {
//       id: string;
//       path: string;
//       article: {
//         author: {
//           username: string;
//           id: string;
//         };
//         title: string;
//         content: string;
//         commentCount: number;
//         // comments: [];
//         published: boolean;
//         createdAt: string;
//         updatedAt: string;
//         id: string;
//       };
//     };
//     message?: string;
//   };
// };

export const updateArticle = async (article: articleUpdate): Promise<ArticleResponse> => {
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
