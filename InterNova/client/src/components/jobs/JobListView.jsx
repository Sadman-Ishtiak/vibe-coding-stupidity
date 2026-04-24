import JobListCard from '@/components/cards/JobListCard';

/**
 * Reusable component to render a list of jobs
 * @param {Array} jobs - Array of job objects to render
 */
const JobListView = ({ jobs = [] }) => {
  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center mt-4">
        <p className="text-muted">No jobs available</p>
      </div>
    );
  }

  return (
    <>
      {jobs.map((job) => (
        <JobListCard key={job._id || job.id} job={job} />
      ))}
    </>
  );
};

export default JobListView;
