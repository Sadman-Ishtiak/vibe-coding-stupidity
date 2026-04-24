export default function JobListCard() {
  return (
    <div>
      <div className="job-box card mt-5">
        <div className="bookmark-label text-center">
          <a href="#" className="align-middle text-white">
            <i className="mdi mdi-star"></i>
          </a>
        </div>
        <div className="p-4">
          <div className="row align-items-center">
            <div className="col-md-2">
              <div className="text-center mb-4 mb-lg-0">
                <a href="/company-details" data-discover="true">
                  <img
                    alt=""
                    className="img-fluid rounded-3"
                    loading="lazy"
                    src="/assets/images/featured-job/img-01.png"
                  />
                </a>
              </div>
            </div>

            <div className="col-md-3">
              <div className="mb-2 mb-md-0">
                <h5 className="fs-18 mb-0">
                  <a className="text-dark" href="/job-details" data-discover="true">
                    Product Director
                  </a>
                </h5>
                <p className="text-muted fs-14 mb-0">Creative Agency</p>
              </div>
            </div>

            <div className="col-md-3">
              <div className="d-flex mb-2">
                <div className="flex-shrink-0">
                  <i className="mdi mdi-map-marker text-primary me-1"></i>
                </div>
                <p className="text-muted"> Escondido,California</p>
              </div>
            </div>

            <div className="col-md-2">
              <div className="d-flex mb-0">
                <div className="flex-shrink-0">
                  <i className="uil uil-clock-three text-primary me-1"></i>
                </div>
                <p className="text-muted mb-0"> 3 min ago</p>
              </div>
            </div>

            <div className="col-md-2">
              <div>
                <span className="badge bg-soft-success fs-13 mt-1">Full Time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 bg-light">
          <div className="row justify-content-between">
            <div className="col-md-4">
              <div>
                <p className="text-muted mb-0">
                  <span className="text-dark">Experience :</span> 2 - 3 years
                </p>
              </div>
            </div>

            <div className="col-lg-2 col-md-3">
              <div className="text-start text-md-end">
                <a className="primary-link" href="/job-details" data-discover="true">
                  Apply Now <i className="mdi mdi-chevron-double-right"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
