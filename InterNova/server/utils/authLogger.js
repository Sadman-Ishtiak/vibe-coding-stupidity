/**
 * Backend Authentication Logger
 * Safe logging for auth events without sensitive data
 */

const IS_PRODUCTION = process.env.NODE_ENV === 'production';
const LOG_PREFIX = '[AUTH]';

/**
 * Log successful authentication events
 */
function logAuthSuccess(action, data = {}) {
  console.log(`${LOG_PREFIX} ✅ ${action}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Log failed authentication events
 */
function logAuthError(action, error = {}) {
  console.error(`${LOG_PREFIX} ❌ ${action}`, {
    timestamp: new Date().toISOString(),
    message: error.message || 'Unknown error',
    status: error.status || error.statusCode,
  });
}

/**
 * Log authentication warnings
 */
function logAuthWarn(action, data = {}) {
  console.warn(`${LOG_PREFIX} ⚠️ ${action}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Log authentication info
 */
function logAuthInfo(action, data = {}) {
  console.info(`${LOG_PREFIX} ℹ️ ${action}`, {
    timestamp: new Date().toISOString(),
    ...data,
  });
}

/**
 * Backend-specific auth event loggers
 */
const authLog = {
  registerSuccess: (userId, email) => 
    logAuthSuccess('User registered', { userId, email }),
  
  registerFailed: (email, reason) => 
    logAuthError('Registration failed', { email, reason }),
  
  loginSuccess: (userId, email, role) => 
    logAuthSuccess('User logged in', { userId, email, role }),
  
  loginFailed: (email, reason) => 
    logAuthWarn('Login failed', { email, reason }),
  
  logoutSuccess: (userId) => 
    logAuthSuccess('User logged out', { userId }),
  
  tokenVerifyFailed: (reason, userId = null) => 
    logAuthWarn('Token verification failed', { reason, userId }),
  
  tokenExpired: (userId) => 
    logAuthWarn('Access token expired', { userId }),
  
  tokenRefreshSuccess: (userId) => 
    logAuthSuccess('Token refreshed', { userId }),
  
  tokenRefreshFailed: (reason) => 
    logAuthError('Token refresh failed', { reason }),
  
  getMeSuccess: (userId) => 
    logAuthInfo('GET /auth/me', { userId }),
  
  getMeFailed: (reason) => 
    logAuthWarn('GET /auth/me failed', { reason }),
  
  roleAuthorizationFailed: (userId, requiredRole, userRole) => 
    logAuthWarn('Role authorization failed', { userId, requiredRole, userRole }),
  
  invalidCredentials: (email) => 
    logAuthWarn('Invalid credentials', { email }),
};

module.exports = {
  logAuthSuccess,
  logAuthError,
  logAuthWarn,
  logAuthInfo,
  authLog,
};
