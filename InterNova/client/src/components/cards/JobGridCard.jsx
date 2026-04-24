import { Link } from 'react-router-dom';
import { normalizeImageUrl } from '@/utils/imageHelpers';
import { useBookmark } from '@/hooks/useBookmark';

export default function JobGridCard({ job, onApply }) {
  // Return null if no job data provided
  if (!job) {
    return null;
  }

  // Extract and normalize job data
  const jobId = job._id || job.id;
  // company can be an object, a string (name or id), or the job may have a companyName property.
  const companyLogo = normalizeImageUrl(
    job.company && typeof job.company === 'object' ? job.company.logo : undefined
  ) || '/assets/images/featured-job/img-01.png';
  const companyName =
    (typeof job.company === 'string' && job.company) ||
    job.company?.name ||
    job.company?.companyName ||
    job.companyName ||
    'Unknown Company';
  const companyId =
    (job.company && typeof job.company === 'object' && (job.company._id || job.company.id)) ||
    (typeof job.company === 'string' ? job.company : undefined) ||
    job.companyId;
  const jobLink = jobId ? `/job-details?id=${encodeURIComponent(jobId)}` : '/job-details';
  const companyLink = companyId ? `/company-details?id=${encodeURIComponent(companyId)}` : '/company-details';
  const location = job.location || 'Location not specified';
  const salaryText = job.salaryRange || 'Negotiable';
  const experienceText = job.experience || 'Not specified';
  const employmentType = job.employmentType || 'Full Time';

  // Bookmark hook
  const { isBookmarked, toggleBookmark } = useBookmark(jobId, job.isBookmarked || false);

  // Handle badges - use employmentType as primary badge
  const badges = job.badges || [employmentType];

  return (
    <div className="col-lg-6">
      <div className="job-box bookmark-post card mt-4">
        <div className="p-4">
          <div className="row">
            <div className="col-lg-2">
              <Link to={companyLink}>
                <img
                  alt={companyName}
                  className="img-fluid rounded-3"
                  loading="lazy"
                  src={companyLogo}
                  onError={(e) => {
                    e.target.src = '/assets/images/featured-job/img-01.png';
                  }}
                />
              </Link>
            </div>
            <div className="col-lg-10">
              <div className="mt-3 mt-lg-0">
                <h5 className="fs-17 mb-1">
                  <Link className="text-dark" to={jobLink}>
                    {job.title}
                  </Link>
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
                      <i className="uil uil-wallet"></i> {salaryText}
                    </p>
                  </li>
                </ul>
                <div className="mt-2">
                  {badges.length > 0 ? (
                    badges.map((badge, index) => (
                      <span key={index} className="badge bg-soft-success mt-1">{badge}</span>
                    ))
                  ) : (
                    <span className="badge bg-soft-success mt-1">{employmentType}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
          <i 
            className={isBookmarked ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'} 
            onClick={toggleBookmark}
            style={{ 
              position: 'absolute',
              top: '20px',
              right: '20px',
              color: isBookmarked ? '#e74c3c' : '#ffffff',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0,0,0,0.2)',
              zIndex: 10
            }}
            title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
          />
        </div>
        <div className="p-3 bg-light">
          <div className="row justify-content-between">
            <div className="col-md-6">
              <span className="text-muted fs-14">
                <i className="uil uil-briefcase"></i> {experienceText}
              </span>
            </div>
            <div className="col-md-6 text-md-end">
              <a
                href="#applyNow"
                data-bs-toggle="modal"
                className="primary-link"
                onClick={() => onApply && onApply(jobId)}
              >
                Apply Now <i className="mdi mdi-chevron-double-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
