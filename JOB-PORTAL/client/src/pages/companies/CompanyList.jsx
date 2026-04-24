import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `

            <div class="main-content">

                <div class="page-content">
<section class="page-title-box">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-md-6">
                                    <div class="text-center text-white">
                                        <h3 class="mb-4">Company List</h3>
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



                    <!-- START COMPANY-LIST -->
                    <section class="section">
                        <div class="container">
                            <div class="row align-items-center mb-4">
                                <div class="col-lg-8">
                                    <div class="mb-3 mb-lg-0">
                                        <h6 class="fs-16 mb-0"> Showing 1 – 8 of 11 results </h6>
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
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->    
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
                                </div><!--end col-->
                                <div class="col-lg-4 col-md-6">
                                    <company-card></company-card>
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
                    <!-- END COMPANY-LIST -->

                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        



`

    export default function CompanyList() {
    return <StaticMarkupPage slug="company-list" />
    }
