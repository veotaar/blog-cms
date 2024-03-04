import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const Route = createRootRoute({
  component: () => (
    <>
      <div>
        <h1 className={'text-red-600'}>Blog CMS</h1>
      </div>
      <div className="flex gap-2 p-2">
        <Link to="/" activeProps={{ className: 'font-bold' }}>
          Home
        </Link>{' '}
        <Link to="/about" className="[&.active]:font-bold">
          About
        </Link>
      </div>
      <hr />
      <Outlet />
      <TanStackRouterDevtools />
      <ReactQueryDevtools />
    </>
  ),
});
