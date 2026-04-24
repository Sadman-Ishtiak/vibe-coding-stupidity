export const API_PATHS = {
  AUTH: {
    SIGN_IN: '/auth/sign-in',
    SIGN_UP: '/auth/sign-up',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    ME: '/auth/me',
    SIGN_OUT: '/auth/sign-out',
  },
  JOBS: {
    LIST: '/jobs',
    DETAILS: (id) => `/jobs/${id}`,
    APPLY: (id) => `/jobs/${id}/apply`,
    BOOKMARKS: '/jobs/bookmarks',
  },
  COMPANIES: {
    LIST: '/companies',
    DETAILS: (id) => `/companies/${id}`,
  },
  CANDIDATES: {
    LIST: '/candidates',
    DETAILS: (id) => `/candidates/${id}`,
  },
}
