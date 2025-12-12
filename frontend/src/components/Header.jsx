// src/components/Header.jsx
import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  return (
    <header className="bg-white shadow">
      <div className="max-w-4xl mx-auto p-4 flex justify-between items-center">
        <Link to="/app" className="text-lg font-bold">Notes</Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <div className="text-sm">{user.fullName}</div>
              <button onClick={logout} className="px-3 py-1 border rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1">Login</Link>
              <Link to="/register" className="px-3 py-1 border rounded">Sign up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
