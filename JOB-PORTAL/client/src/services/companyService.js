import API from './api'

export const fetchCompanies = (params) => API.get('/companies', { params })
export const fetchCompanyDetails = (id) => API.get(`/companies/${id}`)
