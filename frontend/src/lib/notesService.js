import api from './api'

function ensurePayload(payload) {
  if (!payload || (typeof payload !== 'object')) {
    throw new TypeError('createNote payload must be an object with { title, body }')
  }
  if (!payload.title || String(payload.title).trim() === '') {
    throw new TypeError('createNote payload missing required "title" field')
  }
  return { title: String(payload.title).trim(), body: payload.body ?? '' }
}

export const fetchNotes = () => api.get('/api/notes').then(r => r.data)
export const fetchNote = (id) => api.get(`/api/notes/${id}`).then(r => r.data)

export const createNote = async (payload) => {
  const body = ensurePayload(payload)
  // Frontend debug log: request payload
  // eslint-disable-next-line no-console
  console.debug('[notesService] POST /api/notes payload:', body)

  try {
    const res = await api.post('/api/notes', body)
    // Frontend debug log: response
    // eslint-disable-next-line no-console
    console.debug('[notesService] POST /api/notes response:', res.status, res.data)
    return res.data
  } catch (err) {
    // log server response payload if present
    // eslint-disable-next-line no-console
    console.error('[notesService] createNote error:', err?.response?.status, err?.response?.data, err)
    const msg = err?.response?.data?.message || err?.message || 'Failed to create note'
    const e = new Error(msg)
    e.cause = err
    throw e
  }
}

export const updateNote = async (id, payload) => {
  if (!id) throw new TypeError('updateNote requires id')
  try {
    const res = await api.put(`/api/notes/${id}`, payload)
    return res.data
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to update note'
    const e = new Error(msg)
    e.cause = err
    throw e
  }
}

export const deleteNote = async (id) => {
  if (!id) throw new TypeError('deleteNote requires id')
  try {
    const res = await api.delete(`/api/notes/${id}`)
    return res.data
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to delete note'
    const e = new Error(msg)
    e.cause = err
    throw e
  }
}