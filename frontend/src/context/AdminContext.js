import React, { createContext, useState, useCallback } from 'react';
import { adminService } from '../services/adminService';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalUsers: 0,
    candidates: 0,
    companies: 0,
    admins: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  }, []);

  const approveUser = async (userId) => {
    try {
      await adminService.approveUser(userId);
      setUsers(prev => prev.map(user => 
        user._id === userId ? { ...user, isApproved: true } : user
      ));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to approve user');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(user => user._id !== userId));
      fetchAnalytics(); // Refresh stats
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete user');
    }
  };

  return (
    <AdminContext.Provider value={{
      users,
      analytics,
      loading,
      error,
      fetchUsers,
      fetchAnalytics,
      approveUser,
      deleteUser,
    }}>
      {children}
    </AdminContext.Provider>
  );
};
