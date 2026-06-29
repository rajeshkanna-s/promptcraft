import { Wand2, RefreshCw, AlertCircle } from 'lucide-react';
import { PROMPT_TYPES, TONES, COUNT_OPTIONS, LENGTHS, CUSTOM_LENGTH } from '../lib/constants.js';

// Shared <select> styling.
const selectClass =
  'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900';

const labelClass =
  'mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400';

export default function InputPanel({
  input,
  setInput,
  type,
  setType,
  tone,
  setTone,
  count,
  setCount,
  length,
  setLength,
  customChars,
  setCustomChars,
  onGenerate,
  onRegenerate,
  loading,
  error,
  canRegenerate,
}) {
  const trimmed = input.trim();
  const charCount = input.length;
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;
  const activeType = PROMPT_TYPES.find((t) => t.id === type);

  const handleSubmit = (e) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
    >
      {/* Idea input */}
      <label htmlFor="idea" className={labelClass}>
        Your idea
      </label>
      <input
        id="idea"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder='e.g. "sunset beach", "a cat detective", "REST API in Go"'
        maxLength={200}
        autoComplete="off"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
      />
      <div className="mt-1.5 flex justify-between text-xs text-slate-400 dark:text-slate-500">
        <span>{activeType?.hint}</span>
        <span>
          {wordCount} {wordCount === 1 ? 'word' : 'words'} · {charCount}/200
        </span>
      </div>

      {/* Controls row */}
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="type" className={labelClass}>
            Prompt type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className={selectClass}
          >
            {PROMPT_TYPES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

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
                    ? 'bg-indigo-600 text-white shadow-sm'
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
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom length input — only when "Custom" is selected */}
      {length === 'custom' && (
        <div className="mt-4">
          <label htmlFor="customChars" className={labelClass}>
            Target characters per prompt (max {CUSTOM_LENGTH.max})
          </label>
          <div className="flex items-center gap-3">
            <input
              id="customChars"
              type="range"
              min={CUSTOM_LENGTH.min}
              max={CUSTOM_LENGTH.max}
              step={10}
              value={customChars}
              onChange={(e) => setCustomChars(Number(e.target.value))}
              className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
            />
            <input
              type="number"
              min={CUSTOM_LENGTH.min}
              max={CUSTOM_LENGTH.max}
              value={customChars}
              onChange={(e) => setCustomChars(Number(e.target.value))}
              // Clamp into range when the field loses focus.
              onBlur={(e) => {
                const v = Number(e.target.value) || CUSTOM_LENGTH.default;
                setCustomChars(
                  Math.min(CUSTOM_LENGTH.max, Math.max(CUSTOM_LENGTH.min, Math.round(v))),
                );
              }}
              className="w-24 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:border-indigo-500 dark:focus:ring-indigo-900"
            />
            <span className="text-sm text-slate-400 dark:text-slate-500">chars</span>
          </div>
        </div>
      )}

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
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-indigo-800"
        >
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
