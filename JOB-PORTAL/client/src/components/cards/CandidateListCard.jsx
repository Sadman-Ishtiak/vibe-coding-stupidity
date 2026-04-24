export default function CandidateListCard() {
  return (
    <div className="candidate-list-box card mt-4">
      <div className="card-body p-4">
        <div className="row align-items-center">
          <div className="col-auto">
            <div className="candidate-list-images">
              <a href="/candidate-details" data-discover="true">
                <img
                  src="/assets/images/user/img-01.jpg"
                  alt=""
                  className="avatar-md img-thumbnail rounded-circle"
                  loading="lazy"
                />
              </a>
            </div>
          </div>

          <div className="col-lg-5">
            <div className="candidate-list-content mt-3 mt-lg-0">
              <h5 className="fs-19 mb-0">
                <a href="/candidate-details" className="primary-link" data-discover="true">
                  Charles Dickens
                </a>
              </h5> 
              <p className="text-muted mb-2"> Project Manager</p>
              <ul className="list-inline mb-0 text-muted">
                <li className="list-inline-item">
                  <i className="mdi mdi-map-marker"></i> Oakridge Lane Richardson
                </li>
              </ul>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="mt-2 mt-lg-0">
              <span className="badge bg-soft-muted fs-14 mt-1">Leader</span>{' '}
              <span className="badge bg-soft-muted fs-14 mt-1">Manager</span>
              <span className="badge bg-soft-muted fs-14 mt-1">Developer</span>
            </div>
          </div>
        </div>
        <div className="favorite-icon">
          <a href="#">
            <i className="uil uil-heart-alt fs-18"></i>
          </a>
        </div>
      </div>
    </div>
  )
}
