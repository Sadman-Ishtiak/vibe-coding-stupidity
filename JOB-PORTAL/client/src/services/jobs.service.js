import { API_PATHS } from '@/utils/constants/api'
import { requestJson } from '@/services/api/httpClient'
import { mockJobs } from '@/data/jobs'
import { isAuthenticated } from '@/services/auth.session'

const shouldUseMocks = () => String(import.meta.env.VITE_USE_MOCKS || '').toLowerCase() === 'true'

export async function listJobs(filters = {}, { signal } = {}) {
  try {
    const params = new URLSearchParams()
    if (filters && typeof filters === 'object') {
      for (const [k, v] of Object.entries(filters)) {
        if (v === undefined || v === null) continue
        if (Array.isArray(v)) params.set(k, v.join(','))
        else params.set(k, String(v))
      }
    }

    const path = params.toString() ? `${API_PATHS.JOBS.LIST}?${params.toString()}` : API_PATHS.JOBS.LIST
    const data = await requestJson(path, { signal })

    // Support both legacy responses (data = array) and paginated responses (data.data)
    if (Array.isArray(data?.data)) return { success: true, data: data.data, meta: null }
    if (Array.isArray(data?.data?.data)) return { success: true, data: data.data.data, meta: { total: data.data.total, page: data.data.page, pages: data.data.pages } }
    // fallback: raw
    return data
  } catch (err) {
    if (shouldUseMocks()) {
      return { success: true, data: mockJobs, message: 'mock' }
    }
    throw err
  }
}

export async function getJob(jobId, { signal } = {}) {
  if (!jobId) throw new Error('jobId is required')
  try {
    const data = await requestJson(API_PATHS.JOBS.DETAILS(jobId), { signal })
    return data
  } catch (err) {
    if (shouldUseMocks()) {
      const found = mockJobs.find((j) => j.id === jobId) || null
      return { success: true, data: found, message: 'mock' }
    }
    throw err
  }
}

export async function applyToJob(jobId, application, { signal } = {}) {
  if (!jobId) throw new Error('jobId is required')
  if (!isAuthenticated()) {
    const err = new Error('AUTH_REQUIRED')
    err.code = 'AUTH_REQUIRED'
    throw err
  }
  return requestJson(API_PATHS.JOBS.APPLY(jobId), { method: 'POST', body: application, signal })
}


