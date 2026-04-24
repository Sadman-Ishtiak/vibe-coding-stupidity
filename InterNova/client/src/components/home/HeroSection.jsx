import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LocationSelect from '@/components/common/LocationSelect';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const navigate = useNavigate();
  return (
    <>
      {/* START HOME */}
      <section className="bg-home2" id="home">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="mb-4 pb-3 me-lg-5">
                <h6 className="sub-title">Internship-first job platform</h6>
                <h1 className="display-5 fw-semibold mb-3">
                  Where careers begin at{" "}
                  <span className="text-primary fw-bold">InternNova</span>
                </h1>
                <p className="lead text-muted mb-0">
                  Access internships, part-time, full-time and freelance jobs.
                  Build experience, manage applications and step confidently into
                  the professional world.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const params = new URLSearchParams();
                  if (query) params.set('keyword', query);
                  if (location) params.set('location', location);
                  const qs = params.toString();
                  navigate(`/job-list${qs ? `?${qs}` : ''}`);
                }}
              >
                <div className="registration-form">
                  <div className="row g-0">
                    <div className="col-md-4">
                      <div className="filter-search-form filter-border mt-3 mt-md-0">
                        <i className="uil uil-briefcase-alt"></i>
                        <input
                          type="search"
                          id="job-title"
                          className="form-control filter-input-box"
                          placeholder="Job, Company name..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="filter-search-form filter-border mt-3 mt-md-0">
                        <i className="uil uil-map-marker"></i>
                        <LocationSelect
                          name="location"
                          id="choices-single-location"
                          className="form-select filter-input-box"
                          aria-label="Select District"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="mt-3 mt-md-0 h-100">
                        <button
                          className="btn btn-primary submit-btn w-100 h-100"
                          type="submit"
                        >
                          <i className="uil uil-search me-1"></i> Find Job
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="col-lg-5">
              <div className="mt-5 mt-md-0">
                <img
                  src="/assets/images/process-02.png"
                  alt="Hero"
                  className="home-img"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END HOME */}

      {/* START SHAPE */}
      <div className="position-relative">
        <div className="shape">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            version="1.1"
            width="1440"
            height="150"
            preserveAspectRatio="none"
            viewBox="0 0 1440 220"
          >
            <g fill="none">
              <path
                d="M 0,213 C 288,186.4 1152,106.6 1440,80L1440 250L0 250z"
                fill="rgba(255, 255, 255, 1)"
              ></path>
            </g>
          </svg>
        </div>
      </div>
      {/* END SHAPE */}
    </>
  );
};

export default HeroSection;
