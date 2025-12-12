
// src/pages/LoginPage.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      nav('/app')
    } catch (err) {
      alert(err?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Sign in</h1>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full p-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full p-2 border rounded" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-indigo-600 text-white p-2 rounded" disabled={loading}>{loading? 'Signing in...' : 'Sign in'}</button>
      </form>
      <p className="mt-4 text-sm">New? <Link to="/register" className="text-indigo-600">Create an account</Link></p>
    </div>
  )
}
