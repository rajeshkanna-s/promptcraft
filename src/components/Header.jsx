import { Sparkles, PanelRightOpen } from 'lucide-react';
import ThemeToggle from './ThemeToggle.jsx';

export default function Header({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
            <Sparkles size={18} />
          </span>
          <div className="leading-tight">
            <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
              PromptCraft
            </h1>
            <p className="hidden text-xs text-slate-500 dark:text-slate-400 sm:block">
              Turn a spark into a batch of polished prompts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <PanelRightOpen size={18} />
            <span className="hidden sm:inline">Library</span>
          </button>
        </div>
      </div>
    </header>
  );
}
