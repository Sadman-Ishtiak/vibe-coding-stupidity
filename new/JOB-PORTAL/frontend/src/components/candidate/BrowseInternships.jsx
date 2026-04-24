import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './BrowseInternships.css';

const BrowseInternships = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    jobType: '',
    workModel: [],
    salary: '',
    seniority: '',
  });

  const [viewType, setViewType] = useState('grid'); // 'grid' or 'list'
  const [sortBy, setSortBy] = useState('featured');

  // Sample internship data
  const internships = [
    {
      id: 1,
      title: 'Senior UI/UX Designer',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: true,
      rating: 5,
    },
    {
      id: 2,
      title: 'Social Media Marketing',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Freelancer', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: true,
      rating: 5,
    },
    {
      id: 3,
      title: 'HR Administration',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Temporary', 'On-site'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: true,
      rating: 5,
    },
    {
      id: 4,
      title: 'Full Stack Development',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Part-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 5,
      title: 'Project Manager',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Freelancer', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 6,
      title: 'Senior DevOps Engineer',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Contract', 'On-site'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 7,
      title: 'Project Manager',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 8,
      title: 'Social Media Marketing',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Freelancer', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 9,
      title: 'Senior UI/UX Designer',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 10,
      title: 'Project Manager',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 11,
      title: 'HR Administration',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
    {
      id: 12,
      title: 'Senior DevOps Engineer',
      company: 'Rockstar Games New York',
      logo: 'https://logo.clearbit.com/rockstargames.com',
      location: 'Las Vegas, NV 89107, USA',
      jobType: ['Full-time', 'Remote'],
      salary: '$83,000 - $110,000',
      salaryPeriod: 'year',
      posted: '2 days ago',
      daysLeft: 22,
      featured: false,
      rating: 5,
    },
  ];

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const toggleWorkModel = (model) => {
    setFilters(prev => ({
      ...prev,
      workModel: prev.workModel.includes(model)
        ? prev.workModel.filter(m => m !== model)
        : [...prev.workModel, model]
    }));
  };

  const resetFilters = () => setFilters({ keyword: '', location: '', jobType: '', workModel: [], salary: '', seniority: '' });

  // List view job card
  const ListJobCard = ({ job }) => (
    <div className="internship-card list-view">
      <div className="card-header">
        <div className="company-info">
          <div className="logo">
            <img src={job.logo} alt={job.company} />
          </div>
          <div className="details">
            <h3 className="title">
              <Link to={`/internship/${job.id}`}>{job.title}</Link>
              {job.featured && <span className="badge-featured">Featured</span>}
            </h3>
            <p className="company"><Link to={`/company/${job.id}`}>{job.company}</Link></p>
            <p className="meta">📍 {job.location}</p>
            <div className="tags">
              {job.jobType.map((type, idx) => (
                <span key={idx} className="tag">{type}</span>
              ))}
            </div>
          </div>
        </div>
        <div className="card-actions">
          <div className="rating">
            <span>⭐</span>
            <strong>{job.rating}</strong>
          </div>
          <span className="salary">{job.salary}</span>
          <span className="days">{job.daysLeft} days left</span>
        </div>
      </div>
    </div>
  );

  // Grid view job card
  const GridJobCard = ({ job }) => (
    <div className="internship-card grid-view">
      <div className="card-badge">
        {job.featured && <span className="badge-featured">Featured</span>}
      </div>
      <div className="card-content">
        <div className="company-header">
          <img src={job.logo} alt={job.company} className="company-logo" />
          <div className="rating">
            <span>⭐</span>
            <strong>{job.rating}</strong>
          </div>
        </div>
        <h3 className="title"><Link to={`/internship/${job.id}`}>{job.title}</Link></h3>
        <p className="company"><Link to={`/company/${job.id}`}>{job.company}</Link></p>
        <p className="location">📍 {job.location}</p>
        <div className="tags">
          {job.jobType.map((type, idx) => (
            <span key={idx} className="tag">{type}</span>
          ))}
        </div>
        <div className="card-footer">
          <div className="salary">{job.salary}</div>
          <Link to={`/internship/${job.id}`} className="btn-apply">Apply Now</Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="internships-page">
      {/* Header */}
      <div className="page-header">
        <div className="tf-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Internships</span>
          </div>
          <h1 className="page-title">Browse Internships</h1>
          <p className="page-subtitle">Explore internship opportunities available now</p>
        </div>
      </div>

      {/* Content */}
      <div className="internships-content">
        <div className="tf-container">
          <div className="content-wrapper">
            {/* Sidebar */}
            <aside className="filters-sidebar">
              <div className="sidebar-header">
                <h3>Filter Internships</h3>
                <button className="btn-reset" onClick={resetFilters}>Reset All</button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Search Position</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔍</span>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Job title, keywords..."
                    value={filters.keyword}
                    onChange={(e) => handleFilterChange('keyword', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="City or country"
                    value={filters.location}
                    onChange={(e) => handleFilterChange('location', e.target.value)}
                  />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Job Type</label>
                <select
                  value={filters.jobType}
                  onChange={(e) => handleFilterChange('jobType', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Job Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelancer">Freelancer</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Work Model</label>
                <div className="checkbox-group">
                  {['On-site', 'Remote', 'Hybrid'].map(model => (
                    <label key={model} className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={filters.workModel.includes(model)} 
                        onChange={() => toggleWorkModel(model)} 
                      />
                      <span className="checkbox-text">{model}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Salary Range</label>
                <select
                  value={filters.salary}
                  onChange={(e) => handleFilterChange('salary', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any Salary</option>
                  <option value="50k">$50,000+</option>
                  <option value="70k">$70,000+</option>
                  <option value="90k">$90,000+</option>
                  <option value="110k">$110,000+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Seniority Level</label>
                <select
                  value={filters.seniority}
                  onChange={(e) => handleFilterChange('seniority', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Levels</option>
                  <option value="Entry Level">Entry Level</option>
                  <option value="Mid Level">Mid Level</option>
                  <option value="Senior">Senior</option>
                  <option value="Executive">Executive</option>
                </select>
              </div>
            </aside>

            {/* Main */}
            <main className="internships-main">
              <div className="internships-toolbar">
                <div className="toolbar-left">
                  <h2 className="results-count">Showing <strong>{internships.length}</strong> internships</h2>
                </div>
                <div className="toolbar-right">
                  <div className="view-toggle">
                    <button 
                      className={`view-btn ${viewType === 'list' ? 'active' : ''}`} 
                      onClick={() => setViewType('list')} 
                      title="List view"
                      aria-label="List view"
                    >
                      ☰
                    </button>
                    <button 
                      className={`view-btn ${viewType === 'grid' ? 'active' : ''}`} 
                      onClick={() => setViewType('grid')} 
                      title="Grid view"
                      aria-label="Grid view"
                    >
                      ⊞
                    </button>
                  </div>
                  <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="newest">Newest First</option>
                    <option value="salary-high">Highest Salary</option>
                    <option value="salary-low">Lowest Salary</option>
                    <option value="deadline">Deadline Soon</option>
                  </select>
                </div>
              </div>

              <div className={`internships-grid ${viewType}`}>
                {internships.map(job => (
                  viewType === 'list' 
                    ? <ListJobCard key={job.id} job={job} />
                    : <GridJobCard key={job.id} job={job} />
                ))}
              </div>

              <div className="pagination">
                <button className="page-btn prev" disabled>← Previous</button>
                <div className="page-numbers">
                  <button className="page-number active">1</button>
                  <button className="page-number">2</button>
                  <button className="page-number">3</button>
                  <span className="page-ellipsis">…</span>
                  <button className="page-number">10</button>
                </div>
                <button className="page-btn next">Next →</button>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrowseInternships;
