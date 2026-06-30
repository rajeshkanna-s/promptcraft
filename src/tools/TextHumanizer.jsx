import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { generateText } from '../lib/api.js';
import { mdToHtml } from '../lib/markdown.js';
import ResultEditor from '../components/ResultEditor.jsx';
import LoadingResult from '../components/LoadingResult.jsx';
import { ToolHeader, ToolError, ToolButton, ToolFormCard, fieldClass, labelClass, LANGUAGES } from './ToolShell.jsx';

const STRENGTHS = [
  { id: 'light', label: 'Light — light touch-up' },
  { id: 'balanced', label: 'Balanced — natural rewrite' },
  { id: 'strong', label: 'Strong — fully reworded' },
];

const TONES = ['Neutral', 'Casual', 'Friendly', 'Professional', 'Confident', 'Witty'];

export default function TextHumanizer() {
  const [text, setText] = useState('');
  const [strength, setStrength] = useState('balanced');
  const [tone, setTone] = useState('Neutral');
  const [language, setLanguage] = useState('English');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState('');

  const humanize = async (e) => {
    e?.preventDefault();
    if (!text.trim()) {
      setError('Paste the text you want to humanize first.');
      return;
    }
    setError('');
    setLoading(true);
    setResult('');
    try {
      const strengthClause = {
        light: 'Make light edits only — keep the wording close to the original.',
        balanced: 'Rewrite naturally while preserving the meaning and roughly the same length.',
        strong: 'Fully rephrase in fresh wording while keeping the meaning intact.',
      }[strength];

      const out = await generateText({
        system:
          'You are an expert editor who makes AI-generated text sound genuinely human. ' +
          'Remove robotic phrasing and AI clichés, vary sentence length and rhythm, use natural ' +
          'word choices and a confident voice, and keep it easy to read. Do NOT add new facts or ' +
          `change the meaning. Write the result in ${language} with a ${tone.toLowerCase()} tone. ` +
          `${strengthClause} Respond with ONLY the rewritten text (Markdown allowed), no preamble.`,
        user: `Humanize this text:\n\n${text.trim().slice(0, 20000)}`,
        maxTokens: 3000,
        temperature: 0.85,
      });
      setResult(out.trim());
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToolHeader
        icon={Wand2}
        title="Text Humanizer"
        description="Make AI-generated text sound natural and human"
      />

      <ToolFormCard onSubmit={humanize}>
        <label htmlFor="hum-text" className={labelClass}>
          Text to humanize
        </label>
        <textarea
          id="hum-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          placeholder="Paste AI-generated or robotic-sounding text here…"
          className={fieldClass}
        />
        <div className="mt-1 text-right text-xs text-slate-400 dark:text-slate-500">
          {text.length.toLocaleString()} characters
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="hum-strength" className={labelClass}>
              Strength
            </label>
            <select
              id="hum-strength"
              value={strength}
              onChange={(e) => setStrength(e.target.value)}
              className={fieldClass}
            >
              {STRENGTHS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hum-tone" className={labelClass}>
              Tone
            </label>
            <select
              id="hum-tone"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className={fieldClass}
            >
              {TONES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hum-lang" className={labelClass}>
              Language
            </label>
            <select
              id="hum-lang"
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

        <div className="mt-4">
          <ToolError message={error} />
        </div>

        <div className="mt-4">
          <ToolButton type="submit" loading={loading}>
            <Wand2 size={18} />
            {loading ? 'Humanizing…' : 'Humanize Text'}
          </ToolButton>
        </div>
      </ToolFormCard>

      {loading ? (
        <div className="mt-6">
          <LoadingResult
            title="Humanized text"
            label="Humanizing your text"
            messages={[
              'Reading your text…',
              'Smoothing the phrasing…',
              'Varying the rhythm…',
              'Adding a human touch…',
            ]}
          />
        </div>
      ) : result ? (
        <div className="mt-6">
          <ResultEditor
            content={mdToHtml(result)}
            title="Humanized text"
            filename="humanized"
            placeholder="Your humanized text will appear here…"
          />
        </div>
      ) : null}
    </div>
  );
}
