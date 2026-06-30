import { Wand2, RefreshCw, AlertCircle, Type, Image, Video, Sparkles, Shuffle, Loader2 } from 'lucide-react';
import {
  PROMPT_TYPES,
  TYPE_OPTIONS,
  TONES,
  COUNT_OPTIONS,
  LENGTHS,
  CUSTOM_LENGTH,
  CHARS_PER_TOKEN,
} from '../lib/constants.js';

// Icon per category, keyed by id.
const TYPE_ICONS = { text: Type, image: Image, video: Video };

// Quick-start example seeds shown as clickable chips.
const EXAMPLES = ['sunset beach', 'a cat detective', 'REST API in Go', 'cozy coffee shop'];

// Random ideas for the "Surprise me" button.
const SURPRISE_IDEAS = [
  'a lighthouse keeper who collects storms',
  'neon cyberpunk street market at night',
  'a productivity app for procrastinators',
  'time-travelling food critic',
  'a dragon who is afraid of fire',
  'minimalist logo for a space tea brand',
  'underwater city powered by jellyfish',
  'a detective novel set on Mars',
  'retro 80s synthwave album cover',
  'a polite robot learning to garden',
];

// Shared <select> styling.
const selectClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900';

const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';

export default function InputPanel({
  input,
  setInput,
  type,
  onTypeChange,
  typeOptions,
  setOption,
  tone,
  setTone,
  count,
  setCount,
  length,
  setLength,
  customChars,
  setCustomChars,
  customUnit,
  setCustomUnit,
  onGenerate,
  onRegenerate,
  onEnhance,
  enhancing,
  loading,
  error,
  canRegenerate,
}) {
  const trimmed = input.trim();
  const charCount = input.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const activeType = PROMPT_TYPES.find((t) => t.id === type);
  const optionGroups = TYPE_OPTIONS[type] || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  // ⌘/Ctrl+Enter generates from anywhere in the input.
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onGenerate();
    }
  };

  const surpriseMe = () =>
    setInput(SURPRISE_IDEAS[Math.floor(Math.random() * SURPRISE_IDEAS.length)]);

  return (
    <form
      onSubmit={handleSubmit}
      className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 ring-1 ring-black/[0.02] dark:border-slate-800 dark:bg-slate-900 sm:p-7"
    >
      {/* Gradient accent strip */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

      {/* Idea input */}
      <label htmlFor="idea" className={labelClass}>
        Your idea
      </label>
      <div className="relative">
        <input
          id="idea"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder='e.g. "sunset beach", "a cat detective", "REST API in Go"'
          maxLength={200}
          autoComplete="off"
          autoFocus
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pr-32 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
        />
        {/* Enhance my idea */}
        <button
          type="button"
          onClick={onEnhance}
          disabled={enhancing || loading}
          title="Let AI expand your idea into a richer brief"
          className="absolute right-2 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-2.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-indigo-600 hover:to-fuchsia-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {enhancing ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
          Enhance
        </button>
      </div>

      {/* Example chips + Surprise me */}
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="text-xs text-slate-400 dark:text-slate-500">Try:</span>
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setInput(ex)}
            className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-700 dark:hover:bg-indigo-950/40"
          >
            {ex}
          </button>
        ))}
        <button
          type="button"
          onClick={surpriseMe}
          className="inline-flex items-center gap-1 rounded-full border border-fuchsia-200 bg-fuchsia-50 px-2.5 py-0.5 text-xs font-semibold text-fuchsia-700 transition hover:bg-fuchsia-100 dark:border-fuchsia-900/60 dark:bg-fuchsia-950/40 dark:text-fuchsia-300"
        >
          <Shuffle size={12} /> Surprise me
        </button>
      </div>

      <div className="mt-1.5 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>{activeType?.hint}</span>
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount}/200
        </span>
      </div>

      {/* Prompt category — Text / Image / Video */}
      <div className="mt-4">
        <span className={labelClass}>Prompt type</span>
        <div className="grid grid-cols-3 gap-2">
          {PROMPT_TYPES.map((t) => {
            const Icon = TYPE_ICONS[t.id] || Type;
            const active = type === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => onTypeChange(t.id)}
                aria-pressed={active}
                className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition-all duration-150 ${
                  active
                    ? '-translate-y-px border-transparent bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                    : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-px hover:border-indigo-200 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-indigo-800 dark:hover:bg-slate-700'
                }`}
              >
                <Icon size={17} />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Type-specific options (aspect ratio, style, duration…) + Tone */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {optionGroups.map((group) => (
          <div key={group.key}>
            <label htmlFor={`opt-${group.key}`} className={labelClass}>
              {group.label}
            </label>
            <select
              id={`opt-${group.key}`}
              value={typeOptions[group.key] ?? group.default}
              onChange={(e) => setOption(group.key, e.target.value)}
              className={selectClass}
            >
              {group.choices.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label htmlFor="tone" className={labelClass}>
            Tone / style
          </label>
          <select
            id="tone"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className={selectClass}
          >
            {TONES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Count + Length selectors */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:gap-8">
        <div>
          <span className={labelClass}>How many prompts?</span>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            {COUNT_OPTIONS.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setCount(n)}
                aria-pressed={count === n}
                className={`min-w-[3rem] rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  count === n
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className={labelClass}>Prompt length</span>
          <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
            {LENGTHS.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLength(l.id)}
                aria-pressed={length === l.id}
                title={l.instruction}
                className={`rounded-lg px-4 py-2 text-sm font-semibold transition ${
                  length === l.id
                    ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom length input — only when "Custom" is selected.
          The budget can be set in characters or tokens; characters stay the
          canonical value, tokens are converted via CHARS_PER_TOKEN. */}
      {length === 'custom' && (() => {
        const isTokens = customUnit === 'tokens';
        const toDisplay = (chars) =>
          isTokens ? Math.round(chars / CHARS_PER_TOKEN) : chars;
        const toChars = (val) => (isTokens ? val * CHARS_PER_TOKEN : val);
        const bounds = {
          min: toDisplay(CUSTOM_LENGTH.min),
          max: toDisplay(CUSTOM_LENGTH.max),
        };
        const displayValue = toDisplay(customChars);
        const commit = (val) =>
          setCustomChars(
            Math.min(
              CUSTOM_LENGTH.max,
              Math.max(CUSTOM_LENGTH.min, Math.round(toChars(val))),
            ),
          );
        return (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor="customChars" className={`${labelClass} mb-0`}>
                Target {isTokens ? 'tokens' : 'characters'} per prompt (max {bounds.max})
              </label>
              {/* Unit toggle: characters ⇄ tokens */}
              <div className="inline-flex shrink-0 rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                {[
                  { id: 'chars', label: 'Chars' },
                  { id: 'tokens', label: 'Tokens' },
                ].map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setCustomUnit(u.id)}
                    aria-pressed={customUnit === u.id}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                      customUnit === u.id
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {u.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="customChars"
                type="range"
                min={bounds.min}
                max={bounds.max}
                step={isTokens ? 5 : 10}
                value={displayValue}
                onChange={(e) => commit(Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
              />
              <input
                type="number"
                min={bounds.min}
                max={bounds.max}
                value={displayValue}
                onChange={(e) => commit(Number(e.target.value))}
                onBlur={(e) => commit(Number(e.target.value) || toDisplay(CUSTOM_LENGTH.default))}
                className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
              />
              <span className="text-sm text-slate-400 dark:text-slate-500">
                {isTokens ? 'tokens' : 'chars'}
              </span>
            </div>
            <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
              {isTokens
                ? `≈ ${displayValue * CHARS_PER_TOKEN} characters`
                : `≈ ${Math.round(displayValue / CHARS_PER_TOKEN)} tokens`}
            </p>
          </div>
        );
      })()}

      {/* Inline error */}
      {error && (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-300"
        >
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          disabled={loading}
          className="group relative inline-flex flex-1 items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/40 focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-indigo-800"
        >
          {/* shine sweep on hover */}
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
          <Wand2 size={18} className={loading ? 'animate-pulse' : ''} />
          {loading ? 'Generating…' : 'Generate prompts'}
        </button>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={loading || !canRegenerate}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Regenerate
        </button>
      </div>
    </form>
  );
}
