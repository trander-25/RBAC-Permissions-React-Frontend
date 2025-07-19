import axios from 'axios'
import { toast } from 'react-toastify'
import { handleLogoutAPI, refreshTokenAPI } from '~/apis'

// Create authorized axios instance with custom configuration
let authorizedAxiosInstance = axios.create()

// Request timeout: 10 minutes
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10

// Enable cookies for JWT tokens (httpOnly cookies)
authorizedAxiosInstance.defaults.withCredentials = true

/**
 * Configure Interceptors (intercept between Request & Response)
 * https://axios-http.com/docs/interceptors
 */

// Request interceptor: Add authorization header
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Add access token to headers
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    // Use Bearer token standard (OAuth 2.0)
    config.headers.Authorization = `Bearer ${accessToken}`
  }

  return config
}, function (error) {
  return Promise.reject(error)
})

// Promise for refresh token API calls to prevent multiple simultaneous requests
let refreshTokenPromise = null

// Response interceptor: Handle token refresh and errors
authorizedAxiosInstance.interceptors.response.use((response) => {
  return response
}, function (error) {
  /** Handle automatic token refresh */
  // 401: Logout immediately
  if (error.response?.status === 401) {
    handleLogoutAPI().then(() => {
      // If using cookies, remember to remove userInfo from localStorage
      // localStorage.removeItem('userInfo')

      // Redirect to login page
      location.href = '/login'
    })
  }

  // 410: Refresh token and retry request
  const originalRequest = error.config
  if (error.response?.status === 410 && originalRequest) {
    if (!refreshTokenPromise) {
      const refreshToken = localStorage.getItem('refreshToken')
      // Call refresh token API
      refreshTokenPromise = refreshTokenAPI(refreshToken)
        .then((res) => {
          // Update access token
          const { accessToken } = res.data
          localStorage.setItem('accessToken', accessToken)
          authorizedAxiosInstance.defaults.headers.Authorization = `Bearer ${accessToken}`
        })
        .catch((_error) => {
          // Logout on refresh token error
          handleLogoutAPI().then(() => {
            // If using cookies, remember to remove userInfo from localStorage
            // localStorage.removeItem('userInfo')

            // Redirect to login page
            location.href = '/login'
          })
          return Promise.reject(_error)
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // Return promise and retry original request
    return refreshTokenPromise.then(() => {
      return authorizedAxiosInstance(originalRequest)
    })

  }

  // Show error for all status codes except 410
  if (error.response?.status !== 410) {
    toast.error(error.response?.data?.message || error?.message)
  }

  return Promise.reject(error)
})

export default authorizedAxiosInstance