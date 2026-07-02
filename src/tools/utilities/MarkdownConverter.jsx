import { useMemo, useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { fieldClass } from '../ToolShell.jsx';
import { mdToHtml } from '../../lib/markdown.js';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

const SAMPLE = `# Hello world

A **Markdown** to HTML converter.

- Bullet one
- Bullet two

> A quote, and some \`inline code\`.

[A link](https://example.com)`;

export default function MarkdownConverter() {
  const [md, setMd] = useState('');
  const [view, setView] = useState('preview'); // 'preview' | 'html'
  const html = useMemo(() => mdToHtml(md), [md]);

  return (
    <div>
      <ToolHeader
        icon={FileCode2}
        title="Markdown to HTML Converter"
        description="Write Markdown and get clean HTML — with a live preview and copyable output"
      />
      <UtilCard>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Markdown</span>
              <button
                type="button"
                onClick={() => setMd(SAMPLE)}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400"
              >
                Load sample
              </button>
            </div>
            <textarea
              value={md}
              onChange={(e) => setMd(e.target.value)}
              rows={14}
              placeholder="# Write Markdown here…"
              className={`${fieldClass} resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5 dark:border-slate-700 dark:bg-slate-800">
                {[
                  ['preview', 'Preview'],
                  ['html', 'HTML'],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setView(id)}
                    className={`rounded-md px-2.5 py-1 text-xs font-semibold transition ${
                      view === id
                        ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
                        : 'text-slate-500 hover:bg-white dark:text-slate-400 dark:hover:bg-slate-700'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <CopyButton text={html} label="Copy HTML" />
            </div>
            {view === 'preview' ? (
              <div
                className="pc-editor min-h-[20rem] max-h-[24rem] overflow-auto rounded-xl border border-slate-200 bg-white p-4 text-sm dark:border-slate-700 dark:bg-slate-950/40"
                dangerouslySetInnerHTML={{ __html: html || '<p class="text-slate-400">Preview appears here…</p>' }}
              />
            ) : (
              <div className="min-h-[20rem] max-h-[24rem] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
                {html || <span className="text-slate-400 dark:text-slate-600">HTML appears here…</span>}
              </div>
            )}
          </div>
        </div>
      </UtilCard>
    </div>
  );
}
