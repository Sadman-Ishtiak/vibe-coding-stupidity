import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { notificationService } from '../../services/notificationService';

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (user) {
      fetchNotifications();
    }
  }, [user, notifOpen]); // Refresh when opening panel

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getMyNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to load notifications');
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (error) {
      // ignore
    }
  };

  return (
    <header className="hf-navbar">
      <div className="nav-inner">
          {/* Logo */}
          <div className="logo">
            <Link to="/">
              <img
                className="logo-img"
                src="https://cdn-icons-png.flaticon.com/512/2942/2942821.png"
                alt="Internship Finder logo"
              />
              <span className="logo-text">Internship Finder</span>
            </Link>
          </div>

          <nav className={`main-nav ${mobileOpen ? 'mobile-open' : ''}`}>
            <ul className="menu">
              <li className={`menu-item ${location.pathname === '/' ? 'current' : ''}`}>
                <Link to="/">Home</Link>
              </li>

              <li className={`menu-item ${['/find-jobs','/browse'].includes(location.pathname) ? 'current' : ''}`}>
                <Link to="/browse">Find Internships</Link>
              </li>

              {/* Role-based Links */}
              {user?.role === 'candidate' && (
                <li className={`menu-item ${location.pathname === '/ai-coach' ? 'current' : ''}`}>
                  <Link to="/ai-coach">AI Coach 🤖</Link>
                </li>
              )}

              {user?.role === 'company' && (
                <li className={`menu-item ${location.pathname === '/post-internship' ? 'current' : ''}`}>
                  <Link to="/post-internship">Post Job</Link>
                </li>
              )}
            </ul>
          </nav>

          {/* Right Side Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                {/* Notification Bell */}
                <div className="nav-action-item notification" onClick={() => setNotifOpen(!notifOpen)}>
                  <span className="bell-icon">🔔</span>
                  {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
                  {notifOpen && (
                    <div className="notification-panel">
                      <div className="notif-header">
                        <span className="notif-title">Notifications</span>
                        <span className="notif-count">{unreadCount} New</span>
                      </div>
                      <div className="notif-list">
                        {notifications.length > 0 ? (
                          notifications.map(notif => (
                            <div key={notif._id} className={`notif-item ${notif.read ? 'read' : 'unread'}`} onClick={() => handleMarkRead(notif._id)}>
                              <div className="notif-content">
                                {notif.message}
                              </div>
                              <div className="notif-time">{new Date(notif.createdAt).toLocaleDateString()}</div>
                            </div>
                          ))
                        ) : (
                          <div className="notif-item">No notifications</div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Account */}
                <div className="nav-action-item account" onClick={() => setAccountOpen(!accountOpen)}>
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.firstName || 'User')}&background=00b074&color=fff&size=40&bold=true`} alt="User" className="user-avatar" />
                  <span className="user-name">{user?.firstName || 'User'} ▾</span>
                  {accountOpen && (
                    <div className="account-panel">
                      <Link to="/dashboard"><span>📊</span> Dashboard</Link>
                      <Link to="/logout"><span>🚪</span> Log Out</Link>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="nav-auth-cta">
                <Link to="/login" className={`btn-outline ${location.pathname === '/login' ? 'current' : ''}`}>Sign in</Link>
                <Link to="/register" className="btn-primary">Register</Link>
              </div>
            )}
          </div>

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
