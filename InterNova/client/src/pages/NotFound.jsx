import { Link } from 'react-router-dom';

/**
 * NotFound Component (404 Page)
 * Professional React component for displaying 404 error
 */
export default function NotFound() {
  return (
    <div className="main-content">
      <div className="page-content">
        <section className="bg-error bg-auth text-dark">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6">
                <div className="text-center">
                  <img 
                    src="/assets/images/404.png" 
                    alt="404 Not Found" 
                    className="img-fluid"
                    loading="lazy"
                  />
                  <div className="mt-5">
                    <h4 className="text-uppercase mt-3">Sorry, page not found</h4>
                    <p className="text-muted">
                      The page you are looking for might have been removed, had its name changed,
                      or is temporarily unavailable.
                    </p>
                    <div className="mt-4">
                      <Link 
                        to="/" 
                        className="btn btn-primary waves-effect waves-light"
                      >
                        <i className="mdi mdi-home"></i> Back to Home
                      </Link>
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
