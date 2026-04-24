import React from 'react';
import PropTypes from 'prop-types';

/**
 * ProfileCompletionBar Component
 * Displays a visual progress bar showing profile completion percentage
 * @param {number} completion - Profile completion percentage (0-100)
 * @param {boolean} showLabel - Whether to show the percentage label
 * @param {string} className - Additional CSS classes
 */
const ProfileCompletionBar = ({ completion = 0, showLabel = true, className = '' }) => {
  // Ensure completion is between 0 and 100
  const safeCompletion = Math.min(100, Math.max(0, completion));
  
  // Determine color based on completion level (Bootstrap classes)
  const getBarColor = () => {
    if (safeCompletion === 100) return 'bg-success';
    if (safeCompletion >= 75) return 'bg-info';
    if (safeCompletion >= 50) return 'bg-warning';
    return 'bg-danger';
  };

  const getTextColor = () => {
    if (safeCompletion === 100) return 'text-success';
    if (safeCompletion >= 75) return 'text-info';
    if (safeCompletion >= 50) return 'text-warning';
    return 'text-danger';
  };

  return (
    <div className={`profile-completion-container ${className}`}>
      {showLabel && (
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="profile-completion-label">
            Profile Completion: 
          </span>
        </div>
      )}
      
      <div className="profile-progress-wrapper position-relative">
        {/* Milestone markers */}
        <div className="milestone-markers">
          <span className="milestone-marker" style={{ left: '25%' }}></span>
          <span className="milestone-marker" style={{ left: '50%' }}></span>
          <span className="milestone-marker" style={{ left: '75%' }}></span>
          <span className="milestone-marker" style={{ left: '100%' }}></span>
        </div>

        {/* Bootstrap progress bar */}
        <div className="progress profile-progress">
          <div
            className={`progress-bar ${getBarColor()} progress-bar-animated`}
            role="progressbar"
            aria-valuenow={safeCompletion}
            aria-valuemin="0"
            aria-valuemax="100"
            style={{ width: `${safeCompletion}%` }}
          >
            {/* Centered percentage display */}
            <span className="progress-percentage">{safeCompletion}%</span>
          </div>
        </div>
      </div>
      
      {safeCompletion < 100 && showLabel && (
        <p className="profile-completion-helper-text">
          Complete your profile to unlock locked feature
        </p>
      )}
    </div>
  );
};

ProfileCompletionBar.propTypes = {
  completion: PropTypes.number,
  showLabel: PropTypes.bool,
  className: PropTypes.string,
};

export default ProfileCompletionBar;
