import { queryOptions, useMutation, QueryClient } from '@tanstack/react-query';
import { getArticle } from './getArticle';
import { getArticles } from './getArticles';
import { createArticle } from './createArticle';
import { updateArticle } from './updateArticle';
import { deleteArticle } from './deleteArticle';
import { createComment } from './createComment';
import { deleteComment } from './deleteComment';
import { getSignupStatus } from './getSignupStatus';
import { getCommentStatus } from './getCommentStatus';
import { getSettings, updateSettings } from './settings';
import { useRouter } from '@tanstack/react-router';

export const queryClient = new QueryClient();

export const signupsQueryOptions = () => {
  return queryOptions({
    queryKey: ['settings', 'signup'],
    queryFn: () => getSignupStatus(),
  });
};

export const commentsQueryOptions = () => {
  return queryOptions({
    queryKey: ['settings', 'comment'],
    queryFn: () => getCommentStatus(),
  });
};

export const settingsQueryOptions = (token: string) => {
  return queryOptions({
    queryKey: ['settings', 'all'],
    queryFn: () => getSettings(token),
  });
};

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

export const useUpdateSettingsMutation = () => {
  return useMutation({
    mutationKey: ['settings', 'update'],
    mutationFn: updateSettings,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
      queryClient.setQueryData(['settings', 'all'], data);
      queryClient.setQueryData(['settings', 'signup'], {
        status: 'success',
        data: {
          allowSignups: data.data.settings.allowSignups,
        },
      });
      queryClient.setQueryData(['settings', 'comment'], {
        status: 'success',
        data: {
          allowComments: data.data.settings.allowComments,
        },
      });
    },
  });
};
