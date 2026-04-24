import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · Profile</h3>
              <p class="text-white-50 mb-0">Keep your operator profile current.</p>
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
            <div class="d-flex align-items-center mb-4">
              <img src="/assets/images/featured-job/img-02.png" class="rounded-circle me-3" alt="Admin" style="width:72px;height:72px;object-fit:cover;">
              <div>
                <h5 class="mb-1">Avery Collins</h5>
                <small class="text-muted">Super Admin · Joined 2019</small>
              </div>
            </div>

            <form class="row g-4">
              <div class="col-md-6">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control" value="Avery Collins">
              </div>
              <div class="col-md-6">
                <label class="form-label">Email</label>
                <input type="email" class="form-control" value="avery.collins@example.com">
              </div>
              <div class="col-md-6">
                <label class="form-label">Role</label>
                <select class="form-select">
                  <option selected>Super Admin</option>
                  <option>Operations</option>
                  <option>Support</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Phone</label>
                <input type="tel" class="form-control" value="+1 234 567 8901">
              </div>
              <div class="col-md-6">
                <label class="form-label">Timezone</label>
                <select class="form-select">
                  <option selected>GMT-5 (New York)</option>
                  <option>GMT+0 (London)</option>
                  <option>GMT+4 (Dubai)</option>
                </select>
              </div>
              <div class="col-md-6">
                <label class="form-label">Notification Email</label>
                <input type="email" class="form-control" value="alerts@internnova.com">
              </div>

              <div class="col-12">
                <label class="form-label">Bio</label>
                <textarea class="form-control" rows="4">I help keep the hiring platform fast, fair, and reliable.</textarea>
              </div>

              <div class="col-12">
                <h6 class="fs-16 fw-semibold mt-2 mb-2">Security</h6>
              </div>
              <div class="col-md-6">
                <label class="form-label">New Password</label>
                <input type="password" class="form-control" placeholder="••••••••">
              </div>
              <div class="col-md-6">
                <label class="form-label">Confirm Password</label>
                <input type="password" class="form-control" placeholder="••••••••">
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch mt-4 pt-2">
                  <input class="form-check-input" type="checkbox" id="mfaToggle" checked>
                  <label class="form-check-label" for="mfaToggle">Require MFA at sign-in</label>
                </div>
              </div>
              <div class="col-md-6">
                <div class="form-check form-switch mt-4 pt-2">
                  <input class="form-check-input" type="checkbox" id="alertsToggle" checked>
                  <label class="form-check-label" for="alertsToggle">Send weekly audit log</label>
                </div>
              </div>

              <div class="col-12 text-end">
                <button type="button" class="btn btn-outline-secondary me-2">Cancel</button>
                <button type="submit" class="btn btn-primary">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
`

export default function AdminProfile() {
  return <StaticMarkupPage slug="admin-profile" />
}
