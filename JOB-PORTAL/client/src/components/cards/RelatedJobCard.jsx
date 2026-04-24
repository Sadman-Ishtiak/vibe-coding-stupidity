export default function RelatedJobCard() {
  return (
    <div className="job-box card mt-4">
      <div className="p-4">
        <div className="row">
          <div className="col-lg-1">
            <img src="/assets/images/featured-job/img-01.png" alt="" className="img-fluid rounded-3" loading="lazy" />
          </div>
          <div className="col-lg-10">
            <div className="mt-3 mt-lg-0">
              <h5 className="fs-17 mb-1">
                <a href="/job-details" className="text-dark" data-discover="true">HTML Developer</a>{' '}
                <small className="text-muted fw-normal">(0-2 Yrs Exp.)</small>
              </h5>
              <ul className="list-inline mb-0">
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0">InternNova Technology Pvt.Ltd</p>
                </li>
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0"><i className="mdi mdi-map-marker"></i> California</p>
                </li>
                <li className="list-inline-item">
                  <p className="text-muted fs-14 mb-0"><i className="uil uil-wallet"></i> $250 - $800 / month</p>
                </li>
              </ul>
              <div className="mt-2">
                <span className="badge bg-soft-success mt-1">Full Time</span>
                <span className="badge bg-soft-warning mt-1">Urgent</span>
                <span className="badge bg-soft-info mt-1">Private</span>
              </div>
            </div>
          </div>
        </div>
        <div className="favorite-icon">
          <a href="#">
            <i className="uil uil-heart-alt fs-18"></i>
          </a>
        </div>
      </div>
      <div className="p-3 bg-light">
        <div className="row justify-content-between">
          <div className="col-md-8">
            <div>
              <ul className="list-inline mb-0">
                <li className="list-inline-item"><i className="uil uil-tag"></i> Keywords :</li>
                <li className="list-inline-item">
                  <a href="#" className="primary-link text-muted">Ui designer</a>,
                </li>
                <li className="list-inline-item">
                  <a href="#" className="primary-link text-muted">developer</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-md-3">
            <div className="text-md-end">
              <a href="#" className="primary-link">Apply Now <i className="mdi mdi-chevron-double-right"></i></a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
