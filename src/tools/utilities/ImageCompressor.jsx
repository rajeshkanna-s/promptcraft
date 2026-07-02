import { useRef, useState } from 'react';
import { ImageDown, Upload, Download } from 'lucide-react';
import { labelClass } from '../ToolShell.jsx';
import { UtilCard, ToolHeader } from './UtilShell.jsx';

const fmtBytes = (b) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(2)} MB`;
};

export default function ImageCompressor() {
  const [src, setSrc] = useState(null); // { url, name, size, w, h }
  const [quality, setQuality] = useState(0.7);
  const [maxWidth, setMaxWidth] = useState(1600);
  const [format, setFormat] = useState('image/jpeg');
  const [result, setResult] = useState(null); // { url, size, w, h }
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);

  const onFile = (file) => {
    setError('');
    setResult(null);
    if (!file) return;
    if (!/^image\//.test(file.type)) {
      setError('Please choose an image file (JPG, PNG, WebP…).');
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () =>
      setSrc({ url, name: file.name, size: file.size, w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => setError('Could not read that image.');
    img.src = url;
  };

  const compress = () => {
    if (!src) return;
    setBusy(true);
    setError('');
    const img = new Image();
    img.onload = () => {
      const scale = maxWidth && img.naturalWidth > maxWidth ? maxWidth / img.naturalWidth : 1;
      const w = Math.round(img.naturalWidth * scale);
      const h = Math.round(img.naturalHeight * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (format === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, w, h);
      }
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            setError('Compression failed. Try a different format.');
            setBusy(false);
            return;
          }
          setResult({ url: URL.createObjectURL(blob), size: blob.size, w, h });
          setBusy(false);
        },
        format,
        quality,
      );
    };
    img.onerror = () => {
      setError('Could not process that image.');
      setBusy(false);
    };
    img.src = src.url;
  };

  const download = () => {
    if (!result) return;
    const ext = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';
    const a = document.createElement('a');
    a.href = result.url;
    a.download = `compressed.${ext}`;
    a.click();
  };

  const saved = src && result ? Math.max(0, Math.round((1 - result.size / src.size) * 100)) : 0;

  return (
    <div>
      <ToolHeader
        icon={ImageDown}
        title="Image Compressor & Resizer"
        description="Shrink and resize JPG, PNG or WebP images in your browser — no upload to any server"
      />
      <UtilCard>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Upload size={15} /> Choose image
          </button>
          {src && (
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {src.name} · {src.w}×{src.h} · {fmtBytes(src.size)}
            </span>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </div>

        {error && <div className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>}

        {src && (
          <>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="ic-q" className={labelClass}>
                  Quality: {Math.round(quality * 100)}%
                </label>
                <input
                  id="ic-q"
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-indigo-600 dark:bg-slate-700"
                />
              </div>
              <div>
                <label htmlFor="ic-w" className={labelClass}>
                  Max width (px)
                </label>
                <input
                  id="ic-w"
                  type="number"
                  min={100}
                  value={maxWidth}
                  onChange={(e) => setMaxWidth(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label htmlFor="ic-f" className={labelClass}>
                  Output format
                </label>
                <select
                  id="ic-f"
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/webp">WebP</option>
                  <option value="image/png">PNG</option>
                </select>
              </div>
            </div>

            <button
              type="button"
              onClick={compress}
              disabled={busy}
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 disabled:opacity-60"
            >
              {busy ? 'Compressing…' : 'Compress image'}
            </button>
          </>
        )}

        {result && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950/40">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <span className="font-semibold text-slate-800 dark:text-slate-100">
                  {fmtBytes(result.size)}
                </span>{' '}
                · {result.w}×{result.h}{' '}
                {saved > 0 && (
                  <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                    −{saved}% smaller
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={download}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <Download size={14} /> Download
              </button>
            </div>
            <img
              src={result.url}
              alt="Compressed preview"
              className="mt-3 max-h-72 w-auto rounded-lg border border-slate-200 dark:border-slate-700"
            />
          </div>
        )}
      </UtilCard>
    </div>
  );
}
