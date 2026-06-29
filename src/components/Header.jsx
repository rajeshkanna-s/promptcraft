import { Sparkles, Wand2, LayoutGrid } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle.jsx';

const navClass = ({ isActive }) =>
  `inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`;

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2.5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-sm">
            <Sparkles size={18} />
          </span>
          <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
            PromptCraft
          </h1>
        </NavLink>

        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink to="/" end className={navClass}>
            <Wand2 size={16} />
            <span className="hidden sm:inline">Generator</span>
          </NavLink>
          <NavLink to="/tools" className={navClass}>
            <LayoutGrid size={16} />
            <span className="hidden sm:inline">Tools</span>
          </NavLink>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
