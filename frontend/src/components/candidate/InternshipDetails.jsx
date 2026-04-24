import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { internshipService } from '../../services/internshipService';
import ApplyInternship from './ApplyInternship';
import './Candidates.css'; // We'll assume a shared CSS or create a new one

const InternshipDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await internshipService.getInternshipById(id);
        setInternship(data);
      } catch (error) {
        console.error('Failed to load internship', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="loading-screen">Loading details...</div>;
  if (!internship) return <div className="error-screen">Internship not found</div>;

  return (
    <div className="details-page">
      <div className="details-container">
        <button className="btn-back" onClick={() => navigate(-1)}>← Back</button>
        
        <div className="details-header">
          <div className="header-main">
            <h1>{internship.title}</h1>
            <h2 className="company-link">{internship.company?.companyName}</h2>
          </div>
          <button className="btn-primary btn-lg" onClick={() => setShowApplyModal(true)}>
            Apply Now
          </button>
        </div>

        <div className="details-grid">
          <div className="details-main">
            <section className="detail-section">
              <h3>About the Role</h3>
              <p>{internship.description}</p>
            </section>

            <section className="detail-section">
              <h3>Requirements</h3>
              <ul className="requirements-list">
                {internship.requirements?.length > 0 ? (
                  internship.requirements.map((req, index) => <li key={index}>{req}</li>)
                ) : (
                  <li>No specific requirements listed.</li>
                )}
              </ul>
            </section>

            <section className="detail-section">
              <h3>Perks & Benefits</h3>
              <div className="tags-row">
                {internship.perks?.map((perk, index) => (
                  <span key={index} className="tag-pill">{perk}</span>
                ))}
              </div>
            </section>
          </div>

          <div className="details-sidebar">
            <div className="sidebar-card">
              <h3>Overview</h3>
              <div className="info-item">
                <span className="label">Location</span>
                <span className="value">{internship.location}</span>
              </div>
              <div className="info-item">
                <span className="label">Stipend</span>
                <span className="value">
                  {internship.stipend ? `$${internship.stipend} (${internship.stipendType})` : 'Unpaid'}
                </span>
              </div>
              <div className="info-item">
                <span className="label">Duration</span>
                <span className="value">{internship.duration}</span>
              </div>
              <div className="info-item">
                <span className="label">Start Date</span>
                <span className="value">{new Date(internship.startDate).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Category</span>
                <span className="value">{internship.category}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showApplyModal && (
        <ApplyInternship 
          internshipId={id} 
          internshipTitle={internship.title} 
          onClose={() => setShowApplyModal(false)} 
        />
      )}
    </div>
  );
};

export default InternshipDetails;