import { Outlet, createFileRoute, redirect, useLoaderData } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import Paginator from '@/components/Paginator';
import { z } from 'zod';
import { getArticles } from '@/api/getArticles';
import ArticleList from '@/components/ArticleList';

// import { cn } from '../lib/utils';

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
  loader: ({ deps: { page }, context }) => getArticles(page as number, context.auth.token as string),
});

function Posts() {
  const { isAuthenticated } = useAuth();
  const { page } = Route.useSearch();

  const loaderData = useLoaderData({ from: '/posts' });

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
    <div className="mx-auto max-w-screen-lg overflow-hidden text-ellipsis whitespace-nowrap bg-background p-2">
      <ArticleList data={loaderData.data} />
      <Paginator currentPage={page as number} totalPages={loaderData.data.totalPages} pagesAroundCurrent={2} />
      <Outlet />
    </div>
  );
}
