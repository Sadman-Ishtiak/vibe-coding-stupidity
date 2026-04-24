import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import JobListCard from '@/components/cards/JobListCard';
import { getCompany, getCompanyJobs } from '@/services/companies.service';
import { normalizeImageUrl, getCompanyLogoUrl, createImageErrorHandler } from '@/utils/imageHelpers';

export default function CompanyDetails() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCompany = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!id) {
        setError('No company ID provided');
        setLoading(false);
        return;
      }
      
      // Load company details
      const response = await getCompany(id);
      if (response.success && response.data) {
        setCompany(response.data);
        
        // Load jobs by this company
        try {
          const jobsResponse = await getCompanyJobs(id, { limit: 20 });
          if (jobsResponse.success) {
            setCompanyJobs(jobsResponse.data || []);
          }
        } catch (jobsError) {
          console.error('Failed to load company jobs:', jobsError);
          setCompanyJobs([]);
        }
      } else {
        setError('Company not found');
      }
    } catch (err) {
      console.error('Failed to load company:', err);
      setError(err.response?.data?.message || 'Failed to load company');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadCompany();
  }, [loadCompany]);

  if (loading) {
    return (
      <>
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Company Details</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path fill="#FFFFFF" fillOpacity="1" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  if (error || !company) {
    return (
      <>
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Company Details</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path fill="#FFFFFF" fillOpacity="1" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        <section className="section">
          <div className="container">
            <div className="text-center py-5">
              <h5>{error || 'Company not found'}</h5>
              <Link to="/company-list" className="btn btn-primary mt-3">
                Back to Companies
              </Link>
            </div>
          </div>
        </section>
      </>
    );
  }

  // Format established date
  const formatEstablishedDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Render working days in a consistent Monday-Sunday order
  const renderWorkingDays = () => {
    const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];

    const wd = company.workingDays;
    const schedule = {};

    // Normalize various formats into a map: { Day: timeOrClose }
    if (!wd) {
      // Empty schedule
      DAYS.forEach(d => (schedule[d] = null));
    } else if (typeof wd === 'string') {
      // Try to parse strings like "Monday:9AM - 5PM;Tuesday:..." or newline separated
      const parts = wd.split(/[;\n|\\r]+/).map(p => p.trim()).filter(Boolean);
      parts.forEach(part => {
        const [day, ...rest] = part.split(/[:\-–]/);
        if (!rest || rest.length === 0) return;
        const key = day.trim();
        const value = part.substring(part.indexOf(':') + 1).trim();
        if (key) schedule[key] = value;
      });
    } else if (Array.isArray(wd)) {
      // Array of strings or objects
      wd.forEach(item => {
        if (typeof item === 'string') {
          // "Monday:9AM - 5PM" or "Monday 9AM - 5PM"
          const m = item.match(/^(\w+)[:\s-]*(.*)$/);
          if (m) schedule[m[1]] = m[2] || null;
        } else if (item && typeof item === 'object') {
          const key = item.day || item.name || item.title;
          const value = item.time || item.value || item.slot || item.hours;
          if (key) schedule[key] = value || null;
        }
      });
    } else if (typeof wd === 'object') {
      // Object with day keys
      Object.keys(wd).forEach(k => {
        schedule[k] = wd[k];
      });
    }

    // Render list items in order
    return DAYS.map(day => {
      const raw = schedule[day];
      let content = null;

      if (!raw) {
        content = <span className="text-danger">Close</span>;
      } else if (typeof raw === 'string' && /close|closed/i.test(raw)) {
        content = <span className="text-danger">Close</span>;
      } else {
        content = <span>{raw}</span>;
      }

      return (
        <li key={day}>
          {day}
          {content}
        </li>
      );
    });
  };

  return (
    <>
      <section className="page-title-box">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="text-center text-white">
                <h3 className="mb-4">Company Details</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="position-relative" style={{ zIndex: 1 }}>
        <div className="shape">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
            <path fill="#FFFFFF" fillOpacity="1" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <section className="section">
        <div className="container">
          <div className="row">
            <div className="col-lg-4">
              <div className="card side-bar">
                <div className="card-body p-4 text-center">
                  <img
                    src={getCompanyLogoUrl(company.logo, '/assets/images/featured-job/img-01.png')}
                    alt="Logo"
                    className="avatar-lg rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                    onError={createImageErrorHandler('/assets/images/featured-job/img-01.png')}
                  />
                  <h6 className="fs-18 mb-1 mt-4">{company.companyName}</h6>
                  <p className="text-muted mb-4">
                    Since {formatEstablishedDate(company.establishedDate)}
                  </p>
                  <ul className="candidate-detail-social-menu list-inline mb-0">
                    {company.facebook && (
                      <li className="list-inline-item">
                        <a href={company.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                          <i className="uil uil-facebook"></i>
                        </a>
                      </li>
                    )}
                    {company.whatsapp && (
                      <li className="list-inline-item">
                        <a href={company.whatsapp} target="_blank" rel="noopener noreferrer" className="social-link">
                          <i className="uil uil-whatsapp"></i>
                        </a>
                      </li>
                    )}
                    {company.linkedin && (
                      <li className="list-inline-item">
                        <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                          <i className="uil uil-linkedin"></i>
                        </a>
                      </li>
                    )}
                  </ul>
                </div>

                <div className="candidate-profile-overview card-body border-top p-4">
                  <h6 className="fs-17 fw-medium mb-3">Profile Overview</h6>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex">
                      <label className="text-dark">Owner Name</label>
                      <p className="text-muted ms-2 mb-0">{company.ownerName || 'N/A'}</p>
                    </li>
                    <li className="d-flex mt-2">
                      <label className="text-dark">Employees</label>
                      <p className="text-muted ms-2 mb-0">{company.employees || 'N/A'}</p>
                    </li>
                    <li className="d-flex mt-2">
                      <label className="text-dark">Location</label>
                      <p className="text-muted ms-2 mb-0">{company.companyLocation || company.location || 'N/A'}</p>
                    </li>
                  </ul>
                  <div className="mt-3">
                    <a href={`mailto:${company.email || ''}`} className="btn btn-danger btn-hover w-100">
                      <i className="uil uil-envelope-alt"></i> Send Mail
                    </a>
                  </div>
                </div>

                <div className="card-body border-top p-4">
                  <h6 className="fs-17 fw-medium mb-3">Working Days</h6>
                  <ul className="working-days">
                    {renderWorkingDays()}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="card ms-lg-4 mt-4 mt-lg-0">
                <div className="card-body p-4">
                  <h5 className="fs-18 fw-semibold mb-3">About {company.companyName}</h5>
                  <p className="text-muted">
                    {company.description || 'A leading company in the industry, committed to innovation and excellence.'}
                  </p>

                  {company.gallery && company.gallery.length > 0 && (
                    <div className="mt-4">
                      <h6 className="fs-16 fw-semibold mb-3">Gallery</h6>
                      <div className="row g-3">
                        {company.gallery.map((image, index) => (
                          <div key={index} className={index < 2 ? 'col-lg-6' : 'col-lg-12'}>
                            <img
                              src={normalizeImageUrl(image) || `/assets/images/gallery/img-0${index + 1}.jpg`}
                              alt={`${company.companyName} gallery ${index + 1}`}
                              className="img-fluid rounded"
                              onError={createImageErrorHandler(`/assets/images/gallery/img-0${index + 1}.jpg`)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
