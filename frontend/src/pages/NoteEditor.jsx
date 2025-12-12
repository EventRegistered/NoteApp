import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import { useUpdateNote } from '../hooks/useNotes'

export default function NoteEditor() {
  const { id } = useParams()
  const nav = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const update = useUpdateNote()

  useEffect(() => {
    if (id && id !== 'new') {
      api.get(`/api/notes/${id}`).then(res => {
        setTitle(res.data?.data?.Title || '')
        setContent(res.data?.data?.Content || '')
      })
    }
  }, [id])

  const save = async () => {
    try {
      if (id === 'new') {
        await api.post('/api/notes', { title, content })
      } else {
        await update.mutateAsync({ id, payload: { title, content } })
      }
      nav('/app')
    } catch (err) {
      alert('Save failed')
    }
  }

  return (
    <div className="bg-white p-6 rounded shadow">
      <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" className="w-full p-2 border rounded mb-3" />
      <textarea value={content} onChange={e => setContent(e.target.value)} rows={12} className="w-full p-2 border rounded mb-3" />
      <div className="flex gap-2">
        <button onClick={save} className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
        <button onClick={() => nav('/app')} className="px-3 py-1 border rounded">Cancel</button>
      </div>
    </div>
  )
}
