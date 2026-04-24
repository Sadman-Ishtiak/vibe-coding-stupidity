import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBriefcase, FaUsers, FaStar, FaHeart } from 'react-icons/fa';
import './CandidateDashboard.css';

// All components merged into this single file per request

function normalizeAttributeValue(value) {
  if (value === undefined || value === null) return undefined;

  let normalizedValue;
  if (Array.isArray(value)) {
    normalizedValue = value
      .map(normalizeAttributeValue)
      .filter(Boolean)
      .join(', ');
  }

  normalizedValue =
    normalizedValue ||
    value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/&amp;/g, '&')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ');

  if (normalizedValue === '') return undefined;
  return normalizedValue;
}

// SidebarMenu (merged)
function SidebarMenu() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div className="left-menu ff-show">
      <div id="sidebar-menu" className="ff-active">
        <ul className="downmenu list-unstyled downMenu ff-show" id="side-menu">
          <li className="ff-active">
            <Link to="/candidate-only" className="tf-effect active">
              <span className="icon-dashboard dash-icon" />
              <span className="dash-titles">Dashboard</span>
            </Link>
          </li>

          <li>
            <button
              type="button"
              aria-expanded={profileOpen}
              aria-controls="profile-submenu"
              className="has-arrow tf-effect btn-reset"
              onClick={() => setProfileOpen(!profileOpen)}
            >
              <span className="icon-profile dash-icon" />
              <span className="dash-titles">Profile</span>
            </button>
            <ul id="profile-submenu" className={`sub-menu2 ff-collapse ${profileOpen ? 'ff-show' : ''}`}>
              <li><Link to="/candidates-overview">Overview</Link></li>
              <li><Link to="/candidates-profile-setting">Profile Setting</Link></li>
            </ul>
          </li>

          <li>
            <Link to="/candidates-resumes" className="tf-effect">
              <span className="icon-resumes dash-icon" />
              <span className="dash-titles">Resumes</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-my-applied" className="tf-effect">
              <span className="icon-my-apply dash-icon" />
              <span className="dash-titles">My Applied</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-save-jobs" className="tf-effect">
              <span className="icon-work dash-icon" />
              <span className="dash-titles">Saved Jobs</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-alerts-jobs" className="tf-effect">
              <span className="icon-bell1 dash-icon" />
              <span className="dash-titles">Alerts Jobs</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-messages" className="tf-effect">
              <span className="icon-chat dash-icon" />
              <span className="dash-titles">Messages</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-following-employers" className="tf-effect">
              <span className="icon-following dash-icon" />
              <span className="dash-titles">Following Employers</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-meetings" className="tf-effect">
              <span className="icon-meeting dash-icon" />
              <span className="dash-titles">Meeting</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-change-passwords" className="tf-effect">
              <span className="icon-change-passwords dash-icon" />
              <span className="dash-titles">Change passwords</span>
            </Link>
          </li>

          <li>
            <Link to="/candidates-delete-profile" className="tf-effect ">
              <span className="icon-trash dash-icon" />
              <span className="dash-titles">Delete Profile</span>
            </Link>
          </li>

          <li>
            <a href="/" className="tf-effect">
              <span className="icon-log-out dash-icon" />
              <span className="dash-titles">Log out</span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

