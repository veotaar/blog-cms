import { createFileRoute, redirect, useLoaderData } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { Link } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Edit } from 'lucide-react';
// import { buttonVariants } from '@/components/ui/button';
import buttonVariants from '@/components/ui/buttonVariants';
import { articleQueryOptions } from '@/api/queryOptions';
import { z } from 'zod';
import { cn } from '../lib/utils';
import DeleteButton from '@/components/DeleteButton';
import { toast } from 'sonner';
import { useDeleteArticleMutation } from '@/api/queryOptions';
import { useNavigate } from '@tanstack/react-router';
import CommentForm from '@/components/CommentForm';

const postsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute('/posts/$postId')({
  component: Post,
  validateSearch: postsSearchSchema,
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  loader: async ({ params, context }) => {
    return await context.queryClient.ensureQueryData(articleQueryOptions(params.postId, context.auth.token as string));
  },
  // shouldReload: ({ params, context }) => {
  //   const { queryClient } = context;
  //   const queryState = queryClient.getQueryState(['article', { id: params.postId }]);
  //   console.log(`should reload: ${queryState?.isInvalidated}`);
  //   return queryState?.isInvalidated;
  // },
  // shouldReload: true,
});

function Post() {
  const { isAuthenticated, token } = useAuth();
  const { page } = Route.useSearch();

  const loaderData = useLoaderData({ from: '/posts/$postId' });
  const navigate = useNavigate({ from: '/posts/$postId' });

  const queryClient = Route.useRouteContext({ select: (context) => context.queryClient });

  const { title, author, content, commentCount, comments } = loaderData.data.post;

  const { postId } = Route.useParams();

  const deleteArticleMutation = useDeleteArticleMutation(postId);

  const handleDelete = async () => {
    try {
      await deleteArticleMutation.mutateAsync(
        {
          postId: postId,
          token: token as string,
        },
        {
          onSuccess: () => {
            queryClient.clear();
          },
        },
      );

      navigate({ to: '/' });
      toast('article has been deleted');
    } catch {
      toast('there was a problem');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-screen-lg bg-background p-2">
        <h3>Login to view posts</h3>
      </div>
    );
  }

  if (!loaderData) {
    return <p>loading...</p>;
  }

  return (
    <>
      <div className="mx-auto max-w-screen-lg overflow-hidden text-ellipsis bg-background p-2">
        <div className="flex items-center justify-between">
          <Link
            className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
            to="/posts"
            search={{ page: page }}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Go back to posts</span>
          </Link>
          <DeleteButton deleteFn={handleDelete} />
          <Link
            className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
            to="/posts/$postId/edit"
            search={{ page: page }}
            params={{ postId: postId }}
          >
            <span>Edit</span>
            <Edit />
          </Link>
        </div>
        <h1>title {title}</h1>
        <p>written by {author ? author.username : 'deleted user'}</p>
        <Markdown remarkPlugins={[remarkGfm]} className="prose dark:prose-invert">
          {content}
        </Markdown>
      </div>
      <div
        className={cn(
          'mx-auto flex max-w-screen-lg flex-col gap-2 overflow-hidden text-ellipsis border bg-background p-2',
        )}
      >
        <CommentForm postId={postId} page={page} disabled={commentCount >= 20} />
      </div>
      <div
        className={cn(
          'mx-auto flex max-w-screen-lg flex-col gap-2 overflow-hidden text-ellipsis border bg-background p-2',
        )}
      >
        {commentCount > 0
          ? comments.map((comment) => (
              <div key={comment.id} className="rounded-md border border-violet-300 p-2">
                <p className="italic">{comment.author} says:</p>
                <p>{comment.content}</p>
              </div>
            ))
          : null}
      </div>
    </>
  );
}
