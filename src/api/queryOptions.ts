import { queryOptions, useMutation, QueryClient } from '@tanstack/react-query';
import { getArticle } from './getArticle';
import { getArticles } from './getArticles';
import { createArticle } from './createArticle';
import { updateArticle } from './updateArticle';
import { deleteArticle } from './deleteArticle';

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
    mutationKey: ['article', 'update', postId],
    mutationFn: updateArticle,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['articles'] });
      queryClient.setQueryData(['article', { id: variables.postId }], data);
    },
    gcTime: 1000 * 10,
  });
};

export const useDeleteArticleMutation = (postId: string) => {
  return useMutation({
    mutationKey: ['article', 'delete', postId],
    mutationFn: deleteArticle,
  });
};