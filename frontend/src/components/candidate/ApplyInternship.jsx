import React, { useState } from 'react';
import { applicationService } from '../../services/applicationService';
import './Candidates.css';

const ApplyInternship = ({ internshipId, internshipTitle, onClose }) => {
  const [formData, setFormData] = useState({
    coverLetter: '',
    resumeUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await applicationService.apply(internshipId, formData);
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Apply for {internshipTitle}</h2>
          <button className="btn-close" onClick={onClose}>&times;</button>
        </div>

        {success ? (
          <div className="success-message">
            <div className="check-icon">✓</div>
            <h3>Application Sent!</h3>
            <p>Good luck! The company will review your application shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert error">{error}</div>}
            
            <div className="form-group">
              <label>Link to Resume / Portfolio *</label>
              <input 
                type="url" 
                name="resumeUrl"
                placeholder="https://drive.google.com/..." 
                value={formData.resumeUrl}
                onChange={handleChange}
                required
              />
              <small>Please provide a public link to your resume (Google Drive, Dropbox, LinkedIn, etc).</small>
            </div>

            <div className="form-group">
              <label>Cover Letter</label>
              <textarea 
                name="coverLetter"
                rows="6"
                placeholder="Introduce yourself and explain why you're a good fit..."
                value={formData.coverLetter}
                onChange={handleChange}
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplyInternship;