const ProcessSection = () => {
  return (
    <section className="section">
      <div className="container">
        <div className="row align-items-center">
          {/* Left Content */}
          <div className="col-lg-6">
              <div className="section-title me-5">
              <h3 className="title">How It Works</h3>
              <p className="text-muted">
                Follow these three simple steps to post a job or find work on
                InterNova — whether you're hiring or freelancing.
              </p>

              <div
                className="process-menu nav flex-column nav-pills"
                id="v-pills-tab"
                role="tablist"
                aria-orientation="vertical"
              >
                <a
                  className="nav-link active"
                  id="v-pills-home-tab"
                  data-bs-toggle="pill"
                  href="#v-pills-home"
                  role="tab"
                  aria-controls="v-pills-home"
                  aria-selected="true"
                >
                  <div className="d-flex">
                    <div className="number flex-shrink-0">1</div>
                    <div className="flex-grow-1 text-start ms-3">
                      <h5 className="fs-18">Register an account</h5>
                      <p className="text-muted mb-0">
                        Sign up with your email to create your profile and preferences.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  className="nav-link"
                  id="v-pills-profile-tab"
                  data-bs-toggle="pill"
                  href="#v-pills-profile"
                  role="tab"
                  aria-controls="v-pills-profile"
                  aria-selected="false"
                >
                  <div className="d-flex">
                    <div className="number flex-shrink-0">2</div>
                    <div className="flex-grow-1 text-start ms-3">
                      <h5 className="fs-18">Post or find jobs</h5>
                      <p className="text-muted mb-0">
                        Recruiter: create a clear job listing with budget and
                        requirements. 
                        Candidate: browse, bookmarks and apply to
                        opportunities that match your skills.
                      </p>
                    </div>
                  </div>
                </a>

                <a
                  className="nav-link"
                  id="v-pills-messages-tab"
                  data-bs-toggle="pill"
                  href="#v-pills-messages"
                  role="tab"
                  aria-controls="v-pills-messages"
                  aria-selected="false"
                >
                  <div className="d-flex">
                    <div className="number flex-shrink-0">3</div>
                    <div className="flex-grow-1 text-start ms-3">
                      <h5 className="fs-18">Review proposals & hire</h5>
                      <p className="text-muted mb-0">
                        Review applications, message candidates and hire the
                        best fit.
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-lg-6">
            <div className="tab-content" id="v-pills-tabContent">
              <div
                className="tab-pane fade show active"
                id="v-pills-home"
                role="tabpanel"
                aria-labelledby="v-pills-home-tab"
              >
                <img
                  src="/assets/images/process-01.png"
                  alt="Process step 1"
                  className="img-fluid"
                />
              </div>

              <div
                className="tab-pane fade"
                id="v-pills-profile"
                role="tabpanel"
                aria-labelledby="v-pills-profile-tab"
              >
                <img
                  src="/assets/images/process-02.png"
                  alt="Process step 2"
                  className="img-fluid"
                />
              </div>

              <div
                className="tab-pane fade"
                id="v-pills-messages"
                role="tabpanel"
                aria-labelledby="v-pills-messages-tab"
              >
                <img
                  src="/assets/images/process-03.png"
                  alt="Process step 3"
                  className="img-fluid"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
