import { Link } from 'react-router-dom';
import { normalizeImageUrl } from '@/utils/imageHelpers';

const RelatedJobCard = ({ job }) => {
  if (!job) {
    return null;
  }

  const jobId = job._id || job.id;
  const companyLogo = normalizeImageUrl(job.company?.logo) || '/assets/images/featured-job/img-01.png';
  const companyName = job.company?.name || 'Company Name';
  const jobLink = jobId ? `/job-details?id=${encodeURIComponent(jobId)}` : '/job-details';
  const location = job.location || 'Location not specified';
  const salary = job.salaryRange || 'Negotiable';
  const experienceText = job.experience || 'Experience not specified';
  const employmentType = job.employmentType || 'Full Time';
  const badges = job.badges || [employmentType];

  return (
    <div className="job-box card mt-4">
      <div className="p-4">
        <div className="row">
          <div className="col-lg-1">
            <img 
              src={companyLogo} 
              alt={companyName} 
              className="img-fluid rounded-3" 
              loading="lazy"
              onError={(e) => {
                e.target.src = '/assets/images/featured-job/img-01.png';
              }}
            />
          </div>
          <div className="col-lg-10">
            <div className="mt-3 mt-lg-0">
              <h5 className="fs-17 mb-1">
                <Link to={jobLink} className="text-dark">
                  {job.title}
                </Link>{' '}
                <small className="text-muted fw-normal">({experienceText})</small>
              </h5>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0">{companyName}</p>
                </li>
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0">
                    <i className="mdi mdi-map-marker"></i> {location}
                  </p>
                </li>
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0">
                    <i className="uil uil-wallet"></i> {salary}
                  </p>
                </li>
              </ul>
              <div className="mt-2">
                {badges.length > 0 ? (
                  badges.map((badge, index) => (
                    <span key={index} className="badge bg-soft-success mt-1 me-1">
                      {badge}
                    </span>
                  ))
                ) : (
                  <span className="badge bg-soft-success mt-1">{employmentType}</span>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="favorite-icon">
          <Link to="/bookmark-jobs" className="btn btn-link p-0">
            <i className="uil uil-heart-alt fs-18"></i>
          </Link>
        </div>
      </div>
      <div className="p-3 bg-light">
        <div className="row justify-content-between">
          <div className="col-md-8">
            <div>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <i className="uil uil-tag"></i> Skills:
                </li>
                {job.skills && job.skills.length > 0 ? (
                  job.skills.slice(0, 3).map((skill, index) => (
                    <li key={index} className="list-inline-item">
                      <span className="primary-link text-muted">{skill}</span>
                      {index < Math.min(job.skills.length, 3) - 1 && ','}
                    </li>
                  ))
                ) : (
                  <li className="list-inline-item">
                    <span className="text-muted">Various skills required</span>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-md-end">
              <Link to={jobLink} className="primary-link">
                View Details <i className="mdi mdi-chevron-double-right"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RelatedJobCard;
