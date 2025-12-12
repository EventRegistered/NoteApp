import React, { useRef, useState } from 'react'
import { useCreateNote } from '../hooks/useNotes'

export default function NoteEditor() {
  const titleRef = useRef()
  const bodyRef = useRef()
  const create = useCreateNote()
  const [error, setError] = useState(null)

  const handleCreate = async (e) => {
    e.preventDefault()
    setError(null)
    const title = titleRef.current?.value?.trim() || ''
    const body = bodyRef.current?.value ?? ''
    if (!title) {
      titleRef.current?.focus()
      return
    }

    const payload = { title, body }
    // debug: show exact payload being sent
    // eslint-disable-next-line no-console
    console.debug('Creating note payload:', payload)

    try {
      await create.mutateAsync(payload)
      if (titleRef.current) titleRef.current.value = ''
      if (bodyRef.current) bodyRef.current.value = ''
    } catch (err) {
      // prefer thrown Error message from notesService, then axios response body
      const serverMsg = err?.response?.data ?? err?.response?.data?.message
      const msg = err?.message || (serverMsg && JSON.stringify(serverMsg)) || 'Save failed'
      setError(msg)
      // eslint-disable-next-line no-console
      console.error('Create note failed', { err, serverMsg })
    }
  }

  return (
    <form onSubmit={handleCreate} aria-label="Create note">
      <label htmlFor="note-title">Title</label>
      <input id="note-title" ref={titleRef} required maxLength={255} />
      <label htmlFor="note-body">Body</label>
      <textarea id="note-body" ref={bodyRef} rows={4} />
      <button type="submit" disabled={create.isLoading}>
        {create.isLoading ? 'Saving…' : 'Create'}
      </button>
      {error && <div role="alert" style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
    </form>
  )
}