import { useState } from 'react';
import { X, History, Star } from 'lucide-react';
import HistoryPanel from './HistoryPanel.jsx';
import FavoritesPanel from './FavoritesPanel.jsx';

export default function Sidebar({
  open,
  onClose,
  history,
  favorites,
  onReloadBatch,
  onClearHistory,
  onRemoveFavorite,
}) {
  const [tab, setTab] = useState('history');

  return (
    <>
      {/* Backdrop (mobile + desktop overlay) */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        className={`fixed right-0 top-0 z-40 flex h-full w-full max-w-sm flex-col border-l border-slate-200 bg-slate-50 shadow-xl transition-transform duration-300 dark:border-slate-800 dark:bg-slate-950 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Library</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close library"
            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-slate-200 px-3 pt-2 dark:border-slate-800">
          <TabButton active={tab === 'history'} onClick={() => setTab('history')}>
            <History size={15} /> History
            {history.length > 0 && <Badge>{history.length}</Badge>}
          </TabButton>
          <TabButton active={tab === 'favorites'} onClick={() => setTab('favorites')}>
            <Star size={15} /> Favorites
            {favorites.length > 0 && <Badge>{favorites.length}</Badge>}
          </TabButton>
        </div>

        {/* Panel body */}
        <div className="thin-scroll flex-1 overflow-y-auto">
          {tab === 'history' ? (
            <HistoryPanel
              history={history}
              onReload={(batch) => {
                onReloadBatch(batch);
                onClose();
              }}
              onClear={onClearHistory}
            />
          ) : (
            <FavoritesPanel favorites={favorites} onRemove={onRemoveFavorite} />
          )}
        </div>
      </aside>
    </>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`-mb-px inline-flex items-center gap-1.5 rounded-t-lg border-b-2 px-3 py-2 text-sm font-semibold transition ${
        active
          ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  );
}

function Badge({ children }) {
  return (
    <span className="ml-0.5 inline-flex min-w-[1.25rem] items-center justify-center rounded-full bg-slate-200 px-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}
