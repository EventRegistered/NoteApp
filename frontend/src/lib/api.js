import axios from 'axios'

// prefer explicit VITE_API_URL, otherwise fall back to a relative /api path for dev proxy
const base = import.meta.env.VITE_API_URL || '/api'

const instance = axios.create({
  baseURL: base,
  timeout: 10000,
})

const initToken = localStorage.getItem('token')
if (initToken) instance.defaults.headers.common.Authorization = `Bearer ${initToken}`

instance.setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
    instance.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    instance.clearAuthToken()
  }
}

instance.clearAuthToken = () => {
  localStorage.removeItem('token')
  delete instance.defaults.headers.common.Authorization
}

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response && err.response.status === 401) {
      // optional: emit a global event or call a hook to logout
    }
    return Promise.reject(err)
  }
)

export default instance

