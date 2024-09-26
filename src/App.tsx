// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'; // Import your AuthProvider
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute component
import LoginPage from './pages/Login'; // Example login page
import Dashboard from './pages/Dashboard'; // Example private dashboard page
import CreateUser from './pages/CreateUser';
import Roles from './pages/Roles';
import CreateRol from './pages/CreateRol';
import Option from './pages/Option';
import CreatePermission from './pages/CreatePermission';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/edit-user/:id" element={<CreateUser />} />
          <Route path="/roles" element={<Roles />} />
          <Route path="/create-rol" element={<CreateRol />} />
          <Route path="/edit-rol/:id" element={<CreateRol />} />
          <Route path="/option" element={<Option />} />
          <Route path="/create-option" element={<CreatePermission />} />
          <Route path="/edit-option/:id" element={<CreatePermission />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;