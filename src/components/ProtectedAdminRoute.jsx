import React from 'react';
import { Navigate } from 'react-router-dom';
import SignIn from '../pages/SignIn';

const ProtectedAdminRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin') === 'true';
  
  console.log('Token:', token);
  console.log('isAdmin:', isAdmin);
  console.log('Raw isAdmin value:', localStorage.getItem('isAdmin'));

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="sign-in-container">
        <h2>Access Denied</h2>
        <p className="message error">
          You are not authorized to access the admin dashboard.
        </p>
        <button 
          onClick={() => window.location.href = '/events'} 
          className="btn"
        >
          Go to Events
        </button>
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute; 