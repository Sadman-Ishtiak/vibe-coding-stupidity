import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · Candidates</h3>
              <p class="text-white-50 mb-0">Talent quality, sourcing health, and profile compliance.</p>
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
                <h5 class="fs-17 fw-semibold mb-0">Candidate Directory</h5>
                <small class="text-muted">Verify completeness and eligibility.</small>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <select class="form-select form-select-sm" style="width: 160px;">
                  <option selected>Status: All</option>
                  <option>Verified</option>
                  <option>Pending KYC</option>
                  <option>Flagged</option>
                </select>
                <select class="form-select form-select-sm" style="width: 160px;">
                  <option selected>Experience</option>
                  <option>0 - 2 years</option>
                  <option>3 - 5 years</option>
                  <option>6+ years</option>
                </select>
                <div class="input-group input-group-sm" style="width: 240px;">
                  <span class="input-group-text bg-white"><i class="uil uil-search"></i></span>
                  <input type="search" class="form-control" placeholder="Search name, email, skills" />
                </div>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Candidate</th>
                    <th>Role Focus</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Profile</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <div class="fw-semibold">Sara Nolan</div>
                      <small class="text-muted">sara.nolan@example.com</small>
                    </td>
                    <td>Product Design</td>
                    <td>Remote · US</td>
                    <td><span class="badge bg-success-subtle text-success">Verified</span></td>
                    <td>92%</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <a class="btn btn-outline-primary" href="/candidate-details">View</a>
                        <button class="btn btn-outline-secondary">Nudge</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Emily Carter</div>
                      <small class="text-muted">emily.carter@example.com</small>
                    </td>
                    <td>Frontend Engineering</td>
                    <td>New York</td>
                    <td><span class="badge bg-warning-subtle text-warning">Pending KYC</span></td>
                    <td>78%</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-success">Verify</button>
                        <button class="btn btn-outline-secondary">Contact</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Kevin Wu</div>
                      <small class="text-muted">kevin.wu@example.com</small>
                    </td>
                    <td>Data Science</td>
                    <td>San Francisco</td>
                    <td><span class="badge bg-success-subtle text-success">Verified</span></td>
                    <td>88%</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">View</button>
                        <button class="btn btn-outline-danger">Flag</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <div class="fw-semibold">Aisha Rahman</div>
                      <small class="text-muted">aisha.rahman@example.com</small>
                    </td>
                    <td>Marketing</td>
                    <td>Dubai</td>
                    <td><span class="badge bg-danger-subtle text-danger">Flagged</span></td>
                    <td>64%</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary">Review</button>
                        <button class="btn btn-outline-primary">Resolve</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row g-3 mt-4">
              <div class="col-md-6">
                <div class="p-3 border rounded">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Profile completion</span>
                    <span class="fw-semibold">82%</span>
                  </div>
                  <div class="progress" style="height: 6px;">
                    <div class="progress-bar" style="width: 82%"></div>
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="p-3 border rounded">
                  <div class="d-flex justify-content-between mb-2">
                    <span class="text-muted">Diversity</span>
                    <span class="fw-semibold">Balanced</span>
                  </div>
                  <div class="d-flex gap-2 align-items-center">
                    <span class="badge bg-primary-subtle text-primary">Gender</span>
                    <span class="badge bg-info-subtle text-info">Geo</span>
                    <span class="badge bg-success-subtle text-success">Background</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
              <small class="text-muted">Showing 1 - 10 of 540</small>
              <nav aria-label="Candidates pagination">
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

export default function AdminCandidates() {
  return <StaticMarkupPage slug="admin-candidates" />
}
