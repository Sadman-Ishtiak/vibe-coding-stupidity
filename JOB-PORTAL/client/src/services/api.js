import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // send/receive cookies (refresh token)
})

// Attach access token if present
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token')
  if (token) {
    req.headers.Authorization = `Bearer ${token}`
  }
  return req
})

// Refresh access token on 401 and retry once
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        // Call refresh endpoint (cookie-based)
        const resp = await API.post('/auth/refresh', null, { withCredentials: true })
        const newAccessToken = resp.data?.data?.accessToken || resp.data?.accessToken
        if (newAccessToken) {
          localStorage.setItem('token', newAccessToken)
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
          return API(originalRequest)
        }
      } catch (refreshErr) {
        // Refresh failed, fall through to reject
        return Promise.reject(refreshErr)
      }
    }
    return Promise.reject(error)
  }
)

export default API
