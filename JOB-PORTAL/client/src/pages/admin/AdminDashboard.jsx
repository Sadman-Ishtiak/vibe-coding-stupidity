import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">
	<div class="page-content">

		<!-- PAGE TITLE -->
		<section class="page-title-box">
			<div class="container">
				<div class="row justify-content-center">
					<div class="col-md-8">
						<div class="text-center text-white">
							<h3 class="mb-2">Admin Dashboard</h3>
							<p class="text-white-50 mb-0">Platform pulse, hiring performance, and quick admin shortcuts.</p>
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

		<!-- DASHBOARD -->
		<section class="section">
			<div class="container">

				<!-- KPI ROW -->
				<div class="row g-3">
					<div class="col-xl-3 col-md-6">
						<div class="card shadow-sm border-0">
							<div class="card-body d-flex align-items-center">
								<div class="avatar-sm bg-primary bg-opacity-10 text-primary rounded d-flex align-items-center justify-content-center me-3">
									<i class="uil uil-briefcase-alt fs-22"></i>
								</div>
								<div>
									<p class="text-muted mb-0">Open Jobs</p>
									<h5 class="mb-0">128</h5>
									<small class="text-success">+6 this week</small>
								</div>
							</div>
						</div>
					</div>

					<div class="col-xl-3 col-md-6">
						<div class="card shadow-sm border-0">
							<div class="card-body d-flex align-items-center">
								<div class="avatar-sm bg-success bg-opacity-10 text-success rounded d-flex align-items-center justify-content-center me-3">
									<i class="uil uil-user-check fs-22"></i>
								</div>
								<div>
									<p class="text-muted mb-0">Applications</p>
									<h5 class="mb-0">4,210</h5>
									<small class="text-success">+12% vs last week</small>
								</div>
							</div>
						</div>
					</div>

					<div class="col-xl-3 col-md-6">
						<div class="card shadow-sm border-0">
							<div class="card-body d-flex align-items-center">
								<div class="avatar-sm bg-warning bg-opacity-10 text-warning rounded d-flex align-items-center justify-content-center me-3">
									<i class="uil uil-building fs-22"></i>
								</div>
								<div>
									<p class="text-muted mb-0">Active Employers</p>
									<h5 class="mb-0">312</h5>
									<small class="text-muted">14 pending verifications</small>
								</div>
							</div>
						</div>
					</div>

					<div class="col-xl-3 col-md-6">
						<div class="card shadow-sm border-0">
							<div class="card-body d-flex align-items-center">
								<div class="avatar-sm bg-info bg-opacity-10 text-info rounded d-flex align-items-center justify-content-center me-3">
									<i class="uil uil-dollar-sign-alt fs-22"></i>
								</div>
								<div>
									<p class="text-muted mb-0">Monthly Revenue</p>
									<h5 class="mb-0">$84,600</h5>
									<small class="text-success">+3.8% MoM</small>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-4 g-4">
					<!-- PIPELINE -->
					<div class="col-xl-8">
						<div class="card border-0 shadow-sm h-100">
							<div class="card-body">
								<div class="d-flex justify-content-between align-items-start mb-3">
									<div>
										<h5 class="fs-17 fw-semibold mb-1">Application Pipeline</h5>
										<p class="text-muted mb-0">This week by stage</p>
									</div>
									<span class="badge bg-primary-subtle text-primary">Live</span>
								</div>

								<div class="row g-3">
									<div class="col-md-6">
										<div class="border rounded p-3">
											<div class="d-flex justify-content-between mb-1">
												<span class="text-muted">New</span>
												<span class="fw-semibold">642</span>
											</div>
											<div class="progress" style="height: 6px;">
												<div class="progress-bar bg-primary" style="width: 65%"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6">
										<div class="border rounded p-3">
											<div class="d-flex justify-content-between mb-1">
												<span class="text-muted">Screened</span>
												<span class="fw-semibold">384</span>
											</div>
											<div class="progress" style="height: 6px;">
												<div class="progress-bar bg-success" style="width: 55%"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6">
										<div class="border rounded p-3">
											<div class="d-flex justify-content-between mb-1">
												<span class="text-muted">Interviewing</span>
												<span class="fw-semibold">192</span>
											</div>
											<div class="progress" style="height: 6px;">
												<div class="progress-bar bg-warning" style="width: 42%"></div>
											</div>
										</div>
									</div>

									<div class="col-md-6">
										<div class="border rounded p-3">
											<div class="d-flex justify-content-between mb-1">
												<span class="text-muted">Offers</span>
												<span class="fw-semibold">46</span>
											</div>
											<div class="progress" style="height: 6px;">
												<div class="progress-bar bg-info" style="width: 28%"></div>
											</div>
										</div>
									</div>
								</div>

								<div class="mt-4">
									<div class="d-flex align-items-center mb-3">
										<div class="avatar-sm rounded bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-2">
											<i class="uil uil-schedule"></i>
										</div>
										<div>
											<h6 class="mb-0">Time-to-hire</h6>
											<small class="text-muted">Median 12.5 days · Target 14 days</small>
										</div>
									</div>
									<div class="progress" style="height: 8px;">
										<div class="progress-bar" role="progressbar" style="width: 78%" aria-valuenow="78" aria-valuemin="0" aria-valuemax="100"></div>
									</div>
								</div>
							</div>
						</div>
					</div>

					<!-- SYSTEM SNAPSHOT -->
					<div class="col-xl-4">
						<div class="card border-0 shadow-sm h-100">
							<div class="card-body">
								<h5 class="fs-17 fw-semibold mb-3">System Snapshot</h5>

								<div class="d-flex align-items-center mb-3">
									<span class="badge bg-success-subtle text-success me-2"><i class="uil uil-check me-1"></i>Operational</span>
									<small class="text-muted">All services</small>
								</div>

								<ul class="list-unstyled mb-4">
									<li class="d-flex justify-content-between align-items-center py-2 border-bottom">
										<span class="text-muted">Email deliverability</span>
										<span class="fw-semibold text-dark">99.1%</span>
									</li>
									<li class="d-flex justify-content-between align-items-center py-2 border-bottom">
										<span class="text-muted">Profile completion</span>
										<span class="fw-semibold text-dark">82%</span>
									</li>
									<li class="d-flex justify-content-between align-items-center py-2">
										<span class="text-muted">Pending KYC checks</span>
										<span class="fw-semibold text-warning">9</span>
									</li>
								</ul>

								<div class="p-3 rounded bg-light">
									<h6 class="mb-2">Quick Actions</h6>
									<div class="d-flex flex-wrap gap-2">
										<a class="btn btn-sm btn-primary" href="/admin-jobs">Approve jobs</a>
										<a class="btn btn-sm btn-outline-primary" href="/admin-employers">Verify employers</a>
										<a class="btn btn-sm btn-outline-secondary" href="/admin-settings">Update limits</a>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="row mt-4 g-4">
					<!-- RECENT APPLICATIONS -->
					<div class="col-xl-7">
						<div class="card border-0 shadow-sm h-100">
							<div class="card-body">
								<div class="d-flex justify-content-between align-items-center mb-3">
									<h5 class="fs-17 fw-semibold mb-0">Recent Applications</h5>
									<a href="/admin-applications" class="text-primary">View all</a>
								</div>

								<div class="table-responsive">
									<table class="table align-middle mb-0">
										<thead class="table-light">
											<tr>
												<th>Candidate</th>
												<th>Role</th>
												<th>Stage</th>
												<th>Date</th>
											</tr>
										</thead>
										<tbody>
											<tr>
												<td class="fw-semibold">Sara Nolan</td>
												<td>Product Designer</td>
												<td><span class="badge bg-warning-subtle text-warning">Interview</span></td>
												<td class="text-muted">Today</td>
											</tr>
											<tr>
												<td class="fw-semibold">Kevin Wu</td>
												<td>Data Analyst</td>
												<td><span class="badge bg-success-subtle text-success">Offer</span></td>
												<td class="text-muted">Today</td>
											</tr>
											<tr>
												<td class="fw-semibold">Emily Carter</td>
												<td>Frontend Engineer</td>
												<td><span class="badge bg-info-subtle text-info">Screening</span></td>
												<td class="text-muted">Yesterday</td>
											</tr>
											<tr>
												<td class="fw-semibold">David Lee</td>
												<td>Sales Manager</td>
												<td><span class="badge bg-secondary-subtle text-secondary">Review</span></td>
												<td class="text-muted">Yesterday</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>

					<!-- OPEN JOBS -->
					<div class="col-xl-5">
						<div class="card border-0 shadow-sm h-100">
							<div class="card-body">
								<div class="d-flex justify-content-between align-items-center mb-3">
									<h5 class="fs-17 fw-semibold mb-0">Open Jobs</h5>
									<a href="/admin-jobs" class="text-primary">Manage</a>
								</div>

								<div class="list-group list-group-flush">
									<a href="/admin-jobs" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
										<div>
											<h6 class="mb-1">Senior Frontend Engineer</h6>
											<small class="text-muted">InternNova · Remote</small>
										</div>
										<span class="badge bg-success-subtle text-success">18 applied</span>
									</a>
									<a href="/admin-jobs" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
										<div>
											<h6 class="mb-1">Product Manager</h6>
											<small class="text-muted">BoldBank · Hybrid</small>
										</div>
										<span class="badge bg-primary-subtle text-primary">11 applied</span>
									</a>
									<a href="/admin-jobs" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
										<div>
											<h6 class="mb-1">Data Scientist</h6>
											<small class="text-muted">VisionAI · Onsite</small>
										</div>
										<span class="badge bg-warning-subtle text-warning">7 applied</span>
									</a>
									<a href="/admin-jobs" class="list-group-item list-group-item-action d-flex justify-content-between align-items-start">
										<div>
											<h6 class="mb-1">Customer Success Lead</h6>
											<small class="text-muted">Northwind · Remote</small>
										</div>
										<span class="badge bg-info-subtle text-info">5 applied</span>
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

export default function AdminDashboard() {
	return <StaticMarkupPage slug="admin-dashboard" />
}
