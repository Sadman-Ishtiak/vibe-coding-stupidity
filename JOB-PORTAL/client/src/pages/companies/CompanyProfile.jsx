import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
  <div class="page-content">

    <!-- PAGE TITLE -->
    <section class="page-title-box">
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="text-center text-white">
              <h3 class="mb-4">Company Profile</h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SHAPE -->
    <div class="position-relative" style="z-index: 1">
      <div class="shape">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
          <path fill="#FFFFFF"
            d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z" />
        </svg>
      </div>
    </div>

    <!-- START PROFILE -->
    <section class="section">
      <div class="container">

        <div class="card profile-content-page">

          <!-- TABS -->
          <ul class="profile-content-nav nav nav-pills border-bottom mb-4">
            <li class="nav-item">
              <button class="nav-link active" data-bs-toggle="pill" data-bs-target="#overview">Overview</button>
            </li>
            <li class="nav-item">
              <button class="nav-link" data-bs-toggle="pill" data-bs-target="#settings">Settings</button>
            </li>
          </ul>

          <div class="card-body p-4">
            <div class="tab-content">

              <!-- ================= OVERVIEW ================= -->
<div class="tab-pane fade show active" id="overview">
  <div class="row">

    <!-- LEFT SIDEBAR -->
    <div class="col-lg-4">
      <div class="card side-bar">

        <!-- COMPANY HEADER -->
        <div class="card-body p-4 text-center">
          <img src="/assets/images/featured-job/img-01.png" class="avatar-lg rounded-circle" alt="">
          <h6 class="fs-18 mb-1 mt-4">InternNova Technology Pvt.Ltd</h6>
          <p class="text-muted mb-4">Since July 2017</p>

          <!-- SOCIAL LINKS (SYNC WITH SETTINGS) -->
          <ul class="candidate-detail-social-menu list-inline mb-0">

            <li class="list-inline-item">
              <a href="#" class="social-link" title="Facebook">
                <i class="uil uil-facebook-f"></i>
              </a>
            </li>

            <li class="list-inline-item">
              <a href="#" class="social-link" title="Twitter">
                <i class="uil uil-twitter-alt"></i>
              </a>
            </li>

            <li class="list-inline-item">
              <a href="#" class="social-link" title="WhatsApp">
                <i class="uil uil-whatsapp"></i>
              </a>
            </li>

            <li class="list-inline-item">
              <a href="#" class="social-link" title="Call">
                <i class="uil uil-phone-alt"></i>
              </a>
            </li>

          </ul>
        </div>

        <!-- PROFILE OVERVIEW -->
        <div class="candidate-profile-overview card-body border-top p-4">
          <h6 class="fs-17 fw-medium mb-3">Profile Overview</h6>

          <ul class="list-unstyled mb-0">
            <li class="d-flex">
              <label class="text-dark">Owner Name</label>
              <p class="text-muted ms-2 mb-0">Charles Dickens</p>
            </li>
            <li class="d-flex">
              <label class="text-dark">Employees</label>
              <p class="text-muted ms-2 mb-0">1500 - 1850</p>
            </li>
            <li class="d-flex">
              <label class="text-dark">Location</label>
              <p class="text-muted ms-2 mb-0">New York</p>
            </li>
            <li class="d-flex">
              <label class="text-dark">Website</label>
              <p class="text-muted text-break ms-2 mb-0">
                <a href="https://www.InternNovatecnologypvt.ltd.com" target="_blank">
                  www.InternNovatecnologypvt.ltd.com
                </a>
              </p>
            </li>
            <li class="d-flex">
              <label class="text-dark">Established</label>
              <p class="text-muted ms-2 mb-0">July 10 2017</p>
            </li>
          </ul>

          <div class="mt-3">
            <a href="#" class="btn btn-danger btn-hover w-100">
              <i class="uil uil-phone"></i> Contact
            </a>
          </div>
        </div>

        <!-- WORKING DAYS -->
        <div class="card-body border-top p-4">
          <h6 class="fs-17 fw-medium mb-3">Working Days</h6>

          <ul class="working-days">
            <li>Monday<span>9AM - 5PM</span></li>
            <li>Tuesday<span>9AM - 5PM</span></li>
            <li>Wednesday<span>9AM - 5PM</span></li>
            <li>Thursday<span>9AM - 5PM</span></li>
            <li>Friday<span>9AM - 5PM</span></li>
            <li>Saturday<span>9AM - 5PM</span></li>
            <li>Sunday<span class="text-danger">Close</span></li>
          </ul>
        </div>

      </div>
    </div>

    <!-- RIGHT CONTENT -->
    <div class="col-lg-8">
      <div class="card ms-lg-4 mt-4 mt-lg-0">
        <div class="card-body p-4">

          <div class="mb-5">
            <h6 class="fs-17 fw-medium mb-4">About Company</h6>
            <p class="text-muted">Objectively pursue diverse catalysts for change for interoperable meta-services.</p>
            <p class="text-muted">Intrinsically incubate intuitive opportunities and real-time potentialities.</p>
            <p class="text-muted">Exercitation photo booth stumptown tote bag Banksy, elit small batch freegan sed.</p>
          </div>

          <div class="candidate-portfolio mb-5">
            <h6 class="fs-17 fw-medium mb-4">Gallery</h6>
            <div class="row g-3">
              <div class="col-lg-6">
                <img src="/assets/images/gallery/img-01.jpg" class="img-fluid rounded" alt="">
              </div>
              <div class="col-lg-6">
                <img src="/assets/images/gallery/img-03.jpg" class="img-fluid rounded" alt="">
              </div>
              <div class="col-lg-12">
                <img src="/assets/images/gallery/img-12.jpg" class="img-fluid rounded" alt="">
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

  </div>
