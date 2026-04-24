import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div class="main-content">

                <div class="page-content">
<section class="page-title-box">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="text-center text-white">
                                        <h3 class="mb-4">Job List</h3>
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


                    <!-- START JOB-LIST -->
                    <section class="section">
                        <div class="container">
                            <div class="row">
                                <div class="col-lg-9">
                                    <div class="me-lg-0">
                                        <div class="job-list-header">
                                            <div class="d-flex justify-content-start mb-2">
                                                <div class="btn-group" role="group" aria-label="Job view">
                                                    <a href="job-list.html" class="btn btn-primary btn-sm" aria-label="Job list view">
                                                        <i class="mdi mdi-format-list-bulleted"></i>
                                                    </a>
                                                    <a href="job-grid.html" class="btn btn-outline-primary btn-sm" aria-label="Job grid view">
                                                        <i class="mdi mdi-view-grid-outline"></i>
                                                    </a>
                                                </div>
                                            </div>
                                            <form action="#">
                                                <div class="row g-2">
                                                    <div class="col-lg-3 col-md-6">
                                                        <div class="filler-job-form">
                                                            <i class="uil uil-briefcase-alt"></i>
                                                            <input type="search" class="form-control filter-job-input-box" id="exampleFormControlInput1" placeholder="Job, company... ">
                                                        </div>
                                                    </div><!--end col-->
                                                    <div class="col-lg-3 col-md-6">
                                                        <div class="filler-job-form">
                                                            <i class="uil uil-location-point"></i>
                                                            <select class="form-select" data-trigger name="choices-single-location" id="choices-single-location" aria-label="Default select example">
                                                                <option value="" selected>Select District</option>
                                                            </select>
                                                        </div>
                                                    </div><!--end col-->
                                                    <div class="col-lg-3 col-md-6">
                                                        <div class="filler-job-form">
                                                            <i class="uil uil-clipboard-notes"></i>
                                                            <select class="form-select " data-trigger name="choices-single-categories" id="choices-single-categories" aria-label="Default select example">
                                                                <option value="4">Accounting</option>
                                                                <option value="1">IT & Software</option>
                                                                <option value="3">Marketing</option>
                                                                <option value="5">Banking</option>
                                                            </select>
                                                        </div>
                                                    </div><!--end col-->
                                                    <div class="col-lg-3 col-md-6">
                                                        <a href="javascript:void(0)" class="btn btn-primary w-100"><i class="uil uil-filter"></i> Fliter</a>
                                                    </div><!--end col-->
                                                </div><!--end row-->
                                            </form>
                                        </div>
<div class="wedget-popular-title mt-4">
                                            <h6>Popular</h6>
                                            <ul class="list-inline">
                                                <li class="list-inline-item">
                                                    <div class="popular-box d-flex align-items-center">
                                                        <div class="number flex-shrink-0 me-2">
                                                            20  
                                                        </div>
                                                        <a href="javascript:void(0)" class="primary-link stretched-link"><h6 class="fs-14 mb-0">UI/UX designer</h6></a>
                                                    </div>
                                                </li>
                                                <li class="list-inline-item">
                                                    <div class="popular-box d-flex align-items-center">
                                                        <div class="number flex-shrink-0 me-2">
                                                            18  
                                                        </div>
                                                        <a href="javascript:void(0)" class="primary-link stretched-link"><h6 class="fs-14 mb-0">HR manager</h6></a>
                                                    </div>
                                                </li>
                                                <li class="list-inline-item">
                                                    <div class="popular-box d-flex align-items-center">
                                                        <div class="number flex-shrink-0 me-2">
                                                            10  
                                                        </div>
                                                        <a href="javascript:void(0)" class="primary-link stretched-link"><h6 class="fs-14 mb-0">Product manager</h6></a>
                                                    </div>
                                                </li>
                                                <li class="list-inline-item">
                                                    <div class="popular-box d-flex align-items-center">
                                                        <div class="number flex-shrink-0 me-2">
                                                            15  
                                                        </div>
                                                        <a href="javascript:void(0)" class="primary-link stretched-link"><h6 class="fs-14 mb-0">Sales manager</h6></a>
                                                    </div>
                                                </li>
                                                <li class="list-inline-item">
                                                    <div class="popular-box d-flex align-items-center">
                                                        <div class="number flex-shrink-0 me-2">
                                                            28  
                                                        </div>
                                                        <a href="javascript:void(0)" class="primary-link stretched-link"><h6 class="fs-14 mb-0">Developer</h6></a>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>

<div>
                                            <job-list-card></job-list-card>
                                        </div>
