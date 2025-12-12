import React from 'react'
import { Link } from 'react-router-dom'
import { useNotes, useCreateNote, useDeleteNote } from '../hooks/useNotes'
import NoteCard from '../components/NoteCard'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  // call useNotes with no positional args (v5 object-signature hooks handle config inside)
  const { data, isLoading } = useNotes()
  const create = useCreateNote()
  const del = useDeleteNote()
  const { user } = useAuth()

  const createSample = async () => {
    // API expects { title, body }
    await create.mutateAsync({ title: 'New note', body: 'Quick note' })
  }

  // normalize incoming note objects to guarantee a stable `id` and `body`
  const raw = data?.data ?? []
  const notes = raw.map((n, idx) => {
    const id = n?.id ?? n?.NoteId ?? n?.noteId ?? n?.noteID ?? String(idx)
    return {
      ...n,
      id,
      title: n?.title ?? n?.Title ?? '',
      body: n?.body ?? n?.Body ?? n?.Content ?? '',
    }
  })

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
          {notes.length ? notes.map((n) => (
            <NoteCard
              key={n.id}
              note={n}
              onDelete={() => del.mutate(n.id)}
            />
          )) : (
            <div className="p-6 bg-white rounded shadow">No notes yet</div>
          )}
        </div>
      )}
    </div>
  )
}
