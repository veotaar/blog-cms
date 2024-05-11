import { createFileRoute, redirect } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import Paginator from '@/components/Paginator';
import { z } from 'zod';
import ArticleList from '@/components/ArticleList';
// import { buttonVariants } from '@/components/ui/button';
import buttonVariants from '@/components/ui/buttonVariants';
import { cn } from '../lib/utils';
import { Link } from '@tanstack/react-router';
import { articlesQueryOptions } from '@/api/queryOptions';
import { Plus } from 'lucide-react';

const postsSearchSchema = z.object({
  page: z.number().catch(1),
});

export const Route = createFileRoute('/posts')({
  component: Posts,
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
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: async ({ deps: { page }, context }) =>
    await context.queryClient.ensureQueryData(articlesQueryOptions(page, context.auth.token as string)),
});

function Posts() {
  const { isAuthenticated } = useAuth();
  const { page } = Route.useSearch();

  const loaderData = Route.useLoaderData();

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
    <div className="mx-auto flex max-w-screen-md flex-col gap-4 overflow-hidden text-ellipsis whitespace-nowrap bg-background p-4">
      <Link
        className={cn(buttonVariants({ variant: 'default', size: 'default' }), 'flex gap-2 self-start')}
        to="/posts/new"
        search={{ page: 1 }}
      >
        <Plus className="h-4 w-4" />
        <span>New Article</span>
      </Link>
      <ArticleList data={loaderData.data} />
      <Paginator currentPage={page as number} totalPages={loaderData.data.totalPages} pagesAroundCurrent={2} />
    </div>
  );
}
