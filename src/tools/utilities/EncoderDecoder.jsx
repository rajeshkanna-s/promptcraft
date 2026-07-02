import { useMemo, useState } from 'react';
import { Binary } from 'lucide-react';
import { fieldClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

// Base64 helpers that are safe for Unicode (not just Latin-1).
const b64encode = (s) => btoa(unescape(encodeURIComponent(s)));
const b64decode = (s) => decodeURIComponent(escape(atob(s)));

export default function EncoderDecoder() {
  const [scheme, setScheme] = useState('base64'); // 'base64' | 'url'
  const [dir, setDir] = useState('encode'); // 'encode' | 'decode'
  const [input, setInput] = useState('');

  const { output, error } = useMemo(() => {
    if (!input) return { output: '', error: '' };
    try {
      const out =
        scheme === 'base64'
          ? dir === 'encode'
            ? b64encode(input)
            : b64decode(input)
          : dir === 'encode'
            ? encodeURIComponent(input)
            : decodeURIComponent(input);
      return { output: out, error: '' };
    } catch {
      return {
        output: '',
        error: `That input isn't valid ${scheme === 'base64' ? 'Base64' : 'URL-encoded'} text to decode.`,
      };
    }
  }, [input, scheme, dir]);

  const Toggle = ({ value, set, options }) => (
    <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => set(o.id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
            value === o.id
              ? 'bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-white dark:text-slate-300 dark:hover:bg-slate-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div>
      <ToolHeader
        icon={Binary}
        title="Base64 & URL Encoder / Decoder"
        description="Encode or decode text with Base64 or URL (percent) encoding — instantly, in your browser"
      />
      <UtilCard>
        <div className="flex flex-wrap items-center gap-3">
          <Toggle
            value={scheme}
            set={setScheme}
            options={[
              { id: 'base64', label: 'Base64' },
              { id: 'url', label: 'URL' },
            ]}
          />
          <Toggle
            value={dir}
            set={setDir}
            options={[
              { id: 'encode', label: 'Encode' },
              { id: 'decode', label: 'Decode' },
            ]}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <div>
            <span className="mb-1.5 block text-sm font-semibold text-slate-700 dark:text-slate-200">
              Input
            </span>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={7}
              placeholder={dir === 'encode' ? 'Text to encode…' : 'Text to decode…'}
              className={`${fieldClass} resize-y font-mono text-xs`}
            />
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Output</span>
              <CopyButton text={output} />
            </div>
            <div className="h-[calc(100%-2rem)] min-h-[10rem] overflow-auto whitespace-pre-wrap break-all rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-200">
              {error ? (
                <span className="text-red-600 dark:text-red-400">{error}</span>
              ) : (
                output || <span className="text-slate-400 dark:text-slate-600">Result appears here…</span>
              )}
            </div>
          </div>
        </div>
      </UtilCard>
    </div>
  );
}
