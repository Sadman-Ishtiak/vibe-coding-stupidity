import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile, uploadProfileImage, uploadResume, changePassword } from "@/services/candidates.service";
import { useAuth } from "@/context/AuthContext";
import PasswordInput from "@/components/common/PasswordInput";
import ProfileCompletionBar from '@/components/common/ProfileCompletionBar';
import LocationSelect from "@/components/common/LocationSelect";

const CandidateProfile = () => {
  const { isAuth, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    designation: '',
    email: '',
    phone: '',
    location: '',
    about: '',
    category: '',
    education: [],
    experience: [],
    skills: [],
    languages: [],
    projects: [],
    social: {
      facebook: '',
      linkedin: '',
      whatsapp: ''
    }
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Auth Protection - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuth) {
      navigate('/sign-in', { replace: true });
    }
  }, [authLoading, isAuth, navigate]);

  // ✅ Load profile with proper cleanup and caching
  const loadProfile = useCallback(async (forceRefresh = false) => {
    let isMounted = true;

    try {
      setLoading(true);
      const response = await getMyProfile();
      
      if (isMounted && response.success) {
        const data = response.data;
        setProfile(data);
        setFormData({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          designation: data.designation || '',
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          about: data.about || '',
          category: data.category || '',
          education: Array.isArray(data.education) ? data.education : [],
          experience: Array.isArray(data.experience) ? data.experience : [],
          skills: Array.isArray(data.skills) ? data.skills : [],
          languages: Array.isArray(data.languages) ? data.languages : [],
          projects: Array.isArray(data.projects) ? data.projects : [],
          social: {
            facebook: data.social?.facebook || '',
            linkedin: data.social?.linkedin || '',
            whatsapp: data.social?.whatsapp || ''
          }
        });
      }
    } catch (error) {
      if (isMounted) {
        if (error.response?.status === 401) {
          navigate('/sign-in', { replace: true });
        } else {
          setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to load profile' });
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
      loadProfile();
    }
  }, [authLoading, isAuth, loadProfile]);

  // Memoize profile image URL to prevent flicker
  const profileImageUrl = useMemo(() => {
    return profile?.profileImage || "/assets/images/profile.jpg";
  }, [profile?.profileImage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      social: { ...prev.social, [name]: value }
    }));
  };

  // Projects handlers
  const handleProjectChange = (index, field, value) => {
    setFormData(prev => {
      const projects = Array.isArray(prev.projects) ? [...prev.projects] : [];
      projects[index] = { ...(projects[index] || {}), [field]: value };
      return { ...prev, projects };
    });
  };

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { projectUrl: '', hoverTitle: '' }]
    }));
  };

  const removeProject = (index) => {
    setFormData(prev => ({
      ...prev,
      projects: (prev.projects || []).filter((_, i) => i !== index)
    }));
  };

  // Education handlers
  const handleEducationChange = (index, field, value) => {
    setFormData(prev => {
      const education = Array.isArray(prev.education) ? [...prev.education] : [];
      education[index] = { ...(education[index] || {}), [field]: value };
      return { ...prev, education };
    });
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', university: '', duration: '', description: '' }]
    }));
  };

  const removeEducation = (index) => {
    setFormData(prev => ({
      ...prev,
      education: (prev.education || []).filter((_, i) => i !== index)
    }));
  };

  // Experience handlers
  const handleExperienceChange = (index, field, value) => {
    setFormData(prev => {
      const experience = Array.isArray(prev.experience) ? [...prev.experience] : [];
      experience[index] = { ...(experience[index] || {}), [field]: value };
      return { ...prev, experience };
    });
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { jobTitle: '', companyName: '', duration: '', roleDescription: '' }]
    }));
  };

  const removeExperience = (index) => {
    setFormData(prev => ({
      ...prev,
      experience: (prev.experience || []).filter((_, i) => i !== index)
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
      showMessage('error', 'First name and last name are required');
      return;
    }

    try {
      setSaving(true);
      const response = await updateMyProfile(formData);
      if (response.success) {
        setProfile(response.data);
        // ✅ Update auth context to sync Navbar and prevent refetch
        // Include all essential fields for navbar and overview
        updateUser({
          ...response.data,
          username: `${response.data.firstName} ${response.data.lastName}`,
          profilePicture: response.data.profileImage,
          profileImage: response.data.profileImage,
          profileCompletion: response.data.profileCompletion,
          role: 'candidate', // Ensure role is maintained
          userType: 'candidate' // Ensure userType is maintained
        });
        showMessage('success', 'Profile updated successfully!');
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      showMessage('error', 'Please fill all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', 'New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      showMessage('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setSaving(true);
      const response = await changePassword(passwordData);
      if (response.success) {
        showMessage('success', 'Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  }, []);

  // ✅ Handle profile image upload
  const handleProfileImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Only JPEG, PNG, and WEBP images are allowed');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Image size must be less than 5MB');
      return;
    }

    try {
      setSaving(true);
      const response = await uploadProfileImage(file);
      if (response.success) {
        // Update profile with new image
        setProfile(prev => ({ ...prev, profileImage: response.data.profileImage }));
        // Update auth context - use both profileImage and profilePicture for compatibility
        updateUser({ 
          profileImage: response.data.profileImage,
          profilePicture: response.data.profileImage,
          role: 'candidate', // Maintain role
          userType: 'candidate' // Maintain userType
        });
        showMessage('success', 'Profile image updated successfully!');
        // Reset file input
        e.target.value = '';
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to upload image');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle resume upload
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type (PDF, DOC, DOCX)
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Only PDF, DOC, and DOCX files are allowed for resume');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Resume size must be less than 5MB');
      return;
    }

    try {
      setSaving(true);
      const response = await uploadResume(file);
      if (response.success) {
        // Update profile with new resume
        setProfile(prev => ({ ...prev, resume: response.data.resume }));
        showMessage('success', 'Resume uploaded successfully!');
        // Reset file input
        e.target.value = '';
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to upload resume');
    } finally {
      setSaving(false);
    }
  };

  // ✅ Don't render if auth is still loading
  if (authLoading) {
    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Don't render content if not authenticated
  if (!isAuth) {
    return null;
  }

  if (loading) {
    return (
      <div className="main-content">
        <div className="page-content">
          <div className="container text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="page-content">

        {/* ================= PAGE TITLE ================= */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Candidate Profile</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path
                fill="#FFFFFF"
                fillOpacity="1"
                d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
              />
            </svg>
          </div>
        </div>

        {/* ================= PROFILE CONTENT ================= */}
        <section className="section">
          <div className="container">
            <div className="card profile-content-page mt-4">

              {/* ================= TABS ================= */}
              <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
                <ul className="nav nav-pills profile-content-nav mb-0">
                  <li className="nav-item">
                    <button
                      className="nav-link active"
                      data-bs-toggle="pill"
                      data-bs-target="#overview"
                    >
                      Overview
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="nav-link"
                      data-bs-toggle="pill"
                      data-bs-target="#settings"
                    >
                      Settings
                    </button>
                  </li>
                </ul>
                <div className="ms-auto" style={{ minWidth: '250px' }}>
                  <ProfileCompletionBar completion={profile?.profileCompletion || 0} showLabel={true} />
                </div>
              </div>

              <div className="card-body p-4">
                {message.text && (
                  <div className={`alert alert-${message.type === 'success' ? 'success' : 'danger'} alert-dismissible fade show`}>
                    {message.text}
                    <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
                  </div>
                )}
                
                <div className="tab-content">

                  {/* ================= OVERVIEW TAB ================= */}
                  <div class="tab-pane fade active show" id="overview" role="tabpanel" aria-labelledby="overview-tab">
    <div class="row">

        {/* ================= LEFT SIDEBAR ================= */}
        <div class="col-lg-4">
            <div class="card profile-sidebar me-lg-4">
                <div class="card-body p-4">

                    <div className="text-center pb-4 border-bottom">
                        <img
                            alt="Profile"
                            className="avatar-lg img-thumbnail rounded-circle mb-4"
                            loading="lazy"
                            src={profileImageUrl}
                            onError={(e) => {
                              e.target.src = "/assets/images/profile.jpg";
                            }}
                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                        />
                        <h5 className="mb-0">{profile?.firstName && profile?.lastName ? `${profile.firstName} ${profile.lastName}` : 'N/A'}</h5>
                        <p className="text-muted">{profile?.designation || 'N/A'}</p>

                        <ul className="candidate-detail-social-menu list-inline mb-0">
                            {profile?.social?.facebook && (
                            <li className="list-inline-item">
                                <a href={profile.social.facebook} target="_blank" rel="noreferrer" className="social-link rounded-3 btn-soft-primary">
                                    <i className="uil uil-facebook-f"></i>
                                </a>
                            </li>
                            )}
                            {profile?.social?.linkedin && (
                              <li className="list-inline-item">
                                <a
                                  href={profile.social.linkedin}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="social-link rounded-3 btn-soft-info"
                                >
                                  <i className="uil uil-linkedin"></i>
                                </a>
                              </li>
                            )}

                            {profile?.social?.whatsapp && (
                            <li className="list-inline-item">
                                <a href={profile.social.whatsapp} target="_blank" rel="noreferrer" className="social-link rounded-3 btn-soft-success">
                                    <i className="uil uil-whatsapp"></i>
                                </a>
                            </li>
                            )}
                        </ul>
                    </div>

                    <div className="mt-4 border-bottom pb-4">
                        <h5 className="fs-17 fw-bold mb-3">Documents</h5>
                        {profile?.resume?.fileName ? (
                        <ul className="profile-document list-unstyled mb-0">
                            <div className="profile-document-list d-flex align-items-center mt-4">
                                <div className="icon flex-shrink-0">
                                    <i className="uil uil-file"></i>
                                </div>
                                <div className="ms-3">
                                    <h6 className="fs-16 mb-0">{profile.resume.fileName}</h6>
                                    <p className="text-muted mb-0">{profile.resume.fileSize || 'N/A'}</p>
                                </div>
                                <div className="ms-auto">
                                    <a href={profile.resume.fileUrl} download className="fs-20 text-muted">
                                        <i className="uil uil-import"></i>
                                    </a>
                                </div>
                            </div>
                        </ul>
                        ) : (
                          <p className="text-muted">No resume uploaded</p>
                        )}
                    </div>

                    <div className="mt-4">
                        <h5 className="fs-17 fw-bold mb-3">Contacts</h5>
                        <ul className="list-unstyled mb-0">
                            <li className="d-flex">
                                <label>Email</label>
                                <p className="text-muted ms-2 mb-0">{profile?.email || 'N/A'}</p>
                            </li>
                            <li className="d-flex">
                                <label>Phone Number</label>
                                <p className="text-muted ms-2 mb-0">{profile?.phone || 'N/A'}</p>
                            </li>
                            <li className="d-flex">
                                <label>Location</label>
                                <p className="text-muted ms-2 mb-0">{profile?.location || 'N/A'}</p>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        {/* ================= RIGHT CONTENT ================= */}
        <div className="col-lg-8">

            <h5 className="fs-18 fw-bold">About</h5>
            <p className="text-muted mt-4">
                {profile?.about || 'No about information provided.'}
            </p>

            <div className="candidate-education-details mt-4">
                <h6 className="fs-18 fw-bold mb-0">Education</h6>
                {profile?.education && profile.education.length > 0 ? (
                  profile.education.map((edu, index) => (
                    <div key={index} className="candidate-education-content mt-4 d-flex">
                        <div className="circle flex-shrink-0 bg-soft-primary">{edu.degree?.charAt(0) || 'E'}</div>
                        <div className="ms-4">
                            <h6 className="fs-16 mb-1">{edu.degree || 'N/A'}</h6>
                            <p className="mb-2 text-muted">{edu.university || 'N/A'} - {edu.duration || 'N/A'}</p>
                            <p className="text-muted">{edu.description || ''}</p>
                        </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mt-3">No education information provided.</p>
                )}
            </div>

            <div className="candidate-education-details mt-4">
                <h6 className="fs-18 fw-bold mb-0">Experiences</h6>
                {profile?.experience && profile.experience.length > 0 ? (
                  profile.experience.map((exp, index) => (
                    <div key={index} className="candidate-education-content mt-4 d-flex">
                        <div className="circle flex-shrink-0 bg-soft-primary">{exp.jobTitle?.charAt(0) || 'E'}</div>
                        <div className="ms-4">
                            <h6 className="fs-16 mb-1">{exp.jobTitle || 'N/A'}</h6>
                            <p className="mb-2 text-muted">{exp.companyName || 'N/A'} - {exp.duration || 'N/A'}</p>
                            <p className="text-muted mb-0">{exp.roleDescription || ''}</p>
                        </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mt-3">No experience information provided.</p>
                )}
            </div>

            <div className="mt-4">
                <h5 className="fs-18 fw-bold">Skills</h5>
                {profile?.skills && profile.skills.length > 0 ? (
                  profile.skills.map((skill, index) => (
                    <span key={index} className="badge fs-13 bg-soft-blue mt-2">{skill}</span>
                  ))
                ) : (
                  <p className="text-muted">No skills listed.</p>
                )}
            </div>

            <div className="mt-4">
                <h5 className="fs-18 fw-bold">Spoken languages</h5>
                {profile?.languages && profile.languages.length > 0 ? (
                  profile.languages.map((lang, index) => (
                    <span key={index} className="badge fs-13 bg-soft-success mt-2">{lang}</span>
                  ))
                ) : (
                  <p className="text-muted">No languages listed.</p>
                )}
            </div>

            {/* ================= PROJECTS / PORTFOLIO ================= */}
<div className="candidate-portfolio mt-4 pt-3">
  <h6 className="fs-17 fw-bold mb-0">Projects</h6>

  <div className="row">
    {profile?.projects && profile.projects.length > 0 ? (
      profile.projects.map((project, index) => (
        <div className="col-lg-4 mt-4" key={index}>
          <div className="candidate-portfolio-box card border-0">
            <img
              alt={project.hoverTitle || 'Project'}
              className="img-fluid"
              loading="lazy"
              src={`https://opengraph.githubassets.com/1/${project.projectUrl?.replace('https://github.com/', '') || ''}`}
            />
            <div className="bg-overlay"></div>

            <div className="zoom-icon">
              <a
                href={project.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white"
                title={project.hoverTitle}
              >
                  <i className="uil uil-github"></i>
                </a>
              </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted mt-3">No projects added yet.</p>
                )}
              </div>
            </div>


        </div>

    </div>
</div>


                  {/* ================= SETTINGS TAB (FULL TEMPLATE) ================= */}
                  <div
                      className="tab-pane fade"
                      id="settings"
                      role="tabpanel"
                      aria-labelledby="settings-tab"
                    >
                      <form onSubmit={handleUpdateProfile}>

                        {/* ================= BASIC ACCOUNT ================= */}
                        <div>
                          <h5 className="fs-17 fw-semibold mb-3">My Account</h5>

                          <div className="text-center mb-4">
                            <img
                              src={profileImageUrl}
                              className="rounded-circle img-thumbnail profile-img"
                              loading="lazy"
                              alt="Profile"
                              onError={(e) => {
                                e.target.src = "/assets/images/profile.jpg";
                              }}
                              style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                            />
                            <div className="mt-2">
                              <input 
                                type="file" 
                                className="form-control form-control-sm" 
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleProfileImageUpload}
                                disabled={saving}
                              />
                              <small className="text-muted">JPEG, PNG, WEBP (Max 5MB)</small>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">First Name</label>
                              <input 
                                className="form-control" 
                                type="text" 
                                name="firstName"
                                value={formData.firstName} 
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-6">
                              <label className="form-label">Last Name</label>
                              <input 
                                className="form-control" 
                                type="text" 
                                name="lastName"
                                value={formData.lastName} 
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Designation</label>
                              <input 
                                className="form-control" 
                                type="text" 
                                name="designation"
                                value={formData.designation}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Email</label>
                              <input 
                                className="form-control" 
                                type="email" 
                                name="email"
                                value={formData.email}
                                disabled
                                readOnly
                                title="Email cannot be changed"
                              />
                              <small className="text-muted">Email cannot be changed</small>
                            </div>

                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Phone Number</label>
                              <input 
                                className="form-control" 
                                type="text" 
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                              />
                            </div>

                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Location</label>
                              <LocationSelect
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="Select your location"
                                className="form-select"
                              />
                            </div>
                          </div>
                        </div>

                        {/* ================= CATEGORY ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Category</h5>

                          <select 
                            className="form-select"
                            name="category"
                            value={formData.category}
                            onChange={handleInputChange}
                          >
                            <option value="">All Categories</option>
                            <option value="IT & Software">IT & Software</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Accounting">Accounting</option>
                            <option value="Banking">Banking</option>
                            <option value="Design">Design</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        {/* ================= ABOUT ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">About</h5>
                          <textarea 
                            className="form-control" 
                            rows="5"
                            name="about"
                            value={formData.about}
                            onChange={handleInputChange}
                          />
                        </div>

                        {/* ================= EDUCATION ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Education</h5>

                          {(formData.education || []).map((edu, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="mb-3">
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="Degree (e.g. BCA)"
                                  value={edu.degree || ''}
                                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                                />
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="University"
                                  value={edu.university || ''}
                                  onChange={(e) => handleEducationChange(index, 'university', e.target.value)}
                                />
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="Duration (2004 - 2010)"
                                  value={edu.duration || ''}
                                  onChange={(e) => handleEducationChange(index, 'duration', e.target.value)}
                                />
                                <textarea
                                  className="form-control"
                                  rows="3"
                                  placeholder="Description"
                                  value={edu.description || ''}
                                  onChange={(e) => handleEducationChange(index, 'description', e.target.value)}
                                />
                              </div>

                              {(formData.education || []).length > 1 && (
                                <div className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeEducation(index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addEducation}
                          >
                            + Add Education
                          </button>
                        </div>

                        {/* ================= EXPERIENCE ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Experience</h5>

                          {(formData.experience || []).map((exp, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="mb-3">
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="Job Title"
                                  value={exp.jobTitle || ''}
                                  onChange={(e) => handleExperienceChange(index, 'jobTitle', e.target.value)}
                                />
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="Company Name"
                                  value={exp.companyName || ''}
                                  onChange={(e) => handleExperienceChange(index, 'companyName', e.target.value)}
                                />
                                <input
                                  className="form-control mb-2"
                                  type="text"
                                  placeholder="Duration"
                                  value={exp.duration || ''}
                                  onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                />
                                <textarea
                                  className="form-control"
                                  rows="3"
                                  placeholder="Role Description"
                                  value={exp.roleDescription || ''}
                                  onChange={(e) => handleExperienceChange(index, 'roleDescription', e.target.value)}
                                />
                              </div>

                              {(formData.experience || []).length > 1 && (
                                <div className="text-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeExperience(index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addExperience}
                          >
                            + Add Experience
                          </button>
                        </div>

                        {/* ================= SKILLS ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Skills</h5>
                          
                          {/* Display existing skills as badges */}
                          <div className="mb-2">
                            {Array.isArray(formData.skills) && formData.skills.length > 0 && (
                              <div className="d-flex flex-wrap gap-2">
                                {formData.skills.map((skill, index) => (
                                  <span key={index} className="badge bg-soft-blue fs-13">
                                    {skill}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-2"
                                      style={{ fontSize: '0.65rem' }}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          skills: prev.skills.filter((_, i) => i !== index)
                                        }));
                                      }}
                                      aria-label="Remove"
                                    />
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Input for adding new skill */}
                          <input 
                            className="form-control" 
                            placeholder="Type a skill and press Enter or comma"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !formData.skills.includes(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    skills: [...(prev.skills || []), value]
                                  }));
                                  e.target.value = '';
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // Also add on blur if there's a value
                              const value = e.target.value.trim();
                              if (value && !formData.skills.includes(value)) {
                                setFormData(prev => ({
                                  ...prev,
                                  skills: [...(prev.skills || []), value]
                                }));
                                e.target.value = '';
                              }
                            }}
                          />
                          <small className="text-muted">Press Enter or comma after each skill</small>
                        </div>

                        {/* ================= LANGUAGES ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Languages</h5>
                          
                          {/* Display existing languages as badges */}
                          <div className="mb-2">
                            {Array.isArray(formData.languages) && formData.languages.length > 0 && (
                              <div className="d-flex flex-wrap gap-2">
                                {formData.languages.map((language, index) => (
                                  <span key={index} className="badge bg-soft-success fs-13">
                                    {language}
                                    <button
                                      type="button"
                                      className="btn-close btn-close-white ms-2"
                                      style={{ fontSize: '0.65rem' }}
                                      onClick={() => {
                                        setFormData(prev => ({
                                          ...prev,
                                          languages: prev.languages.filter((_, i) => i !== index)
                                        }));
                                      }}
                                      aria-label="Remove"
                                    />
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                          
                          {/* Input for adding new language */}
                          <input 
                            className="form-control"
                            placeholder="Type a language and press Enter or comma"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ',') {
                                e.preventDefault();
                                const value = e.target.value.trim();
                                if (value && !formData.languages.includes(value)) {
                                  setFormData(prev => ({
                                    ...prev,
                                    languages: [...(prev.languages || []), value]
                                  }));
                                  e.target.value = '';
                                }
                              }
                            }}
                            onBlur={(e) => {
                              // Also add on blur if there's a value
                              const value = e.target.value.trim();
                              if (value && !formData.languages.includes(value)) {
                                setFormData(prev => ({
                                  ...prev,
                                  languages: [...(prev.languages || []), value]
                                }));
                                e.target.value = '';
                              }
                            }}
                          />
                          <small className="text-muted">Press Enter or comma after each language</small>
                        </div>

                        {/* ================= DOCUMENTS ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Documents</h5>
                          <div className="mb-3">
                            <label className="form-label">Upload Resume (PDF, DOC, DOCX)</label>
                            <input 
                              type="file" 
                              className="form-control" 
                              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              onChange={handleResumeUpload}
                              disabled={saving}
                            />
                            {profile?.resume?.fileName && (
                              <small className="text-muted d-block mt-1">
                                Current: {profile.resume.fileName} ({profile.resume.fileSize})
                              </small>
                            )}
                          </div>
                        </div>

                        {/* ================= SOCIAL MEDIA ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Social Media</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <input 
                                className="form-control mb-2" 
                                placeholder="Facebook URL"
                                name="facebook"
                                value={formData.social.facebook}
                                onChange={handleSocialChange}
                              />
                            </div>
                            <div className="col-lg-6">
                              <input
                                  className="form-control mb-2"
                                  placeholder="LinkedIn URL"
                                  name="linkedin"
                                  value={formData.social.linkedin}
                                  onChange={handleSocialChange}
                                />
                            </div>
                            <div className="col-lg-6">
                              <input 
                                className="form-control mb-2" 
                                placeholder="WhatsApp URL"
                                name="whatsapp"
                                value={formData.social.whatsapp}
                                onChange={handleSocialChange}
                              />
                            </div>
                          </div>
                        </div>

                        {/* ================= PROJECTS ================= */}
                        <div className="mt-4">
                          <h5 className="fs-17 fw-semibold mb-3">Projects</h5>

                          {(formData.projects || []).map((project, index) => (
                            <div key={index} className="border rounded p-3 mb-3">
                              <div className="row">

                                {/* Project Link */}
                                <div className="col-lg-12">
                                  <input
                                    type="url"
                                    className="form-control mb-2"
                                    placeholder="Project / GitHub URL"
                                    value={project.projectUrl}
                                    onChange={(e) =>
                                      handleProjectChange(index, "projectUrl", e.target.value)
                                    }
                                  />
                                </div>

                                {/* Hover Title */}
                                <div className="col-lg-12">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Hover Title (shown on project)"
                                    value={project.hoverTitle}
                                    onChange={(e) =>
                                      handleProjectChange(index, "hoverTitle", e.target.value)
                                    }
                                  />
                                </div>

                              </div>

                              {(formData.projects || []).length > 1 && (
                                <div className="text-end mt-2">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => removeProject(index)}
                                  >
                                    Remove
                                  </button>
                                </div>
                              )}
                            </div>
                          ))}

                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary"
                            onClick={addProject}
                          >
                            + Add Project
                          </button>
                        </div>

                        {/* ================= SAVE ================= */}
                        <div className="mt-4 text-end">
                          <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? 'Updating...' : 'Update Profile'}
                          </button>
                        </div>

                      </form>

                      {/* ================= CHANGE PASSWORD FORM (SEPARATE) ================= */}
                      <form onSubmit={handleChangePassword} className="mt-5 pt-4 border-top">
                        <div>
                          <h5 className="fs-17 fw-semibold mb-3">Change Password</h5>

                          <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Current Password"
                            autoComplete="current-password"
                            disabled={saving}
                          />

                          <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="New Password"
                            helperText="Must be at least 8 characters"
                            autoComplete="new-password"
                            disabled={saving}
                          />

                          <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            disabled={saving}
                          />

                          <div className="form-check mt-2">
                            <input className="form-check-input" type="checkbox" id="twoStep" />
                            <label className="form-check-label" htmlFor="twoStep">
                              Enable Two-Step Verification via email
                            </label>
                          </div>

                          <div className="mt-3">
                            <button type="submit" className="btn btn-warning" disabled={saving}>
                              {saving ? 'Changing...' : 'Change Password'}
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>


                </div>
              </div>

            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default CandidateProfile;
