import { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import { getCandidate } from '@/services/candidates.service';
import { normalizeImageUrl } from '@/utils/imageHelpers';

export default function CandidateDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadCandidate = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const candidateId = id || searchParams.get('id');
      if (!candidateId) {
        setError('No candidate ID provided');
        setLoading(false);
        return;
      }
      const response = await getCandidate(candidateId);
      if (response.success && response.data) {
        setCandidate(response.data);
      } else {
        setError('Candidate not found');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load candidate');
    } finally {
      setLoading(false);
    }
  }, [id, searchParams]);

  useEffect(() => {
    loadCandidate();
  }, [loadCandidate]);

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-content">
          <section className="section">
            <div className="container">
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading candidate details...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="main-content">
        <div className="page-content">
          <section className="section">
            <div className="container text-center py-5">
              <i className="uil uil-exclamation-triangle display-3 text-danger"></i>
              <h5 className="mt-3">{error || 'Candidate not found'}</h5>
              <p className="text-muted">The candidate profile you're looking for could not be loaded.</p>
              <button onClick={() => navigate(-1)} className="btn btn-primary mt-3">
                Go Back
              </button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Normalize profile image
  const profileImage = normalizeImageUrl(candidate.profileImage) || "/assets/images/user/img-01.jpg";

  return (
    <div className="main-content">
      <div className="page-content">
        {/* Page Title */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-7">
                <div className="text-center text-white">
                  <h3 className="mb-2">Candidate Profile</h3>
                  <p className="mb-0">Professional Details</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path fill="#FFFFFF" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z" />
            </svg>
          </div>
        </div>

        {/* Candidate Details */}
        <section className="section">
          <div className="container">
            <div className="row">
              {/* Left Sidebar - Profile Card */}
              <div className="col-lg-4">
                <div className="card profile-sidebar mb-4">
                  <div className="card-body p-4">
                    <div className="candidate-profile text-center">
                      <img 
                        src={profileImage} 
                        alt={candidate.name} 
                        className="avatar-lg rounded-circle" 
                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/assets/images/user/img-01.jpg';
                        }}
                      />
                      <h6 className="fs-18 mb-0 mt-4">{candidate.name}</h6>
                      <p className="text-muted mb-2">{candidate.designation || 'Professional'}</p>
                      {candidate.location && (
                        <p className="text-muted mb-4">
                          <i className="uil uil-map-marker"></i> {candidate.location}
                        </p>
                      )}
                      
                      {/* Social Links */}
                      {candidate.social && Object.values(candidate.social).some(link => link) && (
                        <ul className="candidate-detail-social-menu list-inline mb-0">
                          {candidate.social.facebook && (
                            <li className="list-inline-item">
                              <a href={candidate.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                                <i className="uil uil-facebook-f"></i>
                              </a>
                            </li>
                          )}
                          {candidate.social.linkedin && (
                            <li className="list-inline-item">
                              <a href={candidate.social.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                                <i className="uil uil-linkedin-alt"></i>
                              </a>
                            </li>
                          )}
                          {candidate.social.github && (
                            <li className="list-inline-item">
                              <a href={candidate.social.github} target="_blank" rel="noopener noreferrer" className="social-link">
                                <i className="uil uil-github-alt"></i>
                              </a>
                            </li>
                          )}
                          {candidate.social.twitter && (
                            <li className="list-inline-item">
                              <a href={candidate.social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                                <i className="uil uil-twitter-alt"></i>
                              </a>
                            </li>
                          )}
                        </ul>
                      )}
                    </div>

                    <div className="candidate-profile-overview mt-4">
                      <h6 className="fs-17 fw-semibold mb-3">Contact Information</h6>
                      <ul className="list-unstyled mb-0">
                        {candidate.email && (
                          <li>
                            <div className="d-flex mt-3">
                              <i className="uil uil-envelope-alt text-primary fs-5 me-3"></i>
                              <div>
                                <label className="text-dark fw-medium">Email:</label>
                                <p className="text-muted mb-0" style={{ wordBreak: 'break-word' }}>
                                  {candidate.email}
                                </p>
                              </div>
                            </div>
                          </li>
                        )}
                        {candidate.phone && (
                          <li>
                            <div className="d-flex mt-3">
                              <i className="uil uil-phone text-primary fs-5 me-3"></i>
                              <div>
                                <label className="text-dark fw-medium">Phone:</label>
                                <p className="text-muted mb-0">{candidate.phone}</p>
                              </div>
                            </div>
                          </li>
                        )}
                        {candidate.location && (
                          <li>
                            <div className="d-flex mt-3">
                              <i className="uil uil-map-marker text-primary fs-5 me-3"></i>
                              <div>
                                <label className="text-dark fw-medium">Location:</label>
                                <p className="text-muted mb-0">{candidate.location}</p>
                              </div>
                            </div>
                          </li>
                        )}
                      </ul>
                    </div>

                    {candidate.skills && candidate.skills.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fs-17 fw-semibold mb-3">Skills</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {candidate.skills.map((skill, index) => (
                            <span key={index} className="badge bg-soft-primary">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {candidate.languages && candidate.languages.length > 0 && (
                      <div className="mt-4">
                        <h6 className="fs-17 fw-semibold mb-3">Languages</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {candidate.languages.map((lang, index) => (
                            <span key={index} className="badge bg-soft-secondary">
                              {lang}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {candidate.resume && candidate.resume.fileUrl && (
                      <div className="mt-4">
                        <a 
                          href={candidate.resume.fileUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn btn-primary w-100"
                        >
                          <i className="uil uil-file-download me-2"></i>
                          Download Resume
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Content - Details */}
              <div className="col-lg-8">
                <div className="card candidate-details ms-lg-4 mt-4 mt-lg-0">
                  <div className="card-body p-4">
                    {/* About Section */}
                    {candidate.about && (
                      <div className="mb-4">
                        <h5 className="fs-18 fw-semibold mb-3">About</h5>
                        <p className="text-muted">{candidate.about}</p>
                      </div>
                    )}

                    {/* Education Section */}
                    {candidate.education && candidate.education.length > 0 && (
                      <div className="candidate-education-details mt-4">
                        <h5 className="fs-18 fw-semibold mb-4">Education</h5>
                        {candidate.education.map((edu, index) => (
                          <div key={index} className="candidate-education-content mb-4">
                            <div className="d-flex">
                              <div className="circle flex-shrink-0 bg-soft-primary" style={{ width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '40px' }}>
                                <i className="uil uil-graduation-cap"></i>
                              </div>
                              <div className="ms-4">
                                <h6 className="fs-16 mb-1">{edu.degree}</h6>
                                <p className="mb-2 text-muted">{edu.university} {edu.duration && `- ${edu.duration}`}</p>
                                {edu.description && <p className="text-muted">{edu.description}</p>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Experience Section */}
                    {candidate.experience && candidate.experience.length > 0 && (
                      <div className="mt-4">
                        <h5 className="fs-18 fw-semibold mb-4">Work Experience</h5>
                        {candidate.experience.map((exp, index) => (
                          <div key={index} className="candidate-education-content mb-4">
                            <div className="d-flex">
                              <div className="circle flex-shrink-0 bg-soft-success" style={{ width: '35px', height: '35px', lineHeight: '35px', textAlign: 'center', borderRadius: '40px' }}>
                                <i className="uil uil-briefcase-alt"></i>
                              </div>
                              <div className="ms-4">
                                <h6 className="fs-16 mb-1">{exp.jobTitle || exp.title}</h6>
                                <p className="mb-2 text-muted">
                                  {exp.companyName || exp.company} {exp.duration && `- ${exp.duration}`}
                                </p>
                                {(exp.roleDescription || exp.description) && (
                                  <p className="text-muted">{exp.roleDescription || exp.description}</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Projects Section */}
                    {candidate.projects && candidate.projects.length > 0 && (
                      <div className="mt-4">
                        <h5 className="fs-18 fw-semibold mb-4">Projects</h5>
                        <div className="row g-3">
                          {candidate.projects.map((project, index) => (
                            <div key={index} className="col-md-6">
                              <div className="card border">
                                <div className="card-body">
                                  {project.hoverTitle && (
                                    <h6 className="fs-16 mb-2">{project.hoverTitle}</h6>
                                  )}
                                  {project.projectUrl && (
                                    <a 
                                      href={project.projectUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-primary"
                                    >
                                      <i className="uil uil-external-link-alt me-1"></i>
                                      View Project
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-4">
                      <button onClick={() => navigate(-1)} className="btn btn-outline-primary">
                        <i className="uil uil-arrow-left me-1"></i> Go Back
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
