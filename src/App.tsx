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
import PersonalInformation from './pages/PersonalInformation';
import CreatePersonalInformation from './pages/CreatePersonalInformation';
import Addresses from './pages/Addresses';
import CreateAddresses from './pages/CreateAddresses';
import PensionSystem from './pages/PensionSystem';
import CreatePensionSystem from './pages/CreatePensionSystem';
import WorkExperiences from './pages/WorkExperiences';
import CreateWorkExperiences from './pages/CreateWorkExperiences';
import Educations from './pages/Educations';
import CreateEducations from './pages/CreateEducations';
import WorkCondition from './pages/WorkCondition';
import CreateWorkCondition from './pages/CreateWorkCondition';

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
          <Route path="/basic" element={<PersonalInformation />} />
          <Route path="/edit-basic/:id" element={<CreatePersonalInformation />} />
          <Route path="/addresses" element={<Addresses />} />
          <Route path="/edit-addresses/:id" element={<CreateAddresses />} />
          <Route path="/pension-systems" element={<PensionSystem />} />
          <Route path="/edit-pension-systems/:id" element={<CreatePensionSystem />} />
          <Route path="/work-experiences" element={<WorkExperiences />} />
          <Route path="/edit-work-experiences/:id" element={<CreateWorkExperiences />} />
          <Route path="/educations" element={<Educations />} />
          <Route path="/edit-educations/:id" element={<CreateEducations />} />
          <Route path="/work-condition" element={<WorkCondition />} />
          <Route path="/edit-work-condition/:id" element={<CreateWorkCondition />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;