import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';

// Shadcn UI components
import { Button } from '../ui/button';
import { ThemeToggle } from '../ui/theme-toggle';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu.js';

const NavbarShadcn = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast.info('You have been logged out successfully.');
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-primary dark:bg-primary/80 dark:backdrop-blur-md text-primary-foreground shadow-sm border-b border-primary-foreground/20" role="navigation" aria-label="Main navigation">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
        <Link to="/" className="text-xl font-bold tracking-tight" aria-label="ClearAid home page">
          ClearAid
        </Link>

        <div className="flex items-center space-x-4" role="menubar">
          <Link 
            to="/" 
            className="text-sm font-medium transition-colors hover:text-primary-foreground/80"
            role="menuitem"
            aria-label="Go to home page"
          >
            Home
          </Link>
          {isAuthenticated && (currentUser?.role === 'ADMIN' || currentUser?.role === 'NGO') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-sm font-medium transition-colors hover:text-primary-foreground/80">
                  Create Post
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem asChild>
                  <Link to="/posts/new" className="text-black dark:text-white">Crowdfunding</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/posts/volunteer" className="text-black dark:text-white">Volunteering</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          {isAuthenticated && currentUser?.role === 'ADMIN' && (
            <Link to="/posts/pending" className="text-sm font-medium transition-colors hover:text-primary-foreground/80">
              Pending Posts
            </Link>
          )}
        </div>

        <div className="flex items-center space-x-4" role="toolbar" aria-label="User actions">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <span className="text-sm font-medium" aria-label={`Logged in as ${currentUser?.username || 'User'}`}>
                Welcome, {currentUser?.username || 'User'}
              </span>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="bg-transparent border border-primary-foreground hover:bg-primary-foreground hover:text-primary"
                aria-label="Logout from your account"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button 
                  variant="ghost" 
                  className="text-primary-foreground hover:text-primary-foreground/80"
                  aria-label="Go to login page"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button 
                  variant="outline" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                  aria-label="Go to registration page"
                >
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