// DashboardHeader
function DashboardHeader() {
  return (
    <section className="page-title-dashboard">
      <div className="themes-container">
        <div className="row">
          <div className="col-lg-12 col-md-12 ">
            <div className="title-dashboard">
              <div className="title-dash flex2">Dashboard</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// DashboardStats
function DashboardStats({ stats }) {
  const defaultStats = stats || [
    { id: 'jobs', value: 15, title: 'Posted Jobs', icon: <FaBriefcase /> },
    { id: 'applications', value: 2068, title: 'Application', icon: <FaUsers /> },
    { id: 'reviews', value: 21, title: 'Review', icon: <FaStar /> },
    { id: 'wishlist', value: 320, title: 'Wishlist', icon: <FaHeart /> },
  ];

  return (
    <section className="flat-icon-dashboard">
      <div className="themes-container">
        <div className="row">
          <div className="col-lg-12 col-md-12 ">
            <div className="wrap-icon widget-counter">
              {defaultStats.map((s, idx) => (
                <div className="box-icon wrap-counter flex" key={s.id}>
                  <div className={`icon style${idx + 1}`}>
                    <span className="icon-bag">{s.icon}</span>
                  </div>
                  <div className="content">
                    <div className="count-dash counter-number">{s.value}</div>
                    <h4 className="title-count">{s.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ProfileViewsChart
function ProfileViewsChart() {
  return (
    <div className="box-dyagram bg-white">
      <div id="chart">
        <div className="toolbar-box flex">
          <h3>Your Profile Views</h3>
          <div className="toolbar">
            <button id="one_month">1M</button>
            <button id="six_months">6M</button>
            <button id="one_year" className="active">1Y</button>
            <button id="ytd">YTD</button>
            <button id="all">ALL</button>
          </div>
        </div>

        <div id="chart-timeline" style={{ minHeight: 300 }} className="chart-placeholder" />
      </div>
    </div>
  );
}

// Notifications
function Notifications({ items }) {
  const list = items || [
    { id: 1, user: 'Cooper', action: 'applied for a job', subject: 'UI Designer' },
    { id: 2, user: 'Simmons', action: 'get a job', subject: 'UX Architect' },
    { id: 3, user: 'Richards', action: 'get a job', subject: 'Internet Security' },
  ];

  return (
    <div className="box-notifications bg-white">
      <h3>Notifications</h3>
      <ul className="inner-box">
        {list.map((n) => (
          <li className="inner" key={n.id}>
            <div className="noti-icon"><span className="icon-bell1" /></div>
            <div>
              <h4>{n.user}</h4>
              <p>{n.action}</p>
              <div className="p-16 color-3">{n.subject}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

// RecentApplications
function RecentApplications({ applications }) {
  const rows = applications || [];

  return (
    <div className="applicants bg-white">
      <h3 className="title-appli">Job Applied Recently</h3>
      <div className="table-content">
        <div className="wrap-applicants table-responsive">
          <table className="applied-table">
            <thead>
              <tr>
                <th>Jobs</th>
                <th>Status</th>
                <th className="center">Date Applied</th>
                <th className="center">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr className="file-delete" key={r.id}>
                  <td>
                    <div className="candidates-wrap flex2">
                      <div className="images">
                        <img src={r.avatar || `https://picsum.photos/seed/${r.id}/48/48`} alt="" />
                      </div>
                      <div className="content">
                        <h3>{r.position || r.job}</h3>
                        <div className="now-box flex2">
                          <div className="map color-4">{r.company || `Company ${idx + 1}`}</div>
                          <div className="days">{r.applied || r.date}</div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="status-wrap">
                      <div className="button-status style-bt">{r.status}</div>
                    </div>
                  </td>
                  <td className="center">
                    <div className="title-day color-1">{r.applied || r.date}</div>
                  </td>
                  <td className="center">
                    <div className="titles-dropdown">
                      <button className="btn-selector nolink">•••</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// DashboardFooter
function DashboardFooter() {
  return (
    <section className="flat-dashboard-bottom">
      <div className="themes-container">
        <div className="row">
          <div className="col-lg-12 col-md-12 ">
            <h5 className="center">©2023 Jobtex. All Rights Reserved.</h5>
          </div>
        </div>
      </div>
    </section>
  );
}
const sampleCandidates = [
  { id: 1, avatar: '/src/assets/avatar1.png', position: 'Frontend Developer', applied: '2 days ago', status: 'Pending' },
  { id: 2, avatar: '/src/assets/avatar2.png', position: 'Backend Developer', applied: '5 days ago', status: 'Interview' },
  { id: 3, avatar: '/src/assets/avatar3.png', position: 'UI/UX Designer', applied: '1 week ago', status: 'Hired' },
  { id: 4, avatar: '/src/assets/avatar4.png', position: 'DevOps Engineer', applied: '3 days ago', status: 'Pending' },
  { id: 5, avatar: '', position: 'Product Manager', applied: '6 days ago', status: 'Pending' },
  { id: 6, avatar: '', position: 'Data Scientist', applied: '8 days ago', status: 'Interview' },
];

const CandidateDashboard = () => {
  useEffect(() => {
    try {
      const pageAttributes = {
        app_name: normalizeAttributeValue('Marketplace'),
        app_env: normalizeAttributeValue('production'),
        app_version: normalizeAttributeValue('b75fe289f4962fe2472f42aa84528eae48dbc5ee'),
        page_type: normalizeAttributeValue('item'),
        page_location: window.location.href,
        page_title: document.title,
        page_referrer: document.referrer,
        ga_param: normalizeAttributeValue(''),
        event_attributes: null,
        user_attributes: {
          user_id: normalizeAttributeValue(''),
          market_user_id: normalizeAttributeValue(''),
        },
      };

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(pageAttributes);
        window.dataLayer.push({
          event: 'analytics_ready',
          event_attributes: { event_type: 'user', custom_timestamp: Date.now() },
        });
      }
    } catch (e) {
      // ignore
    }
  }, []);

  return (
    <div className="candidate-dashboard dashboard-layout">
      <div className="dashboard-top">
        <div className="dashboard-title">
          <h2>Candidates Dashboard</h2>
          <p className="muted">Overview of candidate activity and recent applications</p>
        </div>
        <div className="dashboard-actions">
          <button className="btn btn-primary">New Candidate</button>
        </div>
      </div>

      <SidebarMenu />

      <DashboardHeader />

      <DashboardStats />

      <section className="flat-dashboard-dyagram">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <div className="wrap-dyagram flex">
                <ProfileViewsChart />
                <Notifications />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flat-dashboard-candidates flat-dashboard-applicants">
        <div className="themes-container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <RecentApplications applications={sampleCandidates} />
            </div>
          </div>
        </div>
      </section>

      <DashboardFooter />
    </div>
  );
};

export default CandidateDashboard;
