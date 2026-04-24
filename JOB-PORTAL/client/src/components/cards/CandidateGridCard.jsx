export default function CandidateGridCard() {
  return (
    <div className="candidate-grid-box bookmark-post card mt-4">
      <div className="card-body p-4">
        <div className="featured-label">
          <span className="featured">featured</span>
        </div>
        <div className="d-flex mb-4">
          <div className="flex-shrink-0 position-relative">
            <img src="/assets/images/user/img-01.jpg" alt="" className="avatar-md rounded" loading="lazy" />
            <span className="profile-active position-absolute badge rounded-circle bg-success">
              <span className="visually-hidden">active</span>
            </span>
          </div>
          <div className="ms-3">
            <a href="/candidate-details" className="primary-link" data-discover="true">
              <h5 className="fs-17">Charles Dickens</h5>
            </a>
          </div>
        </div>
        <ul className="list-inline d-flex justify-content-between align-items-center">
          <li className="list-inline-item">
            <div className="favorite-icon">
              <a href="#">
                <i className="uil uil-heart-alt fs-18"></i>
              </a>
            </div>
          </li>
        </ul>
        <div className="border rounded mb-4">
          <div className="row g-0">
            <div className="col-lg-6">
              <div className="border-end px-3 py-2">
                <p className="text-muted mb-0">Exp. : 0-3 Years</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="px-3 py-2">
                <p className="text-muted mb-0">Freelancers</p>
              </div>
            </div>
          </div>
        </div>
        <p className="text-muted">
          Some quick example text to build on the card title and bulk the card's content Moltin gives you platform.
        </p>
        <div className="mt-3">
          <a href="#hireNow" data-bs-toggle="modal" className="btn btn-primary btn-hover w-100 mt-2">
            <i className="mdi mdi-account-check"></i> Hire Now
          </a>
          <a href="/candidate-details" className="btn btn-soft-primary btn-hover w-100 mt-2" data-discover="true">
            <i className="mdi mdi-eye"></i> View Profile
          </a>
        </div>
      </div>
    </div>
  )
}
