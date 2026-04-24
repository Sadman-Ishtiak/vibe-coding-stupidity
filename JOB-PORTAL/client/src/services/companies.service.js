import { API_PATHS } from '@/utils/constants/api'
import { requestJson } from '@/services/api/httpClient'
import { mockCompanies } from '@/data/companies'

const shouldUseMocks = () => String(import.meta.env.VITE_USE_MOCKS || '').toLowerCase() === 'true'

export async function listCompanies({ signal } = {}) {
  try {
    return await requestJson(API_PATHS.COMPANIES.LIST, { signal })
  } catch (err) {
    if (shouldUseMocks()) return { success: true, data: mockCompanies, message: 'mock' }
    throw err
  }
}

export async function getCompany(companyId, { signal } = {}) {
  if (!companyId) throw new Error('companyId is required')
  try {
    return await requestJson(API_PATHS.COMPANIES.DETAILS(companyId), { signal })
  } catch (err) {
    if (shouldUseMocks()) {
      const found = mockCompanies.find((c) => c.id === companyId) || null
      return { success: true, data: found, message: 'mock' }
    }
    throw err
  }
}


