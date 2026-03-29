import axios from 'axios'

function resolveBaseURL() {
  const fromEnv = import.meta.env.VITE_API_URL?.trim()
  if (fromEnv) {
    return fromEnv.replace(/\/$/, '')
  }
  return 'http://localhost:8000'
}

const api = axios.create({
  baseURL: resolveBaseURL(),
  timeout: 30_000,
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only hard-redirect when an authenticated request was rejected (avoids wiping session on stray 401s).
    const sentAuth =
      error.config?.headers?.Authorization ?? error.config?.headers?.authorization
    if (error.response?.status === 401 && sentAuth) {
      localStorage.removeItem('token')
      window.location.href = '/'
    }
    return Promise.reject(error)
  },
)

export default api
