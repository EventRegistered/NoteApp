// src/components/NoteCard.jsx
import React from 'react'

export default function NoteCard({ note, onDelete }) {
  return (
    <div className="bg-white p-4 rounded shadow flex flex-col">
      <h3 className="font-semibold mb-2">{note.Title}</h3>
      <p className="text-sm text-slate-600 flex-1">{note.Content?.slice(0, 200)}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="text-xs text-slate-400">{new Date(note.UpdatedAt).toLocaleString()}</div>
        <div className="flex gap-2">
          <a href={`/app/note/${note.NoteId}`} className="text-sm text-indigo-600">Open</a>
          <button onClick={onDelete} className="text-sm text-red-600">Delete</button>
        </div>
      </div>
    </div>
  )
}
