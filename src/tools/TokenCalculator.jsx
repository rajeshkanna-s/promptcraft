import { useMemo, useRef, useState } from 'react';
import { Calculator, Upload, X, Copy, Check } from 'lucide-react';
import { ToolHeader, fieldClass } from './ToolShell.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// Token Calculator — a client-side utility (no AI call). Paste text or upload a
// .txt / .md file and it estimates token count alongside characters, words, etc.
//
// Token counts are an ESTIMATE. Real tokenizers (GPT/Claude BPE) vary by model,
// but the widely used rule of thumb is ~4 characters per token for English, or
// ~0.75 words per token. We show a blended estimate and are upfront about it.
// ─────────────────────────────────────────────────────────────────────────────

const estimateTokens = (text) => {
  if (!text) return 0;
  const chars = text.length;
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  // Blend the two common heuristics for a steadier estimate.
  const byChars = chars / 4;
  const byWords = words / 0.75;
  return Math.max(1, Math.round((byChars + byWords) / 2));
};

function StatCard({ label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div
        className={`text-2xl font-extrabold tracking-tight ${
          accent
            ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-transparent dark:from-indigo-400 dark:to-fuchsia-400'
            : 'text-slate-800 dark:text-slate-100'
        }`}
      >
        {value.toLocaleString()}
      </div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </div>
    </div>
  );
}

export default function TokenCalculator() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileError, setFileError] = useState('');
  const [copied, setCopied] = useState(false);
  const fileRef = useRef(null);

  const stats = useMemo(() => {
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const lines = text ? text.split(/\n/).length : 0;
    return { tokens: estimateTokens(text), chars, charsNoSpaces, words, sentences, lines };
  }, [text]);

  const onFile = (file) => {
    setFileError('');
    if (!file) return;
    const okExt = /\.(txt|md|markdown|text)$/i.test(file.name);
    const okType = !file.type || /^text\//.test(file.type) || file.type === 'text/markdown';
    if (!okExt && !okType) {
      setFileError('Please upload a .txt or .md text file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError('File is too large (max 5 MB).');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setText(String(reader.result || ''));
      setFileName(file.name);
    };
    reader.onerror = () => setFileError('Could not read that file.');
    reader.readAsText(file);
  };

  const clear = () => {
    setText('');
    setFileName('');
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const copyReport = async () => {
    const report =
      `Tokens (est.): ${stats.tokens}\nCharacters: ${stats.chars}\n` +
      `Characters (no spaces): ${stats.charsNoSpaces}\nWords: ${stats.words}\n` +
      `Sentences: ${stats.sentences}\nLines: ${stats.lines}`;
    try {
      await navigator.clipboard.writeText(report);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div>
      <ToolHeader
        icon={Calculator}
        title="Token Calculator"
        description="Paste text or upload a .txt / .md file to estimate tokens, characters and words"
      />

      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 ring-1 ring-black/[0.02] dark:border-slate-800 dark:bg-slate-900 sm:p-7">
        <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

        <div className="mb-2 flex items-center justify-between gap-2">
          <label htmlFor="tc-text" className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Your text
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              <Upload size={14} /> Upload .txt / .md
            </button>
            {text && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
              >
                <X size={14} /> Clear
              </button>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".txt,.md,.markdown,.text,text/plain,text/markdown"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>

        <textarea
          id="tc-text"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            if (fileName) setFileName('');
          }}
          rows={9}
          placeholder="Paste or type your text here, or upload a .txt / .md file…"
          className={`${fieldClass} resize-y`}
        />

        {fileName && (
          <div className="mt-2 text-xs text-slate-400 dark:text-slate-500">
            Loaded from <span className="font-medium text-slate-500 dark:text-slate-400">{fileName}</span>
          </div>
        )}
        {fileError && (
          <div className="mt-2 text-xs font-medium text-red-600 dark:text-red-400">{fileError}</div>
        )}

        {/* Stats grid */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Tokens (est.)" value={stats.tokens} accent />
          <StatCard label="Characters" value={stats.chars} />
          <StatCard label="No spaces" value={stats.charsNoSpaces} />
          <StatCard label="Words" value={stats.words} />
          <StatCard label="Sentences" value={stats.sentences} />
          <StatCard label="Lines" value={stats.lines} />
        </div>

        <div className="mt-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">
            Token count is an estimate (~4 characters ≈ 1 token). Exact counts vary by model
            (GPT, Claude, …).
          </p>
          <button
            type="button"
            onClick={copyReport}
            disabled={!text}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied' : 'Copy report'}
          </button>
        </div>
      </div>
    </div>
  );
}
