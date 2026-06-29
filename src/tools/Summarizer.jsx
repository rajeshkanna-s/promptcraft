import { useState } from 'react';
import { FileText, Upload, Info } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import {
  ToolHeader,
  ToolError,
  ToolButton,
  fieldClass,
  labelClass,
  LANGUAGES,
} from './ToolShell.jsx';

// Templates change the default instructions sent to the model.
const TEMPLATES = [
  {
    id: 'highlights',
    label: 'Key Highlights & Summary',
    instructions:
      'Create a concise "Key Highlights & Summary" for the given transcript.\n\n' +
      '- Briefly state the purpose or main topic of the content.\n' +
      '- List the key points and highlights as clear, standalone bullets.\n' +
      '- End with a short 2-3 sentence overall summary.',
  },
  {
    id: 'detailed',
    label: 'Detailed Notes',
    instructions:
      'Produce detailed, well-organized notes from the transcript. Use headings for each ' +
      'major section, sub-bullets for supporting detail, and keep the original meaning intact.',
  },
  {
    id: 'bullets',
    label: 'Bullet Points',
    instructions: 'Summarize the transcript as a clean list of concise bullet points only.',
  },
  {
    id: 'actions',
    label: 'Action Items',
    instructions:
      'Extract all action items, decisions and follow-ups from the transcript. For each action ' +
      'item, note the owner (if mentioned) and any due date. Group under "Action Items", ' +
      '"Decisions" and "Open Questions".',
  },
  {
    id: 'executive',
    label: 'Executive Summary',
    instructions:
      'Write a short executive summary (max ~150 words) capturing the essence, key outcomes ' +
      'and implications of the content for a busy leader.',
  },
];

export default function Summarizer() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');
  const [templateId, setTemplateId] = useState('highlights');
  const [instructions, setInstructions] = useState(TEMPLATES[0].instructions);
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  const onTemplateChange = (id) => {
    setTemplateId(id);
    const tpl = TEMPLATES.find((t) => t.id === id);
    if (tpl) setInstructions(tpl.instructions);
  };

  // Read a plain-text / markdown file straight into the textarea.
  const onFile = async (file) => {
    if (!file) return;
    const isText = /\.(txt|md|markdown|csv|srt|vtt|log)$/i.test(file.name) || file.type.startsWith('text/');
    if (!isText) {
      setError(
        'Audio/video transcription needs a speech-to-text backend (not wired up here). ' +
          'Upload a .txt/.md transcript, or paste the text below.',
      );
      return;
    }
    setError('');
    setFileName(file.name);
    setText(await file.text());
  };

  const summarize = async (e) => {
    e?.preventDefault();
    if (!text.trim()) {
      setError('Paste a transcript / text, or upload a .txt file first.');
      return;
    }
    setError('');
    setLoading(true);
    setSummary('');
    try {
      // Guard against very long inputs (the proxy has a token ceiling).
      const content = text.trim().slice(0, 24000);
      const result = await generateText({
        system:
          `You are an expert summarizer. Follow the user's instructions exactly and write the ` +
          `output in ${language}. Use clean Markdown. Do not invent facts that are not in the text.`,
        user: `Instructions:\n${instructions}\n\n---\nTranscript / text to summarize:\n${content}`,
        maxTokens: 2000,
        temperature: 0.4,
      });
      setSummary(result.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader
        icon={FileText}
        title="AI Summarizer"
        description="Summarize transcripts, notes or any text with customizable templates"
      />

      <form
        onSubmit={summarize}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6"
      >
        {/* File upload (text files) */}
        <label
          htmlFor="sum-file"
          className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40 dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-indigo-600"
        >
          <Upload size={22} className="mb-2 text-slate-400" />
          <span className="text-sm font-medium text-indigo-600 dark:text-indigo-400">
            Click to upload a transcript file
          </span>
          <span className="mt-1 text-xs text-slate-400 dark:text-slate-500">
            .txt, .md, .srt, .vtt — or just paste below
          </span>
          {fileName && (
            <span className="mt-2 text-xs font-medium text-slate-600 dark:text-slate-300">
              Loaded: {fileName}
            </span>
          )}
          <input
            id="sum-file"
            type="file"
            accept=".txt,.md,.markdown,.csv,.srt,.vtt,.log,text/*"
            className="hidden"
            onChange={(e) => onFile(e.target.files?.[0])}
          />
        </label>

        {/* Paste area */}
        <div className="mt-4">
          <label htmlFor="sum-text" className={labelClass}>
            Transcript / text
          </label>
          <textarea
            id="sum-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={6}
            placeholder="Paste the transcript or text you want to summarize…"
            className={fieldClass}
          />
          <div className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
            {text.length.toLocaleString()} characters
          </div>
        </div>

        {/* Template + language */}
        <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="sum-template" className={labelClass}>
              Select Template
            </label>
            <select
              id="sum-template"
              value={templateId}
              onChange={(e) => onTemplateChange(e.target.value)}
              className={fieldClass}
            >
              {TEMPLATES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="sum-lang" className={labelClass}>
              Output Language
            </label>
            <select
              id="sum-lang"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className={fieldClass}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4">
          <label htmlFor="sum-instructions" className={labelClass}>
            Instructions
          </label>
          <textarea
            id="sum-instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            rows={3}
            className={`${fieldClass} resize-y`}
          />
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
          <Info size={14} className="mt-0.5 shrink-0" />
          <span>
            Audio/video & YouTube transcription require a speech-to-text backend. This tool
            summarizes pasted text or uploaded text transcripts.
          </span>
        </div>

        <div className="mt-4">
          <ToolError message={error} />
        </div>

        <div className="mt-4">
          <ToolButton type="submit" loading={loading}>
            <FileText size={18} />
            {loading ? 'Summarizing…' : 'Summarize'}
          </ToolButton>
        </div>
      </form>

      {loading ? (
        <div className="mt-6">
          <LoadingResult
            title="Summary"
            label="Summarizing your text"
            messages={[
              'Reading the transcript…',
              'Identifying key points…',
              'Organizing the highlights…',
              'Writing the summary…',
            ]}
          />
        </div>
      ) : summary ? (
        <div className="mt-6">
          <ResultEditor
            content={mdToHtml(summary)}
            title="Summary"
            filename="summary"
            placeholder="Your summary will appear here…"
          />
        </div>
      ) : null}
    </div>
  );
}
