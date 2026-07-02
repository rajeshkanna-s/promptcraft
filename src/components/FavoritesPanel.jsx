import { useMemo, useState } from 'react';
import { Star, Copy, Check, X, Search, Download } from 'lucide-react';

function FavoriteRow({ text, onRemove }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{text}</p>
      <div className="mt-2 flex justify-end gap-1">
        <button
          type="button"
          onClick={handleCopy}
          title="Copy"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          title="Remove favorite"
          className="inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 dark:hover:text-red-400"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function FavoritesPanel({ favorites, onRemove }) {
  const [q, setQ] = useState('');
  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return term ? favorites.filter((t) => t.toLowerCase().includes(term)) : favorites;
  }, [favorites, q]);

  const exportTxt = () => {
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([favorites.join('\n\n---\n\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `promptcraft-favorites-${stamp}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!favorites.length) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        <Star size={22} className="mx-auto mb-2 opacity-50" />
        Star a prompt to keep it here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search favorites…"
          className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:focus:ring-indigo-950"
        />
      </div>
      <button
        type="button"
        onClick={exportTxt}
        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400"
      >
        <Download size={14} /> Export
      </button>

      {filtered.length === 0 && (
        <p className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
          No favorites match “{q}”.
        </p>
      )}

      {filtered.map((text, i) => (
        <FavoriteRow key={`${i}-${text.slice(0, 24)}`} text={text} onRemove={() => onRemove(text)} />
      ))}
    </div>
  );
}
