import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · Applications</h3>
              <p class="text-white-50 mb-0">Monitor flow, SLA, and escalations across all roles.</p>
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
                <h5 class="fs-17 fw-semibold mb-0">Applications</h5>
                <small class="text-muted">Stages, SLA, and ownership.</small>
              </div>
              <div class="d-flex flex-wrap gap-2">
                <select class="form-select form-select-sm" style="width: 150px;">
                  <option selected>Stage: Any</option>
                  <option>New</option>
                  <option>Screening</option>
                  <option>Interview</option>
                  <option>Offer</option>
                  <option>Rejected</option>
                </select>
                <select class="form-select form-select-sm" style="width: 170px;">
                  <option selected>Owner</option>
                  <option>Ops Team</option>
                  <option>Recruiter</option>
                  <option>Hiring Manager</option>
                </select>
                <div class="input-group input-group-sm" style="width: 240px;">
                  <span class="input-group-text bg-white"><i class="uil uil-search"></i></span>
                  <input type="search" class="form-control" placeholder="Search candidate or job" />
                </div>
                <a class="btn btn-sm btn-outline-primary" href="/admin-candidates">Candidate directory</a>
              </div>
            </div>

            <div class="table-responsive">
              <table class="table align-middle mb-0">
                <thead class="table-light">
                  <tr>
                    <th>Candidate</th>
                    <th>Job</th>
                    <th>Stage</th>
                    <th>Owner</th>
                    <th>SLA</th>
                    <th class="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="fw-semibold">Emily Carter</td>
                    <td>Frontend Engineer · InternNova</td>
                    <td><span class="badge bg-warning-subtle text-warning">Interview</span></td>
                    <td>Recruiter</td>
                    <td class="text-success">On track</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">Open</button>
                        <button class="btn btn-outline-secondary">Reassign</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="fw-semibold">Kevin Wu</td>
                    <td>Data Analyst · BoldBank</td>
                    <td><span class="badge bg-success-subtle text-success">Offer</span></td>
                    <td>Hiring Manager</td>
                    <td class="text-success">On track</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">Open</button>
                        <button class="btn btn-outline-secondary">Nudge</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="fw-semibold">Sara Nolan</td>
                    <td>Product Designer · VisionAI</td>
                    <td><span class="badge bg-info-subtle text-info">Screening</span></td>
                    <td>Ops Team</td>
                    <td class="text-warning">SLA in 12h</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary">Open</button>
                        <button class="btn btn-outline-danger">Escalate</button>
                      </div>
                    </td>
                  </tr>

                  <tr>
                    <td class="fw-semibold">Aisha Rahman</td>
                    <td>Marketing Lead · Northwind</td>
                    <td><span class="badge bg-danger-subtle text-danger">Rejected</span></td>
                    <td>Recruiter</td>
                    <td class="text-muted">Closed</td>
                    <td class="text-end">
                      <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-secondary">Undo</button>
                        <button class="btn btn-outline-primary">Share feedback</button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div class="row g-3 mt-4">
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <p class="text-muted mb-1">Weekly throughput</p>
                  <h5 class="mb-0">1,024</h5>
                  <small class="text-success">+9% WoW</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <p class="text-muted mb-1">Avg time in stage</p>
                  <h5 class="mb-0">2.8 days</h5>
                  <small class="text-muted">Target: 3.0 days</small>
                </div>
              </div>
              <div class="col-md-4">
                <div class="p-3 border rounded">
                  <p class="text-muted mb-1">Escalations</p>
                  <h5 class="mb-0 text-danger">5 open</h5>
                  <small class="text-muted">Last 7 days</small>
                </div>
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-4">
              <small class="text-muted">Showing 1 - 10 of 1,240</small>
              <nav aria-label="Applications pagination">
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

export default function AdminApplications() {
  return <StaticMarkupPage slug="admin-applications" />
}
