import axios from 'axios'

const api = axios.create({ baseURL: '' })

// attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// simple response wrapper
api.interceptors.response.use((res) => res, (err) => Promise.reject(err.response || err))

export default api

