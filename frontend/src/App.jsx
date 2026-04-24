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
import Employers from './components/company/Employers';
import Candidates from './components/candidate/Candidates';
import Logout from './pages/Logout';

import PrivateRoute from './routes/PrivateRoute';

import './main.css';

import InternshipDetails from './components/candidate/InternshipDetails';
import PostInternship from './components/company/PostInternship';
import AIResumeTips from './components/candidate/AIResumeTips';
import CompanyRoute from './routes/CompanyRoute';
import CandidateRoute from './routes/CandidateRoute';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<Home />} />
      <Route path="find-jobs" element={<BrowseInternships />} />
      <Route path="browse-internships" element={<BrowseInternships />} />
      <Route path="browse" element={<BrowseInternships />} />
      <Route path="internships/:id" element={<InternshipDetails />} />
      
      <Route path="employers" element={<Employers />} />
      <Route path="candidates" element={<Candidates />} />
      
      {/* Protected Routes */}
      <Route
        path="post-internship"
        element={
          <PrivateRoute>
            <CompanyRoute>
              <PostInternship />
            </CompanyRoute>
          </PrivateRoute>
        }
      />
      
      <Route
        path="ai-coach"
        element={
          <PrivateRoute>
            <CandidateRoute>
              <AIResumeTips />
            </CandidateRoute>
          </PrivateRoute>
        }
      />

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
