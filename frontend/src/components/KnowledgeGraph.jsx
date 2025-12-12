import React, { useMemo, useCallback } from 'react'
import { useNotes } from '../hooks/useNotes'
import { extractWikilinks } from '../lib/wikilinks'

export default function KnowledgeGraph({ onNodeClick } = {}) {
  const { data, isLoading } = useNotes()
  const notes = useMemo(() => (data && data.data) || [], [data])

  const edges = useMemo(() => {
    if (!notes.length) return []
    const byTitle = new Map(notes.map((n) => [String(n.title || '').trim(), n]))
    const out = []
    for (const n of notes) {
      const links = extractWikilinks(n.body || '')
      for (const t of links) {
        const key = String(t).trim()
        const target = byTitle.get(key)
        if (target && target.id !== n.id) out.push({ from: n.id, to: target.id })
      }
    }
    return out
  }, [notes])

  const positions = useMemo(() => {
    if (!notes.length) return []
    const radius = Math.max(80, Math.min(160, 120 + notes.length * 2)) // scale a bit with size
    const cx = 200
    const cy = 200
    const angleStep = (2 * Math.PI) / notes.length
    return notes.map((n, i) => {
      const angle = i * angleStep
      return { id: n.id, title: String(n.title || 'Untitled'), x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) }
    })
  }, [notes])

  const posById = useMemo(() => new Map(positions.map((p) => [p.id, p])), [positions])

  const handleNodeActivate = useCallback(
    (id) => {
      if (typeof onNodeClick === 'function') onNodeClick(id)
      else {
        // default behaviour: focus console (non-blocking)
        // eslint-disable-next-line no-console
        console.log('Node clicked', id)
      }
    },
    [onNodeClick]
  )

  if (isLoading) return <div role="status">Loading graph…</div>
  if (!notes.length) return <div role="status">No notes to graph</div>

  return (
    <figure aria-label="Knowledge graph">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 400 400"
        role="img"
        aria-labelledby="kg-title kg-desc"
        style={{ maxWidth: 600, height: 'auto' }}
      >
        <title id="kg-title">Knowledge graph</title>
        <desc id="kg-desc">Backlink relationships between notes visualized as nodes and edges</desc>

        <g stroke="#999" strokeWidth="1" fill="none">
          {edges.map((e, i) => {
            const a = posById.get(e.from)
            const b = posById.get(e.to)
            if (!a || !b) return null
            return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#bbb" />
          })}
        </g>

        {positions.map((p) => (
          <g
            key={p.id}
            tabIndex={0}
            role="button"
            aria-label={`Note ${p.title}`}
            transform={`translate(${p.x}, ${p.y})`}
            onClick={() => handleNodeActivate(p.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                handleNodeActivate(p.id)
              }
            }}
            style={{ cursor: 'pointer' }}
          >
            <circle cx={0} cy={0} r="26" fill="#fff" stroke="#333" />
            <text x={0} y={0} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 10, pointerEvents: 'none' }}>
              {p.title.length > 12 ? `${p.title.slice(0, 11)}…` : p.title}
            </text>
          </g>
        ))}
      </svg>
      <figcaption>Simple backlink graph (interactive nodes are keyboard focusable)</figcaption>
    </figure>
  )
}