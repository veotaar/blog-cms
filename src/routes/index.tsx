import { createFileRoute } from '@tanstack/react-router';
import { useAuth } from '../lib/auth';
import { Link } from '@tanstack/react-router';
// import { cn } from '../lib/utils';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-screen-lg bg-background p-2">
        <p>
          <Link to="/login" className="underline underline-offset-8">
            Login
          </Link>{' '}
          to view posts.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-screen-lg overflow-hidden text-ellipsis whitespace-nowrap bg-background p-2">
      <p>You are authenticated!</p>
      <Link to="/posts" search={{ page: 1 }} className="underline underline-offset-8">
        Go to posts
      </Link>
    </div>
  );
}
