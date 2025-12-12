import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function NoteCard({ note, onDelete, isDeleting }) {
  const [showConfirm, setShowConfirm] = useState(false)

  const handleDelete = () => {
    if (showConfirm) {
      onDelete()
      setShowConfirm(false)
    } else {
      setShowConfirm(true)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 flex flex-col hover:shadow-md transition">
      <Link to={`/app/note/${note.NoteId}`} className="flex-1">
        <h3 className="font-semibold text-lg mb-2 text-gray-800 hover:text-indigo-600 transition">
          {note.Title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-3">
          {note.Content?.slice(0, 200) || 'No content'}
          {note.Content?.length > 200 && '...'}
        </p>
      </Link>
      
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-xs text-gray-400">
          {formatDate(note.updatedAt || note.UpdatedAt)}
        </span>
        
        <div className="flex gap-3">
          <Link 
            to={`/app/note/${note.NoteId}`} 
            className="text-sm text-indigo-600 hover:text-indigo-800 transition"
          >
            Edit
          </Link>
          
          {showConfirm ? (
            <div className="flex gap-2">
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="text-sm text-red-600 hover:text-red-800 transition disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Confirm'}
              </button>
              <button 
                onClick={() => setShowConfirm(false)}
                className="text-sm text-gray-500 hover:text-gray-700 transition"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button 
              onClick={handleDelete} 
              className="text-sm text-red-600 hover:text-red-800 transition"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
