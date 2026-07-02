import { useState } from 'react';
import { CaseSensitive, Copy, Check } from 'lucide-react';
import { ToolHeader, fieldClass } from '../ToolShell.jsx';

const toTitle = (s) => s.replace(/\w\S*/g, (t) => t[0].toUpperCase() + t.slice(1).toLowerCase());
const toSentence = (s) =>
  s.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) => c.toUpperCase());
const words = (s) => s.trim().split(/\s+/).filter(Boolean);
const toCamel = (s) =>
  words(s)
    .map((w, i) => (i === 0 ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1).toLowerCase()))
    .join('');
const toSnake = (s) => words(s).map((w) => w.toLowerCase()).join('_');
const toKebab = (s) => words(s).map((w) => w.toLowerCase()).join('-');

const MODES = [
  { id: 'upper', label: 'UPPERCASE', fn: (s) => s.toUpperCase() },
  { id: 'lower', label: 'lowercase', fn: (s) => s.toLowerCase() },
  { id: 'title', label: 'Title Case', fn: toTitle },
  { id: 'sentence', label: 'Sentence case', fn: toSentence },
  { id: 'camel', label: 'camelCase', fn: toCamel },
  { id: 'snake', label: 'snake_case', fn: toSnake },
  { id: 'kebab', label: 'kebab-case', fn: toKebab },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState('upper');
  const [copied, setCopied] = useState(false);
  const out = MODES.find((m) => m.id === mode).fn(text);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(out);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <ToolHeader
        icon={CaseSensitive}
        title="Case Converter"
        description="Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case and more"
      />
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type or paste your text…"
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                mode === m.id
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Result</span>
          <button
            type="button"
            onClick={copy}
            disabled={!out}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <div className="mt-2 min-h-[4rem] whitespace-pre-wrap break-words rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
          {out || <span className="text-slate-400 dark:text-slate-600">Result appears here…</span>}
        </div>
      </div>
    </div>
  );
}
