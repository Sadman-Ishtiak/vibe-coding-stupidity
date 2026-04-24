/**
 * Authentication Debug Logger
 * Safe, environment-aware logging for auth events
 * Prevents sensitive data exposure in production
 */

const IS_DEV = import.meta.env.DEV;
const LOG_PREFIX = '[AUTH]';

// Sensitive keys to redact
const SENSITIVE_KEYS = ['password', 'token', 'accessToken', 'refreshToken', 'secret'];

/**
 * Redact sensitive data from objects
 * @param {any} data - Data to sanitize
 * @returns {any} - Sanitized data
 */
function sanitizeData(data) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.some(sk => key.toLowerCase().includes(sk))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Log authentication success events
 * @param {string} action - Action name
 * @param {object} data - Additional data (will be sanitized)
 */
export function logAuthSuccess(action, data = {}) {
  if (!IS_DEV) return;
  
  console.log(`${LOG_PREFIX} ✅ ${action}`, sanitizeData(data));
}

/**
 * Log authentication failure events
 * @param {string} action - Action name
 * @param {Error|object} error - Error object or data
 */
export function logAuthError(action, error = {}) {
  if (!IS_DEV) return;
  
  const errorData = error instanceof Error 
    ? { message: error.message, status: error.response?.status }
    : error;
    
  console.error(`${LOG_PREFIX} ❌ ${action}`, sanitizeData(errorData));
}

/**
 * Log authentication info events
 * @param {string} action - Action name
 * @param {object} data - Additional data
 */
export function logAuthInfo(action, data = {}) {
  if (!IS_DEV) return;
  
  console.info(`${LOG_PREFIX} ℹ️ ${action}`, sanitizeData(data));
}

/**
 * Log authentication warning events
 * @param {string} action - Action name
 * @param {object} data - Additional data
 */
export function logAuthWarn(action, data = {}) {
  if (!IS_DEV) return;
  
  console.warn(`${LOG_PREFIX} ⚠️ ${action}`, sanitizeData(data));
}

/**
 * Frontend-specific auth event loggers
 */
export const authLog = {
  loginSuccess: (user) => logAuthSuccess('Login successful', { userId: user?.id, role: user?.role }),
  loginFailed: (error) => logAuthError('Login failed', error),
  
  logoutSuccess: () => logAuthSuccess('Logout successful'),
  logoutFailed: (error) => logAuthError('Logout failed', error),
  
  tokenRefreshSuccess: () => logAuthSuccess('Token refresh successful'),
  tokenRefreshFailed: (error) => logAuthError('Token refresh failed', error),
  
  getMeSuccess: (user) => logAuthInfo('User data fetched', { userId: user?.id, role: user?.role }),
  getMeFailed: (error) => logAuthError('Failed to fetch user data', error),
  
  tokenExpired: () => logAuthWarn('Access token expired'),
  autoLogout: (reason) => logAuthWarn('Auto-logout triggered', { reason }),
  
  sessionRestored: (user) => logAuthSuccess('Session restored', { userId: user?.id }),
  sessionCleared: (reason) => logAuthInfo('Session cleared', { reason }),
};
