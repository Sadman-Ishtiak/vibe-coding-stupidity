import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import './Candidates.css';

const CandidateDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await applicationService.getCandidateApplications();
        setApplications(data);
      } catch (error) {
        console.error('Failed to load applications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, []);

  return (
    <div className="page-container">
      <div className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Candidate Dashboard</h1>
            <p>Track your applications and career progress</p>
          </div>
          <Link to="/ai-coach" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span>🤖</span> AI Resume Coach
          </Link>
        </div>

        <div className="dashboard-grid-stats">
          <div className="stat-card">
            <h3>Applied</h3>
            <p className="stat-value">{applications.length}</p>
          </div>
          <div className="stat-card">
            <h3>Interviewing</h3>
            <p className="stat-value">
              {applications.filter(a => ['Shortlisted', 'Reviewed'].includes(a.status)).length}
            </p>
          </div>
          <div className="stat-card">
            <h3>Offers</h3>
            <p className="stat-value">
              {applications.filter(a => a.status === 'Accepted').length}
            </p>
          </div>
        </div>

        <div className="applications-section mt-4">
          <h2>My Applications</h2>
          {loading ? (
            <div className="loading-state">Loading history...</div>
          ) : applications.length > 0 ? (
            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Internship Role</th>
                    <th>Company</th>
                    <th>Applied On</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app._id}>
                      <td>
                        <div className="font-bold">{app.internship?.title || 'Unknown Role'}</div>
                        <div className="text-sm text-gray">{app.internship?.location}</div>
                      </td>
                      <td>{app.internship?.companyName || 'Unknown Company'}</td>
                      <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge status-${app.status?.toLowerCase()}`}>
                          {app.status}
                        </span>
                      </td>
                      <td>
                        <Link to={`/internships/${app.internship?._id}`} className="btn-text">
                          View Role
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-dashboard">
              <div className="empty-icon">📝</div>
              <h3>No Applications Yet</h3>
              <p>Start browsing thousands of internships and apply today.</p>
              <Link to="/browse" className="btn-primary">Browse Internships</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboard;