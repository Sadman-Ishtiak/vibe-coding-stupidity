import React from 'react';
import {
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CompanyProvider } from './context/CompanyContext';
import { CandidateProvider } from './context/CandidateContext';
import { AdminProvider } from './context/AdminContext';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import DashboardRouter from './pages/DashboardRouter';
import RootLayout from './pages/RootLayout';
import BrowseInternships from './components/candidate/BrowseInternships';
import EmployerDetails from './components/candidate/EmployerDetails';
import InternshipDetails from './components/candidate/InternshipDetails';
import ApplyInternship from './components/candidate/ApplyInternship';
import Employers from './components/company/Employers';
import Candidates from './components/candidate/Candidates';
import Logout from './pages/Logout';
import CandidateDashboard from './components/candidate/CandidateDashboard';
import CompanyDashboard from './components/company/CompanyDashboard';

import PrivateRoute from './routes/PrivateRoute';

import './main.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="apply" element={<ApplyInternship />} />
      <Route path="internship/:id" element={<InternshipDetails />} />
      <Route path="internship/:id/apply" element={<ApplyInternship />} />
      <Route path="find-jobs" element={<BrowseInternships />} />
      <Route path="browse-internships" element={<BrowseInternships />} />
      <Route path="browse" element={<BrowseInternships />} />
  <Route path="employers" element={<Employers />} />
  <Route path="company/:id" element={<EmployerDetails />} />
  <Route path="candidates" element={<Candidates />} />
  {/* Temporary dev route to view CandidateDashboard directly */}
  <Route path="candidate-only" element={<CandidateDashboard />} />
  {/* Temporary dev route to view CompanyDashboard directly */}
  <Route path="company-only" element={<CompanyDashboard />} />
  <Route path="logout" element={<Logout />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route
        path="dashboard"
        element={
          <PrivateRoute>
            <DashboardRouter />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <AuthProvider>
      <CompanyProvider>
        <CandidateProvider>
          <AdminProvider>
            <RouterProvider router={router} future={{ v7_startTransition: true }} />
          </AdminProvider>
        </CandidateProvider>
      </CompanyProvider>
    </AuthProvider>
  );
}

export default App;
