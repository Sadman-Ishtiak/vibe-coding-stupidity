import axios from "axios";
import { getAccessToken, setAccessToken, clearAuth, getRefreshToken, setRefreshToken } from "@/services/auth.session";
import { authLog } from "@/utils/authLogger";

// ✅ Event system for logout notification
const AUTH_LOGOUT_EVENT = 'auth:logout';

export const triggerLogout = () => {
  window.dispatchEvent(new CustomEvent(AUTH_LOGOUT_EVENT));
};

export const onLogout = (callback) => {
  window.addEventListener(AUTH_LOGOUT_EVENT, callback);
  return () => window.removeEventListener(AUTH_LOGOUT_EVENT, callback);
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

// Request interceptor to attach access token
api.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for silent token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is not 401 or request already retried, reject
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If token refresh is already in progress, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Get refresh token from localStorage as fallback
      const refreshToken = getRefreshToken();
      
      // Attempt to refresh the token (send in body + cookies)
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/auth/refresh-token`,
        { refreshToken }, // Send in body as fallback
        { withCredentials: true } // Also send cookies
      );

      if (response.data?.success && response.data?.accessToken) {
        const newAccessToken = response.data.accessToken;
        const newRefreshToken = response.data.refreshToken;
        
        setAccessToken(newAccessToken);
        if (newRefreshToken) {
          setRefreshToken(newRefreshToken);
        }
        authLog.tokenRefreshSuccess();
        
        // Update Authorization header
        api.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        
        processQueue(null, newAccessToken);
        
        return api(originalRequest);
      } else {
        throw new Error('Token refresh failed');
      }
    } catch (refreshError) {
      authLog.tokenRefreshFailed(refreshError);
      processQueue(refreshError, null);
      clearAuth();
      authLog.sessionCleared('Token refresh failed');
      
      // ✅ Trigger logout event for AuthContext to handle
      triggerLogout();
      authLog.autoLogout('Token refresh failed - redirecting to login');
      
      // Redirect to login if not already there
      if (window.location.pathname !== '/sign-in') {
        window.location.href = '/sign-in';
      }
      
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
