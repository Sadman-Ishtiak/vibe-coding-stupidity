import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `

                    <!-- START JOB-LIST -->
                    <section class="section">
                        <div class="container">
                            <div class="d-flex justify-content-start mb-2">
                                <div class="btn-group" role="group" aria-label="Job view">
                                    <a href="job-list.html" class="btn btn-outline-primary btn-sm" aria-label="Job list view">
                                        <i class="mdi mdi-format-list-bulleted"></i>
                                    </a>
                                    <a href="job-grid.html" class="btn btn-primary btn-sm" aria-label="Job grid view">
                                        <i class="mdi mdi-view-grid-outline"></i>
                                    </a>
                                </div>
                            </div>
                            <form action="#">
                                <div class="row g-2">
                                    <div class="col-lg-3 col-md-6">
                                        <div class="filler-job-form">
                                            <i class="uil uil-briefcase-alt"></i>
                                            <input type="search" class="form-control filter-job-input-box" id="exampleFormControlInput1" placeholder="Job, Company name... ">
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
                            <div class="row mt-4">
                                <div class="col-lg-12">
                                    <h6 class="fs-16 mb-3">Your Selected</h6>
                                    <div class="selecte-tag position-relative">
                                        <input type="text" id="choices-text-remove-button" value="design, marketing">
                                    </div>
                                </div><!--end col-->
                                <div class="col-lg-12">
                                    <div class="mt-4">
                                        <h6 class="fs-16">Showing all results</h6>
                                    </div>
                                </div><!--end col-->
                            </div><!--end row-->

                            <div class="row mt-4">
                                <job-grid-card></job-grid-card>
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
                                            <li class="page-item"><a class="page-link" href="javascript:void(0)">1</a></li>
                                            <li class="page-item active"><a class="page-link" href="javascript:void(0)">2</a></li>
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

    export default function JobGrid() {
    return <StaticMarkupPage slug="job-grid" />
    }
