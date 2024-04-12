import LoginForm from '@/components/LoginForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/login')({
  component: Login,
});

function Login() {
  return (
    <div className="h-full w-full">
      <h1 className="my-6 text-center text-2xl font-bold">Login to your account</h1>
      <LoginForm />
    </div>
  );
}
