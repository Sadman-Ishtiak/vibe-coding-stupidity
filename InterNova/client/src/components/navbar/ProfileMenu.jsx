import { Link } from "react-router-dom";
import { getProfileImageUrl, createImageErrorHandler } from "@/utils/imageHelpers";

export default function ProfileMenu({ user, onLogout }) {
  if (!user) return null;

  const isRecruiter = user.role === "recruiter";
  const isCandidate = user.role === "candidate";
  
  // Normalize profile image URL with fallback
  const profileImageUrl = getProfileImageUrl(user.profilePicture);

  return (
    <ul
      className="header-menu list-inline d-flex align-items-center mb-0"
      id="profileMenu"
    >
      <li className="list-inline-item dropdown">
        <a
          href="#"
          className="header-item"
          id="userdropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={profileImageUrl}
            alt="profile"
            width="33"
            height="33"
            className="rounded-circle me-1"
            onError={createImageErrorHandler("/assets/images/profile.jpg")}
          />
          <span className="d-none d-md-inline-block fw-medium">
            Hi, {user.username}
          </span>
        </a>

        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="userdropdown"
        >
          {/* -------- Candidate Menu -------- */}
          {isCandidate && (
            <>
              <li>
                <Link className="dropdown-item" to="/bookmark-jobs">
                  Bookmark Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/applied-jobs">
                  Applied Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/candidate-profile">
                  My Profile
                </Link>
              </li>
            </>
          )}

          {/* -------- Recruiter / Company Menu -------- */}
          {isRecruiter && (
            <>
              <li>
                <Link className="dropdown-item" to="/manage-jobs">
                  Manage Jobs
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/manage-jobs-post">
                  Post Job
                </Link>
              </li>
              <li>
                <Link className="dropdown-item" to="/recruiter-profile">
                  Profile
                </Link>
              </li>
            </>
          )}

          {/* -------- Logout (Common) -------- */}
          <li>
            <button
              className="dropdown-item text-danger"
              onClick={onLogout}
            >
              Log Out
            </button>
          </li>
        </ul>
      </li>
    </ul>
  );
}
