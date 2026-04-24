import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">

	<div class="page-content">
		<section class="page-title-box">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-6">
						<div class="text-center text-white">
							<h3 class="mb-4">Bookmarked Jobs</h3>
							<p class="text-white-50">Jobs you've saved for later — manage and apply when ready.</p>
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
							<div class="d-flex justify-content-between align-items-center">
								<div class="d-flex align-items-center">
									<div class="me-3">
										<input type="search" class="form-control" placeholder="Search bookmarked jobs..." />
									</div>
									<div>
										<select class="form-select">
											<option>All categories</option>
											<option>Engineering</option>
											<option>Design</option>
											<option>Marketing</option>
										</select>
									</div>
								</div>
								<div>
									<a href="javascript:void(0)" class="btn btn-outline-secondary btn-sm">Clear All</a>
								</div>
							</div>

							<div class="mt-4 row g-3">
								<div class="col-12">
									<h6 class="mb-3">Saved</h6>
								</div>
								<div class="col-12">
									<job-list-card></job-list-card>
								</div>
								<div class="col-12">
									<job-list-card></job-list-card>
								</div>
								<div class="col-12">
									<job-list-card></job-list-card>
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
								</div>
							</div>

							<div class="card mt-4">
								<div class="card-body p-4">
									<h6 class="fs-16 fw-bold">Saved Jobs Tips</h6>
									<ul class="ps-3 mt-3">
										<li class="text-muted">Review saved jobs weekly.</li>
										<li class="text-muted">Remove outdated postings.</li>
										<li class="text-muted">Set reminders to apply.</li>
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

export default function BookmarkJobs() {
	return <StaticMarkupPage slug="bookmark-jobs" />
}

