const AUTH_KEY = 'internnova.authenticated'
const ACCOUNT_TYPE_KEY = 'internnova.accountType'
const ACCESS_TOKEN_KEY = 'internnova.accessToken'

// Token-Based Authentication: Checks if JWT/access token exists in localStorage
export function isAuthenticated() {
  try {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY)
    // Primary check: Access token exists (JWT token-based auth)
    if (token && token.length > 0) {
      return true
    }
    // Fallback check for backward compatibility
    return localStorage.getItem(AUTH_KEY) === '1'
  } catch {
    return false
  }
}

export function setAuthenticated(value = true) {
  try {
    localStorage.setItem(AUTH_KEY, value ? '1' : '0')
  } catch {
    // ignore
  }
}

export function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setAccessToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(ACCESS_TOKEN_KEY)
      return
    }
    localStorage.setItem(ACCESS_TOKEN_KEY, String(token))
    localStorage.setItem(AUTH_KEY, '1')
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    // ignore
  }
}

export function getAccountType() {
  try {
    return localStorage.getItem(ACCOUNT_TYPE_KEY) || 'candidate'
  } catch {
    return 'candidate'
  }
}

export function setAccountType(value) {
  try {
    localStorage.setItem(ACCOUNT_TYPE_KEY, value || 'candidate')
  } catch {
    // ignore
  }
}
