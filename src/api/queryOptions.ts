import { queryOptions, useMutation, QueryClient } from '@tanstack/react-query';
import { getArticle } from './getArticle';
import { getArticles } from './getArticles';
import { createArticle } from './createArticle';
import { updateArticle } from './updateArticle';
import { deleteArticle } from './deleteArticle';
import { createComment } from './createComment';
import { deleteComment } from './deleteComment';
import { useRouter } from '@tanstack/react-router';

export const queryClient = new QueryClient();

export const articleQueryOptions = (postId: string, token: string) => {
  return queryOptions({
    queryKey: ['article', { id: postId }],
    queryFn: () => getArticle(postId, token),
  });
};

export const articlesQueryOptions = (page: number, token: string) => {
  return queryOptions({
    queryKey: ['articles', { page: page }],
    queryFn: () => getArticles(page, token),
  });
};

export const useCreateArticleMutation = () => {
  return useMutation({
    mutationKey: ['article', 'create'],
    mutationFn: createArticle,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.setQueryData(['article', { id: data.data.post.id }], data);
    },
  });
};

export const useUpdateArticleMutation = (postId: string) => {
  return useMutation({
    mutationKey: ['article', { id: postId }, 'update'],
    mutationFn: updateArticle,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.setQueryData(['article', { id: variables.postId }], data);
    },
    gcTime: 1000 * 10,
  });
};

export const useDeleteArticleMutation = (postId: string, page: number) => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['article', { id: postId }, 'delete'],
    mutationFn: deleteArticle,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['articles', { page: page }] });
      await queryClient.invalidateQueries({ queryKey: ['article', { id: postId }] });
      await router.invalidate();
    },
  });
};

export const useCreateCommentMutation = (postId: string, page: number) => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['article', { id: postId }, 'createComment'],
    mutationFn: createComment,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['articles', { page: page }] });
      await queryClient.invalidateQueries({ queryKey: ['article', { id: postId }] });
      await queryClient.refetchQueries({ queryKey: ['article', { id: postId }] });
      await router.invalidate();
    },
  });
};

export const useDeleteCommentMutation = (postId: string, commentId: string, page: number) => {
  const router = useRouter();
  return useMutation({
    mutationKey: ['article', { id: postId }, 'deleteComment', { commentId: commentId }],
    mutationFn: deleteComment,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['articles', { page: page }] });
      await queryClient.invalidateQueries({ queryKey: ['article', { id: postId }] });
      await queryClient.refetchQueries({ queryKey: ['article', { id: postId }] });
      await router.invalidate();
    },
  });
};
