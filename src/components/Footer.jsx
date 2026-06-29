import { useState } from 'react';
import { CopyCheck, Check, FileDown, FileJson } from 'lucide-react';

// Sticky action bar shown once there are results: Copy All + Export (.txt / .json).
export default function Footer({ prompts, meta }) {
  const [copied, setCopied] = useState(false);
  const hasPrompts = prompts.length > 0;

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(prompts.join('\n\n'));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore */
    }
  };

  // Trigger a client-side file download with the given content + filename.
  const download = (content, filename, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const stamp = new Date().toISOString().slice(0, 10);

  const exportTxt = () => {
    const header = `PromptCraft — "${meta.input}" (${meta.type}/${meta.tone})\n\n`;
    const body = prompts.map((p, i) => `${i + 1}. ${p}`).join('\n\n');
    download(header + body, `promptcraft-${stamp}.txt`, 'text/plain');
  };

  const exportJson = () => {
    const payload = {
      input: meta.input,
      type: meta.type,
      tone: meta.tone,
      generatedAt: new Date().toISOString(),
      prompts,
    };
    download(JSON.stringify(payload, null, 2), `promptcraft-${stamp}.json`, 'application/json');
  };

  if (!hasPrompts) return null;

  return (
    <div className="sticky bottom-0 z-10 mt-6 border-t border-slate-200 bg-white/85 backdrop-blur dark:border-slate-800 dark:bg-slate-900/85">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {prompts.length} prompts ready
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportTxt}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <FileDown size={16} /> .txt
          </button>
          <button
            type="button"
            onClick={exportJson}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <FileJson size={16} /> .json
          </button>
          <button
            type="button"
            onClick={handleCopyAll}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            {copied ? <Check size={16} /> : <CopyCheck size={16} />}
            {copied ? 'Copied!' : 'Copy all'}
          </button>
        </div>
      </div>
    </div>
  );
}
