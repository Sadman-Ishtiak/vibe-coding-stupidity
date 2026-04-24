import { authMenuMarkup } from './authMenu.js';
import { profileMenuMarkup } from './profileMenu.js';

export const navbarMarkup = `
<nav class="navbar navbar-expand-lg fixed-top sticky" id="navbar">
                <div class="container-fluid custom-container">
                    <a class="navbar-brand text-dark fw-bold me-auto brand-logo-link" href="/" data-discover="true">
                        <span class="brand-logo-text">InternNova</span>
                    </a>
                    <div>
                        <button class="navbar-toggler me-3" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarCollapse" aria-controls="navbarCollapse" aria-label="Toggle navigation">
                            <i class="mdi mdi-menu"></i>
                        </button>
                    </div>
                    <div class="collapse navbar-collapse" id="navbarCollapse">
                        <ul class="navbar-nav mx-auto navbar-center">
                            <li class="nav-item">
                                <a class="nav-link" href="index.html">Home</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/job-list" id="jobsdropdown">Job</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/candidate-list" id="candidatedropdown">Candidates</a>
                            </li>

                            <li class="nav-item">
                                <a class="nav-link" href="/company-list" id="companydropdown">Company</a>
                            </li>
                        </ul>
</div>
                    <!--end navabar-collapse-->

                    ${authMenuMarkup}
                    ${profileMenuMarkup}
</div>
                <!--end container-->
            </nav>
`
