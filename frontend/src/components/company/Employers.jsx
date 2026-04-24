import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Employers.css';

const Employers = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    industry: '',
    size: [],
    rating: '',
  });
  const [sortBy, setSortBy] = useState('featured');
  const [viewType, setViewType] = useState('grid'); // 'grid' | 'list'

  const companies = [
    { id: 1, name: 'Google', logo: 'https://logo.clearbit.com/google.com', location: 'Mountain View, US', industry: 'Technology', size: '10k+ employees', openJobs: 42, rating: 4.9, featured: true },
    { id: 2, name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com', location: 'Redmond, US', industry: 'Technology', size: '10k+ employees', openJobs: 28, rating: 4.8, featured: true },
    { id: 3, name: 'Amazon', logo: 'https://logo.clearbit.com/amazon.com', location: 'Seattle, US', industry: 'E-commerce', size: '10k+ employees', openJobs: 35, rating: 4.7 },
    { id: 4, name: 'Apple', logo: 'https://logo.clearbit.com/apple.com', location: 'Cupertino, US', industry: 'Hardware', size: '10k+ employees', openJobs: 22, rating: 4.9 },
    { id: 5, name: 'Meta', logo: 'https://logo.clearbit.com/meta.com', location: 'Menlo Park, US', industry: 'Social Media', size: '10k+ employees', openJobs: 18, rating: 4.6 },
    { id: 6, name: 'Netflix', logo: 'https://logo.clearbit.com/netflix.com', location: 'Los Gatos, US', industry: 'Entertainment', size: '5k-10k employees', openJobs: 9, rating: 4.5 },
    { id: 7, name: 'Airbnb', logo: 'https://logo.clearbit.com/airbnb.com', location: 'San Francisco, US', industry: 'Travel', size: '5k-10k employees', openJobs: 12, rating: 4.6 },
    { id: 8, name: 'Stripe', logo: 'https://logo.clearbit.com/stripe.com', location: 'Remote', industry: 'Fintech', size: '1k-5k employees', openJobs: 15, rating: 4.7 },
  ];

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));

  const toggleSize = (size) => {
    setFilters(prev => ({
      ...prev,
      size: prev.size.includes(size)
        ? prev.size.filter(s => s !== size)
        : [...prev.size, size]
    }));
  };

  const resetFilters = () => setFilters({ keyword: '', location: '', industry: '', size: [], rating: '' });

  return (
    <div className="employers-page">
      {/* Header */}
      <div className="page-header">
        <div className="tf-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Employers</span>
          </div>
          <h1 className="page-title">Top Employers</h1>
          <p className="page-subtitle">Explore companies hiring right now</p>
        </div>
      </div>

      {/* Content */}
      <div className="employers-content">
        <div className="tf-container">
          <div className="content-wrapper">
            {/* Sidebar */}
            <aside className="filters-sidebar">
              <div className="sidebar-header">
                <h3>Filter Companies</h3>
                <button className="btn-reset" onClick={resetFilters}>Reset All</button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Search Company</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔍</span>
                  <input
                    type="text"
                    className="filter-input"
                    placeholder="Company name, keyword..."
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
                <label className="filter-label">Industry</label>
                <select
                  value={filters.industry}
                  onChange={(e) => handleFilterChange('industry', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Industries</option>
                  <option value="Technology">Technology</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Company Size</label>
                <div className="checkbox-group">
                  {['1-50','51-200','201-1000','1k-5k','5k-10k','10k+'].map(s => (
                    <label key={s} className="checkbox-label">
                      <input type="checkbox" checked={filters.size.includes(s)} onChange={() => toggleSize(s)} />
                      <span className="checkbox-text">{s} employees</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Rating</label>
                <div className="radio-group">
                  {[5,4.5,4,3.5].map(r => (
                    <label key={r} className="radio-label">
                      <input type="radio" name="rating" value={r} checked={String(filters.rating)===String(r)} onChange={(e)=>handleFilterChange('rating', e.target.value)} />
                      <span className="radio-text">{r}+ stars</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="employers-main">
              <div className="employers-toolbar">
                <div className="toolbar-left">
                  <h2 className="results-count">Showing <strong>{companies.length}</strong> companies</h2>
                </div>
                <div className="toolbar-right">
                  <div className="view-toggle">
                    <button className={`view-btn ${viewType==='grid'?'active':''}`} onClick={()=>setViewType('grid')} title="Grid">⊞</button>
                    <button className={`view-btn ${viewType==='list'?'active':''}`} onClick={()=>setViewType('list')} title="List">☰</button>
                  </div>
                  <select className="sort-select" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="jobs-desc">Open Jobs: High → Low</option>
                    <option value="jobs-asc">Open Jobs: Low → High</option>
                    <option value="rating">Top Rated</option>
                  </select>
                </div>
              </div>

              <div className={`companies ${viewType}`}>
                {companies.map(c => (
                  <div key={c.id} className="company-card">
                    {c.featured && <span className="badge-featured">Featured</span>}
                    <div className="card-inner">
                      <div className="logo">
                        <img src={c.logo} alt={c.name} />
                      </div>
                      <div className="info">
                        <h3 className="name"><Link to={`/company/${c.id}`}>{c.name}</Link></h3>
                        <p className="meta">📍 {c.location} • 🏷️ {c.industry}</p>
                        <div className="tags">
                          <span className="tag jobs">{c.openJobs} open jobs</span>
                          <span className="tag size">{c.size}</span>
                        </div>
                      </div>
                      <div className="actions">
                        <div className="rating" title="Company rating">
                          <span>⭐</span>
                          <strong>{c.rating}</strong>
                        </div>
                        <Link to={`/company/${c.id}`} className="btn-view">View Company</Link>
                      </div>
                    </div>
                  </div>
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

export default Employers;
