import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Protected({ children, fallback = null }) {
  const { isAuthenticated, loading } = useAuth()

  // while we are validating the token, show a lightweight fallback
  if (loading) return fallback ?? <div>Checking authentication…</div>

  // only redirect when loading finished and the user is not authenticated
  if (!isAuthenticated) return <Navigate to="/login" replace />

  return children
}