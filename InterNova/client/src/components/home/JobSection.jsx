import { useState, useEffect } from "react";
import JobTabs from "./JobTabs";
import { getHomeJobs } from "@/services/jobs.service";

const JobSection = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await getHomeJobs();
        setJobs(response.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to load jobs');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <section className="section bg-light">
      <div className="container">
        {/* Section Title */}
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <div className="section-title text-center mb-4 pb-2">
              <h4 className="title">New &amp; Random Jobs</h4>
              <p className="text-muted mb-1">
                Post a job to tell us about your project. We'll quickly match you
                with the right Freelancers.
              </p>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="row">
            <div className="col-lg-12 text-center">
              <p className="text-muted">Loading jobs...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="row">
            <div className="col-lg-12 text-center">
              <p className="text-danger">{error}</p>
            </div>
          </div>
        )}

        {/* Jobs Display */}
        {!loading && !error && <JobTabs jobs={jobs} />}
      </div>
    </section>
  );
};

export default JobSection;
