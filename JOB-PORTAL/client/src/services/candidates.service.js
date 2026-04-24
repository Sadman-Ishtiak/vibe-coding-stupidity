import { API_PATHS } from '@/utils/constants/api'
import { requestJson } from '@/services/api/httpClient'

const shouldUseMocks = () => String(import.meta.env.VITE_USE_MOCKS || '').toLowerCase() === 'true'

export async function listCandidates({ signal } = {}) {
  try {
    return await requestJson(API_PATHS.CANDIDATES.LIST, { signal })
  } catch (err) {
    if (shouldUseMocks()) {
      return { success: true, data: [], message: 'mock' }
    }
    throw err
  }
}

export async function getCandidate(candidateId, { signal } = {}) {
  if (!candidateId) throw new Error('candidateId is required')
  try {
    return await requestJson(API_PATHS.CANDIDATES.DETAILS(candidateId), { signal })
  } catch (err) {
    if (shouldUseMocks()) {
      return { success: true, data: null, message: 'mock' }
    }
    throw err
  }
}


