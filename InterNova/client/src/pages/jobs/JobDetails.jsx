import React, { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { getJob } from "@/services/jobs.service";
import { normalizeImageUrl } from "@/utils/imageHelpers";
import ApplyJobModal from "@/components/common/ApplyJobModal";
import { useBookmark } from "@/hooks/useBookmark";
import { useAuth } from "@/context/AuthContext";

const JobDetails = () => {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("id");
  const navigate = useNavigate();
  const { isAuth, user } = useAuth();
  
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Bookmark hook - will be initialized after job loads
  const { isBookmarked, toggleBookmark } = useBookmark(jobId, job?.isBookmarked || false);

  useEffect(() => {
    const loadJobDetails = async () => {
      if (!jobId) {
        setError("Job ID not provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await getJob(jobId);
        
        if (response?.success) {
          setJob(response.data);
          console.log('✅ Job loaded:', response.data);
          console.log('🏢 Full company object:', response.data?.company);
          console.log('📧 Company email from userId:', response.data?.company?.userId?.email);
          console.log('📧 Company email direct:', response.data?.company?.email);
          console.log('📅 Company establishedDate:', response.data?.company?.establishedDate);
          console.log('📅 Company createdAt:', response.data?.company?.createdAt);
        } else {
          setError("Failed to load job details");
        }
      } catch (err) {
        console.error("Error loading job details:", err);
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    loadJobDetails();
  }, [jobId]);

  // Show loading state
  if (loading) {
    return (
      <div className="main-content">
        <div className="page-content">
          <section className="page-title-box">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="text-center text-white">
                    <h3 className="mb-4">Job Details</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="shape">
              <svg viewBox="0 0 1440 250">
                <path
                  fill="#ffffff"
                  d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"
                />
              </svg>
            </div>
          </div>

          <section className="section">
            <div className="container">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" />
                <p className="text-muted mt-3">Loading job details...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !job) {
    return (
      <div className="main-content">
        <div className="page-content">
          <section className="page-title-box">
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-md-6">
                  <div className="text-center text-white">
                    <h3 className="mb-4">Job Details</h3>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="position-relative" style={{ zIndex: 1 }}>
            <div className="shape">
              <svg viewBox="0 0 1440 250">
                <path
                  fill="#ffffff"
                  d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"
                />
              </svg>
            </div>
          </div>

          <section className="section">
            <div className="container">
              <div className="text-center py-5">
                <p className="text-danger">{error || "Job not found"}</p>
                <Link to="/job-grid" className="btn btn-primary mt-3">
                  Browse Jobs
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Extract job data with proper mapping (company may be an object, a string, or job may have companyName/companyEmail fields)
  const companyLogo =
    normalizeImageUrl(
      job.company && typeof job.company === 'object' ? job.company.logo : undefined
    ) || normalizeImageUrl(job.company?.logo) || "/assets/images/featured-job/img-02.png";

  const companyName =
    (typeof job.company === 'string' && job.company) ||
    job.company?.name ||
    job.company?.companyName ||
    job.companyName ||
    job.company?.company_name ||
    'Unknown Company';

  // Simplified company email fallback order
  const companyEmail =
    job.company?.email ||
    job.company?.userId?.email ||
    job.company?.contact?.email ||
    job.company?.contactEmail ||
    job.companyEmail ||
    'Not available';

  const companyId =
    (job.company && typeof job.company === 'object' && (job.company._id || job.company.id)) ||
    (typeof job.company === 'string' ? job.company : undefined) ||
    job.companyId;

  const companyCreatedAt =
    job.company && typeof job.company === 'object' ? job.company.createdAt : job.companyCreatedAt;
  
  const companyCreatedAtYear = companyCreatedAt ? (isNaN(Date.parse(companyCreatedAt)) ? null : new Date(companyCreatedAt).getFullYear()) : null;

  // Additional fallbacks for established date / created year
  const companyEstablishedRaw =
    (job.company && typeof job.company === 'object' && (
      job.company.establishedDate || job.company.established || job.company.established_at || job.company.establishedYear
    )) || job.companyEstablishedDate || job.companyCreatedAt || companyCreatedAt;

  let companyEstablishedYear = null;
  if (companyEstablishedRaw) {
    // If it's a number or 4-digit year string
    if (typeof companyEstablishedRaw === 'number') {
      companyEstablishedYear = companyEstablishedRaw;
    } else if (/^\d{4}$/.test(String(companyEstablishedRaw))) {
      companyEstablishedYear = parseInt(companyEstablishedRaw, 10);
    } else {
      const parsed = Date.parse(companyEstablishedRaw);
      if (!isNaN(parsed)) {
        companyEstablishedYear = new Date(parsed).getFullYear();
      }
    }
  }

  // Parse responsibilities and qualifications (assuming they're stored as newline-separated or comma-separated)
  const responsibilities = job.responsibilities 
    ? job.responsibilities.split('\n').filter(item => item.trim())
    : [];
  
  const qualifications = job.qualifications 
    ? job.qualifications.split('\n').filter(item => item.trim())
    : [];

  const skills = job.skills || [];

  return (
    <div className="main-content">
      <div className="page-content">

        {/* PAGE TITLE */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Job Details</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHAPE */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg viewBox="0 0 1440 250">
              <path
                fill="#ffffff"
                d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* JOB DETAILS */}
        <section className="section">
          <div className="container">
            <div className="row">

              {/* LEFT CONTENT */}
              <div className="col-lg-8">
                <div className="card job-detail overflow-hidden">
                  <div className="card-body p-4">

                    {/* HEADER */}
                    <div className="row">
                      <div className="col-md-8">
                        <h5 className="mb-1">{job.title}</h5>
                        <ul className="list-inline text-muted mb-0">
                          <li className="list-inline-item">
                            <i className="mdi mdi-account"></i>{" "}
                            {job.vacancy} Vacancy
                          </li>
                        </ul>
                      </div>

                      <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
                        <i 
                          className={isBookmarked ? 'mdi mdi-heart' : 'mdi mdi-heart-outline'} 
                          onClick={toggleBookmark}
                          style={{ 
                            color: isBookmarked ? '#e74c3c' : '#495057',
                            fontSize: '28px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                          }}
                          title={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
                        />
                      </div>
                    </div>

                    {/* META BOXES */}
                    <div className="mt-4">
                      <div className="row g-2">
                        <div className="col-lg-3">
                          <div className="border rounded-start p-3">
                            <p className="text-muted fs-13 mb-0">Location</p>
                            <p className="fw-medium mb-0">{job.location}</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="border p-3">
                            <p className="text-muted fs-13 mb-0">
                              Employee type
                            </p>
                            <p className="fw-medium mb-0">
                              {job.employmentType}
                            </p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="border p-3">
                            <p className="text-muted fs-13 mb-0">Position</p>
                            <p className="fw-medium mb-0">{job.position}</p>
                          </div>
                        </div>
                        <div className="col-lg-3">
                          <div className="border rounded-end p-3">
                            <p className="text-muted fs-13 mb-0">
                              Offer Salary
                            </p>
                            <p className="fw-medium mb-0">
                              {job.salaryRange} TK
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* DESCRIPTION */}
                    <div className="mt-4">
                      <h5 className="mb-3">Job Description</h5>
                      <p className="text-muted">{job.description}</p>
                    </div>

                    {/* RESPONSIBILITIES */}
                    {responsibilities.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3">Responsibilities</h5>
                        <ul className="job-detail-list list-unstyled text-muted">
                          {responsibilities.map((item, index) => (
                            <li key={index}>
                              <i className="uil uil-circle"></i> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* QUALIFICATION */}
                    {qualifications.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3">Qualification</h5>
                        <ul className="job-detail-list list-unstyled text-muted">
                          {qualifications.map((item, index) => (
                            <li key={index}>
                              <i className="uil uil-circle"></i> {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* SKILLS */}
                    {skills.length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3">Skill & Experience</h5>
                        {job.skillsExperienceDescription && (
                          <p className="text-muted mb-3">{job.skillsExperienceDescription}</p>
                        )}
                        <ul className="job-detail-list list-unstyled text-muted">
                          {skills.map((skill, index) => (
                            <li key={index}>
                              <i className="uil uil-circle"></i> {skill}
                            </li>
                          ))}
                        </ul>

                        <div className="mt-4">
                          {skills.map((skill, index) => (
                            <span key={index} className="badge bg-primary me-1">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* APPLY */}
                    <div className="mt-4 pt-3">
                      {!isAuth ? (
                        // Guest user - redirect to login
                        <button
                          onClick={() => navigate('/sign-in')}
                          className="btn btn-primary w-100"
                        >
                          Apply Now <i className="uil uil-arrow-right"></i>
                        </button>
                      ) : user?.role === 'company' || user?.role === 'recruiter' ? (
                        // Company/Recruiter - show disabled button
                        <button
                          disabled
                          className="btn btn-secondary w-100"
                          title="Companies cannot apply to jobs"
                        >
                          Apply Now <i className="uil uil-arrow-right"></i>
                        </button>
                      ) : (
                        // Candidate - show modal
                        <a
                          href="#applyNow"
                          data-bs-toggle="modal"
                          className="btn btn-primary w-100"
                        >
                          Apply Now <i className="uil uil-arrow-right"></i>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="col-lg-4 mt-4 mt-lg-0">
                <div className="side-bar ms-lg-4">
                  <div className="card company-profile">
                    <div className="card-body p-4 text-center">
                      <img
                        src={companyLogo}
                        alt={companyName}
                        className="img-fluid rounded-3"
                        onError={(e) => {
                          e.target.src = "/assets/images/featured-job/img-02.png";
                        }}
                      />

                      <div className="mt-4">
                        <h6 className="fs-17 mb-1">
                          {companyName}
                        </h6>
                        <p className="text-muted mb-0">
                          Since {companyEstablishedYear || companyCreatedAtYear || "N/A"}
                        </p>
                      </div>

                      <ul className="list-unstyled mt-4 text-start">
                        <li className="mb-3">
                          <i className="uil uil-envelope text-primary fs-4"></i>
                          <span className="ms-2">
                            {companyEmail}
                          </span>
                        </li>
                        <li className="mb-3">
                          <i className="uil uil-map-marker text-primary fs-4"></i>
                          <span className="ms-2">
                            {job.company?.location || job.location}
                          </span>
                        </li>
                      </ul>

                      {companyId && (
                        <Link
                          to={`/company-details/${companyId}`}
                          className="btn btn-primary w-100"
                        >
                          <i className="mdi mdi-eye"></i> View Profile
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* APPLY JOB MODAL */}
        <ApplyJobModal jobId={job?._id} />
      </div>
    </div>
  );
};

export default JobDetails;
