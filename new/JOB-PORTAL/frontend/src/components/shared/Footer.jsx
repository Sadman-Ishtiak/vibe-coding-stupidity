import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top footer-grid">
          {/* Brand + Help + Address + Subscribe */}
          <div className="f-col brand">
            <div className="f-logo">Internship Finder</div>
            <div className="f-help">
              <span className="ico" aria-hidden>📞</span>
              <div>
                <small>Need help? 24/7</small>
                <div className="phone">001-1234-88888</div>
              </div>
            </div>
            <div className="f-address">
              <span className="ico" aria-hidden>📍</span>
              <span>101 E 129th St, East Chicago, IN 46312, US</span>
            </div>
            <form className="f-subscribe" onSubmit={(e)=>e.preventDefault()}>
              <input type="email" placeholder="Your email address" aria-label="Your email" />
              <button className="send" aria-label="Subscribe">✈️</button>
            </form>
          </div>

          {/* Columns */}
          <div className="f-col">
            <h5>Quick Links</h5>
            <Link to="/packages">Job Packages</Link>
            <Link to="/post">Post New Job</Link>
            <Link to="/browse">Jobs Listing</Link>
            <Link to="/styles">Jobs Style Grid</Link>
            <Link to="/employers">Employer Listing</Link>
            <Link to="/employers/grid">Employers Grid</Link>
          </div>

          <div className="f-col">
            <h5>For Candidates</h5>
            <Link to="/dashboard">User Dashboard</Link>
            <Link to="/cv">CV Packages</Link>
            <Link to="/candidates">Candidate Listing</Link>
            <Link to="/candidates/grid">Candidates Grid</Link>
            <Link to="/about">About us</Link>
            <Link to="/contact">Contact us</Link>
          </div>

          <div className="f-col">
            <h5>For Employers</h5>
            <Link to="/post">Post New Job</Link>
            <Link to="/employer-listing">Employer Listing</Link>
            <Link to="/employers">Employers Grid</Link>
            <Link to="/packages">Job Packages</Link>
            <Link to="/browse">Jobs Listing</Link>
            <Link to="/styles">Jobs Style Grid</Link>
          </div>

          {/* Social + App */}
          <div className="f-col social-app">
            <div className="follow">
              <span className="label">Follow Us:</span>
              <div className="socials">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">in</a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">t</a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" aria-label="Pinterest">p</a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">▶</a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copy">©2025 Internship Finder. All Rights Reserved.</div>
          <div className="legal">
            <Link to="/terms">Terms Of Services</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/cookies">Cookie Policy</Link>
          </div>
          <div className="lang">English</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
