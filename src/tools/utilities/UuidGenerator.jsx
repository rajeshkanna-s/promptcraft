import { useCallback, useEffect, useState } from 'react';
import { Fingerprint, RefreshCw } from 'lucide-react';
import { labelClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

const uuid = () =>
  typeof crypto.randomUUID === 'function'
    ? crypto.randomUUID()
    : '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
        (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16),
      );

export default function UuidGenerator() {
  const [count, setCount] = useState(5);
  const [upper, setUpper] = useState(false);
  const [list, setList] = useState([]);

  const generate = useCallback(() => {
    const n = Math.min(100, Math.max(1, Number(count) || 1));
    const ids = Array.from({ length: n }, uuid);
    setList(upper ? ids.map((i) => i.toUpperCase()) : ids);
  }, [count, upper]);

  useEffect(() => {
    generate();
  }, [generate]);

  return (
    <div>
      <ToolHeader
        icon={Fingerprint}
        title="UUID Generator"
        description="Generate random version-4 UUIDs — one click, copy individually or all at once"
      />
      <UtilCard>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label htmlFor="uuid-count" className={labelClass}>
              How many
            </label>
            <input
              id="uuid-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className="w-28 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>
          <label className="flex items-center gap-2 pb-2 text-sm text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              checked={upper}
              onChange={(e) => setUpper(e.target.checked)}
              className="h-4 w-4 rounded accent-indigo-600"
            />
            Uppercase
          </label>
          <button
            type="button"
            onClick={generate}
            className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700"
          >
            <RefreshCw size={15} /> Generate
          </button>
          <CopyButton text={list.join('\n')} label="Copy all" className="pb-0" />
        </div>

        <div className="mt-4 space-y-2">
          {list.map((id, i) => (
            <div
              key={`${id}-${i}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-950/40"
            >
              <code className="select-all break-all font-mono text-sm text-slate-800 dark:text-slate-200">
                {id}
              </code>
              <CopyButton text={id} label="" />
            </div>
          ))}
        </div>
      </UtilCard>
    </div>
  );
}
