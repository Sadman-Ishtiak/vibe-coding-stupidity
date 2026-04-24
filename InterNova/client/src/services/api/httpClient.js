// Simplified HTTP client - no backend calls
// This module is kept for compatibility but returns mock responses

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

/**
 * Mock HTTP client wrapper - returns empty responses
 * All actual data should come from service layer mock data
 * @param {string} path
 * @param {{ method?: string, body?: any, headers?: Record<string,string>, signal?: AbortSignal, credentials?: RequestCredentials }} [options]
 */
export async function requestJson(path, options = {}) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Return mock success response
  return { 
    success: true, 
    data: null,
    message: 'Mock response - no backend'
  }
}

export { ApiError }
