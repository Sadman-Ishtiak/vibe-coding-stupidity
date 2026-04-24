import { Link } from 'react-router-dom';
import { normalizeImageUrl } from '@/utils/imageHelpers';
import { useBookmark } from '@/hooks/useBookmark';

const JobListCard = ({ job, onApply, isBookmarkPage = false, onRemoveBookmark }) => {
  // Return null if no job data provided
  if (!job) {
    return null;
  }

  // Render dynamic job data
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

  // Bookmark hook - only active if NOT on bookmark page
  const { isBookmarked, toggleBookmark } = useBookmark(jobId, job.isBookmarked || false);

  // Handle badges - use employmentType as primary badge if no badges provided
  const badges = job.badges || [employmentType];

  return (
    <div className="job-box card mt-4">
      {/* Show different bookmark styles based on page type */}
      {isBookmarkPage ? (
        <div className="bookmark-label text-center" style={{ position: 'relative' }}>
          {/* On bookmark page: Red heart clickable to remove bookmark */}
          <i
            className="mdi mdi-heart"
            onClick={() => onRemoveBookmark && onRemoveBookmark(jobId)}
            style={{
              color: '#e74c3c',
              fontSize: '20px',
              cursor: 'pointer'
            }}
            title="Remove from bookmarks"
            role="button"
            aria-label="Remove from bookmarks"
          />
          {/* Cross icon to remove (kept for accessibility) */}
          <i
            className="mdi mdi-close-circle"
            onClick={() => onRemoveBookmark && onRemoveBookmark(jobId)}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              color: '#dc3545',
              fontSize: '24px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            title="Remove from bookmarks"
          />
        </div>
      ) : (
        /* On other pages: Toggleable heart in bookmark-label */
        <div className="bookmark-label text-center">
          <a href="#" onClick={toggleBookmark} className="btn btn-link align-middle p-0" style={{ cursor: 'pointer' }}>
            <i 
              className={isBookmarked ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'} 
              style={{ 
                color: isBookmarked ? '#e74c3c' : '#6c757d',
                fontSize: '20px'
              }}
            ></i>
          </a>
        </div>
      )}
      <div className="p-4">
        <div className="row align-items-center">
          <div className="col-md-2">
            <div className="text-center mb-4 mb-lg-0">
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
          </div>

          <div className="col-md-3">
            <div className="mb-2 mb-md-0">
              <h5 className="fs-18 mb-0">
                <Link className="text-dark" to={jobLink}>
                  {job.title}
                </Link>
              </h5>
              <p className="text-muted fs-14 mb-0">{companyName}</p>
            </div>
          </div>

          <div className="col-md-3">
            <div className="d-flex mb-2">
              <div className="flex-shrink-0">
                <i className="mdi mdi-map-marker text-primary me-1"></i>
              </div>
              <p className="text-muted mb-0">{location}</p>
            </div>
          </div>

          <div className="col-md-2">
            <div className="d-flex mb-0">
              <div className="flex-shrink-0">
                <i className="uil uil-wallet text-primary me-1"></i>
              </div>
              <p className="text-muted mb-0">{salaryText} TK</p>
            </div>
          </div>

          <div className="col-md-2">
            <div>
              {badges.length > 0 ? (
                badges.map((badge, index) => (
                  <span key={index} className="badge bg-soft-success fs-13 mt-1 me-1">{badge}</span>
                ))
              ) : (
                <span className="badge bg-soft-success fs-13 mt-1">{employmentType}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="p-3 bg-light">
        <div className="row justify-content-between">
          <div className="col-md-4">
            <div>
              <p className="text-muted mb-0">
                <span className="text-dark">Experience:</span> {experienceText}
              </p>
            </div>
          </div>

          <div className="col-lg-2 col-md-3">
            <div className="text-start text-md-end">
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
};

export default JobListCard;
