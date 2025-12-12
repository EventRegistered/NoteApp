// src/hooks/useNotes.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as notesService from '../lib/notesService'

// v5 requires the object-signature form for query/mutation hooks
export function useNotes() {
  return useQuery({
    queryKey: ['notes'],
    queryFn: notesService.fetchNotes,
    staleTime: 1000 * 60,
    retry: 1,
  })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: notesService.createNote,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }) => notesService.updateNote(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id) => notesService.deleteNote(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notes'] }),
  })
}
