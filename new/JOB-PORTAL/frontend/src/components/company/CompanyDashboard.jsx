import React, { useState } from 'react';

function CompanySidebar() {
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <div id="sidebar-menu" className="ff-active">
      <ul className="downmenu list-unstyled downMenu ff-show" id="side-menu">
        <li className="ff-active">
          <a href="candidates-dashboard.html" className="tf-effect active">
            <span className="icon-dashboard dash-icon"></span>
            <span className="dash-titles">Dashboard</span>
          </a>
        </li>

        <li>
          <button
            type="button"
            className="has-arrow tf-effect btn-reset"
            onClick={() => setProfileOpen((v) => !v)}
            aria-expanded={profileOpen}
          >
            <span className="icon-profile dash-icon"></span>
            <span className="dash-titles">Profile</span>
          </button>
          <ul className={`sub-menu2 ff-collapse ${profileOpen ? 'ff-show' : ''}`}>
            <li><a href="candidates-overview.html">Overview</a></li>
            <li><a href="candidates-profile-setting.html">Profile Setting</a></li>
          </ul>
        </li>

        <li>
          <a href="candidates-resumes.html" className="tf-effect">
            <span className="icon-resumes dash-icon"></span>
            <span className="dash-titles">Resumes</span>
          </a>
        </li>

        <li>
          <a href="candidates-my-applied.html" className="tf-effect">
            <span className="icon-my-apply dash-icon"></span>
            <span className="dash-titles">My Applied</span>
          </a>
        </li>

        <li>
          <a href="candidates-save-jobs.html" className="tf-effect">
            <span className="icon-work dash-icon"></span>
            <span className="dash-titles">Saved Jobs</span>
          </a>
        </li>

        <li>
          <a href="candidates-alerts-jobs.html" className="tf-effect">
            <span className="icon-bell1 dash-icon"></span>
            <span className="dash-titles">Alerts Jobs</span>
          </a>
        </li>

        <li>
          <a href="candidates-messages.html" className="tf-effect">
            <span className="icon-chat dash-icon"></span>
            <span className="dash-titles">Messages</span>
          </a>
        </li>

        <li>
          <a href="candidates-following-employers.html" className="tf-effect">
            <span className="icon-following dash-icon"></span>
            <span className="dash-titles">Following Employers</span>
          </a>
        </li>

        <li>
          <a href="candidates-meetings.html" className="tf-effect">
            <span className="icon-meeting dash-icon"></span>
            <span className="dash-titles">Meeting</span>
          </a>
        </li>

        <li>
          <a href="candidates-change-passwords.html" className="tf-effect">
            <span className="icon-change-passwords dash-icon"></span>
            <span className="dash-titles">Change passwords</span>
          </a>
        </li>

        <li>
          <a href="candidates-delete-profile.html" className="tf-effect ">
            <span className="icon-trash dash-icon"></span>
            <span className="dash-titles">Delete Profile</span>
          </a>
        </li>

        <li>
          <a href="../home-01.html" className="tf-effect">
            <span className="icon-log-out dash-icon"></span>
            <span className="dash-titles">Log out</span>
          </a>
        </li>

      </ul>
    </div>
  );
}

const CompanyDashboard = () => {
  return (
    <div className="company-dashboard dashboard">
      <div className="dashboard-grid">
        <aside className="dashboard-sidebar">
          <CompanySidebar />
        </aside>
        <main className="dashboard-main">
          <h1>Company Dashboard</h1>
          {/* TODO: Add dashboard widgets here */}
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
