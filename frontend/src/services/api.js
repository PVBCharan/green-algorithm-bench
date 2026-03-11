/**
 * Centralized API Service
 * 
 * Axios instance configured for backend communication.
 * All API calls should use this instance to maintain consistency.
 */

import axios from 'axios'

// Create Axios instance with default configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000', // Use env var or fallback to localhost
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Optional: Add request interceptor for logging
api.interceptors.request.use(
  config => {
    console.log(`[API] ${config.method.toUpperCase()} ${config.url}`)
    return config
  },
  error => {
    console.error('[API] Request error:', error)
    return Promise.reject(error)
  }
)

// Optional: Add response interceptor for error handling
api.interceptors.response.use(
  response => {
    return response.data
  },
  error => {
    console.error('[API] Response error:', error.response?.status, error.message)
    return Promise.reject(error)
  }
)

export default api
