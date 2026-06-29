import { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import InputPanel from './components/InputPanel.jsx';
import ResultsGrid from './components/ResultsGrid.jsx';
import Sidebar from './components/Sidebar.jsx';
import Footer from './components/Footer.jsx';
import { generatePrompts } from './lib/api.js';
import {
  loadHistory,
  saveBatch,
  clearHistory,
  loadFavorites,
  saveFavorites,
} from './lib/storage.js';
import { CUSTOM_LENGTH } from './lib/constants.js';

export default function App() {
  // ── Input state ──
  const [input, setInput] = useState('');
  const [type, setType] = useState('general');
  const [tone, setTone] = useState('none');
  const [count, setCount] = useState(3);
  const [length, setLength] = useState('medium');
  const [customChars, setCustomChars] = useState(CUSTOM_LENGTH.default);

  // ── Results state ──
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  // Snapshot of the settings that produced the current results (used for export).
  const [resultMeta, setResultMeta] = useState({ input: '', type: 'image', tone: 'none' });

  // ── Persisted collections ──
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    setHistory(loadHistory());
    setFavorites(loadFavorites());
  }, []);

  // Core generation routine — shared by Generate and Regenerate.
  const runGeneration = async (overrides = {}) => {
    const opts = { input, type, tone, count, length, customChars, ...overrides };
    const idea = opts.input.trim();

    if (!idea) {
      setError('Please enter a word or short idea first.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await generatePrompts({
        input: idea,
        count: opts.count,
        type: opts.type,
        tone: opts.tone,
        length: opts.length,
        customChars: opts.customChars,
      });
      setPrompts(result);
      setResultMeta({ input: idea, type: opts.type, tone: opts.tone });

      // Persist this batch into history (most-recent first, capped at 20).
      const batch = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        input: idea,
        type: opts.type,
        tone: opts.tone,
        count: opts.count,
        length: opts.length,
        customChars: opts.customChars,
        prompts: result,
      };
      setHistory(saveBatch(batch));
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = () => runGeneration();
  const handleRegenerate = () => runGeneration();

  // Reload a stored batch back into the workspace.
  const handleReloadBatch = (batch) => {
    setInput(batch.input);
    setType(batch.type);
    setTone(batch.tone);
    setCount(batch.count);
    setLength(batch.length || 'medium');
    setCustomChars(batch.customChars || CUSTOM_LENGTH.default);
    setPrompts(batch.prompts);
    setResultMeta({ input: batch.input, type: batch.type, tone: batch.tone });
    setError('');
  };

  const handleClearHistory = () => setHistory(clearHistory());

  // ── Favorites (dedup by exact prompt text) ──
  const isFavorite = (text) => favorites.includes(text);

  const toggleFavorite = (text) => {
    setFavorites((prev) => {
      const next = prev.includes(text) ? prev.filter((p) => p !== text) : [text, ...prev];
      saveFavorites(next);
      return next;
    });
  };

  return (
    <div className="min-h-full bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Header onToggleSidebar={() => setSidebarOpen(true)} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="grid gap-6">
          <InputPanel
            input={input}
            setInput={setInput}
            type={type}
            setType={setType}
            tone={tone}
            setTone={setTone}
            count={count}
            setCount={setCount}
            length={length}
            setLength={setLength}
            customChars={customChars}
            setCustomChars={setCustomChars}
            onGenerate={handleGenerate}
            onRegenerate={handleRegenerate}
            loading={loading}
            error={error}
            canRegenerate={Boolean(resultMeta.input)}
          />

          <section>
            <ResultsGrid
              prompts={prompts}
              loading={loading}
              count={count}
              isFavorite={isFavorite}
              onToggleFavorite={toggleFavorite}
            />
          </section>
        </div>
      </main>

      <Footer prompts={prompts} meta={resultMeta} />

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        favorites={favorites}
        onReloadBatch={handleReloadBatch}
        onClearHistory={handleClearHistory}
        onRemoveFavorite={toggleFavorite}
      />
    </div>
  );
}
