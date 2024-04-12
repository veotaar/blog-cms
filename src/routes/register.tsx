import RegisterForm from '@/components/RegisterForm';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/register')({
  component: Register,
});

function Register() {
  return (
    <div className="h-full w-full">
      <h1 className="my-6 text-center text-2xl font-bold">Create your account</h1>
      <RegisterForm />
    </div>
  );
}
