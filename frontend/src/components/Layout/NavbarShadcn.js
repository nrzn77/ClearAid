import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Shadcn UI components
import { Button } from '../ui/button';

const NavbarShadcn = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full border-b bg-primary text-primary-foreground shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight">
          ClearAid
        </Link>

        <div className="flex items-center space-x-4">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary-foreground/80">
            Home
          </Link>
          {isAuthenticated && (
            <Link to="/posts/new" className="text-sm font-medium transition-colors hover:text-primary-foreground/80">
              Create Post
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium">
                Welcome, {currentUser?.username || 'User'}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-transparent border border-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground hover:text-primary-foreground/80">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavbarShadcn;