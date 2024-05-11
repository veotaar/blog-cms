import RegisterForm from '@/components/RegisterForm';
import { createFileRoute } from '@tanstack/react-router';
import { signupsQueryOptions } from '@/api/queryOptions';

export const Route = createFileRoute('/register')({
  component: Register,
  loader: ({ context }) => context.queryClient.ensureQueryData(signupsQueryOptions()),
});

function Register() {
  const loaderData = Route.useLoaderData();

  if (!loaderData.data.allowSignups) {
    return (
      <div className="h-full w-full">
        <h1 className="my-6 text-center text-2xl font-bold">Signups are closed.</h1>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <h1 className="my-6 text-center text-2xl font-bold">Create your account</h1>
      <RegisterForm />
    </div>
  );
}
