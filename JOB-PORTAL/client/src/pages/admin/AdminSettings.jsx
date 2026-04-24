import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · Settings</h3>
              <p class="text-white-50 mb-0">Platform controls, guardrails, and notifications.</p>
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
          <div class="card-body p-4">
            <div class="row g-4">
              <div class="col-xl-6">
                <h5 class="fs-17 fw-semibold mb-3">Access & Governance</h5>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Require MFA for admins</h6>
                      <small class="text-muted">Applies to all admin roles</small>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                </div>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Session timeout</h6>
                      <small class="text-muted">Auto sign-out after inactivity</small>
                    </div>
                    <select class="form-select form-select-sm" style="width: 140px;">
                      <option>30 minutes</option>
                      <option selected>60 minutes</option>
                      <option>120 minutes</option>
                    </select>
                  </div>
                </div>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">IP allowlist</h6>
                      <small class="text-muted">Restrict admin console access</small>
                    </div>
                    <button class="btn btn-sm btn-outline-primary">Edit</button>
                  </div>
                </div>
              </div>

              <div class="col-xl-6">
                <h5 class="fs-17 fw-semibold mb-3">Notifications</h5>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Daily health digest</h6>
                      <small class="text-muted">System status and SLA</small>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                </div>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Billing alerts</h6>
                      <small class="text-muted">Overdue invoices and failures</small>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox" checked>
                    </div>
                  </div>
                </div>
                <div class="border rounded p-3 mb-3">
                  <div class="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 class="mb-1">Abuse signals</h6>
                      <small class="text-muted">Flagged content or fraud</small>
                    </div>
                    <div class="form-check form-switch">
                      <input class="form-check-input" type="checkbox">
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-xl-6">
                <h5 class="fs-17 fw-semibold mb-3 mt-2">Hiring Limits</h5>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label mb-1">Max active jobs per employer</label>
                  <input type="number" class="form-control" value="50">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label mb-1">Application cap per candidate / day</label>
                  <input type="number" class="form-control" value="25">
                </div>
              </div>

              <div class="col-xl-6">
                <h5 class="fs-17 fw-semibold mb-3 mt-2">Brand & Communications</h5>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label mb-1">Support email</label>
                  <input type="email" class="form-control" value="support@internnova.com">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label mb-1">Status page URL</label>
                  <input type="url" class="form-control" value="https://status.internnova.com">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label mb-1">Maintenance banner</label>
                  <textarea class="form-control" rows="3">No maintenance scheduled.</textarea>
                </div>
              </div>

              <div class="col-12 text-end">
                <button class="btn btn-outline-secondary me-2">Discard</button>
                <button class="btn btn-primary">Save settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
`

export default function AdminSettings() {
  return <StaticMarkupPage slug="admin-settings" />
}
