import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          ClearAid
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && (
            <Link to="/posts/new" className="nav-link">Create Post</Link>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated ? (
            <>
              <span className="welcome-message">
                Welcome, {currentUser?.username || 'User'}
              </span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="auth-link">Login</Link>
              <Link to="/register" className="auth-link register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;