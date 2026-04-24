import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `

            <div class="main-content">

                <div class="page-content">
<section class="page-title-box">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="text-center text-white">
                                        <h3 class="mb-4">Candidate List</h3>
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
                            <div class="row justify-content-center">
                                <div class="col-lg-12">
                                    <div class="candidate-list-widgets mb-4">
                                        <form action="#">
                                            <div class="row g-2">
                                                <div class="col-lg-3">
                                                    <div class="filler-job-form">
                                                        <i class="uil uil-briefcase-alt"></i>
                                                        <input type="search" class="form-control filter-job-input-box" id="exampleFormControlInput1" placeholder="Job, Company name... ">
                                                    </div>
                                                </div><!--end col-->
                                                <div class="col-lg-3">
                                                    <div class="filler-job-form">
                                                        <i class="uil uil-location-point"></i>
                                                        <select class="form-select" data-trigger name="choices-single-location" id="choices-single-location" aria-label="Default select example">
                                                            <option value="" selected>Select District</option>
                                                        </select>
                                                    </div>
                                                </div><!--end col-->
                                                <div class="col-lg-3">
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
                                                <div class="col-lg-3">
                                                    <div>
                                                        <a href="javascript:void(0)" class="btn btn-primary"><i class="uil uil-filter"></i> Filter</a>
                                                    </div>
                                                </div>
                                            </div><!--end row-->
                                        </form>
</div>
                                </div><!--end col-->
                            </div><!--end row-->

                            <div class="row align-items-center">
                                <div class="col-lg-8">
                                    <div class="mb-3 mb-lg-0">
                                        <div class="d-flex align-items-center">
                                            <div class="btn-group me-3" role="group" aria-label="Candidate view">
                                                <a href="candidate-list.html" class="btn btn-primary btn-sm" aria-label="Candidate list view">
                                                    <i class="mdi mdi-format-list-bulleted"></i>
                                                </a>
                                                <a href="candidate-grid.html" class="btn btn-outline-primary btn-sm" aria-label="Candidate grid view">
                                                    <i class="mdi mdi-view-grid-outline"></i>
                                                </a>
                                            </div>
                                        <h6 class="fs-16 mb-0"> Showing 1 – 8 of 11 results </h6>
                                        </div>
                                    </div>
                                </div><!--end col-->

                                <div class="col-lg-4">
                                    <div class="candidate-list-widgets">
                                        <div class="row">
                                            <div class="col-lg-6">
                                                <div class="selection-widget">
                                                    <select class="form-select" data-trigger name="choices-single-filter-orderby" id="choices-single-filter-orderby" aria-label="Default select example">
                                                        <option value="df">Default</option>
                                                        <option value="ne">Newest</option>
                                                        <option value="od">Oldest</option>
                                                        <option value="rd">Random</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div class="col-lg-6">
                                                <div class="selection-widget mt-2 mt-lg-0">
                                                    <select class="form-select" data-trigger name="choices-candidate-page" id="choices-candidate-page" aria-label="Default select example">
                                                        <option value="df">All</option>
                                                        <option value="ne">8 per Page</option>
                                                        <option value="ne">12 per Page</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
</div><!--end col-->
                            </div><!--end row-->

                            <div class="row">
                                <div class="col-lg-12">
                                    <div class="candidate-list">
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                        <candidate-list-card></candidate-list-card>
                                    </div>
</div><!--end col-->
                            </div><!--end row-->

                            <div class="row">
                                <div class="col-lg-12 mt-5">
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

                        </div><!--end container-->
                    </section>
                    <!-- END JOB-LIST -->

                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        





`

    export default function CandidateList() {
    return <StaticMarkupPage slug="candidate-list" />
    }
