// src/hooks/useNotes.js
import { useQuery, useMutation, useQueryClient } from 'react-query'
import api from '../lib/api'

export function useNotes(page = 1, q = '') {
  return useQuery(['notes', page, q], async () => {
    const res = await api.get('/api/notes', { params: { page, q } })
    return res.data
  }, { keepPreviousData: true })
}

export function useCreateNote() {
  const qc = useQueryClient()
  return useMutation((payload) => api.post('/api/notes', payload), {
    onSuccess: () => qc.invalidateQueries('notes')
  })
}

export function useUpdateNote() {
  const qc = useQueryClient()
  return useMutation(({ id, payload }) => api.put(`/api/notes/${id}`, payload), {
    onSuccess: () => qc.invalidateQueries('notes')
  })
}

export function useDeleteNote() {
  const qc = useQueryClient()
  return useMutation((id) => api.delete(`/api/notes/${id}`), {
    onSuccess: () => qc.invalidateQueries('notes')
  })
}
