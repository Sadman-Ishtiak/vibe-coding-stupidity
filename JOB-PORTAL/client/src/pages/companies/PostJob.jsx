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
                            <h3 class="mb-4">Post a Job</h3>
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

        <!-- POST JOB -->
        <section class="section">
            <div class="container">
                <div class="row">

                    <!-- FORM COLUMN -->
                    <div class="col-lg-8">
                        <div class="card job-detail overflow-hidden">
                            <div class="card-body p-4">

                                <h5 class="mb-4">Job Details</h5>

                                <div class="row g-3">

                                    <div class="col-md-6">
                                        <label class="form-label">Job Title</label>
                                        <input type="text" class="form-control"
                                            placeholder="e.g. Product Designer / UI Designer">
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Job Category</label>
                                        <select class="form-select">
                                            <option selected disabled>Select category</option>
                                            <option>Design</option>
                                            <option>Development</option>
                                            <option>Marketing</option>
                                            <option>Finance</option>
                                            <option>Human Resources</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Vacancy</label>
                                        <input type="number" class="form-control"
                                            placeholder="Number of openings">
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Employment Type</label>
                                        <select class="form-select">
                                            <option selected disabled>Select type</option>
                                            <option>Full Time</option>
                                            <option>Part Time</option>
                                            <option>Contract</option>
                                            <option>Internship</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Position</label>
                                        <select class="form-select">
                                            <option selected disabled>Select position</option>
                                            <option>Junior</option>
                                            <option>Mid</option>
                                            <option>Senior</option>
                                            <option>Lead</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Job Location (District)</label>
                                        <select class="form-select">
                                            <option selected disabled>Select district</option>
                                            <option>Dhaka</option>
                                            <option>Chattogram</option>
                                            <option>Rajshahi</option>
                                            <option>Khulna</option>
                                            <option>Sylhet</option>
                                            <option>Barisal</option>
                                            <option>Rangpur</option>
                                            <option>Mymensingh</option>
                                        </select>
                                    </div>

                                    <div class="col-md-6">
                                        <label class="form-label">Salary Range</label>
                                        <input type="text" class="form-control"
                                            placeholder="e.g. ৳30,000 - ৳50,000 / Month">
                                    </div>

                                </div>

                                <div class="mt-4">
                                    <label class="form-label">Job Description</label>
                                    <textarea class="form-control" rows="4"
                                        placeholder="Describe the job role and expectations"></textarea>
                                </div>

                                <div class="mt-4">
                                    <label class="form-label">Responsibilities</label>
                                    <textarea class="form-control" rows="3"
                                        placeholder="List key responsibilities"></textarea>
                                </div>

                                <div class="mt-4">
                                    <label class="form-label">Qualifications</label>
                                    <textarea class="form-control" rows="3"
                                        placeholder="Education, certifications, experience"></textarea>
                                </div>

                                <!-- SKILLS DROPDOWN + BADGES -->
                                <div class="mt-4">
                                    <label class="form-label">Select Skills</label>
                                    <select class="form-select">
                                        <option selected disabled>Select a skill</option>
                                        <option>PHP</option>
                                        <option>JavaScript</option>
                                        <option>React</option>
                                        <option>Marketing</option>
                                        <option>Photoshop</option>
                                        <option>UI/UX Design</option>
                                        <option>Laravel</option>
                                        <option>Node.js</option>
                                    </select>

                                    <div class="mt-3">
                                        <span class="badge bg-primary me-1">PHP</span>
                                        <span class="badge bg-primary me-1">JS</span>
                                        <span class="badge bg-primary me-1">Marketing</span>
                                        <span class="badge bg-primary me-1">REACT</span>
                                        <span class="badge bg-primary me-1">PHOTOSHOP</span>
                                    </div>
                                </div>

                                <!-- SKILLS DESCRIPTION -->
                                <div class="mt-3">
                                    <label class="form-label">Skills & Experience Description</label>
                                    <textarea class="form-control" rows="3"
                                        placeholder="Describe required skills, tools, and experience"></textarea>
                                </div>

                                <div class="mt-4 pt-3">
                                    <button class="btn btn-primary w-100">
                                        Publish Job <i class="uil uil-arrow-right"></i>
                                    </button>
                                </div>

                            </div>
                        </div>
                    </div>

                    <!-- SIDEBAR -->
                    <div class="col-lg-4 mt-4 mt-lg-0">
                        <div class="side-bar ms-lg-4">
                            <div class="card job-overview">
                                <div class="card-body p-4">
                                    <h6 class="fs-17">Job Posting Tips</h6>
                                    <ul class="list-unstyled mt-4 mb-0">
                                        <li class="d-flex mt-3">
                                            <i class="uil uil-check-circle icon bg-soft-primary"></i>
                                            <div class="ms-3">
                                                <p class="text-muted mb-0">
                                                    Use a clear and searchable job title
                                                </p>
                                            </div>
                                        </li>
                                        <li class="d-flex mt-3">
                                            <i class="uil uil-check-circle icon bg-soft-primary"></i>
                                            <div class="ms-3">
                                                <p class="text-muted mb-0">
                                                    Select relevant skills and category
                                                </p>
                                            </div>
                                        </li>
                                        <li class="d-flex mt-3">
                                            <i class="uil uil-check-circle icon bg-soft-primary"></i>
                                            <div class="ms-3">
                                                <p class="text-muted mb-0">
                                                    Add location and salary for better reach
                                                </p>
                                            </div>
                                        </li>
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

export default function PostJob() {
    return <StaticMarkupPage slug="manage-jobs-post" />
}
