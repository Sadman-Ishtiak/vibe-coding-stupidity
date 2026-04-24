import { getAccessToken } from '@/services/auth.session'

class ApiError extends Error {
  constructor(message, { status, url, code, details } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.url = url
    this.code = code
    this.details = details
  }
}

const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (raw) return String(raw).replace(/\/$/, '')

  // Sensible dev fallback: backend defaults to :5000 and mounts routes under /api.
  // This avoids "nothing happens" when .env is missing.
  if (typeof window !== 'undefined' && window.location) {
    const protocol = window.location.protocol || 'http:'
    const hostname = window.location.hostname || 'localhost'
    return `${protocol}//${hostname}:5000/api`
  }

  return ''
}

const buildUrl = (path) => {
  const base = getBaseUrl()
  if (!base) return path
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`
}

const parseJsonSafely = async (response) => {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

/**
 * Controller utility: HTTP client wrapper.
 * @param {string} path
 * @param {{ method?: string, body?: any, headers?: Record<string,string>, signal?: AbortSignal, credentials?: RequestCredentials }} [options]
 */
export async function requestJson(path, options = {}) {


  const url = buildUrl(path)
  const method = options.method || 'GET'

  const accessToken = getAccessToken()

  const headers = {
    Accept: 'application/json',
    ...(options.headers || {}),
  }

  if (accessToken && !headers.Authorization) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const init = {
    method,
    headers,
    signal: options.signal,
    credentials: options.credentials || 'include',
  }

  if (options.body !== undefined) {
    headers['Content-Type'] = headers['Content-Type'] || 'application/json'
    init.body = headers['Content-Type'].includes('application/json') ? JSON.stringify(options.body) : options.body
  }

  const response = await fetch(url, init)
  const payload = await parseJsonSafely(response)

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && payload.message) ||
      `Request failed with status ${response.status}`
    throw new ApiError(message, {
      status: response.status,
      url,
      code: payload && typeof payload === 'object' ? payload.code : undefined,
      details: payload,
    })
  }

  return payload
}

export { ApiError }
