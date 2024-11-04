// src/App.tsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { AuthProvider } from './context/AuthProvider'; // Import your AuthProvider
import PrivateRoute from './components/PrivateRoute'; // PrivateRoute component
import LoginPage from './pages/Login'; // Example login page
import User from './pages/users/User'; // Example private usuarios page
import CreateUser from './pages/users/CreateUser';
import Roles from './pages/Roles';
import CreateRol from './pages/CreateRol';
import Option from './pages/Option';
import CreatePermission from './pages/CreatePermission';
import PersonalInformation from './pages/persona-information/PersonalInformation';
import CreatePersonalInformation from './pages/persona-information/CreatePersonalInformation';
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
import Hobby from './pages/Hobby';
import CreateHobbie from './pages/CreateHobbie';
import Complementaries from './pages/Complementaries';
import CreateComplementaries from './pages/CreateComplementaries';
import Dependent from './pages/Dependent';
import CreateDependent from './pages/CreateDependent';
import Incidences from './pages/Incidences';
import CreateIncidences from './pages/CreateIncidences';
import UserBanks from './pages/UserBanks';
import CreateUserBanks from './pages/CreateUserBanks';
import Project from './pages/projects/Project';
import CreateProject from './pages/projects/CreateProject';
import MasterData from './pages/master-data/MasterData';
import CreateMasterData from './pages/master-data/CreateMasterData';
import PeriodicEvaluations from './pages/periodic-evaluations/PeriodicEvaluations';
import CreatePeriodicEvaluations from './pages/periodic-evaluations/CreatePeriodicEvaluations';
import Evaluations from './pages/evaluations/Evaluations';
import CreateEvaluations from './pages/evaluations/CreateEvaluations';
import CreateFamilyRelationshipTypes from './pages/family-relationship-types/CreateFamilyRelationshipTypes';
import FamilyRelationshipTypes from './pages/family-relationship-types/FamilyRelationshipTypes';
import BeneficiaryProofDocuments from './pages/beneficiary-proof-documents/BeneficiaryProofDocuments';
import CreateBeneficiaryProofDocuments from './pages/beneficiary-proof-documents/CreateBeneficiaryProofDocuments';
import CreateQualityRatings from './pages/quality-ratings/CreateQualityRatings';
import QualityRatings from './pages/quality-ratings/QualityRatings';
import Dashboard from './pages/dashboard/Dashboard';
import FormUsers from './pages/form-users/FormUsers';
import CreateFormUsers from './pages/form-users/CreateFormUsers';
import { ThemeProvider } from './utils/ThemeContext';
import { ReportsPage } from './pages/reports';
import Contract from './pages/contract/Contract';
import CreateContract from './pages/contract/CreateContract';
import Management from './pages/management/Management';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/usuarios"
              element={
                <PrivateRoute>
                  <User />
                </PrivateRoute>
              }
            />
            <Route path="/form" element={<FormUsers />} />
            <Route path="/create-form" element={<CreateFormUsers />} />
            <Route path="/edit-form/:id" element={<CreateFormUsers />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-user" element={<CreateUser />} />
            <Route path="/edit-user/:id" element={<CreateUser />} />
            <Route path="/roles" element={<Roles />} />
            <Route path="/create-rol" element={<CreateRol />} />
            <Route path="/edit-rol/:id" element={<CreateRol />} />
            <Route path="/options" element={<Option />} />
            <Route path="/create-option" element={<CreatePermission />} />
            <Route path="/edit-option/:id" element={<CreatePermission />} />
            <Route path="/basic" element={<PersonalInformation />} />
            <Route
              path="/edit-basic/:id"
              element={<CreatePersonalInformation />}
            />
            <Route path="/addresses" element={<Addresses />} />
            <Route path="/edit-addresses/:id" element={<CreateAddresses />} />
            <Route path="/pension-systems" element={<PensionSystem />} />
            <Route
              path="/edit-pension-systems/:id"
              element={<CreatePensionSystem />}
            />
            <Route path="/work-experiences" element={<WorkExperiences />} />
            <Route
              path="/edit-work-experiences/:id"
              element={<CreateWorkExperiences />}
            />
            <Route path="/educations" element={<Educations />} />
            <Route path="/edit-educations/:id" element={<CreateEducations />} />
            <Route path="/work-condition" element={<WorkCondition />} />
            <Route
              path="/edit-work-condition/:id"
              element={<CreateWorkCondition />}
            />
            <Route path="/hobbie" element={<Hobby />} />
            <Route path="/edit-hobbie/:id" element={<CreateHobbie />} />
            <Route path="/complementaries" element={<Complementaries />} />
            <Route
              path="/edit-complementaries/:id"
              element={<CreateComplementaries />}
            />
            <Route path="/dependent" element={<Dependent />} />
            <Route path="/edit-dependent/:id" element={<CreateDependent />} />
            <Route path="/incidences" element={<Incidences />} />
            <Route path="/create-incidences" element={<CreateIncidences />} />
            <Route path="/edit-incidences/:id" element={<CreateIncidences />} />
            <Route path="/user-banks" element={<UserBanks />} />
            <Route path="/edit-user-banks/:id" element={<CreateUserBanks />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/create-projects" element={<CreateProject />} />
            <Route path="/edit-projects/:id" element={<CreateProject />} />
            <Route path="/master-data" element={<MasterData />} />
            <Route
              path="/edit-master-data/:id"
              element={<CreateMasterData />}
            />
            <Route path="/create-master-data" element={<CreateMasterData />} />
            <Route
              path="/periodic-evaluations"
              element={<PeriodicEvaluations />}
            />
            <Route
              path="/edit-periodic-evaluations/:id"
              element={<CreatePeriodicEvaluations />}
            />
            <Route
              path="/create-periodic-evaluations"
              element={<CreatePeriodicEvaluations />}
            />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route
              path="/edit-evaluations/:id"
              element={<CreateEvaluations />}
            />
            <Route path="/create-evaluations" element={<CreateEvaluations />} />
            <Route
              path="/family-relationship-types"
              element={<FamilyRelationshipTypes />}
            />
            <Route
              path="/edit-family-relationship-types/:id"
              element={<CreateFamilyRelationshipTypes />}
            />
            <Route
              path="/create-family-relationship-types"
              element={<CreateFamilyRelationshipTypes />}
            />
            <Route
              path="/beneficiary-proof-documents"
              element={<BeneficiaryProofDocuments />}
            />
            <Route
              path="/edit-beneficiary-proof-documents/:id"
              element={<CreateBeneficiaryProofDocuments />}
            />
            <Route
              path="/create-beneficiary-proof-documents"
              element={<CreateBeneficiaryProofDocuments />}
            />
            <Route path="/quality-ratings" element={<QualityRatings />} />
            <Route
              path="/edit-quality-ratings/:id"
              element={<CreateQualityRatings />}
            />
            <Route
              path="/create-quality-ratings"
              element={<CreateQualityRatings />}
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <ReportsPage />
                </PrivateRoute>
              }
            />
            <Route
              path="/rrhh"
              element={
                <PrivateRoute>
                  <Management />
                </PrivateRoute>
              }
            />
            <Route path="/contract" element={<Contract />} />
            <Route
              path="/edit-contract/:id"
              element={<CreateContract />}
            />
            <Route
              path="/create-contract"
              element={<CreateContract />}
            />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
