import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">

	<div class="page-content">
		<section class="page-title-box">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-6">
						<div class="text-center text-white">
							<h3 class="mb-4">Applied Jobs</h3>
							<p class="text-white-50">Jobs you've applied to — track their status and details.</p>
						</div>
					</div>
				</div>
			</div>
		</section>

		<div class="position-relative" style="z-index: 1">
			<div class="shape">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
					<path fill="#FFFFFF" fill-opacity="1" d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
				</svg>
			</div>
		</div>

		<section class="section">
			<div class="container">
				<div class="row">
					<div class="col-lg-9">
						<div class="me-lg-0">
							<div class="job-list-header d-flex justify-content-between align-items-center">
								<div class="d-flex align-items-center">
									<div class="me-3">
										<input type="search" class="form-control" placeholder="Search applied jobs..." />
									</div>
									<div>
										<select class="form-select">
											<option>All statuses</option>
											<option>Under Review</option>
											<option>Interview</option>
											<option>Rejected</option>
										</select>
									</div>
								</div>
								<div>
									<span class="badge bg-soft-primary text-primary">3 applications</span>
								</div>
							</div>

							<!-- Applied jobs list -->
							<div class="mt-4">
								<job-list-card></job-list-card>
								<job-list-card></job-list-card>
								<job-list-card></job-list-card>
							</div>

							<div class="row">
								<div class="col-lg-12 mt-4 pt-2">
									<nav aria-label="Page navigation example">
										<ul class="pagination job-pagination mb-0 justify-content-center">
											<li class="page-item disabled"><a class="page-link" href="javascript:void(0)"><i class="mdi mdi-chevron-double-left fs-15"></i></a></li>
											<li class="page-item active"><a class="page-link" href="javascript:void(0)">1</a></li>
											<li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
											<li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
											<li class="page-item"><a class="page-link" href="javascript:void(0)"><i class="mdi mdi-chevron-double-right fs-15"></i></a></li>
										</ul>
									</nav>
								</div>
							</div>

						</div>
					</div>

					<div class="col-lg-3">
						<div class="side-bar mt-5 mt-lg-0">
							<div class="card">
								<div class="card-body p-4 text-center">
									<img alt="" class="avatar-md img-thumbnail rounded-circle mb-3" loading="lazy" src="/assets/images/profile.jpg">
									<h6 class="mb-0">Your Name</h6>
									<p class="text-muted">Candidate</p>
									<div class="mt-3">
										<a href="/candidate-profile" class="btn btn-outline-primary btn-sm">View Profile</a>
									</div>
								</div>
							</div>

							<div class="card mt-4">
								<div class="card-body p-4">
									<h6 class="fs-16 fw-bold">Application Tips</h6>
									<ul class="ps-3 mt-3">
										<li class="text-muted">Keep your resume concise and updated.</li>
										<li class="text-muted">Tailor cover letters by job.</li>
										<li class="text-muted">Follow up after interviews.</li>
									</ul>
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

export default function AppliedJobs() {
	return <StaticMarkupPage slug="applied-jobs" />
}

