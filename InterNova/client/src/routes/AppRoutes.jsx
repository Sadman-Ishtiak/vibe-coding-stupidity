import { Route, Routes } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProtectedRoute from './ProtectedRoute';
import HomePage from '@/pages/Home';
import Contact from '@/pages/Contact';
import PrivacyPolicy from '@/pages/PrivacyPage';
import JobList from '@/pages/jobs/JobList';
import JobGrid from '@/pages/jobs/JobGrid';
import JobDetails from '@/pages/jobs/JobDetails';
import CandidateDetails from '@/pages/candidates/CandidateDetails';
import CandidateProfile from '@/pages/candidates/CandidateProfile';
import AppliedJobs from '@/pages/candidates/AppliedJobs';
import BookmarkJobs from '@/pages/candidates/BookmarkJobs';
import CompanyList from '@/pages/companies/CompanyList';
import CompanyDetails from '@/pages/companies/CompanyDetails';
import CompanyProfile from '@/pages/companies/CompanyProfile';
import ManageJobs from '@/pages/companies/ManageJobs';
import ManageApplicants from '@/pages/companies/ManageApplicants';
import PostJob from '@/pages/companies/PostJob';
import SignIn from '@/pages/auth/SignIn';
import SignUp from '@/pages/auth/SignUp';
import ResetPassword from '@/pages/auth/ResetPassword';
import NewPassword from '@/pages/auth/NewPassword';
import VerifyEmail from '@/pages/auth/VerifyEmail';
import NotFound from '@/pages/NotFound';

/**
 * AppRoutes Component
 * Centralized routing configuration for the application
 * Uses React Router v6 for client-side navigation
 * ✅ Protected routes with role-based access control
 * ✅ Layout wrapper ensures Navbar and Footer persist on non-auth pages
 * ✅ Auth pages outside Layout to prevent double-wrapping
 */
export default function AppRoutes() {
  return (
    <Routes>
      {/* Authentication Routes - NO LAYOUT (auth pages have their own structure) */}
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/sign-up" element={<SignUp />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/reset-password/:token" element={<NewPassword />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/new-password" element={<NewPassword />} />

      {/* All other routes wrapped in Layout for persistent Navbar & Footer */}
      <Route element={<Layout />}>
        {/* Main Pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Job Routes - Public */}
        <Route path="/job-list" element={<JobList />} />
        <Route path="/job-grid" element={<JobGrid />} />
        <Route path="/job-details" element={<JobDetails />} />
        <Route path="/job-details/:id" element={<JobDetails />} />
        
        {/* Candidate Routes - Protected (Candidate Only) */}
        <Route 
          path="/candidate-details" 
          element={<CandidateDetails />} 
        />
        <Route 
          path="/candidate-details/:id" 
          element={<CandidateDetails />} 
        />
        <Route 
          path="/candidate-profile" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <CandidateProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/applied-jobs" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <AppliedJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/bookmark-jobs" 
          element={
            <ProtectedRoute allowedRoles={['candidate']}>
              <BookmarkJobs />
            </ProtectedRoute>
          } 
        />
        
        {/* Company/Recruiter Routes - Protected (Recruiter Only) */}
        <Route path="/company-list" element={<CompanyList />} />
        <Route path="/company-details/:id" element={<CompanyDetails />} />
        <Route 
          path="/manage-jobs" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <ManageJobs />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/manage-applicants/:jobId" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <ManageApplicants />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/post-job" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <PostJob />
            </ProtectedRoute>
          } 
        />
        
        {/* Backward compatibility - redirect old route name */}
        <Route 
          path="/manage-jobs-post" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <PostJob />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/recruiter-profile" 
          element={
            <ProtectedRoute allowedRoles={['recruiter']}>
              <CompanyProfile />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/companies/profile" 
          element={
            <ProtectedRoute allowedRoles={['recruiter', 'company']}>
              <CompanyProfile />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 - Not Found */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
