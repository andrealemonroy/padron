// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'; // Import your AuthProvider
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute component
import LoginPage from './pages/Login'; // Example login page
import Dashboard from './pages/Dashboard'; // Example private dashboard page

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;