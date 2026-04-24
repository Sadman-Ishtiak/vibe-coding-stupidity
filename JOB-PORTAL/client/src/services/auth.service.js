import { API_PATHS } from '@/utils/constants/api'
import { requestJson } from '@/services/api/httpClient'

export function signIn(credentials, { signal } = {}) {
  return requestJson(API_PATHS.AUTH.SIGN_IN, { method: 'POST', body: credentials, signal })
}

export function signUp(payload, { signal } = {}) {
  return requestJson(API_PATHS.AUTH.SIGN_UP, { method: 'POST', body: payload, signal })
}

export function getMe({ signal } = {}) {
  return requestJson(API_PATHS.AUTH.ME, { signal })
}

export function signOut({ signal } = {}) {
  return requestJson(API_PATHS.AUTH.SIGN_OUT, { method: 'POST', signal })
}

export function forgotPassword(payload, { signal } = {}) {
  return requestJson(API_PATHS.AUTH.FORGOT_PASSWORD, { method: 'POST', body: payload, signal })
}

export function resetPassword(payload, { signal } = {}) {
  return requestJson(API_PATHS.AUTH.RESET_PASSWORD, { method: 'POST', body: payload, signal })
}


