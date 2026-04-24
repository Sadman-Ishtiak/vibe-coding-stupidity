import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { internshipService } from '../../services/internshipService';
import ViewApplicants from './ViewApplicants';
import './Employers.css';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInternshipId, setSelectedInternshipId] = useState(null);

  useEffect(() => {
    fetchMyInternships();
  }, []);

  const fetchMyInternships = async () => {
    try {
      const data = await internshipService.getMyInternships();
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this internship? This cannot be undone.')) return;
    try {
      await internshipService.deleteInternship(id);
      setInternships(prev => prev.filter(i => i._id !== id));
    } catch (error) {
      alert('Failed to delete internship');
    }
  };

  return (
    <div className="page-container">
      {selectedInternshipId ? (
        <ViewApplicants 
          internshipId={selectedInternshipId} 
          onBack={() => setSelectedInternshipId(null)} 
        />
      ) : (
        <div className="dashboard-content">
          <div className="dashboard-header">
            <div>
              <h1>Company Dashboard</h1>
              <p>Manage your internships and applicants</p>
            </div>
            <button className="btn-primary" onClick={() => navigate('/post-internship')}>
              + Post New Internship
            </button>
          </div>

          <div className="internship-list-section">
            <h2>Your Posted Internships</h2>
            {loading ? (
              <div className="loading-state">Loading your internships...</div>
            ) : internships.length > 0 ? (
              <div className="dashboard-grid">
                {internships.map(internship => (
                  <div key={internship._id} className="dash-card">
                    <div className="dash-card-header">
                      <h3>{internship.title}</h3>
                      <span className={`status-badge ${internship.isActive ? 'active' : 'inactive'}`}>
                        {internship.isActive ? 'Active' : 'Closed'}
                      </span>
                    </div>
                    <div className="dash-card-body">
                      <p className="location-text">📍 {internship.location}</p>
                      <p className="date-text">Posted: {new Date(internship.createdAt).toLocaleDateString()}</p>
                      <div className="stats-row">
                        <div className="stat-item">
                          <span className="stat-num">{internship.applicationCount || 0}</span>
                          <span className="stat-label">Applicants</span>
                        </div>
                      </div>
                    </div>
                    <div className="dash-card-footer">
                      <button 
                        className="btn-text" 
                        onClick={() => setSelectedInternshipId(internship._id)}
                      >
                        View Applicants
                      </button>
                      <div className="action-menu">
                        <button 
                          className="btn-icon-sm" 
                          title="Delete"
                          onClick={() => handleDelete(internship._id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-dashboard">
                <div className="empty-icon">🏢</div>
                <h3>No Internships Posted Yet</h3>
                <p>Start hiring by posting your first internship opportunity.</p>
                <button className="btn-primary" onClick={() => navigate('/post-internship')}>
                  Post Internship
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDashboard;