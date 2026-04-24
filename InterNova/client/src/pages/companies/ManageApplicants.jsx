import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchApplicants, updateApplicationStatus } from '@/services/applications.service';
import { normalizeImageUrl } from '@/utils/imageHelpers';

function ManageApplicants() {
  const { jobId } = useParams();
  
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState('');

  useEffect(() => {
    let isMounted = true;
    
    if (jobId) {
      loadApplicants();
    } else {
      setLoading(false);
    }
    
    return () => {
      isMounted = false;
    };
    
    async function loadApplicants() {
      try {
        setLoading(true);
        const response = await fetchApplicants(jobId);
        if (isMounted && response.success) {
          setApplicants(response.data || []);
          setJobTitle(response.meta?.jobTitle || '');
        }
      } catch (error) {
        if (isMounted) {
          alert(error.response?.data?.message || 'Failed to load applicants');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
  }, [jobId]);

  const handleUpdateStatus = async (applicantId, newStatus) => {
    try {
      const response = await updateApplicationStatus(applicantId, newStatus);
      if (response.success) {
        // Update local state
        setApplicants(prev => prev.map(app => 
          app._id === applicantId ? { ...app, status: newStatus } : app
        ));
        alert(`Application ${newStatus}!`);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    }
  };

  // Calculate stats
  const stats = {
    total: applicants.length,
    pending: applicants.filter(a => a.status === 'pending').length,
    shortlisted: applicants.filter(a => a.status === 'shortlisted').length
  };

  return (
    <div className="main-content">
      <div className="page-content">
      <section className="page-title-box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-7">
              <div className="text-center text-white">
                <h3 className="mb-2">Applicant Management</h3>
                {jobTitle && <p className="mb-0">for: {jobTitle}</p>}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
            <path fill="#FFFFFF" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z" />
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {!jobId ? (
            <div className="card">
              <div className="card-body text-center py-5">
                <i className="uil uil-info-circle display-4 text-muted"></i>
                <h5 className="mt-3">No Job Selected</h5>
                <p className="text-muted">Please select a job from Manage Jobs to view applicants</p>
              </div>
            </div>
          ) : (
            <>
              <div className="row g-4 mb-4">
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <i className="uil uil-users-alt fs-1 text-primary"></i>
                      <h4 className="mt-2 mb-0">{stats.total}</h4>
                      <p className="text-muted mb-0">Total Applicants</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <i className="uil uil-clock fs-1 text-warning"></i>
                      <h4 className="mt-2 mb-0">{stats.pending}</h4>
                      <p className="text-muted mb-0">Pending Review</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card text-center">
                    <div className="card-body">
                      <i className="uil uil-check-circle fs-1 text-success"></i>
                      <h4 className="mt-2 mb-0">{stats.shortlisted}</h4>
                      <p className="text-muted mb-0">Shortlisted</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="card-body p-4" style={{ minHeight: '500px' }}>
                  <h5 className="mb-4">Applications</h5>
                  
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary"></div>
                    </div>
                  ) : applicants.length > 0 ? (
                    <div className="table-responsive" style={{ paddingBottom: '150px' }}>
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Candidate</th>
                            <th>Designation</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {applicants.map((applicant) => {
                            // ✅ Properly construct candidate name from firstName + lastName
                            const candidateName = applicant.candidate?.firstName && applicant.candidate?.lastName
                              ? `${applicant.candidate.firstName} ${applicant.candidate.lastName}`
                              : applicant.candidate?.name || 'N/A';
                            
                            // ✅ Normalize profile image URL
                            const profileImage = normalizeImageUrl(applicant.candidate?.profileImage) || "/assets/images/user/img-01.jpg";
                            
                            return (
                              <tr key={applicant._id}>
                                <td>
                                  <div className="d-flex align-items-center">
                                    <img 
                                      src={profileImage} 
                                      alt="" 
                                      className="avatar-sm rounded-circle me-2"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                      onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/assets/images/user/img-01.jpg';
                                      }}
                                    />
                                    <div>
                                      <Link 
                                        to={`/candidate-details/${applicant.candidate?._id || applicant.candidateId}`}
                                        className="text-dark text-decoration-none"
                                      >
                                        <h6 className="mb-0" style={{ cursor: 'pointer' }}>
                                          {candidateName}
                                        </h6>
                                      </Link>
                                      <small className="text-muted">{applicant.candidate?.email || 'N/A'}</small>
                                    </div>
                                  </div>
                                </td>
                                <td>{applicant.candidate?.designation || 'N/A'}</td>
                                <td>{new Date(applicant.appliedAt).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${
                                    applicant.status === 'shortlisted' ? 'bg-success' :
                                    applicant.status === 'rejected' ? 'bg-danger' :
                                    applicant.status === 'accepted' ? 'bg-info' :
                                    'bg-warning'
                                  }`}>
                                    {applicant.status}
                                  </span>
                                </td>
                                <td>
                                  <div className="dropdown">
                                    <button className="btn btn-sm btn-outline-primary dropdown-toggle" data-bs-toggle="dropdown">
                                      Actions
                                    </button>
                                    <ul className="dropdown-menu">
                                      <li>
                                        <button 
                                          className="dropdown-item" 
                                          onClick={() => handleUpdateStatus(applicant._id, 'shortlisted')}
                                        >
                                          Shortlist
                                        </button>
                                      </li>
                                      <li>
                                        <button 
                                          className="dropdown-item" 
                                          onClick={() => handleUpdateStatus(applicant._id, 'accepted')}
                                        >
                                          Accept
                                        </button>
                                      </li>
                                      <li>
                                        <button 
                                          className="dropdown-item text-danger" 
                                          onClick={() => handleUpdateStatus(applicant._id, 'rejected')}
                                        >
                                          Reject
                                        </button>
                                      </li>
                                    </ul>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="uil uil-users-alt display-4 text-muted"></i>
                      <h5 className="mt-3">No Applicants Yet</h5>
                      <p className="text-muted">Applications will appear here once candidates apply</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </section>
      </div>
    </div>
  );
}

export default ManageApplicants;