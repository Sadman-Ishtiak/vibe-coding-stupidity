import React from 'react';
import { useAuth } from '../hooks/useAuth';
import CandidateDashboard from '../components/candidate/CandidateDashboard';
import CompanyDashboard from '../components/company/CompanyDashboard';
import AdminPanel from '../components/admin/AdminPanel';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Please login to view dashboard</div>;
  }

  switch (user.role) {
    case 'candidate':
      return <CandidateDashboard />;
    case 'company':
      return <CompanyDashboard />;
    case 'admin':
      return <AdminPanel />;
    default:
      return <div>Invalid role</div>;
  }
};

export default DashboardRouter;
