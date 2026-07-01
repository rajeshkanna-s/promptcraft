import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import { ToolHeader, ToolError, ToolFormCard, fieldClass, labelClass } from './ToolShell.jsx';

// Row of overlapping color dots that preview a swatch option.
function Swatches({ colors }) {
  return (
    <span className="flex shrink-0 -space-x-1.5">
      {colors.map((c, i) => (
        <span
          key={i}
          className="h-5 w-5 rounded-full border border-white shadow-sm dark:border-slate-800"
          style={{ background: c }}
        />
      ))}
    </span>
  );
}

// A dropdown whose trigger and options both show their colors clearly.
function SwatchSelect({ id, value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);
  const selected = options.find((o) => o.value === value);
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`${fieldClass} flex items-center justify-between gap-2 text-left`}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected ? <Swatches colors={selected.colors} /> : null}
          <span className="truncate">{selected ? selected.label : placeholder || 'Select…'}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="mt-2 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-sm dark:border-slate-700 dark:bg-slate-900 sm:grid-cols-3">
          {options.map((o) => {
            const active = o.value === value;
            return (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left text-xs font-medium transition ${
                  active
                    ? 'border-indigo-500 ring-2 ring-indigo-200 dark:ring-indigo-900'
                    : 'border-slate-200 hover:border-slate-300 dark:border-slate-700 dark:hover:border-slate-600'
                }`}
              >
                <Swatches colors={o.colors} />
                <span className="truncate text-slate-700 dark:text-slate-200">{o.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic, config-driven tool. Most simple "fill a form → get AI output" tools
// (e.g. the whole YouTube Tools suite) are just a config object passed here, so
// there's no need for a bespoke component per tool.
//
// config = {
//   icon, title, description,
//   fields: [{ name, label, type, placeholder, options, rows, default,
//              required, requiredMsg, advanced, emoji, maxLength }],
//   build: (values) => ({ system, user, maxTokens?, temperature? }),
//   loading: { label, messages },
//   result: { title, filename },
// }
// ─────────────────────────────────────────────────────────────────────────────
export default function FormTool({ config }) {
  const { icon, title, description, fields, build, loading: loadingCfg, result } = config;

  const [values, setValues] = useState(() =>
    Object.fromEntries(fields.map((f) => [f.name, f.default ?? ''])),
  );
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [output, setOutput] = useState('');

  const set = (name, v) => setValues((prev) => ({ ...prev, [name]: v }));

  // A field can declare `showIf: (values) => boolean` to appear conditionally.
  const isVisible = (f) => !f.showIf || f.showIf(values);
  const mainFields = fields.filter((f) => !f.advanced && isVisible(f));
  const advFields = fields.filter((f) => f.advanced && isVisible(f));

  const renderControl = (f) => {
    // Datalist: a text input with preset suggestions AND free custom entry.
    if (f.type === 'datalist') {
      return (
        <>
          <input
            id={`f-${f.name}`}
            list={`dl-${f.name}`}
            value={values[f.name]}
            onChange={(e) => set(f.name, e.target.value)}
            placeholder={f.placeholder}
            className={fieldClass}
          />
          <datalist id={`dl-${f.name}`}>
            {f.options.map((o) => (
              <option key={o} value={o} />
            ))}
          </datalist>
        </>
      );
    }
    // Swatch: a dropdown whose trigger + options show their colors clearly.
    if (f.type === 'swatch') {
      return (
        <SwatchSelect
          id={`f-${f.name}`}
          value={values[f.name]}
          onChange={(v) => set(f.name, v)}
          options={f.options}
          placeholder={f.placeholder}
        />
      );
    }
    if (f.type === 'select') {
      return (
        <select
          id={`f-${f.name}`}
          value={values[f.name]}
          onChange={(e) => set(f.name, e.target.value)}
          className={fieldClass}
        >
          {f.options.map((o) => {
            const value = typeof o === 'object' ? o.value : o;
            const label = typeof o === 'object' ? o.label : o;
            return (
              <option key={value} value={value}>
                {label}
              </option>
            );
          })}
        </select>
      );
    }
    if (f.type === 'textarea') {
      return (
        <>
          <textarea
            id={`f-${f.name}`}
            value={values[f.name]}
            onChange={(e) => set(f.name, e.target.value)}
            rows={f.rows || 5}
            maxLength={f.maxLength}
            placeholder={f.placeholder}
            className={`${fieldClass} resize-y`}
          />
          {f.maxLength && (
            <div className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
              {values[f.name].length.toLocaleString()}/{f.maxLength.toLocaleString()}
            </div>
          )}
        </>
      );
    }
    return (
      <input
        id={`f-${f.name}`}
        type={f.type === 'number' ? 'number' : 'text'}
        value={values[f.name]}
        onChange={(e) => set(f.name, e.target.value)}
        placeholder={f.placeholder}
        className={fieldClass}
      />
    );
  };

  const submit = async (e) => {
    e?.preventDefault();
    const missing = fields.find(
      (f) => isVisible(f) && f.required && !String(values[f.name] ?? '').trim(),
    );
    if (missing) {
      setError(missing.requiredMsg || `Please fill in “${missing.label}”.`);
      return;
    }
    setError('');
    setLoading(true);
    setOutput('');
    try {
      const { system, user, maxTokens = 2500, temperature = 0.8 } = build(values);
      const out = await generateText({ system, user, maxTokens, temperature });
      setOutput(out.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader icon={icon} title={title} description={description} />

      <ToolFormCard onSubmit={submit}>
        {/* Numbered main fields — 2-column horizontal grid; wide fields span both */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {mainFields.map((f, i) => {
            const wide = f.full || f.type === 'textarea' || f.type === 'swatch';
            return (
            <div key={f.name} className={wide ? 'sm:col-span-2' : ''}>
              <label htmlFor={`f-${f.name}`} className="mb-1.5 flex items-center gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-[11px] font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {f.emoji ? `${f.emoji} ` : ''}
                  {f.label}
                </span>
              </label>
              {renderControl(f)}
              {f.note && (
                <div className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                  {f.note}
                </div>
              )}
            </div>
            );
          })}
        </div>

        {/* Advanced settings (optional) */}
        {advFields.length > 0 && (
          <div className="mt-5">
            <button
              type="button"
              onClick={() => setShowAdvanced((o) => !o)}
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <span>
                Advanced Settings <span className="font-normal text-slate-400">(optional)</span>
              </span>
              <ChevronDown
                size={18}
                className={`transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
              />
            </button>
            {showAdvanced && (
              <div className="mt-3 grid grid-cols-1 gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700 sm:grid-cols-2">
                {advFields.map((f) => (
                  <div key={f.name}>
                    <label htmlFor={`f-${f.name}`} className={labelClass}>
                      {f.label}
                    </label>
                    {renderControl(f)}
                    {f.note && (
                      <div className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
                        {f.note}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-5">
          <ToolError message={error} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 focus:ring-2 focus:ring-violet-300 disabled:cursor-not-allowed disabled:opacity-60 dark:focus:ring-violet-900"
        >
          {loading ? 'Creating…' : (config.submitLabel || 'Create Content')}
        </button>
      </ToolFormCard>

      {loading ? (
        <div className="mt-6">
          <LoadingResult
            title={result.title}
            label={loadingCfg?.label || 'Creating your content'}
            messages={loadingCfg?.messages}
          />
        </div>
      ) : output ? (
        <div className="mt-6">
          <ResultEditor
            content={mdToHtml(output)}
            title={result.title}
            filename={result.filename}
            placeholder="Your generated content will appear here…"
          />
        </div>
      ) : null}
    </div>
  );
}
