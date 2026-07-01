import { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { QrCode, Download, Link as LinkIcon } from 'lucide-react';
import { ToolHeader, fieldClass, labelClass } from './ToolShell.jsx';

// ─────────────────────────────────────────────────────────────────────────────
// QR Code Generator — a client-side utility (no AI call). Enter a URL or any
// text, render a QR code to a canvas, and download it as PNG, JPG or PDF.
// Everything happens locally in the browser; nothing is sent to a server.
// ─────────────────────────────────────────────────────────────────────────────

const SIZES = [
  { value: 256, label: 'Small (256px)' },
  { value: 512, label: 'Medium (512px)' },
  { value: 800, label: 'Large (800px)' },
  { value: 1024, label: 'Extra large (1024px)' },
];

const ECC = [
  { value: 'L', label: 'Low (L)' },
  { value: 'M', label: 'Medium (M)' },
  { value: 'Q', label: 'Quartile (Q)' },
  { value: 'H', label: 'High (H) — best for logos' },
];

export default function QRCodeGenerator() {
  const [value, setValue] = useState('');
  const [size, setSize] = useState(512);
  const [ecc, setEcc] = useState('M');
  const [fg, setFg] = useState('#0f172a');
  const [bg, setBg] = useState('#ffffff');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const canvasRef = useRef(null);

  // Re-render the QR whenever inputs change.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const text = value.trim();
    if (!text) {
      setReady(false);
      const ctx = canvas.getContext('2d');
      ctx && ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    QRCode.toCanvas(
      canvas,
      text,
      {
        width: size,
        margin: 2,
        errorCorrectionLevel: ecc,
        color: { dark: fg, light: bg },
      },
      (err) => {
        if (err) {
          setError('Could not generate a QR code for that input.');
          setReady(false);
        } else {
          setError('');
          setReady(true);
        }
      },
    );
  }, [value, size, ecc, fg, bg]);

  const triggerDownload = (href, ext) => {
    const a = document.createElement('a');
    a.href = href;
    a.download = `qr-code.${ext}`;
    a.click();
  };

  const downloadImage = (type, ext) => {
    if (!ready || !canvasRef.current) return;
    triggerDownload(canvasRef.current.toDataURL(type, 0.95), ext);
  };

  const downloadPdf = async () => {
    if (!ready || !canvasRef.current) return;
    try {
      // Lazy-load jsPDF so it only ships when someone actually exports a PDF.
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ unit: 'pt', format: 'a4' });
      const img = canvasRef.current.toDataURL('image/png');
      const pageW = doc.internal.pageSize.getWidth();
      const boxW = 320; // points (~11cm)
      const x = (pageW - boxW) / 2;
      doc.addImage(img, 'PNG', x, 90, boxW, boxW);
      doc.setFontSize(12);
      doc.setTextColor(120);
      const caption = value.trim().slice(0, 90);
      doc.text(caption, pageW / 2, 90 + boxW + 28, { align: 'center', maxWidth: boxW + 80 });
      doc.save('qr-code.pdf');
    } catch {
      setError('Could not create the PDF. Please try PNG or JPG instead.');
    }
  };

  const btn =
    'inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-indigo-600 dark:hover:text-indigo-300';

  return (
    <div>
      <ToolHeader
        icon={QrCode}
        title="QR Code Generator"
        description="Turn any URL or text into a QR code, then download it as PNG, JPG or PDF"
      />

      <div className="grid gap-5 lg:grid-cols-2">
        {/* ── Controls ── */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 ring-1 ring-black/[0.02] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />

          <label htmlFor="qr-value" className={labelClass}>
            URL or text
          </label>
          <div className="relative">
            <LinkIcon
              size={16}
              className="pointer-events-none absolute left-3 top-3.5 text-slate-400 dark:text-slate-500"
            />
            <input
              id="qr-value"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="https://example.com  or any text"
              className={`${fieldClass} pl-9`}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qr-size" className={labelClass}>
                Size
              </label>
              <select
                id="qr-size"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className={fieldClass}
              >
                {SIZES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="qr-ecc" className={labelClass}>
                Error correction
              </label>
              <select
                id="qr-ecc"
                value={ecc}
                onChange={(e) => setEcc(e.target.value)}
                className={fieldClass}
              >
                {ECC.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="qr-fg" className={labelClass}>
                Foreground
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-fg"
                  type="color"
                  value={fg}
                  onChange={(e) => setFg(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">{fg}</span>
              </div>
            </div>
            <div>
              <label htmlFor="qr-bg" className={labelClass}>
                Background
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-bg"
                  type="color"
                  value={bg}
                  onChange={(e) => setBg(e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
                />
                <span className="text-sm text-slate-500 dark:text-slate-400">{bg}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 text-sm font-medium text-red-600 dark:text-red-400">{error}</div>
          )}
        </div>

        {/* ── Preview + downloads ── */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-lg shadow-indigo-500/5 ring-1 ring-black/[0.02] dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex aspect-square w-full max-w-xs items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40">
            {/* The canvas is always mounted so the ref exists; hidden until ready. */}
            <canvas
              ref={canvasRef}
              className={`h-full w-full rounded-lg ${ready ? 'block' : 'hidden'}`}
            />
            {!ready && (
              <div className="text-center text-slate-400 dark:text-slate-500">
                <QrCode size={40} className="mx-auto mb-2 opacity-40" />
                <p className="text-sm">Your QR code will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Download row (below the preview, never over the QR) ── */}
      <div className="mt-5 flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row">
        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">
          Download as
        </span>
        <div className="grid w-full grid-cols-3 gap-2 sm:w-auto sm:grid-cols-3">
          <button type="button" onClick={() => downloadImage('image/png', 'png')} disabled={!ready} className={btn}>
            <Download size={15} /> PNG
          </button>
          <button type="button" onClick={() => downloadImage('image/jpeg', 'jpg')} disabled={!ready} className={btn}>
            <Download size={15} /> JPG
          </button>
          <button type="button" onClick={downloadPdf} disabled={!ready} className={btn}>
            <Download size={15} /> PDF
          </button>
        </div>
      </div>
    </div>
  );
}
