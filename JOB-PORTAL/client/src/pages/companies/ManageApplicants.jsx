import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `

<div class="main-content">
    <div class="page-content">

        <!-- PAGE TITLE -->
        <section class="page-title-box">
            <div class="container">
                <div class="row justify-content-center">
                    <div class="col-md-7">
                        <div class="text-center text-white">
                            <h3 class="mb-2">Applicant Management</h3>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- SHAPE -->
        <div class="position-relative" style="z-index:1">
            <div class="shape">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
                    <path fill="#FFFFFF"
                        d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L0,320Z">
                    </path>
                </svg>
            </div>
        </div>

        <!-- APPLICANT DASHBOARD -->
        <section class="section">
            <div class="container">

                <!-- SUMMARY CARDS -->
                <div class="row g-4 mb-4">
                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-users-alt fs-1 text-primary"></i>
                                <h4 class="mt-2 mb-0">42</h4>
                                <p class="text-muted mb-0">Total Applicants</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-check-circle fs-1 text-success"></i>
                                <h4 class="mt-2 mb-0">15</h4>
                                <p class="text-muted mb-0">Shortlisted</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-4">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-times-circle fs-1 text-danger"></i>
                                <h4 class="mt-2 mb-0">10</h4>
                                <p class="text-muted mb-0">Rejected</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- HEADER -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">Applicants for: <span class="text-primary">UI / UX Designer</span></h5>
                </div>

                <!-- APPLICANT CARD -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">

                            <!-- APPLICANT INFO -->
                            <div class="col-lg-4">
                                <h6 class="mb-1 fs-16">Amit Sharma</h6>
                                <p class="text-muted mb-1">amit.sharma@email.com</p>
                                <div>
                                    <span class="badge bg-soft-primary me-1">UI/UX</span>
                                    <span class="badge bg-soft-info">3+ Years</span>
                                </div>
                            </div>

                            <!-- APPLIED INFO -->
                            <div class="col-lg-3 text-center mt-3 mt-lg-0">
                                <p class="mb-0">Applied On</p>
                                <h6 class="mb-0">14 Sep 2024</h6>
                            </div>

                            <!-- STATUS -->
                            <div class="col-lg-2 text-center mt-3 mt-lg-0">
                                <span class="badge bg-warning fs-6 px-3 py-2">
                                    Pending
                                </span>
                            </div>

                            <!-- ACTIONS -->
                            <div class="col-lg-3 text-lg-end mt-3 mt-lg-0">
                                <div class="btn-group">
                                    <a href="#" class="btn btn-soft-primary px-3" title="View Resume">
                                        <i class="uil uil-file-alt fs-4"></i>
                                    </a>
                                    <a href="#" class="btn btn-soft-success px-3" title="Shortlist">
                                        <i class="uil uil-check fs-4"></i>
                                    </a>
                                    <a href="#" class="btn btn-soft-danger px-3" title="Reject">
                                        <i class="uil uil-times fs-4"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- SECOND APPLICANT -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">

                            <div class="col-lg-4">
                                <h6 class="mb-1 fs-16">Neha Verma</h6>
                                <p class="text-muted mb-1">neha.verma@email.com</p>
                                <div>
                                    <span class="badge bg-soft-primary me-1">Frontend</span>
                                    <span class="badge bg-soft-info">5+ Years</span>
                                </div>
                            </div>

                            <div class="col-lg-3 text-center mt-3 mt-lg-0">
                                <p class="mb-0">Applied On</p>
                                <h6 class="mb-0">10 Sep 2024</h6>
                            </div>

                            <div class="col-lg-2 text-center mt-3 mt-lg-0">
                                <span class="badge bg-success fs-6 px-3 py-2">
                                    Shortlisted
                                </span>
                            </div>

                            <div class="col-lg-3 text-lg-end mt-3 mt-lg-0">
                                <div class="btn-group">
                                    <a href="#" class="btn btn-soft-primary px-3" title="View Resume">
                                        <i class="uil uil-file-alt fs-4"></i>
                                    </a>
                                    <a href="#" class="btn btn-soft-danger px-3" title="Reject">
                                        <i class="uil uil-times fs-4"></i>
                                    </a>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </section>

    </div>
</div>
`

export default function Applicants() {
    return <StaticMarkupPage slug="applicant-management" />
}
