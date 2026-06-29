import { useEffect, useRef, useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import InputPanel from '../components/InputPanel.jsx';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Lightbulb } from 'lucide-react';
import { generatePrompts } from '../lib/api.js';
import { PROMPT_TYPES } from '../lib/constants.js';
import {
  loadHistory,
  saveBatch,
  clearHistory,
  loadFavorites,
  saveFavorites,
} from '../lib/storage.js';
import { CUSTOM_LENGTH, defaultTypeOptions } from '../lib/constants.js';

const escapeHtml = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// Render a batch of prompts into editor-ready HTML.
function promptsToHtml(prompts, meta) {
  if (!prompts.length) return '';
  const typeLabel = (PROMPT_TYPES.find((t) => t.id === meta.type)?.label || '').toLowerCase();
  const noun = `${typeLabel ? typeLabel + ' ' : ''}prompt${prompts.length === 1 ? '' : 's'}`;
  const intro = `Here ${prompts.length === 1 ? 'is' : 'are'} ${prompts.length} ${noun}${
    meta.input ? ` based on "${escapeHtml(meta.input)}"` : ''
  }:`;
  const body = prompts
    .map(
      (p, i) =>
        `<p><strong>Prompt ${i + 1}:</strong></p><p>${escapeHtml(p)}</p>`,
    )
    .join('');
  return `<p>${intro}</p>${body}`;
}

// The original PromptCraft prompt-generator, now a routed page at "/".
export default function GeneratorPage() {
  // ── Input state ──
  const [input, setInput] = useState('');
  const [type, setType] = useState('text');
  const [typeOptions, setTypeOptions] = useState(() => defaultTypeOptions('text'));
  const [tone, setTone] = useState('none');
  const [count, setCount] = useState(3);
  const [length, setLength] = useState('medium');
  const [customChars, setCustomChars] = useState(CUSTOM_LENGTH.default);

  // Switching category resets its options to sensible defaults.
  const handleTypeChange = (nextType) => {
    setType(nextType);
    setTypeOptions(defaultTypeOptions(nextType));
  };
  const setOption = (key, value) => setTypeOptions((prev) => ({ ...prev, [key]: value }));

  // ── Results state ──
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultMeta, setResultMeta] = useState({ input: '', type: 'text', tone: 'none' });

  // ── Persisted collections ──
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const resultRef = useRef(null);

  useEffect(() => {
    setHistory(loadHistory());
    setFavorites(loadFavorites());
  }, []);

  // When a generation kicks off, smoothly scroll the result area into view so
  // the user sees the loading animation and then the result.
  useEffect(() => {
    if (loading) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [loading]);

  const runGeneration = async (overrides = {}) => {
    const opts = { input, type, typeOptions, tone, count, length, customChars, ...overrides };
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
        typeOptions: opts.typeOptions,
        tone: opts.tone,
        length: opts.length,
        customChars: opts.customChars,
      });
      setPrompts(result);
      setResultMeta({ input: idea, type: opts.type, tone: opts.tone });

      const batch = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        input: idea,
        type: opts.type,
        typeOptions: opts.typeOptions,
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

  const handleReloadBatch = (batch) => {
    setInput(batch.input);
    setType(batch.type);
    setTypeOptions(batch.typeOptions || defaultTypeOptions(batch.type));
    setTone(batch.tone);
    setCount(batch.count);
    setLength(batch.length || 'medium');
    setCustomChars(batch.customChars || CUSTOM_LENGTH.default);
    setPrompts(batch.prompts);
    setResultMeta({ input: batch.input, type: batch.type, tone: batch.tone });
    setError('');
  };

  const handleClearHistory = () => setHistory(clearHistory());

  const isFavorite = (text) => favorites.includes(text);
  const toggleFavorite = (text) => {
    setFavorites((prev) => {
      const next = prev.includes(text) ? prev.filter((p) => p !== text) : [text, ...prev];
      saveFavorites(next);
      return next;
    });
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
              Prompt Generator
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Turn a spark into a batch of polished prompts
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
          >
            <PanelRightOpen size={18} />
            <span className="hidden sm:inline">Library</span>
          </button>
        </div>

        <div className="grid gap-6">
          <InputPanel
            input={input}
            setInput={setInput}
            type={type}
            onTypeChange={handleTypeChange}
            typeOptions={typeOptions}
            setOption={setOption}
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

          <section ref={resultRef} className="scroll-mt-24">
            {loading ? (
              <LoadingResult />
            ) : prompts.length ? (
              <ResultEditor content={promptsToHtml(prompts, resultMeta)} />
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
                <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300">
                  <Lightbulb size={22} />
                </span>
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  No prompts yet
                </h3>
                <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                  Type an idea above, pick a type and tone, then hit{' '}
                  <span className="font-medium text-indigo-600 dark:text-indigo-400">Generate</span>.
                </p>
              </div>
            )}
          </section>
        </div>
      </main>

      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        history={history}
        favorites={favorites}
        onReloadBatch={handleReloadBatch}
        onClearHistory={handleClearHistory}
        onRemoveFavorite={toggleFavorite}
      />
    </>
  );
}
