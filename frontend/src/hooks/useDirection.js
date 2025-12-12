import { useEffect, useState } from 'react'

export function useDirection() {
  const [dir, setDir] = useState(document.documentElement.dir || 'ltr')
  useEffect(() => {
    const lang = document.documentElement.lang || navigator.language || 'en'
    const isRtl = ['ar','he','fa','ur'].some(code => lang.startsWith(code))
    const newDir = isRtl ? 'rtl' : 'ltr'
    document.documentElement.dir = newDir
    setDir(newDir)
  }, [])
  return dir
}