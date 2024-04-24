import React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import { useAuth } from '@/lib/auth';
import { ModeToggle } from './ModeToggle';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, setUser, setToken } = useAuth();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  // className={cn('m-2 mx-auto flex max-w-screen-lg justify-center gap-4 rounded-xl bg-accent p-2 text-foreground')}

  return (
    <nav className={cn('mb-2 bg-accent p-2 text-foreground')}>
      <div className={cn('mx-auto flex max-w-screen-lg items-center justify-center gap-4 px-2')}>
        <Link to="/" className="mr-auto [&.active]:font-bold">
          Home
        </Link>
        {isAuthenticated ? (
          <div className={cn('flex gap-4')}>
            <p>Welcome, {user}</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <div className={cn('flex gap-4')}>
            <Link to="/login" className={cn('[&.active]:font-bold')}>
              Login
            </Link>
            <Link to="/register" className={cn('[&.active]:font-bold')}>
              Register
            </Link>
          </div>
        )}
        <ModeToggle />
      </div>
    </nav>
  );
};

export default Navbar;
