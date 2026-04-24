import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LocationSelect } from '@/components/common';
import { createJob, updateJob, getJob } from '@/services/jobs.service';

export default function PostJob() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    vacancy: '',
    employmentType: '',
    position: '',
    location: '',
    salaryRange: '',
    experience: '',
    description: '',
    responsibilities: '',
    qualifications: '',
    skillsExperienceDescription: ''
  });

  const [selectedSkills, setSelectedSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableSkills = [
    'PHP', 'JavaScript', 'React', 'Marketing', 'Photoshop', 
    'UI/UX Design', 'Laravel', 'Node.js', 'Python', 'Java',
    'Angular', 'Vue.js', 'HTML', 'CSS', 'SQL'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillSelect = (e) => {
    const skill = e.target.value;
    if (skill && !selectedSkills.includes(skill)) {
      setSelectedSkills(prev => [...prev, skill]);
    }
    e.target.value = '';
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSelectedSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  // Load job data if editing
  useEffect(() => {
    if (editId) {
      const loadJob = async () => {
        try {
          setLoading(true);
          const response = await getJob(editId);
          
          if (response.success && response.data) {
            const job = response.data;
            setFormData({
              title: job.title || '',
              category: job.category || '',
              vacancy: job.vacancy || '',
              employmentType: job.employmentType || '',
              position: job.position || '',
              location: job.location || '',
              salaryRange: job.salaryRange || '',
              experience: job.experience || '',
              description: job.description || '',
              responsibilities: job.responsibilities || '',
              qualifications: job.qualifications || '',
              skillsExperienceDescription: job.skillsExperienceDescription || ''
            });
            setSelectedSkills(job.skills || []);
          }
        } catch (err) {
          setError('Failed to load job data');
        } finally {
          setLoading(false);
        }
      };
      loadJob();
    }
  }, [editId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (loading) return;
    
    // Validate required fields
    const required = ['title', 'category', 'vacancy', 'employmentType', 'position', 'location', 'salaryRange', 'experience', 'description'];
    const missing = required.filter(field => !formData[field] || formData[field].toString().trim() === '');
    
    if (missing.length > 0) {
      alert(`Please fill in all required fields: ${missing.join(', ')}`);
      return;
    }
    
    if (formData.description.length < 50) {
      alert('Description must be at least 50 characters');
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // Prepare job data matching Job schema
      const jobData = {
        ...formData,
        vacancy: Number(formData.vacancy),
        skills: selectedSkills,
        // company will be automatically attached on backend from req.user
      };

      let response;
      if (editId) {
        // Update existing job
        response = await updateJob(editId, jobData);
      } else {
        // Create new job
        response = await createJob(jobData);
      }
      
      if (response.success) {
        alert(response.message || (editId ? 'Job updated successfully!' : 'Job posted successfully!'));
        navigate('/manage-jobs');
      } else {
        throw new Error(response.message || 'Failed to save job');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Failed to save job. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="page-content">
        {/* PAGE TITLE */}
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">{editId ? 'Edit Job' : 'Post a Job'}</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SHAPE */}
        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path fill="#FFFFFF" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z"></path>
            </svg>
          </div>
        </div>

        {/* POST JOB */}
        <section className="section">
          <div className="container">
            <div className="row">
              {/* FORM COLUMN */}
              <div className="col-lg-8">
                <div className="card job-detail overflow-hidden">
                  <div className="card-body p-4">
                    <h5 className="mb-4">Job Details</h5>

                    <form onSubmit={handleSubmit}>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Job Title</label>
                          <input
                            type="text"
                            name="title"
                            className="form-control"
                            placeholder="e.g. Product Designer / UI Designer"
                            value={formData.title}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Job Category</label>
                          <select
                            name="category"
                            className="form-select"
                            value={formData.category}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select category</option>
                            <option value="Design">Design</option>
                            <option value="Development">Development</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Finance">Finance</option>
                            <option value="Human Resources">Human Resources</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Vacancy</label>
                          <input
                            type="number"
                            name="vacancy"
                            className="form-control"
                            placeholder="Number of openings"
                            value={formData.vacancy}
                            onChange={handleChange}
                            min="1"
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Employment Type</label>
                          <select
                            name="employmentType"
                            className="form-select"
                            value={formData.employmentType}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select type</option>
                            <option value="Full Time">Full Time</option>
                            <option value="Part Time">Part Time</option>
                            <option value="Freelancer">Freelancer</option>
                            <option value="Internship">Internship</option>
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Position</label>
                          <input
                            type="text"
                            name="position"
                            className="form-control"
                            placeholder="e.g. Junior, Senior, Lead, Manager"
                            value={formData.position}
                            onChange={handleChange}
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Job Location (District)</label>
                          <LocationSelect
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            includeRemote
                            required
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Salary Range</label>
                          <input
                            type="text"
                            name="salaryRange"
                            className="form-control"
                            placeholder="e.g. ৳30,000 - ৳50,000 / Month"
                            value={formData.salaryRange}
                            onChange={handleChange}
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">Experience</label>
                          <input
                            type="text"
                            name="experience"
                            className="form-control"
                            placeholder="e.g. 0-1 years"
                            value={formData.experience}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="form-label">Job Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows="4"
                          placeholder="Describe the job role and expectations"
                          value={formData.description}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="form-label">Responsibilities</label>
                        <textarea
                          name="responsibilities"
                          className="form-control"
                          rows="3"
                          placeholder="List key responsibilities"
                          value={formData.responsibilities}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mt-4">
                        <label className="form-label">Qualifications</label>
                        <textarea
                          name="qualifications"
                          className="form-control"
                          rows="3"
                          placeholder="Education, certifications, experience"
                          value={formData.qualifications}
                          onChange={handleChange}
                        />
                      </div>

                      {/* SKILLS DROPDOWN + BADGES */}
                      <div className="mt-4">
                        <label className="form-label">Select Skills</label>
                        <select
                          className="form-select"
                          onChange={handleSkillSelect}
                        >
                          <option value="">Select a skill</option>
                          {availableSkills.map(skill => (
                            <option key={skill} value={skill}>
                              {skill}
                            </option>
                          ))}
                        </select>

                        <div className="mt-3">
                          {selectedSkills.map(skill => (
                            <span key={skill} className="badge bg-primary me-1 mb-1">
                              {skill}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.6rem' }}
                                onClick={() => handleRemoveSkill(skill)}
                                aria-label="Remove"
                              ></button>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* SKILLS DESCRIPTION */}
                      <div className="mt-3">
                        <label className="form-label">Skills & Experience Description</label>
                        <textarea
                          name="skillsExperienceDescription"
                          className="form-control"
                          rows="3"
                          placeholder="Describe required skills, tools, and experience"
                          value={formData.skillsExperienceDescription}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="mt-4 pt-3">
                        <button
                          type="submit"
                          className="btn btn-primary w-100"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              Publishing...
                            </>
                          ) : (
                            <>
                              {editId ? 'Update Job' : 'Publish Job'} <i className="uil uil-arrow-right"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              {/* SIDEBAR */}
              <div className="col-lg-4 mt-4 mt-lg-0">
                <div className="side-bar ms-lg-4">
                  <div className="card job-overview">
                    <div className="card-body p-4">
                      <h6 className="fs-17">Job Posting Tips</h6>
                      <ul className="list-unstyled mt-4 mb-0">
                        <li className="d-flex mt-3">
                          <i className="uil uil-check-circle icon bg-soft-primary"></i>
                          <div className="ms-3">
                            <p className="text-muted mb-0">
                              Use a clear and searchable job title
                            </p>
                          </div>
                        </li>
                        <li className="d-flex mt-3">
                          <i className="uil uil-check-circle icon bg-soft-primary"></i>
                          <div className="ms-3">
                            <p className="text-muted mb-0">
                              Select relevant skills and category
                            </p>
                          </div>
                        </li>
                        <li className="d-flex mt-3">
                          <i className="uil uil-check-circle icon bg-soft-primary"></i>
                          <div className="ms-3">
                            <p className="text-muted mb-0">
                              Add location and salary for better reach
                            </p>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
