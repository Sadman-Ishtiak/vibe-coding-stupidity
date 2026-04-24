import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · Jobs</h3>
              <p class="text-white-50 mb-0">Review postings, approvals, and visibility rules.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <div class="position-relative" style="z-index: 1">
      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
          <path fill="#FFFFFF" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z" />
        </svg>
      </div>
    </div>

    <section class="section">
      <div class="container">
        <div class="card border-0 shadow-sm">
          <div class="card-body">
            <div class="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
              <div>
                <h5 class="fs-17 fw-semibold mb-0">Job Listings</h5>
                <small class="text-muted">Approve, archive, or highlight roles.</small>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <select class="form-select form-select-sm" style="width: 160px;">
                  <option selected>Status: All</option>
                  <option>Pending Review</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                  <option>Archived</option>
                </select>
                <select class="form-select form-select-sm" style="width: 160px;">
                  <option selected>Employer: All</option>
                  <option>InternNova</option>
                  <option>Northwind</option>
                  <option>VisionAI</option>
                </select>
                <div class="input-group input-group-sm" style="width: 220px;">
                  <span class="input-group-text bg-white"><i class="uil uil-search"></i></span>
                  <input type="search" class="form-control" placeholder="Search title or ID" />
                </div>
                <a class="btn btn-sm btn-primary" href="/manage-jobs-post">Create job</a>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Job</th>
                    <th>Employer</th>
                    <th>Status</th>
                    <th>Applicants</th>
                    <th>Visibility</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="fw-semibold">Senior Frontend Engineer</div>
                      <small class="text-muted">#JD-4821 · Remote</small>
                    </td>
                    <td>InternNova</td>
                    <td><span class="badge bg-warning-subtle text-warning">Pending Review</span></td>
                    <td>18</td>
                    <td>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" checked>
                      </div>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <a class="btn btn-success" href="/job-details">Approve</a>
                        <button class="btn btn-outline-secondary">Hold</button>
                        <button class="btn btn-outline-danger">Reject</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Product Manager</div>
                      <small class="text-muted">#JD-3770 · Hybrid</small>
                    </td>
                    <td>BoldBank</td>
                    <td><span class="badge bg-success-subtle text-success">Approved</span></td>
                    <td>42</td>
                    <td>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" checked>
                      </div>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">Feature</button>
                        <button class="btn btn-outline-secondary">Archive</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Data Scientist</div>
                      <small class="text-muted">#JD-2193 · Onsite</small>
                    </td>
                    <td>VisionAI</td>
                    <td><span class="badge bg-danger-subtle text-danger">Rejected</span></td>
                    <td>7</td>
                    <td>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch">
                      </div>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary">Review</button>
                        <button class="btn btn-outline-primary">Request edit</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Customer Success Lead</div>
                      <small class="text-muted">#JD-1411 · Remote</small>
                    </td>
                    <td>Northwind</td>
                    <td><span class="badge bg-primary-subtle text-primary">Live</span></td>
                    <td>5</td>
                    <td>
                      <div class="form-check form-switch">
                        <input class="form-check-input" type="checkbox" role="switch" checked>
                      </div>
                    </td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">Promote</button>
                        <button class="btn btn-outline-secondary">Archive</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
              <small class="text-muted">Showing 1 - 10 of 128</small>
              <nav aria-label="Jobs pagination">
                <ul class="pagination pagination-sm mb-0">
                  <li class="page-item disabled"><span class="page-link">Prev</span></li>
                  <li class="page-item active"><span class="page-link">1</span></li>
                  <li class="page-item"><span class="page-link">2</span></li>
                  <li class="page-item"><span class="page-link">3</span></li>
                  <li class="page-item"><span class="page-link">Next</span></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
`

export default function AdminJobs() {
  return <StaticMarkupPage slug="admin-jobs" />
}
