import { useState } from 'react';
import {
  Star,
  Copy,
  Check,
  RefreshCw,
  Plus,
  Minus,
  Globe,
  MoreHorizontal,
  Loader2,
} from 'lucide-react';
import Typewriter from './Typewriter.jsx';
import { LANGUAGES } from '../tools/ToolShell.jsx';

function PromptCard({ index, text, instant, isFavorite, onToggleFavorite, onAction, busy }) {
  const [copied, setCopied] = useState(false);
  const [menu, setMenu] = useState(false);
  const [translateOpen, setTranslateOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const run = (action, language) => {
    setMenu(false);
    setTranslateOpen(false);
    onAction(action, language);
  };

  const menuItem =
    'flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-medium text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700 dark:text-slate-300 dark:hover:bg-slate-700';

  return (
    <div className="group relative rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-2 flex items-center justify-between">
        <span className="inline-flex items-center rounded-full bg-gradient-to-r from-indigo-100 to-fuchsia-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wide text-indigo-700 dark:from-indigo-950/60 dark:to-fuchsia-950/50 dark:text-indigo-300">
          Prompt {index + 1}
        </span>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            onClick={onToggleFavorite}
            title={isFavorite ? 'Remove favorite' : 'Save to favorites'}
            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg transition ${
              isFavorite
                ? 'text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-950/40'
                : 'text-slate-400 hover:bg-slate-100 hover:text-amber-500 dark:hover:bg-slate-800'
            }`}
          >
            <Star size={15} fill={isFavorite ? 'currentColor' : 'none'} />
          </button>
          <button
            type="button"
            onClick={copy}
            title="Copy"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            {copied ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setMenu((o) => !o)}
              title="More actions"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <MoreHorizontal size={15} />
            </button>
            {menu && (
              <div className="absolute right-0 z-20 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg dark:border-slate-700 dark:bg-slate-800">
                <button type="button" className={menuItem} onClick={() => run('regenerate')}>
                  <RefreshCw size={14} /> Regenerate
                </button>
                <button type="button" className={menuItem} onClick={() => run('longer')}>
                  <Plus size={14} /> Make longer
                </button>
                <button type="button" className={menuItem} onClick={() => run('shorter')}>
                  <Minus size={14} /> Make shorter
                </button>
                <button
                  type="button"
                  className={menuItem}
                  onClick={() => setTranslateOpen((o) => !o)}
                >
                  <Globe size={14} /> Translate…
                </button>
                {translateOpen && (
                  <div className="max-h-44 overflow-y-auto border-t border-slate-100 dark:border-slate-700">
                    {LANGUAGES.map((l) => (
                      <button
                        key={l}
                        type="button"
                        className={`${menuItem} pl-8`}
                        onClick={() => run('translate', l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
        <Typewriter text={text} instant={instant} startDelay={instant ? 0 : index * 220} />
      </p>

      {busy && (
        <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/70 backdrop-blur-[1px] dark:bg-slate-900/70">
          <Loader2 size={20} className="animate-spin text-indigo-500" />
        </div>
      )}
    </div>
  );
}

export default function PromptResults({
  prompts,
  instant,
  isFavorite,
  onToggleFavorite,
  onAction,
  busyIndex,
}) {
  // Adapt the column count to the number of prompts so a single result is
  // centered (instead of stranded on the left) and two results sit balanced.
  const count = prompts.length;
  const gridClass =
    count === 1
      ? 'grid-cols-1 max-w-2xl mx-auto'
      : count === 2
        ? 'grid-cols-1 sm:grid-cols-2 max-w-4xl mx-auto'
        : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3';

  return (
    <div className={`grid gap-4 ${gridClass}`}>
      {prompts.map((text, i) => (
        <PromptCard
          key={i}
          index={i}
          text={text}
          instant={instant}
          isFavorite={isFavorite(text)}
          onToggleFavorite={() => onToggleFavorite(text)}
          onAction={(action, language) => onAction(i, action, language)}
          busy={busyIndex === i}
        />
      ))}
    </div>
  );
}
