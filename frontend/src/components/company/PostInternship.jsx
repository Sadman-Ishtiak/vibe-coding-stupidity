import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { internshipService } from '../../services/internshipService';
import './Employers.css'; // Assuming we can use this or create a new one

const PostInternship = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: 'Engineering',
    startDate: '',
    endDate: '',
    duration: '',
    stipend: '',
    stipendType: 'None',
    requirements: '', // We'll handle this as comma-separated
    perks: '',        // We'll handle this as comma-separated
  });

  const categories = [
    'Engineering', 'Business', 'Marketing', 'Design', 'Data Science',
    'Finance', 'Human Resources', 'Legal', 'Sales', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process array fields
      const payload = {
        ...formData,
        stipend: formData.stipend ? Number(formData.stipend) : 0,
        requirements: formData.requirements.split(',').map(item => item.trim()).filter(Boolean),
        perks: formData.perks.split(',').map(item => item.trim()).filter(Boolean),
      };

      await internshipService.createInternship(payload);
      navigate('/dashboard'); // Redirect to dashboard after success
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Failed to post internship');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="card-form-wrapper">
        <div className="form-header">
          <h2>Post a New Internship</h2>
          <p>Find the best talent for your company</p>
        </div>

        {error && <div className="alert error">{error}</div>}

        <form onSubmit={handleSubmit} className="standard-form">
          <div className="form-group">
            <label>Internship Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Software Engineer Intern"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Remote, New York, NY"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe the role, responsibilities, and what you're looking for..."
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Start Date *</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>End Date *</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Duration (approx)</label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                placeholder="e.g. 3 months"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Stipend Amount</label>
              <input
                type="number"
                name="stipend"
                value={formData.stipend}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Stipend Type</label>
              <select name="stipendType" value={formData.stipendType} onChange={handleChange}>
                <option value="None">Unpaid / None</option>
                <option value="Fixed">Fixed (One-time)</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Requirements (comma separated)</label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleChange}
              rows="3"
              placeholder="e.g. React, Node.js, Team player, Good communication"
            />
          </div>

          <div className="form-group">
            <label>Perks (comma separated)</label>
            <textarea
              name="perks"
              value={formData.perks}
              onChange={handleChange}
              rows="2"
              placeholder="e.g. Remote work, Flexible hours, Certificate"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={() => navigate('/dashboard')}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Posting...' : 'Post Internship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostInternship;