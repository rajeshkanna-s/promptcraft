import { useCallback, useEffect, useState } from 'react';
import { KeyRound, RefreshCw } from 'lucide-react';
import { labelClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

const SETS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
};

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({ lower: true, upper: true, numbers: true, symbols: true });
  const [password, setPassword] = useState('');

  const generate = useCallback(() => {
    const pool = Object.entries(opts)
      .filter(([, on]) => on)
      .map(([k]) => SETS[k])
      .join('');
    if (!pool) {
      setPassword('');
      return;
    }
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    let pw = '';
    for (let i = 0; i < length; i++) pw += pool[arr[i] % pool.length];
    setPassword(pw);
  }, [length, opts]);

  useEffect(() => {
    generate();
  }, [generate]);

  const activeCount = Object.values(opts).filter(Boolean).length;
  const strength =
    length >= 16 && activeCount >= 3
      ? { label: 'Strong', cls: 'text-emerald-600 dark:text-emerald-400', w: '100%' }
      : length >= 10 && activeCount >= 2
        ? { label: 'Medium', cls: 'text-amber-600 dark:text-amber-400', w: '60%' }
        : { label: 'Weak', cls: 'text-red-600 dark:text-red-400', w: '30%' };

  return (
    <div>
      <ToolHeader
        icon={KeyRound}
        title="Password Generator"
        description="Generate strong, random passwords right in your browser — nothing is sent anywhere"
      />
      <UtilCard>
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40">
          <code className="flex-1 select-all break-all font-mono text-lg text-slate-800 dark:text-slate-100">
            {password || '—'}
          </code>
          <button
            type="button"
            onClick={generate}
            title="Regenerate"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <RefreshCw size={16} />
          </button>
          <CopyButton text={password} />
        </div>

        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400">Strength</span>
            <span className={`font-semibold ${strength.cls}`}>{strength.label}</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 transition-all"
              style={{ width: strength.w }}
            />
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="pw-len" className={labelClass}>
            Length: {length}
          </label>
          <input
            id="pw-len"
            type="range"
            min={4}
            max={64}
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['lower', 'a-z'],
            ['upper', 'A-Z'],
            ['numbers', '0-9'],
            ['symbols', '!@#'],
          ].map(([key, label]) => (
            <label
              key={key}
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300"
            >
              <input
                type="checkbox"
                checked={opts[key]}
                onChange={(e) => setOpts((o) => ({ ...o, [key]: e.target.checked }))}
                className="h-4 w-4 rounded accent-indigo-600"
              />
              {label}
            </label>
          ))}
        </div>
      </UtilCard>
    </div>
  );
}
