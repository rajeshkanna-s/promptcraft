import { useState } from 'react';
import { AlignLeft } from 'lucide-react';
import { fieldClass, labelClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

const WORDS =
  'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure in reprehenderit voluptate velit esse cillum eu fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(
    ' ',
  );

const rand = (n) => Math.floor(Math.random() * n);
const cap = (w) => w[0].toUpperCase() + w.slice(1);

function sentence() {
  const len = 8 + rand(10);
  const w = Array.from({ length: len }, () => WORDS[rand(WORDS.length)]);
  return cap(w.join(' ')) + '.';
}
function paragraph() {
  const len = 3 + rand(4);
  return Array.from({ length: len }, sentence).join(' ');
}

export default function LoremIpsum() {
  const [count, setCount] = useState(3);
  const [type, setType] = useState('paragraphs');
  const [startClassic, setStartClassic] = useState(true);
  const [output, setOutput] = useState('');

  const generate = () => {
    const n = Math.min(100, Math.max(1, Number(count) || 1));
    let out = '';
    if (type === 'paragraphs') out = Array.from({ length: n }, paragraph).join('\n\n');
    else if (type === 'sentences') out = Array.from({ length: n }, sentence).join(' ');
    else out = Array.from({ length: n }, () => WORDS[rand(WORDS.length)]).join(' ');
    if (startClassic) {
      out = out.replace(/^\S+\s\S+/, 'Lorem ipsum');
      if (!/^Lorem ipsum/.test(out)) out = 'Lorem ipsum ' + out;
    }
    setOutput(out);
  };

  return (
    <div>
      <ToolHeader
        icon={AlignLeft}
        title="Lorem Ipsum Generator"
        description="Generate placeholder text — paragraphs, sentences or words — for mockups and designs"
      />
      <UtilCard>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="li-count" className={labelClass}>
              How many
            </label>
            <input
              id="li-count"
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(e.target.value)}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="li-type" className={labelClass}>
              Type
            </label>
            <select
              id="li-type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={fieldClass}
            >
              <option value="paragraphs">Paragraphs</option>
              <option value="sentences">Sentences</option>
              <option value="words">Words</option>
            </select>
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={startClassic}
                onChange={(e) => setStartClassic(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
              Start with “Lorem ipsum”
            </label>
          </div>
        </div>
        <button
          type="button"
          onClick={generate}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:from-violet-700 hover:to-blue-700 sm:w-auto"
        >
          Generate
        </button>

        {output && (
          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Result</span>
              <CopyButton text={output} />
            </div>
            <div className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700 dark:border-slate-700 dark:bg-slate-950/40 dark:text-slate-300">
              {output}
            </div>
          </div>
        )}
      </UtilCard>
    </div>
  );
}
