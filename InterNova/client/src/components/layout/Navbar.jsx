import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useScrollNavbar } from '@/hooks';
import { normalizeImageUrl, createImageErrorHandler } from '@/utils/imageHelpers';

const Navbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const { isAuth, user, logout, loading } = useAuth();
  const navigate = useNavigate();

  // Sticky navbar
  useScrollNavbar();

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const isCandidate = user?.role === 'candidate';
  const isRecruiter = user?.role === 'recruiter' || user?.role === 'company'; // ✅ Support both roles
  
  // Normalize profile image URL with fallback
  // For recruiters/companies, check multiple possible locations for logo
  // Priority: logo > profilePicture > company.logo > profileImage
  const rawImagePath = isRecruiter 
    ? (user?.logo || user?.profilePicture || user?.company?.logo || user?.profileImage) 
    : (user?.profilePicture || user?.profileImage);
  
  // Apply normalization to convert relative paths to absolute URLs
  const profileImageUrl = normalizeImageUrl(rawImagePath) || (isRecruiter 
    ? '/assets/images/user/img-02.jpg' 
    : '/assets/images/profile.jpg');

  return (
    <nav className="navbar navbar-expand-lg fixed-top sticky" id="navbar">
      <div className="container-fluid custom-container">

        {/* Logo */}
        <Link
          className="navbar-brand text-dark fw-bold me-auto brand-logo-link"
          to="/"
          title="A Smart Internship and Career Finder"
          aria-label="InternNova - A Smart Internship and Career Finder"
        >
          <span className="brand-logo-text">InternNova</span>
        </Link>

        {/* Mobile Toggle */}
        <button
          className="navbar-toggler me-3"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarCollapse"
          aria-expanded={!isCollapsed}
          aria-label="Toggle navigation"
        >
          <i className="mdi mdi-menu"></i>
        </button>

        {/* Center Nav */}
        <div className={`collapse navbar-collapse ${!isCollapsed ? 'show' : ''}`} id="navbarCollapse">
          <ul className="navbar-nav mx-auto navbar-center">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Home</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/job-list">Job</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/company-list">Company</NavLink>
            </li>
          </ul>
        </div>

        {/* RIGHT SIDE AUTH AREA */}
        {!isAuth ? (
          /* -------- Logged OUT -------- */
          <ul className="header-menu list-inline d-flex align-items-center mb-0">
            <li className="list-inline-item me-2">
              <Link to="/sign-in" className="btn btn-outline-primary btn-hover">
                Log In
              </Link>
            </li>
            <li className="list-inline-item">
              <Link to="/sign-up" className="btn btn-primary btn-hover">
                Register
              </Link>
            </li>
          </ul>
        ) : (
          /* -------- Logged IN -------- */
          <ul className="header-menu list-inline mb-0 d-flex align-items-center">
            <li className="list-inline-item dropdown">
              <a
                className="header-item"
                href="#"
                id="userdropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  src={profileImageUrl}
                  alt="user"
                  width="33"
                  height="33"
                  className="profile-user rounded-circle"
                  onError={createImageErrorHandler('/assets/images/user/img-02.jpg')}
                />
                <span className="fw-medium d-none d-md-inline-block ms-1">
                  Hi, {user.username}
                </span>
              </a>

              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userdropdown">

                {/* Candidate Menu */}
                {isCandidate && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/bookmark-jobs">
                        <i className="uil uil-bookmark me-2"></i> Bookmark Jobs
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/applied-jobs">
                        <i className="uil uil-briefcase me-2"></i> Applied Jobs
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/candidate-profile">
                        <i className="uil uil-user me-2"></i> My Profile
                      </Link>
                    </li>
                  </>
                )}

                {/* Recruiter/Company Menu */}
                {isRecruiter && (
                  <>
                    <li>
                      <Link className="dropdown-item" to="/manage-jobs">
                        <i className="uil uil-briefcase-alt me-2"></i> Manage Jobs
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/manage-jobs-post">
                        <i className="uil uil-plus-circle me-2"></i> Post Job
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/companies/profile">
                        <i className="uil uil-user me-2"></i> Profile
                      </Link>
                    </li>
                  </>
                )}

                {/* Logout */}
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={handleLogout}
                  >
                    <i className="uil uil-sign-out-alt me-2"></i> Log Out
                  </button>
                </li>

              </ul>
            </li>
          </ul>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
