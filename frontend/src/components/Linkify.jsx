import React, { Suspense } from 'react'
const LinkifyCore = React.lazy(() => import('linkify-react'))

export default function Linkify({ text }) {
  if (!text) return null
  return (
    <Suspense fallback={<span>{text}</span>}>
      <LinkifyCore options={{ target: '_blank', rel: 'noopener noreferrer' }}>{text}</LinkifyCore>
    </Suspense>
  )
}