<div class="row">
                                            <div class="col-lg-12 mt-4 pt-2">
                                                <nav aria-label="Page navigation example">
                                                    <ul class="pagination job-pagination mb-0 justify-content-center">
                                                        <li class="page-item disabled">
                                                            <a class="page-link" href="javascript:void(0)" tabindex="-1">
                                                                <i class="mdi mdi-chevron-double-left fs-15"></i>
                                                            </a>
                                                        </li>
                                                        <li class="page-item active"><a class="page-link" href="javascript:void(0)">1</a></li>
                                                        <li class="page-item"><a class="page-link" href="javascript:void(0)">2</a></li>
                                                        <li class="page-item"><a class="page-link" href="javascript:void(0)">3</a></li>
                                                        <li class="page-item"><a class="page-link" href="javascript:void(0)">4</a></li>
                                                        <li class="page-item">
                                                            <a class="page-link" href="javascript:void(0)">
                                                                <i class="mdi mdi-chevron-double-right fs-15"></i>
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </nav>
                                            </div><!--end col-->
                                        </div><!-- end row -->
                                    </div>
                                </div><!--end col-->
                                
                                <!-- START SIDE-BAR -->
                                <div class="col-lg-3">
                                    <div class="side-bar mt-5 mt-lg-0">
                                        <div class="accordion" id="accordionExample">
                                            <div class="accordion-item mt-4">   
                                            <h2 class="accordion-header" id="experienceOne">
                                                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#experience" aria-expanded="true" aria-controls="experience">
                                                    Work experience
                                                </button>
                                            </h2>
                                            <div id="experience" class="accordion-collapse collapse show" aria-labelledby="experienceOne">
                                                <div class="accordion-body">
                                                    <div class="side-title">
                                                        <div class="form-check mt-2">
                                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked1" />
                                                            <label class="form-check-label ms-2 text-muted" for="flexCheckChecked1">No experience</label>
                                                        </div>
                                                        <div class="form-check mt-2">
                                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked2" checked />
                                                            <label class="form-check-label ms-2 text-muted" for="flexCheckChecked2">0-3 years</label>
                                                        </div>
                                                        <div class="form-check mt-2">
                                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked3" />
                                                            <label class="form-check-label ms-2 text-muted" for="flexCheckChecked3">3-6 years</label>
                                                        </div>
                                                        <div class="form-check mt-2">
                                                            <input class="form-check-input" type="checkbox" value="" id="flexCheckChecked4" />
                                                            <label class="form-check-label ms-2 text-muted" for="flexCheckChecked4">More than 6 years</label>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            </div>
<div class="accordion-item mt-3">
                                                <h2 class="accordion-header" id="jobType">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#jobtype" aria-expanded="false" aria-controls="jobtype">
                                                        Type of employment
                                                    </button>
                                                </h2>
                                                <div id="jobtype" class="accordion-collapse collapse show" aria-labelledby="jobType">
                                                    <div class="accordion-body">
                                                        <div class="side-title">
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault6" checked>
                                                                <label class="form-check-label ms-2 text-muted" for="flexRadioDefault6">
                                                                    Freelance
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault2">
                                                                <label class="form-check-label ms-2 text-muted" for="flexRadioDefault2">
                                                                    Full Time
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault3">
                                                                <label class="form-check-label ms-2 text-muted" for="flexRadioDefault3">
                                                                    Internship
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="radio" name="flexRadioDefault" id="flexRadioDefault4">
                                                                <label class="form-check-label ms-2 text-muted" for="flexRadioDefault4">
                                                                    Part Time
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
<div class="accordion-item mt-3">
                                                <h2 class="accordion-header" id="datePosted">
                                                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#dateposted" aria-expanded="false" aria-controls="dateposted">
                                                        Date Posted
                                                    </button>
                                                </h2>
                                                <div id="dateposted" class="accordion-collapse collapse show" aria-labelledby="datePosted">
                                                    <div class="accordion-body">
                                                        <div class="side-title form-check-all">
                                                            <div class="form-check">
                                                                <input class="form-check-input" type="checkbox" id="checkAll" value="" />
                                                                <label class="form-check-label ms-2 text-muted" for="checkAll">
                                                                    All
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="checkbox"  name="datePosted"  value="last" id="flexCheckChecked5" checked />
                                                                <label class="form-check-label ms-2 text-muted" for="flexCheckChecked5">
                                                                    Last Hour
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="checkbox" name="datePosted" value="last" id="flexCheckChecked6" />
                                                                <label class="form-check-label ms-2 text-muted" for="flexCheckChecked6">
                                                                    Last 24 hours
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="checkbox" name="datePosted" value="last" id="flexCheckChecked7" />
                                                                <label class="form-check-label ms-2 text-muted" for="flexCheckChecked7">
                                                                    Last 7 days
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="checkbox" name="datePosted" value="last" id="flexCheckChecked8" />
                                                                <label class="form-check-label ms-2 text-muted" for="flexCheckChecked8">
                                                                    Last 14 days
                                                                </label>
                                                            </div>
                                                            <div class="form-check mt-2">
                                                                <input class="form-check-input" type="checkbox" name="datePosted" value="last" id="flexCheckChecked9" />
                                                                <label class="form-check-label ms-2 text-muted" for="flexCheckChecked9">
                                                                    Last 30 days
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
</div>
</div>
</div><!--end col-->
                                <!-- END SIDE-BAR -->
                            </div><!--end row-->
                        </div><!--end container-->
                    </section>
                    <!-- END JOB-LIST -->

                    <!-- START APPLY MODAL -->
                    <div class="modal fade" id="applyNow" tabindex="-1" aria-labelledby="applyNow" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered">
                            <div class="modal-content">
                                <div class="modal-body p-5">
                                    <div class="text-center mb-4">
                                        <h5 class="modal-title" id="staticBackdropLabel">Apply For This Job</h5>
                                    </div>
                                    <div class="position-absolute end-0 top-0 p-3">
                                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div class="mb-3">
                                        <label for="nameControlInput" class="form-label">Name</label>
                                        <input type="text" class="form-control" id="nameControlInput" placeholder="Enter your name">
                                    </div>
                                    <div class="mb-3">
                                        <label for="emailControlInput2" class="form-label">Email Address</label>
                                        <input type="email" class="form-control" id="emailControlInput2" placeholder="Enter your email">
                                    </div>
                                    <div class="mb-3">
                                        <label for="messageControlTextarea" class="form-label">Message</label>
                                        <textarea class="form-control" id="messageControlTextarea" rows="4" placeholder="Enter your message"></textarea>
                                    </div>
                                    <button type="submit" class="btn btn-primary w-100">Send Application</button>
                                </div>
                            </div>
                        </div>
                    </div><!-- END APPLY MODAL -->

                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        





`

    export default function JobList() {
    return <StaticMarkupPage slug="job-list" />
    }
