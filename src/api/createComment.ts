import { axios } from './axios.ts';

export type newComment = {
  author: string;
  content: string;
  postId: string;
};

type CommentResponse = {
  status: 'success' | 'fail' | 'error';
  data: {
    comment?: {
      id: string;
      articlePath: string;
    };
    message?: string;
  };
};

export const createComment = async (comment: newComment): Promise<CommentResponse> => {
  const response = await axios.post(`/posts/${comment.postId}/comments`, {
    author: comment.author,
    content: comment.content,
  });
  return response.data;
};
