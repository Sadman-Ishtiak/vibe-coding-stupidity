import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchMyApplications, deleteApplication } from '@/services/applications.service';
import { getCompany } from '@/services/companies.service';
import { useAuth } from '@/context/AuthContext';

export default function AppliedJobs() {
  const { isAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // all, pending, shortlisted, rejected, accepted

  // ✅ Auth Protection
  useEffect(() => {
    if (!authLoading && !isAuth) {
      navigate('/sign-in', { replace: true });
    }
  }, [authLoading, isAuth, navigate]);

  // ✅ Load applications with proper cleanup
  const loadApplications = useCallback(async () => {
    const controller = new AbortController();
    
    try {
      setLoading(true);
      setError(null);
      const response = await fetchMyApplications({ signal: controller.signal });
      
      if (response.success) {
        // ✅ Filter out applications where job was deleted
        const validApplications = (response.data || []).filter(app => app.jobId);
        setApplications(validApplications);
      } else {
        setError('Failed to load applications');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        if (error.response?.status === 401) {
          navigate('/sign-in', { replace: true });
        } else {
          setError(error.response?.data?.message || 'Failed to load applications');
        }
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }

    return () => controller.abort();
  }, [navigate]);

  useEffect(() => {
    if (!authLoading && isAuth) {
      loadApplications();
    }
  }, [authLoading, isAuth, loadApplications]);

  const filteredApplications = applications.filter(app => {
    if (filter === 'all') return true;
    return app.status === filter;
  });

  const handleDeleteApplication = async (applicationId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your application for "${jobTitle}"?`)) {
      return;
    }

    try {
      const response = await deleteApplication(applicationId);
      if (response.success) {
        // Remove from local state
        setApplications(prev => prev.filter(app => app._id !== applicationId && app.id !== applicationId));
        alert('✅ Application cancelled successfully');
      } else {
        alert('❌ Failed to cancel application: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Delete application error:', error);
      alert('❌ Failed to cancel application: ' + (error.response?.data?.message || error.message || 'Unknown error'));
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'shortlisted':
        return 'bg-success';
      case 'rejected':
        return 'bg-danger';
      case 'accepted':
        return 'bg-info';
      default:
        return 'bg-warning';
    }
  };

  // ✅ Don't render if auth is still loading
  if (authLoading) {
    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Don't render content if not authenticated
  if (!isAuth) {
    return null;
  }

  return (
    <div className="main-content">
      <div className="page-content">

        {/* ✅ Page Title Box */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Applied Jobs</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ✅ Wave Shape */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path
                fill="#FFFFFF"
                fillOpacity="1"
                d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* Statistics */}
        <section className="section pt-0">
          <div className="container">
            <div className="row">
              <div className="col-lg-3 col-md-6">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-briefcase-alt fs-1 text-primary"></i>
                    <h4 className="mt-2 mb-0">{applications.length}</h4>
                    <p className="text-muted mb-0">Total Applied</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-clock fs-1 text-warning"></i>
                    <h4 className="mt-2 mb-0">
                      {applications.filter(a => a.status === 'pending').length}
                    </h4>
                    <p className="text-muted mb-0">Pending Review</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-check-circle fs-1 text-success"></i>
                    <h4 className="mt-2 mb-0">
                      {applications.filter(a => a.status === 'shortlisted').length}
                    </h4>
                    <p className="text-muted mb-0">Shortlisted</p>
                  </div>
                </div>
              </div>

              <div className="col-lg-3 col-md-6">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-times-circle fs-1 text-danger"></i>
                    <h4 className="mt-2 mb-0">
                      {applications.filter(a => a.status === 'rejected').length}
                    </h4>
                    <p className="text-muted mb-0">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Applications List */}
        <section className="section pt-0">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h5 className="mb-0">Your Applications</h5>

                      <div className="btn-group" role="group">
                        {['all', 'pending', 'shortlisted', 'rejected', 'accepted'].map(key => (
                          <button
                            key={key}
                            type="button"
                            className={`btn btn-sm ${
                              filter === key ? 'btn-primary' : 'btn-outline-primary'
                            }`}
                            onClick={() => setFilter(key)}
                          >
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                        <p className="mt-2 text-muted">Loading applications...</p>
                      </div>
                    ) : error ? (
                      <div className="alert alert-danger d-flex justify-content-between align-items-center">
                        <span>{error}</span>
                        <button onClick={loadApplications} className="btn btn-sm btn-outline-danger">
                          Retry
                        </button>
                      </div>
                    ) : filteredApplications.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Job Title</th>
                              <th>Company</th>
                              <th>Applied Date</th>
                              <th>Status</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredApplications.map(app => (
                              <tr key={app._id || app.id}>
                                <td><h6 className="mb-0">{app.jobTitle || 'N/A'}</h6></td>
                                <td>{app.company || app.companyName || 'N/A'}</td>
                                <td>{new Date(app.appliedAt || app.appliedDate).toLocaleDateString()}</td>
                                <td>
                                  <span className={`badge ${getStatusBadgeClass(app.status)}`}>
                                    {app.status || 'pending'}
                                  </span>
                                </td>
                                <td>
                                  {app.jobId && (
                                    <Link
                                      to={`/job-details?id=${encodeURIComponent(app.jobId)}`}
                                      className="btn btn-sm btn-outline-primary me-2"
                                    >
                                      View Job
                                    </Link>
                                  )}
                                  <button
                                    onClick={() => handleDeleteApplication(app._id || app.id, app.jobTitle)}
                                    className="btn btn-sm btn-outline-danger"
                                    title="Cancel Application"
                                  >
                                    <i className="uil uil-trash-alt"></i> Cancel
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="text-center py-5">
                        <i className="uil uil-briefcase-alt display-4 text-muted"></i>
                        <h5 className="mt-3">No applications found</h5>
                        <p className="text-muted">
                          You haven't applied to any jobs yet.
                        </p>
                        <Link to="/job-list" className="btn btn-primary mt-2">
                          Browse Jobs
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
