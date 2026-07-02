import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Type, Image, Video } from 'lucide-react';
import { TEMPLATE_GROUPS } from '../lib/templates.js';
import { useSeo } from '../lib/seo.js';

const TYPE_META = {
  text: { Icon: Type, label: 'Text' },
  image: { Icon: Image, label: 'Image' },
  video: { Icon: Video, label: 'Video' },
};

// Static Tailwind class sets per category color (kept literal so Tailwind keeps them).
const COLORS = {
  violet: { chip: 'bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-300', hover: 'hover:border-violet-300 dark:hover:border-violet-700', bar: 'from-violet-500 to-purple-500' },
  rose: { chip: 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-300', hover: 'hover:border-rose-300 dark:hover:border-rose-700', bar: 'from-rose-500 to-pink-500' },
  amber: { chip: 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-300', hover: 'hover:border-amber-300 dark:hover:border-amber-700', bar: 'from-amber-500 to-orange-500' },
  blue: { chip: 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-300', hover: 'hover:border-blue-300 dark:hover:border-blue-700', bar: 'from-blue-500 to-cyan-500' },
  cyan: { chip: 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-300', hover: 'hover:border-cyan-300 dark:hover:border-cyan-700', bar: 'from-cyan-500 to-teal-500' },
  indigo: { chip: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300', hover: 'hover:border-indigo-300 dark:hover:border-indigo-700', bar: 'from-indigo-500 to-violet-500' },
  emerald: { chip: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-300', hover: 'hover:border-emerald-300 dark:hover:border-emerald-700', bar: 'from-emerald-500 to-green-500' },
  fuchsia: { chip: 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-300', hover: 'hover:border-fuchsia-300 dark:hover:border-fuchsia-700', bar: 'from-fuchsia-500 to-pink-500' },
  sky: { chip: 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-300', hover: 'hover:border-sky-300 dark:hover:border-sky-700', bar: 'from-sky-500 to-blue-500' },
};

export default function TemplatesPage() {
  const navigate = useNavigate();
  useSeo({
    title: 'Prompt Templates & Examples',
    description:
      'Browse 50+ ready-made prompt templates for writing, marketing, business, code, images and video. Click any template to generate instantly.',
    path: '/templates',
  });

  const total = TEMPLATE_GROUPS.reduce((n, g) => n + g.items.length, 0);

  const use = (t) => {
    const params = new URLSearchParams({ idea: t.idea });
    if (t.type) params.set('type', t.type);
    if (t.tone && t.tone !== 'none') params.set('tone', t.tone);
    navigate(`/?${params.toString()}`);
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Hero */}
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 p-6 dark:border-slate-800 dark:from-indigo-950/40 dark:via-slate-900 dark:to-fuchsia-950/30 sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-fuchsia-300/30 blur-3xl dark:bg-fuchsia-700/20" />
        <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-indigo-300/30 blur-3xl dark:bg-indigo-700/20" />
        <div className="relative flex items-center gap-3">
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles size={22} />
          </span>
          <div>
            <h1 className="bg-gradient-to-r from-indigo-600 to-fuchsia-600 bg-clip-text text-2xl font-extrabold tracking-tight text-transparent dark:from-indigo-400 dark:to-fuchsia-400 sm:text-3xl">
              Prompt Templates
            </h1>
            <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
              {total}+ ready-made starting points — click one to generate in a single tap, then tweak to taste.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-10">
        {TEMPLATE_GROUPS.map((group) => {
          const c = COLORS[group.color] || COLORS.indigo;
          return (
            <section key={group.category}>
              <div className="mb-4 flex items-center gap-2.5">
                <span className={`inline-flex h-8 w-8 items-center justify-center rounded-xl text-base ${c.chip}`}>
                  <span aria-hidden>{group.emoji}</span>
                </span>
                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{group.category}</h2>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  {group.items.length}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((t) => {
                  const meta = TYPE_META[t.type] || TYPE_META.text;
                  const Icon = meta.Icon;
                  return (
                    <button
                      key={t.title}
                      type="button"
                      onClick={() => use(t)}
                      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 pt-5 text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 ${c.hover}`}
                    >
                      <span
                        className={`pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${c.bar} opacity-60 transition-opacity duration-200 group-hover:opacity-100`}
                      />
                      <div className="mb-2 flex items-center gap-2.5">
                        <span className={`inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${c.chip}`}>
                          <Icon size={16} />
                        </span>
                        <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{t.title}</span>
                      </div>
                      <p className="flex-1 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{t.idea}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                          <Icon size={11} /> {meta.label}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:opacity-100 dark:text-indigo-400">
                          Use this <ArrowRight size={13} />
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
