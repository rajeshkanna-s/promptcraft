// Placeholder card shown while the API call is in flight.
export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between">
        <div className="h-5 w-20 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
        <div className="h-7 w-14 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
      </div>
      <div className="space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 w-11/12 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
        <div className="h-3.5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}
