import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div>

            
            <div class="main-content">

                <div class="page-content">

                    <!-- START ERROR -->
                    <section class="bg-error bg-auth text-dark">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-lg-6">
                                    <div class="text-center">
                                        <img src="assets/images/404.png" alt="" class="img-fluid">
                                        <div class="mt-5">
<h4 class="text-uppercase mt-3">Sorry, page not found</h4>
                                            <p class="text-muted">It will be as simple as Occidental in fact, it will be Occidental</p>
                                            <div class="mt-4">
                                                <a class="btn btn-primary waves-effect waves-light" href="index.html"><i class="mdi mdi-home"></i> Back to Home</a>
                                            </div>
                                        </div>
                                    </div>
                                </div><!--end col-->
                            </div><!--end row-->
                        </div><!--end container-->
                    </section>
                    <!-- END ERROR -->
                    
                </div>
</div>
</div>
        <!-- END layout-wrapper -->
        
        
<button onclick="topFunction()" id="back-to-top">
            <i class="mdi mdi-arrow-up"></i>
        </button>


`

    export default function NotFound() {
    return <StaticMarkupPage slug="404-error" />
    }
