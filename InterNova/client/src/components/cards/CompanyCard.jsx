import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { getCompanyLogoUrl, createImageErrorHandler } from '@/utils/imageHelpers';

export default function CompanyCard({ company }) {
  // Fallback values for missing data
  const companyName = company?.companyName || 'Company Name';
  const location = company?.location || 'Location not specified';
  const logo = getCompanyLogoUrl(company?.logo, '/assets/images/featured-job/img-01.png');
  const openJobsCount = company?.openJobsCount || 0;
  const companyId = company?._id;

  return (
    <div className="card text-center mb-4">
      <div className="card-body px-4 py-5">
        <img
          src={logo}
          alt={companyName}
          className="img-fluid rounded-3"
          loading="lazy"
          onError={createImageErrorHandler('/assets/images/featured-job/img-01.png')}
        />
        <div className="mt-4">
          <Link to={`/company-details/${companyId}`} className="primary-link">
            <h6 className="fs-18 mb-2">{companyName}</h6>
          </Link>
          <p className="text-muted mb-4">{location}</p>
          <Link to={`/company-details/${companyId}`} className="btn btn-primary">
            {openJobsCount} {openJobsCount === 1 ? 'Opening Job' : 'Opening Jobs'}
          </Link>
        </div>
      </div>
    </div>
  );
}

CompanyCard.propTypes = {
  company: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    companyName: PropTypes.string,
    location: PropTypes.string,
    logo: PropTypes.string,
    openJobsCount: PropTypes.number
  }).isRequired
};
