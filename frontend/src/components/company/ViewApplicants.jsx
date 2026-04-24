import React, { useState, useEffect } from 'react';
import { applicationService } from '../../services/applicationService';

const ViewApplicants = ({ internshipId, onBack }) => {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const data = await applicationService.getCompanyApplications();
        // Filter specifically for this internship
        const filtered = data.filter(app => app.internship._id === internshipId);
        setApplicants(filtered);
      } catch (error) {
        console.error('Failed to load applicants', error);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [internshipId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      await applicationService.updateStatus(appId, newStatus);
      setApplicants(prev => prev.map(app => 
        app._id === appId ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      alert('Failed to update status');
    }
  };

  return (
    <div className="applicants-view">
      <div className="view-header">
        <button className="btn-back" onClick={onBack}>← Back to Dashboard</button>
        <h1>Applicants ({applicants.length})</h1>
      </div>

      {loading ? (
        <div className="loading-state">Loading applicants...</div>
      ) : applicants.length > 0 ? (
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Applied Date</th>
                <th>Cover Letter</th>
                <th>Resume</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {applicants.map(app => (
                <tr key={app._id}>
                  <td>
                    <div className="font-bold">{app.candidate.firstName} {app.candidate.lastName}</div>
                    <div className="text-sm text-gray">{app.candidate.email}</div>
                  </td>
                  <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                  <td>
                    <div className="cover-letter-preview" title={app.coverLetter}>
                      {app.coverLetter ? app.coverLetter.substring(0, 50) + '...' : '-'}
                    </div>
                  </td>
                  <td>
                    {app.resumeUrl ? (
                      <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="link-blue">
                        View Resume
                      </a>
                    ) : '-'}
                  </td>
                  <td>
                    <span className={`badge status-${app.status.toLowerCase()}`}>
                      {app.status}
                    </span>
                  </td>
                  <td>
                    <select 
                      value={app.status} 
                      onChange={(e) => handleStatusChange(app._id, e.target.value)}
                      className="status-select"
                    >
                      <option value="Applied">Applied</option>
                      <option value="Reviewed">Reviewed</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <p>No applicants for this internship yet.</p>
        </div>
      )}
    </div>
  );
};

export default ViewApplicants;