</div>


              <!-- ================= SETTINGS ================= -->
<div class="tab-pane fade" id="settings">
  <form>

    <!-- ================= COMPANY LOGO (TOP PRIORITY) ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Company Logo</h5>

      <p class="text-muted fs-14">
        This logo appears on your public company profile and job listings.
      </p>

      <div class="row align-items-center">
        <div class="col-lg-3 col-md-4 text-center mb-3 mb-md-0">
          <img
            src="/assets/images/featured-job/img-01.png"
            alt="Company Logo"
            class="img-thumbnail rounded-circle"
            style="width:140px;height:140px;object-fit:cover;"
          />
        </div>

        <div class="col-lg-9 col-md-8">
          <label class="form-label fw-medium">Upload New Logo</label>
          <input
            type="file"
            class="form-control"
            accept="image/png, image/jpeg, image/jpg"
          />
          <div class="form-text mt-2">
            Recommended size: <strong>300 × 300 px</strong><br>
            Allowed formats: JPG, PNG<br>
            Max file size: 2MB
          </div>
        </div>
      </div>
    </div>

    <!-- ================= COMPANY BASIC INFO ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Company Basic Information</h5>

      <div class="row">
        <div class="col-lg-6">
          <label class="form-label">Company Name</label>
          <input class="form-control" value="InternNova Technology Pvt.Ltd">
        </div>

        <div class="col-lg-6">
          <label class="form-label">Owner Name</label>
          <input class="form-control" value="Charles Dickens">
        </div>

        <div class="col-lg-6 mt-3">
          <label class="form-label">Established Date</label>
          <input type="date" class="form-control" value="2017-07-10">
        </div>

        <div class="col-lg-6 mt-3">
          <label class="form-label">Website</label>
          <input class="form-control" value="www.InternNovatecnologypvt.ltd.com">
        </div>
      </div>
    </div>

    <!-- ================= COMPANY OVERVIEW ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Company Overview (Public)</h5>

      <p class="text-muted fs-14">
        This description appears on your public company profile.
      </p>

      <textarea class="form-control" rows="6">
