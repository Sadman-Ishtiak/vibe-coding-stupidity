import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="text-center text-white">
              <h3 class="mb-2">Admin · CMS</h3>
              <p class="text-white-50 mb-0">Homepage, blog highlights, and legal copy.</p>
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
              <div class="col-lg-6">
                <h5 class="fs-17 fw-semibold mb-3">Homepage Hero</h5>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Headline</label>
                  <input type="text" class="form-control" value="Hire smarter. Hire faster.">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Subheadline</label>
                  <textarea class="form-control" rows="3">Connect with pre-vetted candidates and fill roles in days, not weeks.</textarea>
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Primary CTA</label>
                  <input type="text" class="form-control" value="Post a job">
                </div>
              </div>

              <div class="col-lg-6">
                <h5 class="fs-17 fw-semibold mb-3">Highlights</h5>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Key stats</label>
                  <input type="text" class="form-control mb-2" value="4,200+ candidates placed">
                  <input type="text" class="form-control mb-2" value="312 active employers">
                  <input type="text" class="form-control" value="Avg. time-to-hire: 12.5 days">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Featured logos</label>
                  <div class="d-flex flex-wrap gap-2">
                    <span class="badge bg-light text-dark border">InternNova</span>
                    <span class="badge bg-light text-dark border">Northwind</span>
                    <span class="badge bg-light text-dark border">VisionAI</span>
                    <span class="badge bg-light text-dark border">BoldBank</span>
                  </div>
                </div>
              </div>

              <div class="col-lg-6">
                <h5 class="fs-17 fw-semibold mb-3">Blog Spotlight</h5>
                <div class="border rounded p-3">
                  <label class="form-label">Article title</label>
                  <input type="text" class="form-control mb-2" value="How to shorten your hiring cycle">
                  <label class="form-label">Article link</label>
                  <input type="url" class="form-control" value="https://internnova.com/blog/shorten-hiring-cycle">
                </div>
              </div>

              <div class="col-lg-6">
                <h5 class="fs-17 fw-semibold mb-3">Legal</h5>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Privacy URL</label>
                  <input type="url" class="form-control" value="/privacy-policy">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Terms URL</label>
                  <input type="url" class="form-control" value="/services">
                </div>
                <div class="border rounded p-3 mb-3">
                  <label class="form-label">Cookie banner text</label>
                  <textarea class="form-control" rows="3">We use cookies to personalize content and analyze traffic.</textarea>
                </div>
              </div>

              <div class="col-12 text-end">
                <button class="btn btn-outline-secondary me-2">Preview</button>
                <button class="btn btn-primary">Publish</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  </div>
</div>
`

export default function AdminCMS() {
  return <StaticMarkupPage slug="admin-cms" />
}
