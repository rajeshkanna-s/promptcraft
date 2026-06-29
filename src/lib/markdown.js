import { marked } from 'marked';

// Convert a Markdown string into HTML for the TipTap result editor.
// GFM on (tables, strikethrough), line breaks preserved.
marked.setOptions({ gfm: true, breaks: true });

export function mdToHtml(md) {
  if (!md) return '';
  try {
    return marked.parse(md);
  } catch {
    // Fallback: escape and wrap in a paragraph so nothing breaks.
    const esc = md.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return `<p>${esc.replace(/\n/g, '<br>')}</p>`;
  }
}
