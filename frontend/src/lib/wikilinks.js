export function extractWikilinks(text = '') {
  const re = /\[\[([^\]]+)\]\]/g
  const out = []
  let m
  while ((m = re.exec(text)) !== null) out.push(m[1].trim())
  return [...new Set(out)]
}