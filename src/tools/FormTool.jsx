import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import { ToolHeader, ToolError, fieldClass, labelClass } from './ToolShell.jsx';

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

  const mainFields = fields.filter((f) => !f.advanced);
  const advFields = fields.filter((f) => f.advanced);

  const renderControl = (f) => {
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
    const missing = fields.find((f) => f.required && !String(values[f.name] ?? '').trim());
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

      <form
        onSubmit={submit}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        {/* Numbered main fields */}
        <div className="space-y-5">
          {mainFields.map((f, i) => (
            <div key={f.name}>
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
            </div>
          ))}
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
          {loading ? 'Creating…' : 'Create Content'}
        </button>
      </form>

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