Objectively pursue diverse catalysts for change for interoperable meta-services.
Distinctively re-engineer revolutionary meta-services and premium architectures.
Intrinsically incubate intuitive opportunities and real-time potentialities.
      </textarea>
    </div>

    <!-- ================= COMPANY STATISTICS ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Company Statistics</h5>

      <div class="row">
        <div class="col-lg-6">
          <label class="form-label">Number of Employees</label>
          <input class="form-control" value="1500 - 1850">
        </div>

        <div class="col-lg-6">
          <label class="form-label">Primary Location</label>
          <input class="form-control" value="New York">
        </div>
      </div>
    </div>

    <!-- ================= WORKING DAYS & HOURS ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Working Days & Hours</h5>

      <div class="row">
        <div class="col-lg-6">
          <label class="form-label">Weekdays</label>
          <input class="form-control" value="Monday - Friday : 9AM - 5PM">
        </div>

        <div class="col-lg-6">
          <label class="form-label">Weekend</label>
          <input class="form-control" value="Sunday : Closed">
        </div>
      </div>
    </div>

    <!-- ================= COMPANY GALLERY ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Company Gallery</h5>

      <p class="text-muted fs-14">
        These images appear in the Gallery section of your company profile.
      </p>

      <div class="row g-3">
        <div class="col-lg-4 col-md-6">
          <div class="border rounded p-3 text-center">
            <img src="/assets/images/gallery/img-01.jpg"
                 class="img-fluid rounded mb-2"
                 style="height:150px;object-fit:cover;" alt="">
            <input type="file" class="form-control form-control-sm" accept="image/*">
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="border rounded p-3 text-center">
            <img src="/assets/images/gallery/img-03.jpg"
                 class="img-fluid rounded mb-2"
                 style="height:150px;object-fit:cover;" alt="">
            <input type="file" class="form-control form-control-sm" accept="image/*">
          </div>
        </div>

        <div class="col-lg-4 col-md-6">
          <div class="border rounded p-3 text-center">
            <img src="/assets/images/gallery/img-12.jpg"
                 class="img-fluid rounded mb-2"
                 style="height:150px;object-fit:cover;" alt="">
            <input type="file" class="form-control form-control-sm" accept="image/*">
          </div>
        </div>
      </div>

      <small class="text-muted d-block mt-2">
        Recommended size: 1200 × 800 px. JPG or PNG.
      </small>
    </div>

    <!-- ================= CONTACT INFORMATION ================= -->
    <div class="mb-5">
      <h5 class="fs-17 fw-semibold mb-3">Contact Information</h5>

      <div class="row">
        <div class="col-lg-6">
          <label class="form-label">Email</label>
          <input class="form-control" value="Jansh@gmail.com">
        </div>

        <div class="col-lg-6">
          <label class="form-label">Phone Number</label>
          <input class="form-control" value="+2 345 678 0000">
        </div>

        <div class="col-lg-6 mt-3">
          <label class="form-label">Office Location</label>
          <input class="form-control" value="New Caledonia">
        </div>
      </div>
    </div>

    <!-- ================= SOCIAL LINKS ================= -->
<div class="mb-5">
  <h5 class="fs-17 fw-semibold mb-3">Social & Online Presence</h5>

  <div class="row">
    <div class="col-lg-6">
      <label class="form-label">Facebook</label>
      <input
        class="form-control"
        placeholder="https://facebook.com/company"
      >
    </div>

    <div class="col-lg-6">
      <label class="form-label">Twitter</label>
      <input
        class="form-control"
        placeholder="https://twitter.com/company"
      >
    </div>

    <div class="col-lg-6 mt-3">
      <label class="form-label">WhatsApp</label>
      <input
        class="form-control"
        placeholder="+1 234 567 8900"
      >
    </div>

    <div class="col-lg-6 mt-3">
      <label class="form-label">Phone Call Link</label>
      <input
        class="form-control"
        placeholder="tel:+1234567890"
      >
    </div>
  </div>
</div>


    <!-- ================= ACTION ================= -->
    <div class="text-end">
      <button class="btn btn-primary px-4">
        Update Company Profile
      </button>
    </div>

  </form>
</div>

     </div>
          </div>

        </div>

      </div>
    </section>

  </div>
</div>
`

export default function CompanyProfile() {
  return <StaticMarkupPage slug="company-profile" />
}
