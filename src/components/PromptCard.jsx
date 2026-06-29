import { useState } from 'react';
import { Copy, Check, Star } from 'lucide-react';

export default function PromptCard({ index, text, isFavorite, onToggleFavorite }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API blocked — silently ignore.
    }
  };

  return (
    <div className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
          Prompt {index + 1}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onToggleFavorite}
            aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
              isFavorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800'
            }`}
          >
            <Star size={16} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={handleCopy}
            aria-label="Copy prompt"
            title="Copy prompt"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</p>
    </div>
  );
}
