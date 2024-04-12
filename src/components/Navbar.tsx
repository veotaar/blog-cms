import React from 'react';
import { Link } from '@tanstack/react-router';
import { cn } from '../lib/utils';
import { useAuth } from '@/lib/auth';

const Navbar: React.FC = () => {
  const { isAuthenticated, user, setUser, setToken } = useAuth();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <nav className={cn('m-2 mx-auto flex max-w-screen-lg gap-4 rounded-xl bg-muted p-2 text-foreground')}>
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
    </nav>
  );
};

export default Navbar;
