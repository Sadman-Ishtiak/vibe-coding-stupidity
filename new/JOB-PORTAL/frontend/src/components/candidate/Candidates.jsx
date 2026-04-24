import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './Candidates.css';

const Candidates = () => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    experience: '',
    jobType: [],
    skills: [],
  });
  const [viewType, setViewType] = useState('grid');
  const [sortBy, setSortBy] = useState('featured');

  const allCandidates = useMemo(() => ([
    { id: 1, name: 'Ayesha Khan', title: 'Frontend Developer', avatar: 'https://i.pravatar.cc/150?img=47', location: 'Karachi, PK', exp: '3-5 years', jobTypes: ['Full-time'], skills: ['React', 'TypeScript', 'CSS'], featured: true },
    { id: 2, name: 'Omar Farooq', title: 'Backend Engineer', avatar: 'https://i.pravatar.cc/150?img=12', location: 'Lahore, PK', exp: '5-7 years', jobTypes: ['Remote', 'Contract'], skills: ['Node.js', 'Express', 'MongoDB'] },
    { id: 3, name: 'Fatima Noor', title: 'UI/UX Designer', avatar: 'https://i.pravatar.cc/150?img=5', location: 'Remote', exp: '2-3 years', jobTypes: ['Part-time', 'Remote'], skills: ['Figma', 'Prototyping', 'Illustrator'] },
    { id: 4, name: 'Bilal Ahmed', title: 'Data Analyst', avatar: 'https://i.pravatar.cc/150?img=30', location: 'Islamabad, PK', exp: '1-2 years', jobTypes: ['Internship'], skills: ['Python', 'Pandas', 'SQL'] },
    { id: 5, name: 'Sara Ali', title: 'Mobile Developer', avatar: 'https://i.pravatar.cc/150?img=32', location: 'Karachi, PK', exp: '3-5 years', jobTypes: ['Full-time'], skills: ['Flutter', 'Dart', 'Firebase'], featured: true },
    { id: 6, name: 'Hamza Yousaf', title: 'DevOps Engineer', avatar: 'https://i.pravatar.cc/150?img=21', location: 'Remote', exp: '5-7 years', jobTypes: ['Remote'], skills: ['AWS', 'Docker', 'CI/CD'] },
  ]), []);

  const handleFilterChange = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const toggleInArray = (key, value) => setFilters(prev => ({
    ...prev,
    [key]: prev[key].includes(value) ? prev[key].filter(v => v !== value) : [...prev[key], value]
  }));

  const resetFilters = () => setFilters({ keyword: '', location: '', experience: '', jobType: [], skills: [] });

  const filtered = useMemo(() => {
    let list = [...allCandidates];
    if (filters.keyword) {
      const k = filters.keyword.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(k) || c.title.toLowerCase().includes(k) || c.skills.some(s => s.toLowerCase().includes(k)));
    }
    if (filters.location) {
      const l = filters.location.toLowerCase();
      list = list.filter(c => c.location.toLowerCase().includes(l));
    }
    if (filters.experience) {
      list = list.filter(c => c.exp === filters.experience);
    }
    if (filters.jobType.length) {
      list = list.filter(c => filters.jobType.some(j => c.jobTypes.includes(j)));
    }
    if (filters.skills.length) {
      list = list.filter(c => filters.skills.every(s => c.skills.includes(s)));
    }
    switch (sortBy) {
      case 'featured':
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      case 'name-asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }
    return list;
  }, [allCandidates, filters, sortBy]);

  return (
    <div className="candidates-page">
      {/* Header */}
      <div className="page-header">
        <div className="tf-container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <span className="separator">/</span>
            <span className="current">Candidates</span>
          </div>
          <h1 className="page-title">Browse Candidates</h1>
          <p className="page-subtitle">Find great talent by skills, experience, and availability</p>
        </div>
      </div>

      <div className="candidates-content">
        <div className="tf-container">
          <div className="content-wrapper">
            {/* Sidebar */}
            <aside className="filters-sidebar">
              <div className="sidebar-header">
                <h3>Filter Talent</h3>
                <button className="btn-reset" onClick={resetFilters}>Reset All</button>
              </div>

              <div className="filter-group">
                <label className="filter-label">Keyword</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔍</span>
                  <input type="text" className="filter-input" placeholder="Name, role, skill" value={filters.keyword} onChange={(e)=>handleFilterChange('keyword', e.target.value)} />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Location</label>
                <div className="input-wrapper">
                  <span className="input-icon">📍</span>
                  <input type="text" className="filter-input" placeholder="City or Remote" value={filters.location} onChange={(e)=>handleFilterChange('location', e.target.value)} />
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Experience</label>
                <select className="filter-select" value={filters.experience} onChange={(e)=>handleFilterChange('experience', e.target.value)}>
                  <option value="">Any</option>
                  <option value="1-2 years">1-2 years</option>
                  <option value="2-3 years">2-3 years</option>
                  <option value="3-5 years">3-5 years</option>
                  <option value="5-7 years">5-7 years</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Job Type</label>
                <div className="checkbox-group">
                  {['Full-time','Part-time','Remote','Contract','Internship'].map(j => (
                    <label key={j} className="checkbox-label">
                      <input type="checkbox" checked={filters.jobType.includes(j)} onChange={()=>toggleInArray('jobType', j)} />
                      <span className="checkbox-text">{j}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="filter-group">
                <label className="filter-label">Skills</label>
                <div className="checkbox-group">
                  {['React','Node.js','Python','UI/UX','AWS','SQL','Flutter'].map(s => (
                    <label key={s} className="checkbox-label">
                      <input type="checkbox" checked={filters.skills.includes(s)} onChange={()=>toggleInArray('skills', s)} />
                      <span className="checkbox-text">{s}</span>
                    </label>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main */}
            <main className="candidates-main">
              <div className="candidates-toolbar">
                <div className="toolbar-left">
                  <h2 className="results-count">Showing <strong>{filtered.length}</strong> candidates</h2>
                </div>
                <div className="toolbar-right">
                  <div className="view-toggle">
                    <button className={`view-btn ${viewType==='grid'?'active':''}`} onClick={()=>setViewType('grid')}>⊞</button>
                    <button className={`view-btn ${viewType==='list'?'active':''}`} onClick={()=>setViewType('list')}>☰</button>
                  </div>
                  <select className="sort-select" value={sortBy} onChange={(e)=>setSortBy(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="name-asc">Name A → Z</option>
                    <option value="name-desc">Name Z → A</option>
                  </select>
                </div>
              </div>

              <div className={`candidate-cards ${viewType}`}>
                {filtered.map(c => (
                  <div key={c.id} className="candidate-card">
                    {c.featured && <span className="badge-featured">Featured</span>}
                    <div className="card-inner">
                      <div className="avatar">
                        <img src={c.avatar} alt={c.name} />
                      </div>
                      <div className="info">
                        <h3 className="name"><Link to={`/candidate/${c.id}`}>{c.name}</Link></h3>
                        <p className="title">{c.title}</p>
                        <p className="meta">📍 {c.location} • ⏱️ {c.exp}</p>
                        <div className="tags">
                          {c.skills.map(s => <span className="tag" key={s}>{s}</span>)}
                        </div>
                      </div>
                      <div className="actions">
                        <div className="jobtypes">
                          {c.jobTypes.map(j => <span key={j} className="jt">{j}</span>)}
                        </div>
                        <div className="buttons">
                          <Link className="btn-outline" to={`/candidate/${c.id}`}>View Profile</Link>
                          <button className="btn-primary" type="button">Contact</button>
                        </div>
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

export default Candidates;
