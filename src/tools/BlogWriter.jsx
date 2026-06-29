import { useState } from 'react';
import { PenLine, Sparkles } from 'lucide-react';
import { generateText } from '../lib/api.js';
import {
  ToolHeader,
  ToolError,
  ToolButton,
  ToolResult,
  fieldClass,
  labelClass,
  LANGUAGES,
} from './ToolShell.jsx';

const CONTENT_SOURCES = [
  { id: 'ai', label: 'Create Blog Using AI' },
  { id: 'outline', label: 'Expand from my outline / notes' },
  { id: 'keywords', label: 'Write around my keywords' },
];

export default function BlogWriter() {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('ai');
  const [extra, setExtra] = useState(''); // outline / keywords when relevant
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [post, setPost] = useState('');

  // Suggest blog titles with AI (returns a few clickable ideas).
  const suggestTopics = async () => {
    setError('');
    setSuggesting(true);
    try {
      const seed = title.trim() || 'a popular, trending topic';
      const raw = await generateText({
        system:
          'You suggest catchy, specific blog post titles. Respond with ONLY a JSON array of 5 ' +
          'title strings, no markdown, no preamble.',
        user: `Suggest 5 blog post titles about: ${seed}`,
        maxTokens: 400,
        temperature: 0.9,
      });
      let ideas = [];
      try {
        const start = raw.indexOf('[');
        const end = raw.lastIndexOf(']');
        ideas = JSON.parse(raw.slice(start, end + 1));
      } catch {
        ideas = raw
          .split('\n')
          .map((l) => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').replace(/^["']|["',]+$/g, '').trim())
          .filter(Boolean)
          .slice(0, 5);
      }
      setSuggestions(ideas);
    } catch (err) {
      setError(err.message || 'Could not fetch suggestions.');
    } finally {
      setSuggesting(false);
    }
  };

  const generate = async (e) => {
    e?.preventDefault();
    if (!title.trim()) {
      setError('Please enter a blog title.');
      return;
    }
    setError('');
    setLoading(true);
    setPost('');
    try {
      const sourceClause =
        source === 'outline'
          ? `Base the article on this outline/notes:\n${extra}`
          : source === 'keywords'
            ? `Naturally incorporate these keywords: ${extra}`
            : 'Research and structure the article yourself.';

      const text = await generateText({
        system:
          'You are an expert blog writer and SEO copywriter. Write a complete, in-depth, ' +
          'well-structured blog post in Markdown. Use a clear H1 title, an engaging intro, ' +
          'logical H2/H3 sections, short paragraphs, bullet lists where useful, and a concise ' +
          'conclusion. Write in a natural, human, helpful tone.',
        user:
          `Write a blog post titled "${title.trim()}" in ${language}.\n${sourceClause}`,
        maxTokens: 4000,
        temperature: 0.8,
      });
      setPost(text.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader
        icon={PenLine}
        title="Blog Writer"
        description="Easily create in-depth blog posts for any topic"
      />

      <form
        onSubmit={generate}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        {/* Title */}
        <label htmlFor="blog-title" className={labelClass}>
          Enter Blog Title
        </label>
        <input
          id="blog-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your blog title"
          className={fieldClass}
        />
        <button
          type="button"
          onClick={suggestTopics}
          disabled={suggesting}
          className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-700 disabled:opacity-60 dark:text-indigo-400"
        >
          <Sparkles size={15} className={suggesting ? 'animate-pulse' : ''} />
          {suggesting ? 'Thinking…' : 'Suggest Blog Topics by AI'}
        </button>

        {suggestions.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setTitle(s)}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 transition hover:bg-indigo-100 dark:border-indigo-900/60 dark:bg-indigo-950/50 dark:text-indigo-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Content source */}
        <div className="mt-5">
          <label htmlFor="blog-source" className={labelClass}>
            Select the Content Source
          </label>
          <select
            id="blog-source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={fieldClass}
          >
            {CONTENT_SOURCES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {source !== 'ai' && (
          <div className="mt-4">
            <label htmlFor="blog-extra" className={labelClass}>
              {source === 'outline' ? 'Your outline / notes' : 'Your keywords'}
            </label>
            <textarea
              id="blog-extra"
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              rows={4}
              placeholder={
                source === 'outline'
                  ? '- Intro\n- Main point 1\n- Main point 2\n- Conclusion'
                  : 'e.g. remote work, productivity, time management'
              }
              className={fieldClass}
            />
          </div>
        )}

        {/* Language */}
        <div className="mt-4">
          <label htmlFor="blog-lang" className={labelClass}>
            Language
          </label>
          <select
            id="blog-lang"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={fieldClass}
          >
            {LANGUAGES.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-5">
          <ToolError message={error} />
        </div>

        <div className="mt-4">
          <ToolButton type="submit" loading={loading}>
            <Sparkles size={18} />
            {loading ? 'Writing your blog post…' : 'Generate Blog Post'}
          </ToolButton>
        </div>
      </form>

      <div className="mt-6">
        <ToolResult text={post} title="Your blog post" filename="blog-post" />
      </div>
    </div>
  );
}
