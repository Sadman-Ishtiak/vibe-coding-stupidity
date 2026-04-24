import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import JobListCard from '@/components/cards/JobListCard';
import LocationSelect from '@/components/common/LocationSelect';
import { getBookmarks, removeBookmark } from '@/services/candidates.service';
import { useAuth } from '@/context/AuthContext';

export default function BookmarkJobs() {
  const { isAuth, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [keyword, setKeyword] = useState('');
  const [jobType, setJobType] = useState('');
  const [location, setLocation] = useState('');

  // ✅ Auth Protection
  useEffect(() => {
    if (!authLoading && !isAuth) {
      navigate('/sign-in', { replace: true });
    }
  }, [authLoading, isAuth, navigate]);

  // ✅ Load bookmarked jobs with proper cleanup
  const loadBookmarkedJobs = useCallback(async () => {5
    let isMounted = true;

    try {
      setLoading(true);
      setError(null);
      const response = await getBookmarks();
      
      if (isMounted && response.success) {
        // ✅ Filter out bookmarks where job was deleted and mark them as bookmarked
        const validBookmarks = (response.data || [])
          .filter(job => job && job._id)
          .map(job => ({ ...job, isBookmarked: true }));
        setAllJobs(validBookmarks);
        setFilteredJobs(validBookmarks);
      } else if (isMounted) {
        setError('Failed to load bookmarks');
      }
    } catch (error) {
      if (isMounted) {
        if (error.response?.status === 401) {
          navigate('/sign-in', { replace: true });
        } else {
          setError(error.response?.data?.message || 'Failed to load bookmarks');
        }
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  useEffect(() => {
    if (!authLoading && isAuth) {
      loadBookmarkedJobs();
    }
  }, [authLoading, isAuth, loadBookmarkedJobs]);

  // ✅ Apply filters with proper dependencies
  const applyFilters = useCallback(() => {
    let jobs = [...allJobs];

    if (keyword) {
      const lowerKeyword = keyword.toLowerCase();
      jobs = jobs.filter(job => {
        const title = job.title?.toLowerCase() || '';
        const companyName = job.company?.name?.toLowerCase() || job.companyName?.toLowerCase() || '';
        
        return title.includes(lowerKeyword) || 
               companyName.includes(lowerKeyword);
      });
    }

    if (jobType) {
      jobs = jobs.filter(
        job => job.employmentType?.toLowerCase() === jobType.toLowerCase()
      );
    }

    if (location) {
      jobs = jobs.filter(job =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    setFilteredJobs(jobs);
  }, [keyword, jobType, location, allJobs]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const clearFilters = () => {
    setKeyword('');
    setJobType('');
    setLocation('');
  };

  // ✅ Remove bookmark with optimistic UI update and alert
  const removeBookmarkHandler = async (id) => {
    if (!id) {
      alert('❌ Cannot remove bookmark: Invalid job ID');
      return;
    }

    // ✅ Optimistic UI update
    const previousJobs = [...allJobs];
    const updated = allJobs.filter(job => (job._id || job.id) !== id);
    setAllJobs(updated);
    setFilteredJobs(updated);

    try {
      const response = await removeBookmark(id);
      if (response.success) {
        alert('✅ Successfully removed from bookmarks');
      } else {
        // ✅ Rollback on failure
        setAllJobs(previousJobs);
        applyFilters();
        alert('❌ Failed to remove bookmark');
      }
    } catch (error) {
      // ✅ Rollback on error
      setAllJobs(previousJobs);
      applyFilters();
      alert('❌ ' + (error.response?.data?.message || 'Failed to remove bookmark'));
    }
  };

  // ✅ Don't render if auth is still loading
  if (authLoading) {
    return (
      <Layout>
        <div className="main-content">
          <div className="page-content">
            <div className="container text-center mt-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // ✅ Don't render content if not authenticated
  if (!isAuth) {
    return null;
  }

  return (
    <Layout>
      {/* Page Title */}
      <section className="page-title-box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center text-white">
                <h3 className="mb-4">Bookmarked Jobs</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Shape */}
      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
            <path
              fill="#FFFFFF"
              d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"
            />
          </svg>
        </div>
      </div>

      {/* Content */}
      <section className="section">
        <div className="container">

          {/* Filters */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row g-3 align-items-end">

                <div className="col-md-4">
                  <label className="form-label">Keyword</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Job title or company"
                    value={keyword}
                    onChange={e => setKeyword(e.target.value)}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label">Job Type</label>
                  <select
                    className="form-select"
                    value={jobType}
                    onChange={e => setJobType(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Location</label>
                  <LocationSelect
                    name="location"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="All Locations"
                    className="form-select"
                  />
                </div>

                <div className="col-md-2">
                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    Clear
                  </button>
                </div>

              </div>
            </div>
          </div>

          {/* Result Count */}
          <div className="mb-3 text-muted">
            Showing {filteredJobs.length} bookmarked job(s)
          </div>

          {/* Job List */}
          {error && (
            <div className="alert alert-danger d-flex justify-content-between align-items-center">
              <span>{error}</span>
              <button onClick={loadBookmarkedJobs} className="btn btn-sm btn-outline-danger">
                Retry
              </button>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary"></div>
              <p className="mt-2 text-muted">Loading bookmarks...</p>
            </div>
          ) : filteredJobs.length > 0 ? (
            filteredJobs.map(job => (
              <JobListCard 
                key={job._id || job.id} 
                job={job}
                isBookmarkPage={true}
                onRemoveBookmark={removeBookmarkHandler}
              />
            ))
          ) : (
            <div className="card text-center py-5">
              <div className="card-body">
                <i className="uil uil-bookmark display-4 text-muted"></i>
                <h5 className="mt-3">No bookmarked jobs</h5>
                <p className="text-muted">
                  {keyword || jobType || location
                    ? 'Try adjusting your filters'
                    : "You haven't bookmarked any jobs yet"}
                </p>
                <Link to="/job-list" className="btn btn-primary mt-2">
                  Browse Jobs
                </Link>
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  );
}
