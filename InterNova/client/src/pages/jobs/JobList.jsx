import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import JobListCard from "@/components/cards/JobListCard";
import LocationSelect from "@/components/common/LocationSelect";
import Pagination from "@/components/common/Pagination";
import ApplyJobModal from "@/components/common/ApplyJobModal";
import { listJobs } from "@/services/jobs.service";
import useJobFilters from "@/hooks/useJobFilters";

const JOBS_PER_PAGE = 8;

export default function JobList() {
  const {
    filters,
    debouncedKeyword,
    updateFilter,
    setPage,
    resetFilters,
    getApiFilters
  } = useJobFilters();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const abortControllerRef = useRef(null);

  /**
   * Load jobs with current filters
   */
  const loadJobs = useCallback(async () => {
    try {
      // Cancel previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      setLoading(true);

      const apiFilters = {
        ...getApiFilters(),
        limit: JOBS_PER_PAGE
      };

      const response = await listJobs(apiFilters, {
        signal: abortControllerRef.current.signal
      });

      if (response?.success) {
        setJobs(response.data || []);
        setTotalPages(response.meta?.pages || 0);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error loading jobs:', error);
        setJobs([]);
        setTotalPages(0);
      }
    } finally {
      setLoading(false);
    }
  }, [getApiFilters]);

  /**
   * Load jobs when filters change (uses debounced keyword)
   */
  useEffect(() => {
    loadJobs();

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadJobs]);

  /**
   * Handle page change
   */
  const changePage = (page) => {
    if (page < 1 || page > totalPages) return;
    setPage(page);
  };

  /**
   * Handle keyword input change
   */
  const handleKeywordChange = (e) => {
    updateFilter('keyword', e.target.value);
  };

  /**
   * Handle location change
   */
  const handleLocationChange = (e) => {
    updateFilter('location', e.target.value);
  };

  /**
   * Handle category change
   */
  const handleCategoryChange = (e) => {
    const categoryMap = {
      '1': 'IT & Software',
      '3': 'Marketing',
      '4': 'Accounting',
      '5': 'Banking',
      '6': 'Design'
    };
    const categoryValue = e.target.value ? categoryMap[e.target.value] || e.target.value : '';
    updateFilter('category', categoryValue);
  };

  /**
   * Handle experience change
   */
  const handleExperienceChange = (value) => {
    updateFilter('experience', value);
  };

  /**
   * Handle job type change
   */
  const handleJobTypeChange = (value) => {
    updateFilter('jobType', value);
  };

  /**
   * Handle date posted change
   */
  const handleDatePostedChange = (value) => {
    updateFilter('datePosted', value);
  };

  /**
   * Handle filter button click
   */
  const handleFilter = (e) => {
    e.preventDefault();
    // Filters are already applied via individual handlers
    // This button is for visual feedback only
  };

  /**
   * Handle reset filters
   */
  const handleReset = (e) => {
    e.preventDefault();
    resetFilters();
  };

  return (
    <div className="main-content">
      <div className="page-content">
        <section className="page-title-box">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="text-center text-white">
                  <h3 className="mb-4">Job List</h3>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="position-relative" style={{ zIndex: 1 }}>
          <div className="shape">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
              <path
                fill="#FFFFFF"
                fillOpacity={1}
                d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>

        {/* START JOB-LIST */}
        <section className="section">
          <div className="container">
            <div className="row g-3">
              <div className="col-lg-9">
                <div className="me-lg-0">
                  {/* JOB LIST HEADER */}
                  <div className="job-list-header">
                    <div className="d-flex justify-content-start mb-2">
                      <div className="btn-group" role="group" aria-label="Job view">
                        <Link to="/job-list" className="btn btn-primary btn-sm" aria-label="Job list view">
                          <i className="mdi mdi-format-list-bulleted"></i>
                        </Link>
                        <Link to="/job-grid" className="btn btn-outline-primary btn-sm" aria-label="Job grid view">
                          <i className="mdi mdi-view-grid-outline"></i>
                        </Link>
                      </div>
                    </div>
                    <form action="#">
                      <div className="row g-2">
                        <div className="col-lg-3 col-md-6">
                          <div className="filler-job-form">
                            <i className="uil uil-briefcase-alt me-2"></i>
                            <input
                              type="search"
                              className="form-control filter-job-input-box"
                              id="exampleFormControlInput1"
                              placeholder="Job, company... "
                              value={filters.keyword}
                              onChange={handleKeywordChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="filler-job-form">
                            <LocationSelect
                              id="choices-single-location"
                              name="choices-single-location"
                              className="form-select"
                              placeholder="Select District"
                              value={filters.location}
                              onChange={handleLocationChange}
                            />
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <div className="filler-job-form">
                            <select
                              className="form-select"
                              data-trigger
                              name="choices-single-categories"
                              id="choices-single-categories"
                              aria-label="Default select example"
                              value={filters.category ? Object.entries({
                                '1': 'IT & Software',
                                '3': 'Marketing',
                                '4': 'Accounting',
                                '5': 'Banking',
                                '6': 'Design'
                              }).find(([k, v]) => v === filters.category)?.[0] || '' : ''}
                              onChange={handleCategoryChange}
                            >
                              <option value="">Select Category</option>
                              <option value="4">Accounting</option>
                              <option value="1">IT & Software</option>
                              <option value="3">Marketing</option>
                              <option value="5">Banking</option>
                              <option value="6">Design</option>
                            </select>
                          </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                          <a href="javascript:void(0)" className="btn btn-primary w-100" onClick={handleFilter}>
                            <i className="uil uil-filter"></i> Filter
                          </a>
                        </div>
                      </div>
                    </form>
                  </div>

                  {/* JOB CARDS */}
                  <div>
                    {loading ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary" />
                      </div>
                    ) : jobs.length === 0 ? (
                      <div className="text-center py-5">
                        <p className="text-muted">No jobs found</p>
                      </div>
                    ) : (
                      jobs.map((job) => <JobListCard key={job._id || job.id} job={job} onApply={setSelectedJobId} />)
                    )}
                  </div>

                  {/* PAGINATION */}
                  {totalPages > 1 && (
                    <Pagination currentPage={filters.page} totalPages={totalPages} onPageChange={changePage} />
                  )}
                </div>
              </div>

              {/* START SIDE-BAR */}
              <div className="col-lg-3">
                <div className="side-bar mt-5 mt-lg-0">
                  <div className="accordion" id="accordionExample">
                    {/* Work Experience */}
                    <div className="accordion-item mt-4">
                      <h2 className="accordion-header" id="experienceOne">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#experience"
                          aria-expanded="true"
                          aria-controls="experience"
                        >
                          Work experience
                        </button>
                      </h2>
                      <div id="experience" className="accordion-collapse collapse show" aria-labelledby="experienceOne">
                        <div className="accordion-body">
                          <div className="side-title">
                            <div className="form-check mt-2">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value="no-experience" 
                                id="flexCheckChecked1"
                                checked={filters.experience === 'no-experience'}
                                onChange={(e) => handleExperienceChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked1">
                                No experience
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                value="0-3"
                                id="flexCheckChecked2"
                                checked={filters.experience === '0-3'}
                                onChange={(e) => handleExperienceChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked2">
                                0-3 years
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value="3-6" 
                                id="flexCheckChecked3"
                                checked={filters.experience === '3-6'}
                                onChange={(e) => handleExperienceChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked3">
                                3-6 years
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                value="6+" 
                                id="flexCheckChecked4"
                                checked={filters.experience === '6+'}
                                onChange={(e) => handleExperienceChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked4">
                                More than 6 years
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Type of Employment */}
                    <div className="accordion-item mt-3">
                      <h2 className="accordion-header" id="jobType">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#jobtype"
                          aria-expanded="false"
                          aria-controls="jobtype"
                        >
                          Type of employment
                        </button>
                      </h2>
                      <div id="jobtype" className="accordion-collapse collapse show" aria-labelledby="jobType">
                        <div className="accordion-body">
                          <div className="side-title">
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault6"
                                value="Freelancer"
                                checked={filters.jobType === 'Freelancer'}
                                onChange={(e) => handleJobTypeChange(e.target.value)}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexRadioDefault6">
                                Freelancer
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                value="full-time"
                                checked={filters.jobType === 'full-time'}
                                onChange={(e) => handleJobTypeChange(e.target.value)}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexRadioDefault2">
                                Full Time
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault3"
                                value="internship"
                                checked={filters.jobType === 'internship'}
                                onChange={(e) => handleJobTypeChange(e.target.value)}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexRadioDefault3">
                                Internship
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault4"
                                value="part-time"
                                checked={filters.jobType === 'part-time'}
                                onChange={(e) => handleJobTypeChange(e.target.value)}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexRadioDefault4">
                                Part Time
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Date Posted */}
                    <div className="accordion-item mt-3">
                      <h2 className="accordion-header" id="datePosted">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#dateposted"
                          aria-expanded="false"
                          aria-controls="dateposted"
                        >
                          Date Posted
                        </button>
                      </h2>
                      <div id="dateposted" className="accordion-collapse collapse show" aria-labelledby="datePosted">
                        <div className="accordion-body">
                          <div className="side-title form-check-all">
                            <div className="form-check">
                              <input 
                                className="form-check-input" 
                                type="checkbox" 
                                id="checkAll" 
                                value=""
                                checked={!filters.datePosted}
                                onChange={() => handleDatePostedChange('')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="checkAll">
                                All
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="datePosted"
                                value="1h"
                                id="flexCheckChecked5"
                                checked={filters.datePosted === '1h'}
                                onChange={(e) => handleDatePostedChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked5">
                                Last Hour
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="datePosted"
                                value="24h"
                                id="flexCheckChecked6"
                                checked={filters.datePosted === '24h'}
                                onChange={(e) => handleDatePostedChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked6">
                                Last 24 hours
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="datePosted"
                                value="7d"
                                id="flexCheckChecked7"
                                checked={filters.datePosted === '7d'}
                                onChange={(e) => handleDatePostedChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked7">
                                Last 7 days
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="datePosted"
                                value="14d"
                                id="flexCheckChecked8"
                                checked={filters.datePosted === '14d'}
                                onChange={(e) => handleDatePostedChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked8">
                                Last 14 days
                              </label>
                            </div>
                            <div className="form-check mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                name="datePosted"
                                value="30d"
                                id="flexCheckChecked9"
                                checked={filters.datePosted === '30d'}
                                onChange={(e) => handleDatePostedChange(e.target.checked ? e.target.value : '')}
                              />
                              <label className="form-check-label ms-2 text-muted" htmlFor="flexCheckChecked9">
                                Last 30 days
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reset Filters Button */}
                    <div className="mt-4">
                      <button 
                        type="button" 
                        className="btn btn-outline-danger w-100"
                        onClick={handleReset}
                      >
                        <i className="uil uil-redo"></i> Reset Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* END SIDE-BAR */}
            </div>
          </div>
        </section>
        {/* END JOB-LIST */}

        {/* Apply Job Modal */}
        <ApplyJobModal jobId={selectedJobId} />
      </div>
    </div>
  );
}
