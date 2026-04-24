import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { internshipService } from '../../services/internshipService';
import './BrowseInternships.css';

const BrowseInternships = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    category: ''
  });

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const data = await internshipService.getAllInternships(filters);
      setInternships(data);
    } catch (error) {
      console.error('Failed to fetch internships', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInternships();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchInternships();
  };

  return (
    <div className="browse-container">
      <div className="browse-header">
        <h1>Find Your Dream Internship</h1>
        <p>Browse hundreds of active listings from top companies</p>
      </div>

      <div className="search-bar-wrapper">
        <form onSubmit={handleSearch} className="search-form">
          <input 
            type="text" 
            name="search"
            placeholder="Search by title or keyword..." 
            value={filters.search}
            onChange={handleFilterChange}
            className="search-input"
          />
          <input 
            type="text" 
            name="location"
            placeholder="Location" 
            value={filters.location}
            onChange={handleFilterChange}
            className="location-input"
          />
          <select 
            name="category" 
            value={filters.category} 
            onChange={handleFilterChange}
            className="category-select"
          >
            <option value="">All Categories</option>
            <option value="Engineering">Engineering</option>
            <option value="Business">Business</option>
            <option value="Marketing">Marketing</option>
            <option value="Design">Design</option>
          </select>
          <button type="submit" className="btn-search">Search</button>
        </form>
      </div>

      <div className="listings-grid">
        {loading ? (
          <div className="loading-state">Loading opportunities...</div>
        ) : internships.length > 0 ? (
          internships.map(internship => (
            <div key={internship._id} className="internship-card">
              <div className="card-header">
                <h3>{internship.title}</h3>
                <span className="company-name">{internship.company?.companyName || 'Unknown Company'}</span>
              </div>
              
              <div className="card-meta">
                <span>📍 {internship.location}</span>
                <span>💰 {internship.stipendType === 'None' ? 'Unpaid' : `$${internship.stipend} ${internship.stipendType}`}</span>
                <span>⏱️ {internship.duration || 'Flexible'}</span>
              </div>
              
              <p className="card-desc">
                {internship.description.substring(0, 100)}...
              </p>

              <div className="card-footer">
                <span className="category-tag">{internship.category}</span>
                <Link to={`/internships/${internship._id}`} className="btn-view">
                  View Details
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No internships found</h3>
            <p>Try adjusting your search filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseInternships;