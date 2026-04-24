export const STATIC_PAGE_SLUGS = [
  "404-error",
  "bookmark-jobs",
  "applied-jobs",
  "candidate-details",
  "candidate-grid",
  "candidate-list",
  "candidate-profile",
  "coming-soon",
  "company-details",
  "company-list",
  "contact",
  "faqs",
  "index",
  "job-categories",
  "job-details",
  "job-grid",
  "job-list",
  "manage-jobs",
  "manage-jobs-post",
  "applicant-management",
  "company-profile",
  "admin-dashboard",
  "admin-jobs",
  "admin-candidates",
  "admin-applications",
  "admin-profile",
  "admin-settings",
  "admin-cms",
  "admin-employers",
  "pricing",
  "privacy-policy",
  "reset-password",
  "services",
  "sign-in",
  "sign-up",
  "starter-page"
];

const WRAPPER_MARKUP_MODULE_BY_SLUG = {
  // Auth
  'sign-in': '../auth/SignIn.jsx',
  'sign-up': '../auth/SignUp.jsx',
  'reset-password': '../auth/ResetPassword.jsx',

  // Candidates
  'candidate-list': '../candidates/CandidateList.jsx',
  'candidate-grid': '../candidates/CandidateGrid.jsx',
  'candidate-details': '../candidates/CandidateDetails.jsx',
  'candidate-profile': '../candidates/CandidateProfile.jsx',
  'applied-jobs': '../candidates/AppliedJobs.jsx',
  'bookmark-jobs': '../candidates/BookmarkJobs.jsx',

  // Jobs
  'job-list': '../jobs/JobList.jsx',
  'job-grid': '../jobs/JobGrid.jsx',
  'job-details': '../jobs/JobDetails.jsx',
  'manage-jobs': '../companies/ManageJobs.jsx',
  'manage-jobs-post': '../companies/PostJob.jsx',
  'applicant-management': '../companies/ManageApplicants.jsx',

  // Companies
  'company-list': '../companies/CompanyList.jsx',
  'company-details': '../companies/CompanyDetails.jsx',

  // Static
  index: './Home.jsx',
  contact: './Contact.jsx',
  faqs: './FAQ.jsx',
  'privacy-policy': './PrivacyPolicy.jsx',
  services: './Services.jsx',
  'starter-page': './StarterPage.jsx',
  '404-error': './NotFound.jsx',
}

const pageModules = import.meta.glob([
  './*.jsx',
  '!./StaticMarkupPage.jsx',
  './markup/*.jsx',
  '../auth/*.jsx',
  '../auth/markup/*.jsx',
  '!../auth/markup/sign-out.jsx',
  '../jobs/*.jsx',
  '../jobs/markup/*.jsx',
  '../candidates/*.jsx',
  '../candidates/markup/*.jsx',
  '../admin/*.jsx',
  '../admin/markup/*.jsx',
  '../companies/*.jsx',
  '../companies/markup/*.jsx',
  '../profile/*.jsx',
  '../profile/markup/*.jsx',
]);

function candidateKeysForSlug(slug) {
  // Keep routing stable; only change where the markup files live.
  const isAuth = slug === 'sign-in' || slug === 'sign-up' || slug === 'reset-password'
  const isJob = slug.startsWith('job-') || slug === 'manage-jobs' || slug === 'manage-jobs-post' || slug === 'bookmark-jobs'
  const isCandidate = slug.startsWith('candidate-')
  const isCompany = slug.startsWith('company-')
  const isAdmin = slug.startsWith('admin-')

  const wrapperKey = WRAPPER_MARKUP_MODULE_BY_SLUG[slug]
  if (wrapperKey) {
    return [wrapperKey, `./markup/${slug}.jsx`]
  }

  if (isAuth) return [`../auth/markup/${slug}.jsx`, './markup/' + slug + '.jsx']
  if (isJob) return [`../jobs/markup/${slug}.jsx`, './markup/' + slug + '.jsx']
  if (isCandidate) return [`../candidates/markup/${slug}.jsx`, './markup/' + slug + '.jsx']
  if (isCompany) {
    const toPascal = (s) => s.split(/[-_]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    const pascal = toPascal(slug)
    return [`../companies/${slug}.jsx`, `../companies/${pascal}.jsx`, `../companies/markup/${slug}.jsx`, './markup/' + slug + '.jsx']
  }

  if (isAdmin) {
    const toPascal = (s) => s.split(/[-_]/).map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
    const pascal = toPascal(slug)
    return [`../admin/${slug}.jsx`, `../admin/${pascal}.jsx`, `../admin/markup/${slug}.jsx`, './markup/' + slug + '.jsx']
  }

  // Default: static pages
  return [`./markup/${slug}.jsx`]
}

export async function loadStaticPageMarkup(slug) {
  if (!slug) return null;
  const keys = candidateKeysForSlug(slug)
  const loader = keys.map((k) => pageModules[k]).find(Boolean)
  if (!loader) return null;
  const mod = await loader();
  return mod.markup || null;
}
