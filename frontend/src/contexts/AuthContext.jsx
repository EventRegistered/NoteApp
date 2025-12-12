// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useEffect, useRef, useState, useCallback, useMemo } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function useAuth() {
  return useContext(AuthContext)
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(false)

  useEffect(() => {
    mountedRef.current = true
    const token = localStorage.getItem('token')
    if (!token) {
      setLoading(false)
      return () => { mountedRef.current = false }
    }

    api.setAuthToken(token) // ensure axios has token header

    let cancelled = false
    api.get('/api/auth/me')
      .then((res) => {
        if (cancelled || !mountedRef.current) return
        const payload = res?.data?.data ?? res?.data ?? null
        setUser(payload?.user ?? null)
      })
      .catch((err) => {
        // handle 401/invalid-token gracefully: clear credentials and avoid noisy errors
        if (!cancelled && mountedRef.current) {
          if (err?.response?.status === 401) {
            api.clearAuthToken()
            localStorage.removeItem('token')
            setUser(null)
          } else {
            // other errors: just log in dev, do not throw
            // eslint-disable-next-line no-console
            console.warn('Auth check failed', err?.response?.data ?? err.message)
          }
        }
      })
      .finally(() => {
        if (!cancelled && mountedRef.current) setLoading(false)
      })

    return () => {
      cancelled = true
      mountedRef.current = false
    }
  }, [])

  const login = useCallback(async (email, password) => {
    const res = await api.post('/api/auth/login', { email, password })
    const payload = res?.data?.data ?? res?.data
    const token = payload?.token ?? null
    if (token) api.setAuthToken(token)
    setUser(payload?.user ?? null)
    return res
  }, [])

  const register = useCallback(async (fullName, email, password) => {
    const res = await api.post('/api/auth/register', { fullName, email, password })
    const payload = res?.data?.data ?? res?.data
    const token = payload?.token ?? null
    if (token) api.setAuthToken(token)
    setUser(payload?.user ?? null)
    return res
  }, [])

  const logout = useCallback(() => {
    api.clearAuthToken()
    localStorage.removeItem('token')
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, login, register, logout, isAuthenticated: !!user }), [user, loading, login, register, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
