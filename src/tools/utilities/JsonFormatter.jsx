import { useMemo, useState } from 'react';
import { Braces, AlertCircle } from 'lucide-react';
import { fieldClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [indent, setIndent] = useState(2);
  const [minify, setMinify] = useState(false);

  const { output, error, valid } = useMemo(() => {
    if (!input.trim()) return { output: '', error: '', valid: null };
    try {
      const parsed = JSON.parse(input);
      const ind = indent === 0 ? '\t' : indent; // 0 → tab
      const out = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, ind);
      return { output: out, error: '', valid: true };
    } catch (e) {
      return { output: '', error: e.message, valid: false };
    }
  }, [input, indent, minify]);

  return (
    <div>
      <ToolHeader
        icon={Braces}
        title="JSON Formatter & Validator"
        description="Beautify, minify and validate JSON — see exactly where errors are, instantly"
      />
      <UtilCard>
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            Indent
            <select
              value={indent}
              onChange={(e) => setIndent(Number(e.target.value))}
              disabled={minify}
              className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
              <option value={0}>Tab</option>
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={minify}
              onChange={(e) => setMinify(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600"
            />
            Minify
          </label>
          {valid === true && (
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
              Valid JSON
            </span>
          )}
          {valid === false && (
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-400">
              Invalid JSON
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Input
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={12}
              placeholder='{"hello": "world"}'
              className={`${fieldClass} resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Output</span>
              <CopyButton text={output} />
            </div>
            <div className="min-h-[16rem] overflow-auto whitespace-pre rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
              {error ? (
                <span className="flex items-start gap-1.5 text-red-600 dark:text-red-400">
                  <AlertCircle size={14} className="mt-0.5 shrink-0" />
                  {error}
                </span>
              ) : (
                output || <span className="text-slate-400 dark:text-slate-600">Formatted JSON appears here…</span>
              )}
            </div>
          </div>
        </div>
      </UtilCard>
    </div>
  );
}
