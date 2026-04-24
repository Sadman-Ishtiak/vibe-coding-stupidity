import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="section bg-light">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="text-center">
              <h2 className="text-primary mb-4">
                Explore{" "}
                <span className="text-warning fw-bold">5,000+</span> Internship &
                Career Opportunities
              </h2>

              <p className="text-muted">
                Start with internships, grow into part-time, full-time, or
                freelance roles. Discover real opportunities, build experience,
                and move forward with confidence.
              </p>

              <div className="mt-4 pt-2">
                <Link to="/job-list" className="btn btn-primary btn-hover">
                  Explore Jobs
                  <i className="uil uil-rocket align-middle ms-1"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
