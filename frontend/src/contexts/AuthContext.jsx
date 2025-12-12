// src/contexts/AuthContext.jsx
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

    // fetch profile or decode token
    api.get('/api/auth/me').then(res => {
      setUser(res.data?.data?.user || null)
    }).catch(() => setUser(null)).finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const token = res.data?.data?.token
    if (token) localStorage.setItem('token', token)
    setUser(res.data?.data?.user)
  }

  const register = async (fullName, email, password) => {
    const res = await api.post('/api/auth/register', { fullName, email, password })
    const token = res.data?.data?.token
    if (token) localStorage.setItem('token', token)
    setUser(res.data?.data?.user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
