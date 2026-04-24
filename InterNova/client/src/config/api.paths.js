export const API_PATHS = {
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    ME: "/auth/me",
    LOGOUT: "/auth/logout",
    REFRESH_TOKEN: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    OTP: {
      SEND: "/auth/otp/send",
      VERIFY: "/auth/otp/verify",
      RESEND: "/auth/otp/resend",
    },
  },

  JOBS: {
    LIST: "/jobs",
    DETAILS: (id) => `/jobs/${id}`,
    APPLY: (id) => `/jobs/${id}/apply`,
    BOOKMARKS: "/jobs/bookmarks",
  },

  COMPANIES: {
    LIST: "/companies",
    DETAILS: (id) => `/companies/${id}`,
  },

  CANDIDATES: {
    LIST: "/candidates",
    DETAILS: (id) => `/candidates/${id}`,
  },
};
