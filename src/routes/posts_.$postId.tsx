import { createFileRoute, redirect, useLoaderData } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { getArticle } from '@/api/getArticle';
// import { useSearch } from '@tanstack/react-router';
import { Link } from '@tanstack/react-router';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChevronLeft, Edit } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

import { cn } from '../lib/utils';

export const Route = createFileRoute('/posts/$postId')({
  component: Post,
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
  loader: ({ params, context }) => getArticle(params.postId, context.auth.token as string),
});

// const postsRouteApi = getRouteApi('/posts');

function Post() {
  const { isAuthenticated } = useAuth();
  // const { page } = postsRouteApi.useSearch();

  const loaderData = useLoaderData({ from: '/posts/$postId' });

  const { title, author, content } = loaderData.data.post;

  const { postId } = Route.useParams();

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
    <div className="mx-auto max-w-screen-lg overflow-hidden text-ellipsis bg-background p-2">
      <div className="flex items-center justify-between">
        <Link
          className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
          to="/posts"
          search={{ page: 1 }}
        >
          <ChevronLeft className="h-4 w-4" />
          <span>Go back to posts</span>
        </Link>
        <Link
          className={cn(buttonVariants({ variant: 'ghost', size: 'default' }), 'gap-1 pl-2.5')}
          to="/posts/$postId/edit"
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
  );
}
