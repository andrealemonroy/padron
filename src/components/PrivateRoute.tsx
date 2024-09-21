// src/components/PrivateRoute.tsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth(); // Now user and isLoading are typed correctly

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;