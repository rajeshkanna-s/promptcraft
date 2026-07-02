import { useMemo, useState } from 'react';
import { Type } from 'lucide-react';
import { fieldClass } from '../ToolShell.jsx';
import { UtilCard, CopyButton, ToolHeader } from './UtilShell.jsx';

function Stat({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="text-2xl font-extrabold tracking-tight text-slate-800 dark:text-slate-100">
        {value}
      </div>
      <div className="mt-0.5 text-xs font-medium uppercase tracking-wide text-slate-400 dark:text-slate-500">
        {label}
      </div>
    </div>
  );
}

export default function WordCounter() {
  const [text, setText] = useState('');
  const s = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length;
    const paragraphs = text.trim() ? text.trim().split(/\n{2,}/).filter(Boolean).length : 0;
    const readMin = Math.max(0, Math.round((words / 200) * 10) / 10); // ~200 wpm
    return { words, chars, charsNoSpaces, sentences, paragraphs, readMin };
  }, [text]);

  return (
    <div>
      <ToolHeader
        icon={Type}
        title="Word & Character Counter"
        description="Count words, characters, sentences, paragraphs and estimated reading time in real time"
      />
      <UtilCard>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Your text</span>
          <CopyButton text={text} label="Copy text" />
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={8}
          placeholder="Type or paste your text here…"
          className={`${fieldClass} resize-y`}
        />
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Words" value={s.words.toLocaleString()} />
          <Stat label="Characters" value={s.chars.toLocaleString()} />
          <Stat label="No spaces" value={s.charsNoSpaces.toLocaleString()} />
          <Stat label="Sentences" value={s.sentences.toLocaleString()} />
          <Stat label="Paragraphs" value={s.paragraphs.toLocaleString()} />
          <Stat label="Read time" value={`${s.readMin} min`} />
        </div>
      </UtilCard>
    </div>
  );
}
