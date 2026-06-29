import { Lightbulb } from 'lucide-react';
import PromptCard from './PromptCard.jsx';
import SkeletonCard from './SkeletonCard.jsx';

export default function ResultsGrid({ prompts, loading, count, isFavorite, onToggleFavorite }) {
  // Loading: render skeletons matching the requested count.
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  // Empty state.
  if (!prompts.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-16 text-center dark:border-slate-700 dark:bg-slate-900/40">
        <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-500 dark:bg-indigo-950/60 dark:text-indigo-300">
          <Lightbulb size={22} />
        </span>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
          No prompts yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
          Type an idea above, pick a type and tone, then hit{' '}
          <span className="font-medium text-indigo-600 dark:text-indigo-400">Generate</span>.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {prompts.map((text, i) => (
        <PromptCard
          key={`${i}-${text.slice(0, 24)}`}
          index={i}
          text={text}
          isFavorite={isFavorite(text)}
          onToggleFavorite={() => onToggleFavorite(text)}
        />
      ))}
    </div>
  );
}
