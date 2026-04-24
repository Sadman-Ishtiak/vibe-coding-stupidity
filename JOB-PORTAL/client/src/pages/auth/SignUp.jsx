import StaticMarkupPage from '@/pages/static/StaticMarkupPage'

export const markup = `
<div>

            
            <div class="main-content">

                <div class="page-content">

                    <!-- START SIGN-UP -->
                    <section class="bg-auth">
                        <div class="container">
                            <div class="row justify-content-center">
                                <div class="col-xl-10 col-lg-12">
                                    <div class="card auth-box">
                                        <div class="row align-items-center">
                                            <div class="col-lg-6 text-center">
                                                <div class="card-body p-4">
                                                    <a href="/" data-discover="true" class="brand-logo-link">
                                                        <span class="brand-logo-text">InternNova</span>
                                                    </a>
                                                    <div class="mt-5">
                                                        <img src="assets/images/auth/sign-up.png" alt="" class="img-fluid">
                                                    </div>
                                                </div>
                                            </div><!--end col-->
                                            <div class="col-lg-6">
                                                <div class="auth-content card-body p-5 text-white">
                                                    <div class="w-100">
                                                        <div class="text-center">
                                                            <h5>Let's Get Started</h5>
                                                            <p class="text-white-70">Sign Up and get access to all the features of InternNova</p>
                                                        </div>
                                                        <form action="index.html" class="auth-form">
                                                            <div class="mb-3">
                                                                <label for="usernameInput" class="form-label">Username</label>
                                                                <input type="text" class="form-control" required id="usernameInput" placeholder="Enter your username">
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="passwordInput" class="form-label">Email</label>
                                                                <input type="email" class="form-control" required id="emailInput" placeholder="Enter your email">
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="emailInput" class="form-label">Password</label>
                                                                <input type="password" class="form-control" id="passwordInput" placeholder="Enter your password">
                                                            </div>
                                                            <div class="mb-3">
                                                                <label for="profilePictureInput" class="form-label">Profile Picture</label>
                                                                <input type="file" class="form-control" id="profilePictureInput" accept="image/*">
                                                                <small class="form-text text-white-70">Upload a profile picture (optional)</small>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label d-block">Create account as</label>
                                                                <div class="form-check form-check-inline">
                                                                    <input class="form-check-input" type="radio" name="accountType" id="accountTypeCandidate" value="candidate" checked>
                                                                    <label class="form-check-label" for="accountTypeCandidate">Candidate</label>
                                                                </div>
                                                                <div class="form-check form-check-inline">
                                                                    <input class="form-check-input" type="radio" name="accountType" id="accountTypeRecruiter" value="recruiter">
                                                                    <label class="form-check-label" for="accountTypeRecruiter">Company/Recruiter</label>
                                                                </div>
                                                            </div>
                                                            <div class="mb-4">
                                                                <div class="form-check"><input class="form-check-input" type="checkbox" id="flexCheckDefault">
                                                                    <label class="form-check-label" for="flexCheckDefault">I agree to the <a href="javascript:void(0)" class="text-white text-decoration-underline">Terms and conditions</a></label>
                                                                </div>
                                                            </div>
                                                            <div class="text-center">
                                                                <button type="submit" class="btn btn-white btn-hover w-100">Sign Up</button>
                                                            </div>
                                                        </form>
                                                        <div class="mt-3 text-center">
                                                            <p class="mb-0">Already a member ? <a href="sign-in.html" class="fw-medium text-white text-decoration-underline"> Sign In </a></p>
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
                    <!-- END SIGN-UP -->
                    
                </div>
</div>
</div>
        <!-- END layout-wrapper -->

        
<button onclick="topFunction()" id="back-to-top">
            <i class="mdi mdi-arrow-up"></i>
        </button>


`

    export default function SignUp() {
            return <StaticMarkupPage slug="sign-up" />
    }
