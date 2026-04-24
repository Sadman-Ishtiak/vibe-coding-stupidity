import React from 'react';

const Analytics = ({ data }) => {
  return (
    <div className="analytics-grid">
      <div className="stat-card">
        <div className="stat-icon users">👥</div>
        <div className="stat-content">
          <h3>Total Users</h3>
          <p className="stat-value">{data.totalUsers || 0}</p>
        </div>
      </div>
      
      <div className="stat-card">
        <div className="stat-icon candidates">🎓</div>
        <div className="stat-content">
          <h3>Candidates</h3>
          <p className="stat-value">{data.candidates || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon companies">🏢</div>
        <div className="stat-content">
          <h3>Companies</h3>
          <p className="stat-value">{data.companies || 0}</p>
        </div>
      </div>

      <div className="stat-card">
        <div className="stat-icon admins">🛡️</div>
        <div className="stat-content">
          <h3>Admins</h3>
          <p className="stat-value">{data.admins || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;