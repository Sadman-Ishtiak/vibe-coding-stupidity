const AUTH_KEY = 'internnova.authenticated'
const ACCOUNT_TYPE_KEY = 'internnova.accountType'
const ACCESS_TOKEN_KEY = 'internnova.accessToken'
const REFRESH_TOKEN_KEY = 'internnova.refreshToken'
const USER_DATA_KEY = 'internnova.userData'

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

export function getRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

export function setRefreshToken(token) {
  try {
    if (!token) {
      localStorage.removeItem(REFRESH_TOKEN_KEY)
      return
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, String(token))
  } catch {
    // ignore
  }
}

export function getUserData() {
  try {
    const data = localStorage.getItem(USER_DATA_KEY)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

export function setUserData(userData) {
  try {
    if (!userData) {
      localStorage.removeItem(USER_DATA_KEY)
      return
    }
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
  } catch {
    // ignore
  }
}

export function clearAuth() {
  try {
    localStorage.removeItem(AUTH_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    localStorage.removeItem(ACCOUNT_TYPE_KEY)
  } catch {
    // ignore
  }
}

export function getAccountType() {
  try {
    // First check user data
    const userData = getUserData()
    if (userData?.role) {
      return userData.role
    }
    // Fallback to stored account type
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
