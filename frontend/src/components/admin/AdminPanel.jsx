import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import UserListTable from './UserListTable';
import Analytics from './Analytics';
import './AdminPanel.css'; // We will create this next

const AdminPanel = () => {
  const { 
    users, 
    analytics, 
    fetchUsers, 
    fetchAnalytics, 
    approveUser, 
    deleteUser,
    loading 
  } = useContext(AdminContext);

  useEffect(() => {
    fetchUsers();
    fetchAnalytics();
  }, [fetchUsers, fetchAnalytics]);

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage users and view platform statistics</p>
      </div>

      <section className="analytics-section">
        <h2>Overview</h2>
        <Analytics data={analytics} />
      </section>

      <section className="users-section">
        <div className="section-header">
          <h2>User Management</h2>
          <button className="btn-outline" onClick={fetchUsers}>Refresh List</button>
        </div>
        
        {loading ? (
          <div className="loading-spinner">Loading users...</div>
        ) : (
          <UserListTable 
            users={users} 
            onApprove={approveUser} 
            onDelete={deleteUser} 
          />
        )}
      </section>
    </div>
  );
};

export default AdminPanel;