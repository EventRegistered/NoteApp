import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useUpdateNote } from '../hooks/useNotes'

export default function NoteEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('') // renamed from content -> body
  const update = useUpdateNote()

  useEffect(() => {
    if (id && id !== 'new') {
      api.get(`/api/notes/${id}`).then(res => {
        // backend returns Title/Body (DB column names) — map to frontend state
        setTitle(res.data?.data?.Title || res.data?.data?.title || '')
        setBody(res.data?.data?.Body || res.data?.data?.body || '')
      }).catch(() => {
        setTitle('')
        setBody('')
      })
    }
  }, [id])

  const save = async () => {
    try {
      if (id === 'new') {
        // API expects { title, body }
        await api.post('/api/notes', { title, body })
      } else {
        await update.mutateAsync({ id, payload: { title, body } })
      }
      nav('/app')
    } catch (err) {
      alert('Save failed: ' + (err?.message || (err?.response?.data && JSON.stringify(err.response.data)) || 'unknown'))
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-3" />
      <textarea value={body} onChange={e => setBody(e.target.value)} rows={12} className="w-full p-2 border rounded mb-3" />
      <div className="flex gap-2">
        <button onClick={save} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
        <button onClick={() => nav('/app')} className="px-3 py-1 border rounded">Cancel</button>
      </div>
    </div>
  )
}
