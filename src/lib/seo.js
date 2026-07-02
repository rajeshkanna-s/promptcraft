import { useEffect } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// Lightweight, dependency-free SEO. `useSeo` updates the document <title>, meta
// description, canonical link, and Open Graph / Twitter tags per route so each
// tool is an indexable, share-friendly page. Google renders client-side JS, so
// this is enough to give every route its own title/description in search.
// ─────────────────────────────────────────────────────────────────────────────

const SITE_NAME = 'PromptCraft';
const DEFAULT_TITLE = 'PromptCraft — AI Prompt Generator & Free AI Tools';
const DEFAULT_DESC =
  'Turn a short idea into a batch of high-quality AI prompts, plus 100+ free AI tools for writing, SEO, YouTube, code, marketing and more.';

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export function useSeo({ title, description, path } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} — ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description || DEFAULT_DESC;
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const url = origin + (path || (typeof window !== 'undefined' ? window.location.pathname : ''));

    document.title = fullTitle;
    setMeta('name', 'description', desc);
    setLink('canonical', url);

    // Open Graph
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', SITE_NAME);

    // Twitter (text-only card — no preview image by design)
    setMeta('name', 'twitter:card', 'summary');
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
  }, [title, description, path]);
}
