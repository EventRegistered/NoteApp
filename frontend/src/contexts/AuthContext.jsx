import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return
    }

    api.get('/api/auth/me').then(res => {
      setUser(res.data?.data?.user || null)
    }).catch(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const { token, refreshToken, user: userData } = res.data?.data || {}
    if (token) localStorage.setItem('token', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
    return userData
  }

  const register = async (fullName, email, password) => {
    const res = await api.post('/api/auth/register', { fullName, email, password })
    const { token, refreshToken, user: userData } = res.data?.data || {}
    if (token) localStorage.setItem('token', token)
    if (refreshToken) localStorage.setItem('refreshToken', refreshToken)
    setUser(userData)
    return userData
  }

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken')
    try {
      await api.post('/api/auth/logout', { refreshToken })
    } catch (e) {
      // Ignore logout errors
    }
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
