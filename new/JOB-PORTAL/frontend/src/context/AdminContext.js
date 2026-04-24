import React, { createContext, useState } from 'react';

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [analytics, setAnalytics] = useState({});

  const approveUser = (userId) => {
    setUsers(users.map(user =>
      user.id === userId ? { ...user, approved: true } : user
    ));
  };

  const deleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const updateAnalytics = (data) => {
    setAnalytics(data);
  };

  return (
    <AdminContext.Provider value={{
      users,
      pendingApprovals,
      analytics,
      setUsers,
      approveUser,
      deleteUser,
      updateAnalytics,
      setPendingApprovals
    }}>
      {children}
    </AdminContext.Provider>
  );
};
