import API from './api'

export const fetchApplicants = (jobId, status) => API.get(`/applications/job/${jobId}`, { params: { status } })
export const updateApplicationStatus = (id, status) => API.patch(`/applications/${id}/status`, { status })
