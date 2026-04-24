import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getMyJobs, getJobStats, updateJobStatus, deleteJob } from '@/services/jobs.service';

export default function ManageJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    pausedJobs: 0,
    totalApplications: 0
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [jobsResponse, statsResponse] = await Promise.all([
        getMyJobs(),
        getJobStats()
      ]);
      
      if (jobsResponse.success) {
        // Filter out jobs without valid IDs and log warnings
        const validJobs = (jobsResponse.data || []).filter(job => {
          const hasId = job._id || job.id;
          if (!hasId) {
            console.warn('Job without ID detected:', job);
          }
          return hasId;
        });
        setJobs(validJobs);
      }
      
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (error) {
      alert('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    
    try {
      const response = await deleteJob(jobId);
      if (response.success) {
        alert('Job deleted successfully');
        loadData();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job');
    }
  };

  const handleToggleStatus = async (jobId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    
    try {
      const response = await updateJobStatus(jobId, newStatus);
      if (response.success) {
        // Update local state immediately (handle jobs that may use `id` or `_id`)
        setJobs(prev => prev.map(job => {
          const id = job._id || job.id;
          return id === jobId ? { ...job, status: newStatus } : job;
        }));
        
        // Update stats immediately
        setStats(prev => ({
          ...prev,
          activeJobs: newStatus === 'active' ? prev.activeJobs + 1 : prev.activeJobs - 1,
          pausedJobs: newStatus === 'paused' ? prev.pausedJobs + 1 : prev.pausedJobs - 1
        }));
        
        alert(`Job ${newStatus} successfully`);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update job status');
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        {/* PAGE TITLE */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-2">Manage Jobs</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHAPE */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path fill="#FFFFFF" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* MANAGE JOBS DASHBOARD */}
        <section className="section">
          <div className="container">
            {/* SUMMARY */}
            <div className="row g-4 mb-4">
              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-briefcase fs-1 text-primary"></i>
                    <h4 className="mt-2 mb-0">{stats.totalJobs}</h4>
                    <p className="text-muted mb-0">Total Jobs</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-check-circle fs-1 text-success"></i>
                    <h4 className="mt-2 mb-0">{stats.activeJobs}</h4>
                    <p className="text-muted mb-0">Active Jobs</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-pause-circle fs-1 text-warning"></i>
                    <h4 className="mt-2 mb-0">{stats.pausedJobs}</h4>
                    <p className="text-muted mb-0">Paused Jobs</p>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="card text-center">
                  <div className="card-body">
                    <i className="uil uil-users-alt fs-1 text-info"></i>
                    <h4 className="mt-2 mb-0">{stats.totalApplications}</h4>
                    <p className="text-muted mb-0">Applications</p>
                  </div>
                </div>
              </div>
            </div>

            {/* HEADER ACTION */}
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Your Job Listings</h5>
              <Link to="/post-job" className="btn btn-primary">
                <i className="uil uil-plus"></i> Post New Job
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : jobs.length > 0 ? (
              jobs.map((job) => {
                const jobId = job._id || job.id;
                
                // Safety check: skip job if ID is missing (should not happen after filtering)
                if (!jobId) {
                  console.error('Job without ID in render:', job);
                  return null;
                }
                
                return (
                  <div key={jobId} className="card mb-3">
                    <div className="card-body">
                      <div className="row align-items-center">
                        {/* JOB INFO */}
                        <div className="col-lg-4">
                          <h6 className="mb-1">{job.title}</h6>
                          <p className="text-muted mb-1">
                            Posted on {new Date(job.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                          <div>
                            <span className="badge bg-soft-primary me-1">{job.category}</span>
                            <span className="badge bg-soft-info me-1">{job.employmentType}</span>
                            <span className="badge bg-soft-secondary">{job.location}</span>
                          </div>
                        </div>

                        {/* APPLICATION COUNT */}
                        <div className="col-lg-2 text-center mt-3 mt-lg-0">
                          <Link to={`/manage-applicants/${jobId}`} className="text-decoration-none d-inline-block">
                            <h5 className="mb-0 link-primary">{job.applicationCount || 0}</h5>
                            <p className="text-muted mb-0 fs-14">Applications</p>
                          </Link>
                        </div>

                        {/* STATUS */}
                        <div className="col-lg-3 text-center mt-3 mt-lg-0 d-flex align-items-center justify-content-center">
                          <span className={`badge ${job.status === 'active' ? 'bg-success' : job.status === 'paused' ? 'bg-warning' : 'bg-danger'} px-3 py-2 fs-14`}>
                            {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                          </span>
                        </div>

                        {/* ACTIONS */}
                        <div className="col-lg-3 mt-3 mt-lg-0 d-flex justify-content-lg-end justify-content-center">
                          <div className="btn-group flex-nowrap">
                            <Link
                              to={`/job-details?id=${jobId}`}
                              className="btn btn-soft-success px-3"
                              title="View Job"
                            >
                              <i className="mdi mdi-eye fs-5"></i>
                            </Link>

                            <Link
                              to={`/post-job?edit=${jobId}`}
                              className="btn btn-soft-primary px-3"
                              title="Edit Job"
                            >
                              <i className="uil uil-edit fs-5"></i>
                            </Link>

                            {job.status !== 'closed' && (
                              <button
                                onClick={() => handleToggleStatus(jobId, job.status)}
                                className={`btn ${job.status === 'active' ? 'btn-soft-warning' : 'btn-soft-success'} px-3`}
                                title={job.status === 'active' ? 'Pause Job' : 'Activate Job'}
                              >
                                <i className={`uil ${job.status === 'active' ? 'uil-pause' : 'uil-play'} fs-5`}></i>
                              </button>
                            )}

                            <button
                              onClick={() => handleDeleteJob(jobId)}
                              className="btn btn-soft-danger px-3"
                              title="Delete Job"
                            >
                              <i className="uil uil-trash-alt fs-5"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="card">
                <div className="card-body text-center py-5">
                  <i className="uil uil-briefcase display-4 text-muted"></i>
                  <h5 className="mt-3">No jobs posted yet</h5>
                  <p className="text-muted">Start by posting your first job listing</p>
                  <Link to="/post-job" className="btn btn-primary mt-2">
                    Post a Job
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}