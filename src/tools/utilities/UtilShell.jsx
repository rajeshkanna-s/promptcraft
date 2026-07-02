import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ToolHeader } from '../ToolShell.jsx';

// Elevated card with the shared gradient accent strip.
export function UtilCard({ children, className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 dark:border-slate-800 dark:bg-slate-900 sm:p-7 ${className}`}
    >
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
      {children}
    </div>
  );
}

// Copy-to-clipboard button with a transient "Copied" state.
export function CopyButton({ text, label = 'Copy', className = '' }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      disabled={!text}
      className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 ${className}`}
    >
      {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
      {copied ? 'Copied' : label}
    </button>
  );
}

export { ToolHeader };
