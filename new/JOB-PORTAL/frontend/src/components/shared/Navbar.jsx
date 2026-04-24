import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  return (
    <header className="hf-navbar">
      <div className="nav-inner">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              {/* Icon from Flaticon (id 2942821). Ensure license compliance and attribution as required. Consider self-hosting the PNG under src/assets/logo.png. */}
              <img
                className="logo-img"
                src="https://cdn-icons-png.flaticon.com/512/2942/2942821.png"
                alt="Internship Finder logo"
              />
              <span className="logo-text">Internship Finder</span>
            </Link>
          </div>

          {/* Main Navigation */}
          <nav className={`main-nav ${mobileOpen ? 'mobile-open' : ''}`}>
            <ul className="menu">
              {/* Home */}
              <li className={`menu-item ${location.pathname === '/' ? 'current' : ''}`}>
                <Link to="/">Home</Link>
              </li>

              {/* Find Jobs */}
              <li className={`menu-item ${['/find-jobs','/browse-internships','/browse'].includes(location.pathname) ? 'current' : ''}`}>
                <Link to="/find-jobs">Find Jobs</Link>
              </li>

              {/* Employers */}
              <li className={`menu-item ${location.pathname === '/employers' ? 'current' : ''}`}>
                <Link to="/employers">Employers</Link>
              </li>

              {/* Candidates */}
              <li className={`menu-item ${location.pathname.startsWith('/candidates') ? 'current' : ''}`}>
                <Link to="/candidates">Candidates</Link>
              </li>

              {/* Pages (mobile-only or compact) */}
              <li className="menu-item has-children mobile-only">
                <Link to="/pages">Pages</Link>
                <div className="dropdown">
                  <ul>
                    <li><Link to="/about">About Us</Link></li>
                    <li><Link to="/faq">FAQs</Link></li>
                    <li><Link to="/pricing">Pricing</Link></li>
                    <li><Link to="/contact">Contact Us</Link></li>
                  </ul>
                </div>
              </li>
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {/* Show account and notifications only when logged in */}
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="nav-action-item notification" onClick={() => setNotifOpen(!notifOpen)}>
                  <span className="bell-icon">🔔</span>
                  <span className="badge">5</span>
                  {notifOpen && (
                    <div className="notification-panel">
                      <div className="notif-header">
                        <span className="notif-title">Notification</span>
                        <span className="notif-count">5 New</span>
                      </div>
                      <div className="notif-list">
                        <div className="notif-item">
                          <div className="notif-time">Last day</div>
                          <div className="notif-content">
                            Your submit job <strong>Graphic Design</strong> is <strong>Success</strong>
                          </div>
                        </div>
                        <div className="notif-item">
                          <div className="notif-time">5 Day ago</div>
                          <div className="notif-content">
                            A new application is submitted on your job <strong>Graphic Design</strong>
                          </div>
                        </div>
                        <div className="notif-item">
                          <div className="notif-time">5 Day ago</div>
                          <div className="notif-content">
                            A new application is submitted by <strong>Maverick Nguyen</strong>
                          </div>
                        </div>
                      </div>
                      <div className="notif-footer">
                        <Link to="/notifications">Read All</Link>
                      </div>
                    </div>
                  )}
                </div>

                {/* User Account */}
                <div className="nav-action-item account" onClick={() => setAccountOpen(!accountOpen)}>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&background=00b074&color=fff&size=40&bold=true`} alt="User" className="user-avatar" />
                  <span className="user-name">{user?.name || 'User'} ▾</span>
                  {accountOpen && (
                    <div className="account-panel">
                      <Link to="/dashboard"><span>📊</span> Dashboard</Link>
                      <Link to="/profile"><span>👤</span> Profile</Link>
                      <Link to="/resumes"><span>📄</span> Resumes</Link>
                      <Link to="/applied"><span>📝</span> My Applied</Link>
                      <Link to="/saved"><span>💼</span> Saved Jobs</Link>
                      <Link to="/alerts"><span>🔔</span> Job Alerts</Link>
                      <Link to="/messages"><span>💬</span> Messages</Link>
                      <Link to="/settings"><span>⚙️</span> Change Password</Link>
                      <Link to="/logout"><span>🚪</span> Log Out</Link>
                    </div>
                  )}
                </div>

                {/* Upload Resume Button */}
                <Link to="/upload-resume" className="btn-upload">
                  Upload Resume
                </Link>
              </>
            ) : (
              // When logged out, show Sign in and Register
              <div className="nav-auth-cta">
                <Link to="/login" className={`btn-outline ${location.pathname === '/login' ? 'current' : ''}`}>Sign in</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="nav-hamburger" onClick={() => setMobileOpen(!mobileOpen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
      </div>
    </header>
  );
};

export default Navbar;
