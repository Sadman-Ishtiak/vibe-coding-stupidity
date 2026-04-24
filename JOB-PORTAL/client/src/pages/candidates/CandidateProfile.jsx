import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `

            <div class="main-content">

                <div class="page-content">
<section class="page-title-box">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="text-center text-white">
                                        <h3 class="mb-4">My Profile</h3>
                                    </div>
                                </div>
                                <!--end col-->
                            </div>
                            <!--end row-->
                        </div>
                        <!--end container-->
                    </section>
<!-- START SHAPE -->
                    <div class="position-relative" style="z-index: 1">
                        <div class="shape">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
                                <path fill="#FFFFFF" fill-opacity="1"
                                    d="M0,192L120,202.7C240,213,480,235,720,234.7C960,235,1200,213,1320,202.7L1440,192L1440,320L1320,320C1200,320,960,320,720,320C480,320,240,320,120,320L0,320Z"></path>
                            </svg>
                        </div>
                    </div>
                    <!-- END SHAPE -->


                    <!-- START PROFILE -->
                    <section class="section">
                        <div class="container">
                            <div class="row">
                                
                                <div>
                                    <div class="card profile-content-page mt-4 mt-lg-0">
                                        <ul class="profile-content-nav nav nav-pills border-bottom mb-4" id="pills-tab" role="tablist">
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link active" id="overview-tab" data-bs-toggle="pill" data-bs-target="#overview" type="button" role="tab" aria-controls="overview" aria-selected="true">
                                                        Overview
                                                    </button>
                                                </li>


                                                
                                                <li class="nav-item" role="presentation">
                                                    <button class="nav-link" id="settings-tab" data-bs-toggle="pill" data-bs-target="#settings" type="button" role="tab" aria-controls="settings" aria-selected="false" tabindex="-1">
                                                        Settings
                                                    </button>
                                                </li>
                                            </ul>
<div class="card-body p-4">
<div class="tab-content" id="pills-tabContent">


<div class="tab-pane fade active show" id="overview" role="tabpanel" aria-labelledby="overview-tab">
    <div class="row">

        <!-- ================= LEFT SIDEBAR ================= -->
        <div class="col-lg-4">
            <div class="card profile-sidebar me-lg-4">
                <div class="card-body p-4">

                    <div class="text-center pb-4 border-bottom">
                        <img alt="" class="avatar-lg img-thumbnail rounded-circle mb-4"
                            loading="lazy" src="/assets/images/profile.jpg">
                        <h5 class="mb-0">Jansh Dickens</h5>
                        <p class="text-muted">Developer</p>

                        <ul class="list-inline d-flex justify-content-center align-items-center">
                            <li class="list-inline-item text-warning fs-19">
                                <i class="mdi mdi-star"></i>
                                <i class="mdi mdi-star"></i>
                                <i class="mdi mdi-star"></i>
                                <i class="mdi mdi-star"></i>
                                <i class="mdi mdi-star-half-full"></i>
                            </li>
                        </ul>

                        <ul class="candidate-detail-social-menu list-inline mb-0">
                            <li class="list-inline-item">
                                <a href="#" class="social-link rounded-3 btn-soft-primary"><i class="uil uil-facebook-f"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="social-link rounded-3 btn-soft-info"><i class="uil uil-twitter-alt"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="social-link rounded-3 btn-soft-success"><i class="uil uil-whatsapp"></i></a>
                            </li>
                            <li class="list-inline-item">
                                <a href="#" class="social-link rounded-3 btn-soft-danger"><i class="uil uil-phone-alt"></i></a>
                            </li>
                        </ul>
                    </div>

                    <div class="mt-4 border-bottom pb-4">
                        <h5 class="fs-17 fw-bold mb-3">Documents</h5>
                        <ul class="profile-document list-unstyled mb-0">
                                <div class="profile-document-list d-flex align-items-center mt-4">
                                    <div class="icon flex-shrink-0">
                                        <i class="uil uil-file"></i>
                                    </div>
                                    <div class="ms-3">
                                        <h6 class="fs-16 mb-0">Resume.pdf</h6>
                                        <p class="text-muted mb-0">1.25 MB</p>
                                    </div>
                                    <div class="ms-auto">
                                        <a id="downloadResume" href="#" class="fs-20 text-muted">
                                            <i class="uil uil-import"></i>
                                        </a>
                                    </div>
                                </div>
                        </ul>
                    </div>

                    <div class="mt-4">
                        <h5 class="fs-17 fw-bold mb-3">Contacts</h5>
                        <ul class="list-unstyled mb-0">
                            <li class="d-flex">
                                <label>Email</label>
                                <p class="text-muted ms-2 mb-0">Jansh@gmail.com</p>
                            </li>
                            <li class="d-flex">
                                <label>Phone Number</label>
                                <p class="text-muted ms-2 mb-0">+2 345 678 0000</p>
                            </li>
                            <li class="d-flex">
                                <label>Location</label>
                                <p class="text-muted ms-2 mb-0">New Caledonia</p>
                            </li>
                        </ul>
                    </div>

                </div>
            </div>
        </div>

        <!-- ================= RIGHT CONTENT ================= -->
        <div class="col-lg-8">

            <h5 class="fs-18 fw-bold">About</h5>
            <p class="text-muted mt-4">
                Developer with over 5 years' experience working in both the public and private sectors. Diplomatic,
                personable, and adept at managing sensitive situations. Highly organized, self-motivated, and proficient
                with computers. Looking to boost students’ satisfactions scores for <b>International University</b>.
                Bachelor's degree in communications.
            </p>
            <p class="text-muted">
                It describes the candidate's relevant experience, skills, and achievements. The purpose of this career
                summary is to explain your qualifications for the job in 3-5 sentences and convince the manager to read
                the whole resume document.
            </p>

            <div class="candidate-education-details mt-4">
                <h6 class="fs-18 fw-bold mb-0">Education</h6>

                <div class="candidate-education-content mt-4 d-flex">
                    <div class="circle flex-shrink-0 bg-soft-primary">B</div>
                    <div class="ms-4">
                        <h6 class="fs-16 mb-1">BCA - Bachelor of Computer Applications</h6>
                        <p class="mb-2 text-muted">International University - (2004 - 2010)</p>
                        <p class="text-muted">There are many variations of passages of available...</p>
                    </div>
                </div>

                <div class="candidate-education-content mt-3 d-flex">
                    <div class="circle flex-shrink-0 bg-soft-primary">M</div>
                    <div class="ms-4">
                        <h6 class="fs-16 mb-1">MCA - Master of Computer Application</h6>
                        <p class="mb-2 text-muted">International University - (2010 - 2012)</p>
                        <p class="text-muted">There are many variations of passages of available...</p>
                    </div>
                </div>

                <div class="candidate-education-content mt-3 d-flex">
                    <div class="circle flex-shrink-0 bg-soft-primary">D</div>
                    <div class="ms-4">
                        <h6 class="fs-16 mb-1">Design Communication Visual</h6>
                        <p class="text-muted mb-2">International University - (2012 - 2015)</p>
                        <p class="text-muted">There are many variations of passages of available...</p>
                    </div>
                </div>
            </div>

            <div class="candidate-education-details mt-4">
                <h6 class="fs-18 fw-bold mb-0">Experiences</h6>

                <div class="candidate-education-content mt-4 d-flex">
                    <div class="circle flex-shrink-0 bg-soft-primary">W</div>
                    <div class="ms-4">
                        <h6 class="fs-16 mb-1">Web Design & Development Team Leader</h6>
                        <p class="mb-2 text-muted">Creative Agency - (2013 - 2016)</p>
                        <p class="text-muted">There are many variations of passages of available...</p>
                    </div>
                </div>

                <div class="candidate-education-content mt-4 d-flex">
                    <div class="circle flex-shrink-0 bg-soft-primary">P</div>
                    <div class="ms-4">
                        <h6 class="fs-16 mb-1">Project Manager</h6>
                        <p class="mb-2 text-muted">InternNova Technology Pvt.Ltd - (Pressent)</p>
                        <p class="text-muted mb-0">There are many variations of passages of available...</p>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <h5 class="fs-18 fw-bold">Skills</h5>
                <span class="badge fs-13 bg-soft-blue mt-2">Cloud Management</span>
                <span class="badge fs-13 bg-soft-blue mt-2">Responsive Design</span>
                <span class="badge fs-13 bg-soft-blue mt-2">Network Architecture</span>
                <span class="badge fs-13 bg-soft-blue mt-2">PHP</span>
                <span class="badge fs-13 bg-soft-blue mt-2">Bootstrap</span>
                <span class="badge fs-13 bg-soft-blue mt-2">UI &amp; UX Designer</span>
            </div>

            <div class="mt-4">
                <h5 class="fs-18 fw-bold">Spoken languages</h5>
                <span class="badge fs-13 bg-soft-success mt-2">English</span>
                <span class="badge fs-13 bg-soft-success mt-2">German</span>
                <span class="badge fs-13 bg-soft-success mt-2">French</span>
            </div>

        </div>

    </div>
</div>

<div class="tab-pane fade" id="settings" role="tabpanel" aria-labelledby="settings-tab">
    <form action="#">

        <!-- ================= BASIC ACCOUNT ================= -->
        <div>
            <h5 class="fs-17 fw-semibold mb-3">My Account</h5>

            <div class="text-center mb-4">
                <img src="/assets/images/user/img-02.jpg"
                     class="rounded-circle img-thumbnail profile-img"
                     loading="lazy"
                     alt="">
                <div class="mt-2">
                    <input type="file" class="form-control form-control-sm">
                </div>
            </div>

            <div class="row">
                <div class="col-lg-6">
                    <label class="form-label">First Name</label>
                    <input class="form-control" type="text" value="Jansh">
                </div>

                <div class="col-lg-6">
                    <label class="form-label">Last Name</label>
                    <input class="form-control" type="text" value="Dickens">
                </div>

                <div class="col-lg-6 mt-3">
                    <label class="form-label">Designation</label>
                    <input class="form-control" type="text" value="Developer">
                </div>

                <div class="col-lg-6 mt-3">
                    <label class="form-label">Email</label>
                    <input class="form-control" type="email" value="Jansh@gmail.com">
                </div>

                <div class="col-lg-6 mt-3">
                    <label class="form-label">Phone Number</label>
                    <input class="form-control" type="text" value="+2 345 678 0000">
                </div>

                <div class="col-lg-6 mt-3">
                    <label class="form-label">Location</label>
                    <input class="form-control" type="text" value="New Caledonia">
                </div>
            </div>
        </div>

        <!-- ================= ABOUT ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">About</h5>
            <textarea class="form-control" rows="5">
Developer with over 5 years' experience working in both the public and private sectors.
            </textarea>
        </div>

        <!-- ================= EDUCATION ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Education</h5>

            <div class="mb-3">
                <input class="form-control mb-2" placeholder="Degree (e.g. BCA)">
                <input class="form-control mb-2" placeholder="University">
                <input class="form-control mb-2" placeholder="Duration (2004 - 2010)">
                <textarea class="form-control" rows="3" placeholder="Description"></textarea>
            </div>

            <button type="button" class="btn btn-sm btn-outline-primary">+ Add Education</button>
        </div>

        <!-- ================= EXPERIENCE ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Experience</h5>

            <div class="mb-3">
                <input class="form-control mb-2" placeholder="Job Title">
                <input class="form-control mb-2" placeholder="Company Name">
                <input class="form-control mb-2" placeholder="Duration">
                <textarea class="form-control" rows="3" placeholder="Role Description"></textarea>
            </div>

            <button type="button" class="btn btn-sm btn-outline-primary">+ Add Experience</button>
        </div>

        <!-- ================= SKILLS ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Skills</h5>
            <input class="form-control" placeholder="Cloud Management, PHP, Bootstrap">
        </div>

        <!-- ================= LANGUAGES ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Languages</h5>
            <input class="form-control" value="English, German, French">
        </div>

        <!-- ================= DOCUMENTS ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Documents</h5>

            <div class="mb-3">
                <label class="form-label">Upload Resume</label>
                <input type="file" class="form-control">
            </div>
        </div>

        <!-- ================= SOCIAL MEDIA ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Social Media</h5>

            <div class="row">
                <div class="col-lg-6">
                    <input class="form-control mb-2" placeholder="Facebook URL">
                </div>
                <div class="col-lg-6">
                    <input class="form-control mb-2" placeholder="Twitter URL">
                </div>
                <div class="col-lg-6">
                    <input class="form-control mb-2" placeholder="WhatsApp URL">
                </div>
                <div class="col-lg-6">
                    <input class="form-control mb-2" placeholder="Phone Call Link">
                </div>
            </div>
        </div>

        <!-- ================= CHANGE PASSWORD ================= -->
        <div class="mt-4">
            <h5 class="fs-17 fw-semibold mb-3">Change Password</h5>

            <input class="form-control mb-2" type="password" placeholder="Current Password">
            <input class="form-control mb-2" type="password" placeholder="New Password">
            <input class="form-control mb-2" type="password" placeholder="Confirm Password">

            <div class="form-check mt-2">
                <input class="form-check-input" type="checkbox">
                <label class="form-check-label">
                    Enable Two-Step Verification via email
                </label>
            </div>
        </div>

        <!-- ================= SAVE ================= -->
        <div class="mt-4 text-end">
            <button class="btn btn-primary">Update Profile</button>
        </div>

    </form>
</div>


</div>
</div>
</div>
</div>
                                
                            </div>
                            
                        </div>
                        
                    </section>
                    <!-- END PROFILE -->

                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        




`

    export default function CandidateProfile() {
    return <StaticMarkupPage slug="candidate-profile" />
    }
