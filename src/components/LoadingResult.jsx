import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

const DEFAULT_MESSAGES = [
  'Warming up the model…',
  'Brainstorming fresh ideas…',
  'Crafting vivid, specific output…',
  'Layering in the details…',
  'Polishing the final wording…',
];

// Animated "thinking" panel shown while a generation is in flight.
export default function LoadingResult({
  title = 'Your Result',
  label = 'Generating…',
  messages = DEFAULT_MESSAGES,
}) {
  const [msgIndex, setMsgIndex] = useState(0);

  // Cycle through friendly status messages every ~2s.
  useEffect(() => {
    const id = setInterval(() => setMsgIndex((i) => (i + 1) % messages.length), 2000);
    return () => clearInterval(id);
  }, [messages.length]);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Header mirrors the result panel */}
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2.5 dark:border-slate-800">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">{title}</h3>
        <span className="flex items-center gap-1">
          <Dot delay="0ms" />
          <Dot delay="150ms" />
          <Dot delay="300ms" />
        </span>
      </div>

      {/* Animated badge + cycling message */}
      <div className="flex flex-col items-center justify-center px-6 py-10 text-center">
        <span className="relative mb-5 inline-flex h-16 w-16 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-2xl bg-indigo-400/40" />
          <span className="relative inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white shadow-lg">
            <Sparkles size={26} className="animate-pulse" />
          </span>
        </span>
        <p className="text-base font-semibold text-slate-800 dark:text-slate-100">{label}</p>
        <p key={msgIndex} className="pc-fade mt-1 text-sm text-slate-500 dark:text-slate-400">
          {messages[msgIndex]}
        </p>

        {/* Shimmer placeholder lines */}
        <div className="mt-8 w-full max-w-xl space-y-3">
          <Shimmer className="w-1/3" />
          <Shimmer className="w-full" />
          <Shimmer className="w-11/12" />
          <Shimmer className="w-2/3" />
          <Shimmer className="mt-4 w-1/4" />
          <Shimmer className="w-full" />
          <Shimmer className="w-5/6" />
        </div>
      </div>
    </div>
  );
}

function Dot({ delay }) {
  return (
    <span
      className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-400"
      style={{ animationDelay: delay }}
    />
  );
}

function Shimmer({ className = '' }) {
  return <div className={`pc-shimmer h-3.5 rounded ${className}`} />;
}
