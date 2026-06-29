import { Clock, Trash2, RotateCcw } from 'lucide-react';
import { PROMPT_TYPES } from '../lib/constants.js';

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function HistoryPanel({ history, onReload, onClear }) {
  if (!history.length) {
    return (
      <div className="px-4 py-10 text-center text-sm text-slate-500 dark:text-slate-400">
        <Clock size={22} className="mx-auto mb-2 opacity-50" />
        Your generated batches will appear here.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3">
      <button
        type="button"
        onClick={onClear}
        className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium text-slate-500 transition hover:text-red-600 dark:text-slate-400 dark:hover:text-red-400"
      >
        <Trash2 size={14} /> Clear all
      </button>

      {history.map((batch) => {
        const typeLabel =
          PROMPT_TYPES.find((t) => t.id === batch.type)?.label || 'General';
        return (
          <button
            key={batch.id}
            type="button"
            onClick={() => onReload(batch)}
            className="group w-full rounded-xl border border-slate-200 bg-white p-3 text-left transition hover:border-indigo-300 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-700"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">
                {batch.input}
              </span>
              <RotateCcw
                size={14}
                className="shrink-0 text-slate-400 opacity-0 transition group-hover:opacity-100"
              />
            </div>
            <div className="mt-1 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="rounded bg-slate-100 px-1.5 py-0.5 dark:bg-slate-800">
                {typeLabel}
              </span>
              <span>{batch.prompts.length} prompts</span>
              <span>·</span>
              <span>{timeAgo(batch.timestamp)}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
