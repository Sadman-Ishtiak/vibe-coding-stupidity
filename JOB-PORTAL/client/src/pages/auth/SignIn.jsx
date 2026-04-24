import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div>

            
            <div class="main-content">

                <div class="page-content">

                    <!-- START SIGN-IN -->
                    <section class="bg-auth">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-xl-10 col-lg-12">
                                    <div class="card auth-box">
                                        <div class="row g-0">
                                            <div class="col-lg-6 text-center">
                                                <div class="card-body p-4">
                                                    <a href="/" data-discover="true" class="brand-logo-link">
                                                        <span class="brand-logo-text">INTERNNOVA</span>
                                                    </a>
                                                    <div class="mt-5">
                                                        <img src="assets/images/auth/sign-in.png" alt="" class="img-fluid">
                                                    </div>
                                                </div>
                                            </div><!--end col-->
                                            <div class="col-lg-6">
                                                <div class="auth-content card-body p-5 h-100 text-white">
                                                    <div class="w-100">
                                                        <div class="text-center mb-4">
                                                            <h5>Welcome Back !</h5>
                                                            <p class="text-white-70">Sign in to continue to InternNova.</p>
                                                        </div>
                                                        <form action="index.html" class="auth-form">
                                                            <div class="mb-3">
                                                                <label for="usernameInput" class="form-label">Username or Email</label>
                                                                <input type="text" class="form-control" id="usernameInput" placeholder="Enter your username or email" required>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="passwordInput" class="form-label">Password</label>
                                                                <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password" required>
                                                            </div>
                                                            <div class="mb-4">
                                                                <div class="form-check"><input class="form-check-input" type="checkbox" id="flexCheckDefault">
                                                                    <a href="reset-password.html" class="float-end text-white">Forgot Password?</a>
                                                                    <label class="form-check-label" for="flexCheckDefault">Remember me</label>
                                                                </div>
                                                            </div>
                                                            <div class="text-center">
                                                                <button type="submit" class="btn btn-white btn-hover w-100">Sign In</button>
                                                            </div>
                                                        </form>
                                                        <div class="mt-4 text-center">
                                                            <p class="mb-0">Don't have an account ? <a href="sign-up.html" class="fw-medium text-white text-decoration-underline"> Sign Up </a></p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div><!--end col-->
                                        </div><!--end row-->
                                    </div>
</div><!--end col-->
                            </div><!--end row-->
                        </div><!--end container-->
                    </section>
                    <!-- END SIGN-IN -->
                    
                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        
<button onclick="topFunction()" id="back-to-top">
            <i class="mdi mdi-arrow-up"></i>
        </button>


`

export default function SignIn() {
  return <StaticMarkupPage slug="sign-in" />
}
