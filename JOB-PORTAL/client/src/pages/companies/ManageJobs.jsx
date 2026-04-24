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
                            <h3 class="mb-2">Manage Jobs</h3>
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

        <!-- MANAGE JOBS DASHBOARD -->
        <section class="section">
            <div class="container">

                <!-- SUMMARY -->
                <div class="row g-4 mb-4">
                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-briefcase fs-1 text-primary"></i>
                                <h4 class="mt-2 mb-0">12</h4>
                                <p class="text-muted mb-0">Total Jobs</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-check-circle fs-1 text-success"></i>
                                <h4 class="mt-2 mb-0">8</h4>
                                <p class="text-muted mb-0">Active Jobs</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-pause-circle fs-1 text-warning"></i>
                                <h4 class="mt-2 mb-0">3</h4>
                                <p class="text-muted mb-0">Paused Jobs</p>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-3">
                        <div class="card text-center">
                            <div class="card-body">
                                <i class="uil uil-users-alt fs-1 text-info"></i>
                                <h4 class="mt-2 mb-0">94</h4>
                                <p class="text-muted mb-0">Applications</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- HEADER ACTION -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">Your Job Listings</h5>
                    <a href="/manage-jobs-post" class="btn btn-primary">
                        <i class="uil uil-plus"></i> Post New Job
                    </a>
                </div>

                <!-- JOB CARD -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">

                            <!-- JOB INFO -->
                            <div class="col-lg-4">
                                <h6 class="mb-1">UI / UX Designer</h6>
                                <p class="text-muted mb-1">Posted on 12 Sep 2024</p>
                                <div>
                                    <span class="badge bg-soft-primary me-1">Design</span>
                                    <span class="badge bg-soft-info me-1">Full Time</span>
                                    <span class="badge bg-soft-secondary">Dhaka</span>
                                </div>
                            </div>

                            <!-- APPLICATION COUNT -->
                            <div class="col-lg-2 text-center mt-3 mt-lg-0">
    <a href="/applicant-management"
       class="text-decoration-none d-inline-block">
        <h5 class="mb-0 link-primary">32</h5>
        <p class="text-muted mb-0 fs-14">Applications</p>
    </a>
</div>


                            <!-- STATUS -->
                            <div class="col-lg-3 text-center mt-3 mt-lg-0 d-flex align-items-center justify-content-center">
                                <span class="badge bg-success px-3 py-2 fs-14">
                                    Active
                                </span>
                            </div>

                            <!-- ACTIONS -->
                            <div class="col-lg-3 mt-3 mt-lg-0 d-flex justify-content-lg-end justify-content-center">
                                <div class="btn-group flex-nowrap">

                                    <a href="/job-details"
                                       class="btn btn-soft-success px-3"
                                       title="View Job">
                                        <i class="mdi mdi-eye fs-5"></i>
                                    </a>

                                    <a href="/manage-jobs-edit"
                                       class="btn btn-soft-primary px-3"
                                       title="Edit Job">
                                        <i class="uil uil-edit fs-5"></i>
                                    </a>

                                    <a href="javascript:void(0)"
                                       class="btn btn-soft-warning px-3"
                                       title="Pause Job">
                                        <i class="uil uil-pause fs-5"></i>
                                    </a>

                                    <a href="javascript:void(0)"
                                       class="btn btn-soft-danger px-3"
                                       title="Delete Job">
                                        <i class="uil uil-trash-alt fs-5"></i>
                                    </a>

                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- SECOND JOB -->
                <div class="card mb-3">
                    <div class="card-body">
                        <div class="row align-items-center">

                            <div class="col-lg-4">
                                <h6 class="mb-1">Frontend Developer</h6>
                                <p class="text-muted mb-1">Posted on 05 Sep 2024</p>
                                <div>
                                    <span class="badge bg-soft-primary me-1">Development</span>
                                    <span class="badge bg-soft-info me-1">Contract</span>
                                    <span class="badge bg-soft-secondary">Remote</span>
                                </div>
                            </div>

                            <div class="col-lg-2 text-center mt-3 mt-lg-0">
                                <h5 class="mb-0">18</h5>
                                <p class="text-muted mb-0 fs-14">Applications</p>
                            </div>

                            <div class="col-lg-3 text-center mt-3 mt-lg-0 d-flex align-items-center justify-content-center">
                                <span class="badge bg-warning px-3 py-2 fs-14">
                                    Paused
                                </span>
                            </div>

                            <div class="col-lg-3 mt-3 mt-lg-0 d-flex justify-content-lg-end justify-content-center">
                                <div class="btn-group flex-nowrap">

                                    <a href="/job-details"
                                       class="btn btn-soft-success px-3">
                                        <i class="mdi mdi-eye fs-5"></i>
                                    </a>

                                    <a href="/manage-jobs-edit"
                                       class="btn btn-soft-primary px-3">
                                        <i class="uil uil-edit fs-5"></i>
                                    </a>

                                    <a href="javascript:void(0)"
                                       class="btn btn-soft-success px-3"
                                       title="Activate Job">
                                        <i class="uil uil-play fs-5"></i>
                                    </a>

                                    <a href="javascript:void(0)"
                                       class="btn btn-soft-danger px-3">
                                        <i class="uil uil-trash-alt fs-5"></i>
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

export default function ManageJobs() {
    return <StaticMarkupPage slug="manage-jobs" />
}
