import DOMPurify from "dompurify";

const urlRegex = /((https?:\/\/|www\.)[^\s<]+)/gi;

export function linkifyText(text = "") {
  const escaped = DOMPurify.sanitize(text, { ALLOWED_TAGS: [] });

  const withLinks = escaped.replace(urlRegex, (url) => {
    const href = url.startsWith("www.") ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer">${url}</a>`;
  });

  return withLinks;
}
