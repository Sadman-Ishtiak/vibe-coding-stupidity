import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <section className="bg-footer">
      <div className="container">
        <div className="row">
          <div className="col-lg-4">
            <div className="footer-item mt-4 mt-lg-0 me-lg-5">
              <h4 className="text-white mb-4">InternNova</h4>
              <p className="text-white-50">
                It is a long established fact that a reader will be of a page reader will be of at its layout.
              </p>
              <p className="text-white mt-3">Follow Us on:</p>
              <ul className="footer-social-menu list-inline mb-0">
                <li className="list-inline-item">
                  <a href="#"><i className="uil uil-facebook-f"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href="#"><i className="uil uil-linkedin-alt"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href="#"><i className="uil uil-google"></i></a>
                </li>
                <li className="list-inline-item">
                  <a href="#"><i className="uil uil-twitter"></i></a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-6">
            <div className="footer-item mt-4 mt-lg-0">
              <p className="fs-16 text-white mb-4">Company</p>
              <ul className="list-unstyled footer-list mb-0">
                <li>
                  <Link to="/contact">
                    <i className="mdi mdi-chevron-right"></i> Contact Us
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-6">
            <div className="footer-item mt-4 mt-lg-0">
              <p className="fs-16 text-white mb-4">For Jobs</p>
              <ul className="list-unstyled footer-list mb-0">
                <li>
                  <Link to="/job-categories">
                    <i className="mdi mdi-chevron-right"></i> Browser Categories
                  </Link>
                </li>
                <li>
                  <Link to="/job-list">
                    <i className="mdi mdi-chevron-right"></i> Browser Jobs
                  </Link>
                </li>
                <li>
                  <Link to="/job-details">
                    <i className="mdi mdi-chevron-right"></i> Job Details
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-lg-2 col-6">
            <div className="footer-item mt-4 mt-lg-0">
              <p className="fs-16 text-white mb-4">Support</p>
              <ul className="list-unstyled footer-list mb-0">
                <li>
                  <Link to="/contact">
                    <i className="mdi mdi-chevron-right"></i> Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/faqs">
                    <i className="mdi mdi-chevron-right"></i> FAQ'S
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy">
                    <i className="mdi mdi-chevron-right"></i> Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Footer;
