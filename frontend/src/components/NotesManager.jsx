import React, { useState, useRef } from 'react'
import { useNotes, useCreateNote, useUpdateNote, useDeleteNote } from '../hooks/useNotes'
import { extractWikilinks } from '../lib/wikilinks'

export default function NotesManager() {
  const { data, isLoading, error } = useNotes()
  const createNote = useCreateNote()
  const updateNote = useUpdateNote()
  const deleteNote = useDeleteNote()
  const [editingId, setEditingId] = useState(null)
  const titleRef = useRef()
  const bodyRef = useRef()

  if (isLoading) return <div role="status">Loading…</div>
  if (error) return <div role="alert">Failed to load notes</div>

  const notes = (data && data.data) || []

  const handleCreate = (e) => {
    e.preventDefault()
    const title = titleRef.current.value.trim()
    const body = bodyRef.current.value.trim()
    if (!title) return titleRef.current.focus()
    createNote.mutate({ title, body })
    titleRef.current.value = ''
    bodyRef.current.value = ''
  }

  const startEdit = (note) => {
    setEditingId(note.id)
  }

  const submitEdit = (note) => {
    const title = document.getElementById(`title-${note.id}`).value.trim()
    const body = document.getElementById(`body-${note.id}`).value.trim()
    updateNote.mutate({ id: note.id, payload: { title, body } })
    setEditingId(null)
  }

  const handleDelete = (id) => {
    if (!window.confirm('Delete note?')) return
    deleteNote.mutate(id)
  }

  return (
    <section aria-labelledby="notes-heading">
      <h2 id="notes-heading">Notes</h2>

      <form onSubmit={handleCreate} aria-label="Create note">
        <label htmlFor="new-title">Title</label>
        <input id="new-title" ref={titleRef} name="title" required maxLength={255} />
        <label htmlFor="new-body">Body</label>
        <textarea id="new-body" ref={bodyRef} name="body" rows={4} />
        <button type="submit" aria-label="Create note">Create</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {editingId === note.id ? (
              <div>
                <input id={`title-${note.id}`} defaultValue={note.title} />
                <textarea id={`body-${note.id}`} defaultValue={note.body} rows={4} />
                <button onClick={() => submitEdit(note)}>Save</button>
                <button onClick={() => setEditingId(null)}>Cancel</button>
              </div>
            ) : (
              <article tabIndex={0} aria-labelledby={`note-title-${note.id}`}>
                <h3 id={`note-title-${note.id}`}>{note.title}</h3>
                <p>{note.body}</p>
                <div>
                  <button onClick={() => startEdit(note)} aria-label={`Edit ${note.title}`}>Edit</button>
                  <button onClick={() => handleDelete(note.id)} aria-label={`Delete ${note.title}`}>Delete</button>
                </div>
                <small>Links: {extractWikilinks(note.body).join(', ') || '—'}</small>
              </article>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}