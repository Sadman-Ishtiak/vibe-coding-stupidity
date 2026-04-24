import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PasswordInput from '@/components/common/PasswordInput';
import LocationSelect from '@/components/common/LocationSelect';
import { getMyProfile, updateMyProfile, changePassword } from "@/services/companies.service";
import { getProfileImageUrl, getCompanyLogoUrl, normalizeImageUrl, createImageErrorHandler } from '@/utils/imageHelpers';
import { useAuth } from "@/context/AuthContext";
import ProfileCompletionBar from '@/components/common/ProfileCompletionBar';

const CompanyProfile = () => {
  const { isAuth, loading: authLoading, updateUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  
  const [formData, setFormData] = useState({
    username: '', phone: '', location: '', about: '',
    companyName: '', ownerName: '', companyDescription: '', companyWebsite: '', companyLocation: '',
    employees: '', establishedDate: '', workingDays: '', weekend: '',
    facebook: '', linkedin: '', whatsapp: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: '', twoStepVerification: false
  });
  
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [galleryImages, setGalleryImages] = useState([null, null, null]);
  const [galleryPreviews, setGalleryPreviews] = useState([null, null, null]);
  const [message, setMessage] = useState({ type: '', text: '' });

  // ✅ Auth Protection - redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuth) {
      navigate('/login', { replace: true });
    }
  }, [authLoading, isAuth, navigate]);

  // ✅ Load profile with proper cleanup and caching
  const loadProfile = useCallback(async (forceRefresh = false) => {
    let isMounted = true;

    try {
      setLoading(true);
      const response = await getMyProfile();
      
      if (isMounted && response.success) {
        console.log('✅ Profile loaded:', response.data);
        setProfile(response.data);
      } else if (isMounted) {
        showMessage('error', 'Failed to load profile: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('❌ Load profile error:', error);
      if (isMounted) {
        if (error.response?.status === 401) {
          navigate('/login', { replace: true });
        } else {
          showMessage('error', 'Failed to load profile: ' + (error.response?.data?.message || error.message || 'Network error'));
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

  // Memoize company logo URL to prevent flicker
  const companyLogoUrl = useMemo(() => {
    const isNewModel = profile?.companyName !== undefined;
    const isLegacyModel = profile?.user && profile?.company;
    const company = isLegacyModel ? profile.company : profile || {};
    // Return the actual logo value (or null) and let the <img> src fallback
    // handle the placeholder. Avoid embedding a static png here.
    return company.logo || null;
  }, [profile]);
  
  useEffect(() => {
    if (profile) {
      console.log('🔄 Setting form data from profile:', profile);
      
      // ✅ Handle BOTH new Company model AND legacy User+Company model
      const isNewModel = profile.companyName !== undefined; // New: direct Company fields
      const isLegacyModel = profile.user && profile.company; // Old: user+company split
      
      console.log('📊 Model type:', isNewModel ? 'NEW' : isLegacyModel ? 'LEGACY' : 'UNKNOWN');
      
      if (isNewModel) {
        // NEW: Standalone Company authentication
        // ✅ Convert workingSchedule back to display strings
        const convertScheduleToDisplay = (schedule) => {
          if (!schedule) {
            return {
              workingDays: 'Monday - Saturday : 9AM - 5PM',
              weekend: 'Sunday : Closed'
            };
          }
          
          // For now, use static display strings since the UI inputs don't parse them
          // The backend stores structured data, frontend displays simple strings
          const sundayStatus = schedule.sunday?.isOpen ? 'Sunday : Open' : 'Sunday : Closed';
          
          return {
            workingDays: 'Monday - Saturday : 9AM - 5PM',
            weekend: sundayStatus
          };
        };
        
        const displaySchedule = convertScheduleToDisplay(profile.workingSchedule);
        
        // ✅ Format date for input field (YYYY-MM-DD)
        const formatDateForInput = (date) => {
          if (!date) return '';
          try {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
          } catch {
            return '';
          }
        };
        
        setFormData({
          username: profile.companyName || '', // username IS the company name
          ownerName: profile.ownerName || '',
          phone: profile.phone || '',
          companyLocation: profile.companyLocation || '',
          companyDescription: profile.companyDescription || '',
          companyWebsite: profile.companyWebsite || '',
          employees: profile.employees || '',
          establishedDate: formatDateForInput(profile.establishedDate),
          workingDays: displaySchedule.workingDays,
          weekend: displaySchedule.weekend,
          facebook: profile.socialLinks?.facebook || '',
          linkedin: profile.socialLinks?.linkedin || '',
          whatsapp: profile.socialLinks?.whatsapp || ''
        });
      } else if (isLegacyModel) {
        // LEGACY: User-based recruiter with optional Company profile
        const { user, company } = profile;
        
        // ✅ Convert workingSchedule back to display strings (legacy model support)
        const convertScheduleToDisplay = (schedule) => {
          if (!schedule) {
            return {
              workingDays: 'Monday - Saturday : 9AM - 5PM',
              weekend: 'Sunday : Closed'
            };
          }
          
          const sundayStatus = schedule.sunday?.isOpen ? 'Sunday : Open' : 'Sunday : Closed';
          
          return {
            workingDays: 'Monday - Saturday : 9AM - 5PM',
            weekend: sundayStatus
          };
        };
        
        const displaySchedule = convertScheduleToDisplay(company?.workingSchedule);
        
        // ✅ Format date for input field (YYYY-MM-DD)
        const formatDateForInput = (date) => {
          if (!date) return '';
          try {
            const d = new Date(date);
            return d.toISOString().split('T')[0];
          } catch {
            return '';
          }
        };
        
        setFormData({
          username: company?.companyName || user.username || '', // username IS the company name
          ownerName: company?.ownerName || '',
          phone: user.phone || company?.phone || '',
          location: user.location || '',
          about: user.about || '',
          companyDescription: company?.description || '',
          companyWebsite: company?.website || '',
          companyLocation: company?.location || '',
          employees: company?.employees || '',
          establishedDate: formatDateForInput(company?.establishedDate),
          workingDays: displaySchedule.workingDays,
          weekend: displaySchedule.weekend,
          facebook: company?.facebook || '',
          linkedin: company?.linkedin || '',
          whatsapp: company?.whatsapp || ''
        });
      }
    }
  }, [profile]);

  const showMessage = useCallback((type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  }, []);

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handlePasswordChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPasswordData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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

    setProfilePicture(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleGalleryChange = (index, e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      showMessage('error', 'Only JPEG, PNG, and WEBP images are allowed for gallery');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      showMessage('error', 'Gallery image size must be less than 5MB');
      return;
    }

    const newGalleryImages = [...galleryImages];
    newGalleryImages[index] = file;
    setGalleryImages(newGalleryImages);

    const newPreviews = [...galleryPreviews];
    newPreviews[index] = URL.createObjectURL(file);
    setGalleryPreviews(newPreviews);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    // ✅ Validation
    if (!formData.username?.trim()) {
      showMessage('error', 'Company name is required');
      return;
    }

    setUpdating(true);
    
    console.log('📝 Updating profile with formData:', formData);
    
    try {
      const fd = new FormData();
      
      // ✅ Build structured workingSchedule from form inputs
      const buildWorkingSchedule = () => {
        const isNewModel = profile?.companyName !== undefined;
        const isLegacyModel = profile?.user && profile?.company;
        const existingSchedule = isLegacyModel ? profile?.company?.workingSchedule : profile?.workingSchedule;
        
        // Parse weekend input to determine Sunday status
        const isSundayOpen = formData.weekend && formData.weekend.toLowerCase().includes('open');
        
        // Build schedule based on existing or defaults
        const schedule = {
          monday: existingSchedule?.monday || { isOpen: true, from: '9AM', to: '5PM' },
          tuesday: existingSchedule?.tuesday || { isOpen: true, from: '9AM', to: '5PM' },
          wednesday: existingSchedule?.wednesday || { isOpen: true, from: '9AM', to: '5PM' },
          thursday: existingSchedule?.thursday || { isOpen: true, from: '9AM', to: '5PM' },
          friday: existingSchedule?.friday || { isOpen: true, from: '9AM', to: '5PM' },
          saturday: existingSchedule?.saturday || { isOpen: true, from: '9AM', to: '5PM' },
          sunday: {
            isOpen: isSundayOpen,
            from: isSundayOpen ? '9AM' : '',
            to: isSundayOpen ? '5PM' : ''
          }
        };
        
        return schedule;
      };
      
      const workingSchedule = buildWorkingSchedule();
      
      // Append all form fields (excluding workingDays and weekend strings)
      Object.keys(formData).forEach(key => {
        // Skip the legacy string fields - we'll use workingSchedule instead
        if (key === 'workingDays' || key === 'weekend') return;
        
        // Skip fields that don't apply (location, about for new model)
        if (key === 'location' || key === 'about') return;
        
        const value = formData[key];
        if (value !== null && value !== undefined && value !== '') {
          // Send username as companyName for the backend
          if (key === 'username') {
            fd.append('companyName', value);
          } else {
            fd.append(key, value);
          }
        }
      });
      
      // ✅ Append structured workingSchedule
      fd.append('workingSchedule', JSON.stringify(workingSchedule));
      
      // Append profile picture if exists
      if (profilePicture) {
        fd.append('profilePicture', profilePicture);
      }
      
      // Append gallery images with correct field name
      galleryImages.forEach((img) => {
        if (img) {
          fd.append('galleryImages', img);
        }
      });
      
      const response = await updateMyProfile(fd);
      
      console.log('✅ Update response:', response);
      
      if (response.success) {
        // ✅ Update profile state directly (no reload needed - matches Candidate pattern)
        setProfile(response.data);
        
        // ✅ Update auth context to sync Navbar with company data
        // Only update essential fields to avoid breaking auth state
        if (response.data) {
          // Handle both new Company model and legacy User+Company model
          const isNewModel = response.data.companyName !== undefined;
          
          if (isNewModel) {
            // New Company model - username IS company name
            updateUser({
              companyName: response.data.companyName,
              ownerName: response.data.ownerName,
              logo: normalizeImageUrl(response.data.logo),
              profilePicture: normalizeImageUrl(response.data.logo), // For navbar compatibility
              username: response.data.companyName, // username IS company name
              profileCompletion: response.data.profileCompletion,
              role: 'company', // Ensure role is maintained
              userType: 'company' // Ensure userType is maintained
            });
          } else {
            // Legacy model - username is company name from company object
            updateUser({
              username: response.data.company?.companyName || response.data.user?.username,
              profilePicture: response.data.company?.logo || response.data.user?.profilePicture,
              logo: response.data.company?.logo,
              company: response.data.company,
              profileCompletion: response.data.profileCompletion,
              role: 'company', // Ensure role is maintained
              userType: 'company' // Ensure userType is maintained
            });
          }
        }
        
        // Reset form state
        setProfilePicture(null);
        setPreviewUrl(null);
        setGalleryImages([null, null, null]);
        setGalleryPreviews([null, null, null]);
        
        // ✅ Switch to overview tab to show updated profile
        setActiveTab('overview');
        
        // Show success message after tab switch to ensure user sees the result
        showMessage('success', 'Profile updated successfully!');
      } else {
        showMessage('error', 'Failed to update profile: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || error.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
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
      const response = await changePassword(passwordData);
      if (response.success) {
        showMessage('success', 'Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error) {
      showMessage('error', error.response?.data?.message || 'Failed to change password');
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

  if (loading) return (
    <div className="main-content">
      <div className="page-content">
        <div className="container text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    </div>
  );

  // ✅ Handle BOTH new Company model AND legacy User+Company model
  const isNewModel = profile?.companyName !== undefined;
  const isLegacyModel = profile?.user && profile?.company;
  
  const user = isLegacyModel ? profile.user : profile || {};
  const company = isLegacyModel ? profile.company : profile || {};

  return (
    <div className="main-content">
      <div className="page-content">
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Company Profile</h3>
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

        <section className="section">
          <div className="container">
            {message.text && (
              <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} alert-dismissible fade show`} role="alert">
                {message.text}
                <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })} aria-label="Close"></button>
              </div>
            )}
            <div className="card profile-content-page">
              <div className="d-flex justify-content-between align-items-center border-bottom mb-4">
                <ul className="profile-content-nav nav nav-pills mb-0">
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>Overview</button>
                  </li>
                  <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Settings</button>
                  </li>
                </ul>
                <div className="ms-auto" style={{ minWidth: '250px' }}>
                  <ProfileCompletionBar completion={profile?.profileCompletion || 0} showLabel={true} />
                </div>
              </div>

              <div className="card-body p-4">
                <div className="tab-content">
                  {activeTab === 'overview' && (
                    <div className="tab-pane fade show active">
                      <div className="row">
                        <div className="col-lg-4">
                          <div className="card side-bar">
                            <div className="card-body p-4 text-center">
                              <img
                                src={getCompanyLogoUrl(companyLogoUrl, '/assets/images/featured-job/img-01.png')}
                                className="avatar-lg rounded-circle"
                                alt="Logo"
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                onError={createImageErrorHandler('/assets/images/featured-job/img-01.png')}
                              />
                              <h6 className="fs-18 mb-1 mt-4">{formData.username || 'Company Name'}</h6>
                              <ul className="candidate-detail-social-menu list-inline mb-0">
                                {formData.facebook && (
                                  <li className="list-inline-item">
                                    <a href={formData.facebook} target="_blank" rel="noopener noreferrer" className="social-link" title="Facebook">
                                      <i className="uil uil-facebook-f"></i>
                                    </a>
                                  </li>
                                )}
                                {formData.linkedin && (
                                  <li className="list-inline-item">
                                    <a href={formData.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
                                      <i className="uil uil-linkedin-alt"></i>
                                    </a>
                                  </li>
                                )}
                                {formData.whatsapp && (
                                  <li className="list-inline-item">
                                    <a href={`https://wa.me/${formData.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="social-link" title="WhatsApp">
                                      <i className="uil uil-whatsapp"></i>
                                    </a>
                                  </li>
                                )}
                                {formData.phone && (
                                  <li className="list-inline-item">
                                    <a href={`tel:${formData.phone}`} className="social-link" title="Call">
                                      <i className="uil uil-phone-alt"></i>
                                    </a>
                                  </li>
                                )}
                              </ul>
                            </div>
                            <div className="candidate-profile-overview card-body border-top p-4">
                              <h6 className="fs-17 fw-medium mb-3">Profile Overview</h6>
                              <ul className="list-unstyled mb-0">
                                {formData.ownerName && (
                                  <li className="d-flex"><label className="text-dark">Owner Name</label><p className="text-muted ms-2 mb-0">{formData.ownerName}</p></li>
                                )}
                                {formData.establishedDate && (() => {
                                  try {
                                    const date = new Date(formData.establishedDate);
                                    return isNaN(date.getTime()) ? null : (
                                      <li className="d-flex"><label className="text-dark">Established</label><p className="text-muted ms-2 mb-0">{date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p></li>
                                    );
                                  } catch {
                                    return null;
                                  }
                                })()}
                                {formData.employees && (
                                  <li className="d-flex"><label className="text-dark">Employees</label><p className="text-muted ms-2 mb-0">{formData.employees}</p></li>
                                )}
                                <li className="d-flex"><label className="text-dark">Location</label><p className="text-muted ms-2 mb-0">{formData.companyLocation || 'N/A'}</p></li>
                                {formData.companyWebsite && (
                                  <li className="d-flex">
                                    <label className="text-dark">Website</label>
                                    <p className="text-muted text-break ms-2 mb-0">
                                      <a href={formData.companyWebsite.startsWith('http') ? formData.companyWebsite : `https://${formData.companyWebsite}`} target="_blank" rel="noopener noreferrer">
                                        {formData.companyWebsite}
                                      </a>
                                    </p>
                                  </li>
                                )}
                              </ul>
                              <div className="mt-3">
                                <a href={`mailto:${isNewModel ? profile.email : user.email}`} className="btn btn-danger btn-hover w-100"><i className="uil uil-envelope-alt"></i> Send Mail</a>
                              </div>
                            </div>
                            <div className="card-body border-top p-4">
                              <h6 className="fs-17 fw-medium mb-3">Working Days</h6>
                              <ul className="working-days">
                                {(() => {
                                  // ✅ Dynamically render working schedule from live data
                                  const schedule = company.workingSchedule || {};
                                  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                                  const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                                  
                                  return days.map((day, index) => {
                                    const daySchedule = schedule[day];
                                    const isOpen = daySchedule?.isOpen !== false;
                                    const hours = isOpen && daySchedule?.from && daySchedule?.to 
                                      ? `${daySchedule.from} - ${daySchedule.to}` 
                                      : isOpen ? '9AM - 5PM' : 'Close';
                                    
                                    return (
                                      <li key={day}>
                                        {dayNames[index]}
                                        <span className={!isOpen ? 'text-danger' : ''}>{hours}</span>
                                      </li>
                                    );
                                  });
                                })()}
                              </ul>
                            </div>
                          </div>
                        </div>
                        <div className="col-lg-8">
                          <div className="card ms-lg-4 mt-4 mt-lg-0">
                            <div className="card-body p-4">
                              <div className="mb-5">
                                <h6 className="fs-17 fw-medium mb-4">About Company</h6>
                                <p className="text-muted">{formData.companyDescription || 'No description available.'}</p>
                              </div>
                              <div className="candidate-portfolio mb-5">
                                <h6 className="fs-17 fw-medium mb-4">Gallery</h6>
                                <div className="row g-3">
                                  {(galleryPreviews[0] || company.gallery?.[0]) && (
                                    <div className="col-lg-6">
                                      <img src={galleryPreviews[0] || normalizeImageUrl(company.gallery?.[0]) || "/assets/images/gallery/img-01.jpg"} className="img-fluid rounded" alt="" />
                                    </div>
                                  )}
                                  {(galleryPreviews[1] || company.gallery?.[1]) && (
                                    <div className="col-lg-6">
                                      <img src={galleryPreviews[1] || normalizeImageUrl(company.gallery?.[1]) || "/assets/images/gallery/img-03.jpg"} className="img-fluid rounded" alt="" />
                                    </div>
                                  )}
                                  {(galleryPreviews[2] || company.gallery?.[2]) && (
                                    <div className="col-lg-12">
                                      <img src={galleryPreviews[2] || normalizeImageUrl(company.gallery?.[2]) || "/assets/images/gallery/img-12.jpg"} className="img-fluid rounded" alt="" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'settings' && (
                    <div className="tab-pane fade show active">
                      <form onSubmit={handleUpdateProfile}>
                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Company Logo</h5>
                          <p className="text-muted fs-14">
                            This logo appears on your public company profile and job listings.
                          </p>
                          <div className="row align-items-center">
                            <div className="col-lg-3 col-md-4 text-center mb-3 mb-md-0">
                              <img
                                src={previewUrl || getCompanyLogoUrl(companyLogoUrl, '/assets/images/featured-job/img-01.png')}
                                alt="Company Logo"
                                className="img-thumbnail rounded-circle"
                                style={{ width: '140px', height: '140px', objectFit: 'cover' }}
                                onError={createImageErrorHandler('/assets/images/featured-job/img-01.png')}
                              />
                            </div>
                            <div className="col-lg-9 col-md-8">
                              <label className="form-label fw-medium">Upload New Logo</label>
                              <input type="file" className="form-control" accept="image/png, image/jpeg, image/jpg" onChange={handleFileChange} />
                              <div className="form-text mt-2">
                                Recommended size: <strong>80 × 80 px</strong><br />
                                Allowed formats: JPG, PNG<br />
                                Max file size: 2MB
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Company Basic Information</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">Company Name</label>
                              <input className="form-control" name="username" value={formData.username} onChange={handleChange} placeholder="Enter company name" />
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">Owner Name</label>
                              <input className="form-control" name="ownerName" value={formData.ownerName} onChange={handleChange} placeholder="Enter owner name" />
                            </div>
                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Established Date</label>
                              <input type="date" className="form-control" name="establishedDate" value={formData.establishedDate} onChange={handleChange} />
                            </div>
                            <div className="col-lg-6 mt-3">
                              <label className="form-label">Website</label>
                              <input className="form-control" name="companyWebsite" value={formData.companyWebsite} onChange={handleChange} />
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Company Overview (Public)</h5>
                          <p className="text-muted fs-14">
                            This description appears on your public company profile.
                          </p>
                          <textarea className="form-control" rows="6" name="companyDescription" value={formData.companyDescription} onChange={handleChange} />
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Company Statistics</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">Number of Employees</label>
                              <input className="form-control" name="employees" placeholder="e.g., 1500 - 1850" value={formData.employees} onChange={handleChange} />
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">Primary Location</label>
                              <LocationSelect
                                name="companyLocation"
                                value={formData.companyLocation}
                                onChange={handleChange}
                                placeholder="Select district"
                                disabled={updating}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Working Days & Hours</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">Weekdays</label>
                              <input className="form-control" name="workingDays" value={formData.workingDays} onChange={handleChange} placeholder="Monday - Friday : 9AM - 5PM" />
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">Weekend</label>
                              <input className="form-control" name="weekend" value={formData.weekend} onChange={handleChange} placeholder="Sunday : Closed" />
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Company Gallery</h5>
                          <p className="text-muted fs-14">
                            These images appear in the Gallery section of your company profile.
                          </p>
                          <div className="row g-3">
                            <div className="col-lg-4 col-md-6">
                              <div className="border rounded p-3 text-center">
                                <img src={galleryPreviews[0] || normalizeImageUrl(company.gallery?.[0]) || "/assets/images/gallery/img-01.jpg"} className="img-fluid rounded mb-2" style={{height:'150px',objectFit:'cover',width:'100%'}} alt="" />
                                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => handleGalleryChange(0, e)} />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="border rounded p-3 text-center">
                                <img src={galleryPreviews[1] || normalizeImageUrl(company.gallery?.[1]) || "/assets/images/gallery/img-03.jpg"} className="img-fluid rounded mb-2" style={{height:'150px',objectFit:'cover',width:'100%'}} alt="" />
                                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => handleGalleryChange(1, e)} />
                              </div>
                            </div>
                            <div className="col-lg-4 col-md-6">
                              <div className="border rounded p-3 text-center">
                                <img src={galleryPreviews[2] || normalizeImageUrl(company.gallery?.[2]) || "/assets/images/gallery/img-12.jpg"} className="img-fluid rounded mb-2" style={{height:'150px',objectFit:'cover',width:'100%'}} alt="" />
                                <input type="file" className="form-control form-control-sm" accept="image/*" onChange={(e) => handleGalleryChange(2, e)} />
                              </div>
                            </div>
                          </div>
                          <small className="text-muted d-block mt-2">
                            Recommended size: 1200 × 800 px. JPG or PNG.
                          </small>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Contact Information</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">Email (Read Only)</label>
                              <input className="form-control" value={isNewModel ? profile.email : user.email} disabled />
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">Phone</label>
                              <input className="form-control" name="phone" placeholder="tel:+1234567890" value={formData.phone} onChange={handleChange} />
                            </div>
                          </div>
                        </div>

                        <div className="mb-5">
                          <h5 className="fs-17 fw-semibold mb-3">Social & Online Presence</h5>
                          <div className="row">
                            <div className="col-lg-6">
                              <label className="form-label">Facebook</label>
                              <input className="form-control" name="facebook" placeholder="https://facebook.com/company" value={formData.facebook} onChange={handleChange} />
                            </div>
                            <div className="col-lg-6">
                              <label className="form-label">LinkedIn</label>
                              <input className="form-control" name="linkedin" placeholder="https://www.linkedin.com/" value={formData.linkedin} onChange={handleChange} />
                            </div>
                            <div className="col-lg-6 mt-3">
                              <label className="form-label">WhatsApp</label>
                              <input className="form-control" name="whatsapp" placeholder="+1 234 567 8900" value={formData.whatsapp} onChange={handleChange} />
                            </div>
                          </div>
                        </div>

                        <div className="text-end">
                          <button type="submit" className="btn btn-primary px-4" disabled={updating}>
                            {updating ? 'Updating...' : 'Update Company Profile'}
                          </button>
                        </div>

                        <div className="mt-5 pt-4 border-top">
                          <h5 className="fs-17 fw-semibold mb-3">Change Password</h5>
                          
                          <PasswordInput
                            id="currentPassword"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                            placeholder="Current Password"
                            autoComplete="current-password"
                            disabled={updating}
                          />

                          <PasswordInput
                            id="newPassword"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                            placeholder="New Password"
                            helperText="Must be at least 8 characters"
                            autoComplete="new-password"
                            disabled={updating}
                          />

                          <PasswordInput
                            id="confirmPassword"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            disabled={updating}
                          />

                          <div className="form-check mt-2">
                            <input className="form-check-input" type="checkbox" name="twoStepVerification" checked={passwordData.twoStepVerification} onChange={handlePasswordChange} />
                            <label className="form-check-label">
                              Enable Two-Step Verification via email
                            </label>
                          </div>
                        </div>

                        <div className="mt-4 text-end">
                          <button type="button" className="btn btn-primary" onClick={handleChangePassword}>
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CompanyProfile;
