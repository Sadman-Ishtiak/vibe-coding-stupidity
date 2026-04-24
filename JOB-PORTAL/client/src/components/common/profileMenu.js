export const profileMenuMarkup = `
<ul class="header-menu list-inline d-flex align-items-center mb-0" id="profileMenu" style="display: none !important;">
    <li class="list-inline-item dropdown">
        <a href="javascript:void(0)" class="header-item" id="userdropdown" data-bs-toggle="dropdown"
            aria-expanded="false">
            <img src="assets/images/profile.jpg" alt="profile" width="35" height="35" class="rounded-circle me-1"> <span class="d-none d-md-inline-block fw-medium">Hi, User</span>
        </a>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userdropdown">
            <li><a class="dropdown-item" href="/manage-jobs">Manage Jobs</a></li>
            <li data-internnova-item="bookmark-jobs" style="display: none;"><a class="dropdown-item" href="/bookmark-jobs">Bookmarks Jobs</a></li>
            <li data-internnova-item="post-job" style="display: none;"><a class="dropdown-item" href="/manage-jobs-post">Post Job</a></li>
            <li><a class="dropdown-item" data-internnova-item="my-profile" href="/candidate-profile">My Profile</a></li>
            <li><a class="dropdown-item" href="/" data-internnova-action="signout">Logout</a></li>
        </ul>
    </li>
</ul>
`;
