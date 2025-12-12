// src/App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import AuthProvider, { useAuth } from './contexts/AuthContext'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Dashboard from './pages/Dashboard'
import NoteEditor from './pages/NoteEditor'
import Header from './components/Header'
import Protected from './components/Protected'

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="max-w-4xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Navigate to="/app" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            <Route path="/app" element={<Protected><Dashboard /></Protected>} />

            <Route
              path="/app/note/:id"
              element={
                <Protected>
                  <NoteEditor />
                </Protected>
              }
            />

            <Route path="*" element={<div className="p-6">Not Found</div>} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}
