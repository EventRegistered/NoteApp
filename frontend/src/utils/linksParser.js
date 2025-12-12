export function extractLinks(text = "") {
  const re = /\[\[([^\]]+)\]\]/g;
  const matches = [];

  let m;
  while ((m = re.exec(text)) !== null) {
    matches.push(m[1].trim());
  }

  return matches;
}
