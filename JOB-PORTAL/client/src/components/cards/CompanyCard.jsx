export default function CompanyCard() {
  return (
    <div className="card text-center mb-4">
      <div className="card-body px-4 py-5">
        <img src="/assets/images/featured-job/img-01.png" alt="" className="img-fluid rounded-3" loading="lazy" />
        <div className="mt-4">
          <a href="/company-details" className="primary-link" data-discover="true">
            <h6 className="fs-18 mb-2">InternNova Consulting</h6>
          </a>
          <p className="text-muted mb-4">New York</p>
          <a href="/company-details" className="btn btn-primary" data-discover="true">52 Opening Jobs</a>
        </div>
      </div>
    </div>
  )
}
