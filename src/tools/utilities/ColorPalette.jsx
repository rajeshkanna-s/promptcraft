import { useCallback, useEffect, useState } from 'react';
import { Palette, RefreshCw, Check, Copy } from 'lucide-react';
import { UtilCard, ToolHeader } from './UtilShell.jsx';

const hslToHex = (h, s, l) => {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n) => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c)
      .toString(16)
      .padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};

const SCHEMES = [
  { id: 'analogous', label: 'Analogous' },
  { id: 'complementary', label: 'Complementary' },
  { id: 'triadic', label: 'Triadic' },
  { id: 'monochrome', label: 'Monochrome' },
  { id: 'random', label: 'Random' },
];

function buildPalette(scheme) {
  const base = Math.floor(Math.random() * 360);
  const out = [];
  for (let i = 0; i < 5; i++) {
    let h = base;
    let s = 60 + Math.floor(Math.random() * 25);
    let l = 45 + i * 8;
    if (scheme === 'analogous') h = (base + i * 30) % 360;
    else if (scheme === 'complementary') h = (base + (i % 2) * 180 + i * 8) % 360;
    else if (scheme === 'triadic') h = (base + (i % 3) * 120) % 360;
    else if (scheme === 'monochrome') {
      h = base;
      l = 25 + i * 14;
    } else if (scheme === 'random') h = Math.floor(Math.random() * 360);
    out.push(hslToHex(h, s, l));
  }
  return out;
}

function Swatch({ hex }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* ignore */
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      className="group relative flex h-32 flex-col justify-end overflow-hidden rounded-xl border border-slate-200 shadow-sm transition hover:shadow-md dark:border-slate-800 sm:h-44"
      style={{ background: hex }}
      title="Click to copy"
    >
      <span className="flex items-center justify-between gap-1 bg-white/85 px-2 py-1.5 text-xs font-semibold uppercase text-slate-700 backdrop-blur dark:bg-slate-900/80 dark:text-slate-200">
        {hex}
        {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} className="opacity-0 transition group-hover:opacity-100" />}
      </span>
    </button>
  );
}

export default function ColorPalette() {
  const [scheme, setScheme] = useState('analogous');
  const [palette, setPalette] = useState([]);

  const regen = useCallback(() => setPalette(buildPalette(scheme)), [scheme]);
  useEffect(() => {
    regen();
  }, [regen]);

  return (
    <div>
      <ToolHeader
        icon={Palette}
        title="Color Palette Generator"
        description="Generate beautiful color palettes — analogous, complementary, triadic and more. Click any swatch to copy its hex."
      />
      <UtilCard>
        <div className="flex flex-wrap items-center gap-2">
          {SCHEMES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setScheme(s.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                scheme === s.id
                  ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                  : 'border border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
          <button
            type="button"
            onClick={regen}
            className="ml-auto inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-violet-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700"
          >
            <RefreshCw size={14} /> Generate
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {palette.map((hex, i) => (
            <Swatch key={`${hex}-${i}`} hex={hex} />
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">
          Tip: press Generate for a fresh palette. Click a swatch to copy its hex code.
        </p>
      </UtilCard>
    </div>
  );
}
