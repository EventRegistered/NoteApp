import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes, useCreateNote, useDeleteNote } from '../hooks/useNotes'
import NoteCard from '../components/NoteCard'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const { data, isLoading } = useNotes(1, '')
  const create = useCreateNote()
  const del = useDeleteNote()
  const { user } = useAuth()

  const createSample = async () => {
    await create.mutateAsync({ title: 'New note', content: 'Quick note' })
  }

  return (
    <div>
      <header className="flex items-center justify-between mb-4">
        <h2 className="text-2xl">{user?.fullName || 'Your'} Notes</h2>
        <div className="flex gap-2">
          <button onClick={createSample} className="bg-green-500 text-white px-3 py-1 rounded">New note</button>
          <Link to="/app/note/new" className="bg-indigo-600 text-white px-3 py-1 rounded">Open editor</Link>
        </div>
      </header>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data?.data?.length ? data.data.map(n => (
            <NoteCard key={n.NoteId} note={n} onDelete={() => del.mutate(n.NoteId)} />
          )) : (
            <div className="p-6 bg-white rounded shadow">No notes yet</div>
          )}
        </div>
      )}
    </div>
  )
}
