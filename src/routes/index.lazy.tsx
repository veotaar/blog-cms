import { createLazyFileRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
// import { cn } from '../lib/utils';

export const Route = createLazyFileRoute('/')({
  component: Index,
});

function Index() {
  const auth = useAuth();
  return (
    <div className="mx-auto max-w-screen-lg bg-background p-2">
      <h3>{auth.isAuthenticated ? 'All Posts' : 'Login to view posts'}</h3>
    </div>
  );
}
