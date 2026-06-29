import { useEffect, useRef, useState } from 'react';
import { PanelRightOpen } from 'lucide-react';
import InputPanel from '../components/InputPanel.jsx';
import ResultEditor from '../components/ResultEditor.jsx';
import PromptResults from '../components/PromptResults.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import Sidebar from '../components/Sidebar.jsx';
import { Lightbulb, LayoutGrid, PencilLine, CopyCheck, Check } from 'lucide-react';
import { generatePrompts, enhanceIdea, transformPrompt } from '../lib/api.js';
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
    .map((p, i) => `<h3>Prompt ${i + 1}</h3><p>${escapeHtml(p)}</p>`)
    .join('<hr>');
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
  const [enhancing, setEnhancing] = useState(false);
  const [error, setError] = useState('');
  const [resultMeta, setResultMeta] = useState({ input: '', type: 'text', tone: 'none' });
  const [instantReveal, setInstantReveal] = useState(false); // skip typewriter for history reloads
  const [busyIndex, setBusyIndex] = useState(-1); // which card is running a per-prompt action
  const [view, setView] = useState('cards'); // 'cards' | 'editor'
  const [copiedAll, setCopiedAll] = useState(false);

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
      setInstantReveal(false); // animate freshly generated prompts
      setResultMeta({
        input: idea,
        type: opts.type,
        typeOptions: opts.typeOptions,
        tone: opts.tone,
        length: opts.length,
        customChars: opts.customChars,
        count: opts.count,
      });

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

  // Expand the short seed idea into a richer brief.
  const handleEnhance = async () => {
    const idea = input.trim();
    if (!idea) {
      setError('Enter an idea to enhance first.');
      return;
    }
    setEnhancing(true);
    setError('');
    try {
      setInput(await enhanceIdea(idea));
    } catch (err) {
      setError(err.message || 'Could not enhance the idea.');
    } finally {
      setEnhancing(false);
    }
  };

  // Per-prompt action: regenerate / longer / shorter / translate one card.
  const handlePromptAction = async (index, action, language) => {
    setBusyIndex(index);
    setError('');
    try {
      const next = await transformPrompt({
        action,
        language,
        prompt: prompts[index],
        input: resultMeta.input,
        type: resultMeta.type,
        typeOptions: resultMeta.typeOptions,
        tone: resultMeta.tone,
        length: resultMeta.length,
        customChars: resultMeta.customChars,
      });
      setInstantReveal(false);
      setPrompts((prev) => prev.map((p, i) => (i === index ? next : p)));
    } catch (err) {
      setError(err.message || 'That action failed. Please try again.');
    } finally {
      setBusyIndex(-1);
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(prompts.join('\n\n'));
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1500);
    } catch {
      /* ignore */
    }
  };

  const handleReloadBatch = (batch) => {
    setInput(batch.input);
    setType(batch.type);
    setTypeOptions(batch.typeOptions || defaultTypeOptions(batch.type));
    setTone(batch.tone);
    setCount(batch.count);
    setLength(batch.length || 'medium');
    setCustomChars(batch.customChars || CUSTOM_LENGTH.default);
    setPrompts(batch.prompts);
    setInstantReveal(true); // show history instantly, no typewriter
    setResultMeta({
      input: batch.input,
      type: batch.type,
      typeOptions: batch.typeOptions || defaultTypeOptions(batch.type),
      tone: batch.tone,
      length: batch.length || 'medium',
      customChars: batch.customChars || CUSTOM_LENGTH.default,
      count: batch.count,
    });
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
            onEnhance={handleEnhance}
            enhancing={enhancing}
            loading={loading}
            error={error}
            canRegenerate={Boolean(resultMeta.input)}
          />

          <section ref={resultRef} className="scroll-mt-24">
            {loading ? (
              <LoadingResult label="Generating your prompts" />
            ) : prompts.length ? (
              <div>
                {/* Result toolbar: copy all + view toggle */}
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {prompts.length} {prompts.length === 1 ? 'prompt' : 'prompts'} ready
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyAll}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    >
                      {copiedAll ? (
                        <Check size={14} className="text-emerald-500" />
                      ) : (
                        <CopyCheck size={14} />
                      )}
                      {copiedAll ? 'Copied' : 'Copy all'}
                    </button>
                    <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                      <button
                        type="button"
                        onClick={() => setView('cards')}
                        aria-pressed={view === 'cards'}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                          view === 'cards'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        <LayoutGrid size={13} /> Cards
                      </button>
                      <button
                        type="button"
                        onClick={() => setView('editor')}
                        aria-pressed={view === 'editor'}
                        className={`inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                          view === 'editor'
                            ? 'bg-indigo-600 text-white shadow-sm'
                            : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                        }`}
                      >
                        <PencilLine size={13} /> Editor
                      </button>
                    </div>
                  </div>
                </div>

                {view === 'cards' ? (
                  <PromptResults
                    prompts={prompts}
                    instant={instantReveal}
                    isFavorite={isFavorite}
                    onToggleFavorite={toggleFavorite}
                    onAction={handlePromptAction}
                    busyIndex={busyIndex}
                  />
                ) : (
                  <ResultEditor content={promptsToHtml(prompts, resultMeta)} />
                )}
              </div>
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
