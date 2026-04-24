import API from './api'

export const createJob = (data) => API.post('/jobs', data)
export const fetchMyJobs = () => API.get('/jobs/company')
