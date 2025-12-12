import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useNotes, useCreateNote, useDeleteNote } from '../hooks/useNotes'
import NoteCard from '../components/NoteCard'
import { useAuth } from '../contexts/AuthContext'

export default function Dashboard() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  
  const { data, isLoading } = useNotes(page, search)
  const create = useCreateNote()
  const del = useDeleteNote()
  const { user } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    setSearch(searchInput)
    setPage(1)
  }

  const clearSearch = () => {
    setSearchInput('')
    setSearch('')
    setPage(1)
  }

  const createSample = async () => {
    await create.mutateAsync({ title: 'New note', content: 'Quick note' })
  }

  const totalPages = data?.totalPages || 1

  return (
    <div>
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h2 className="text-2xl font-semibold">{user?.FullName || 'Your'} Notes</h2>
        <div className="flex gap-2">
          <button 
            onClick={createSample} 
            disabled={create.isLoading}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition disabled:opacity-50"
          >
            {create.isLoading ? 'Creating...' : 'Quick Note'}
          </button>
          <Link 
            to="/app/note/new" 
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded transition"
          >
            New Note
          </Link>
        </div>
      </header>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search notes..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            type="submit"
            className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition"
          >
            Search
          </button>
          {search && (
            <button 
              type="button"
              onClick={clearSearch}
              className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded transition"
            >
              Clear
            </button>
          )}
        </div>
        {search && (
          <p className="mt-2 text-sm text-gray-600">
            Showing results for "{search}" ({data?.total || 0} found)
          </p>
        )}
      </form>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {data?.data?.length ? data.data.map(n => (
              <NoteCard 
                key={n.NoteId} 
                note={n} 
                onDelete={() => del.mutate(n.NoteId)} 
                isDeleting={del.isLoading}
              />
            )) : (
              <div className="col-span-full p-8 bg-white rounded-lg shadow text-center text-gray-500">
                {search ? 'No notes found matching your search' : 'No notes yet. Create your first note!'}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (page <= 3) {
                    pageNum = i + 1
                  } else if (page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = page - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`w-10 h-10 rounded transition ${
                        page === pageNum 
                          ? 'bg-indigo-600 text-white' 
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Next
              </button>
            </div>
          )}
          
          {data?.total > 0 && (
            <p className="text-center text-sm text-gray-500 mt-4">
              Page {page} of {totalPages} ({data.total} notes total)
            </p>
          )}
        </>
      )}
    </div>
  )
}
