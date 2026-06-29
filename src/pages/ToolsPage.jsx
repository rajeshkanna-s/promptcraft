import { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutGrid,
  Search,
  X,
  ChevronDown,
  Youtube,
  PenLine,
  FileText,
  BookOpen,
  RefreshCw,
  Globe,
  Share2,
  Lightbulb,
  GraduationCap,
  HeartHandshake,
  Users,
  Image,
  Megaphone,
  Code2,
  TrendingUp,
  BookOpenText,
} from 'lucide-react';
import { TOOLS, getTool, firstAvailableTool } from '../tools/registry.js';

// Category color backgrounds for side menu icons
const getCategoryColor = (category) => {
  switch (category) {
    case 'Writing':
      return 'bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400';
    case 'Productivity':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
    case 'Creative':
      return 'bg-amber-100 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400';
    case 'YouTube Tools':
      return 'bg-red-100 text-red-600 dark:bg-red-950/60 dark:text-red-400';
    case 'Rewriting Tools':
      return 'bg-fuchsia-100 text-fuchsia-600 dark:bg-fuchsia-950/60 dark:text-fuchsia-400';
    case 'SEO Tools':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400';
    case 'Social Media Tools':
      return 'bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400';
    case 'Idea Generation':
      return 'bg-teal-100 text-teal-600 dark:bg-teal-950/60 dark:text-teal-400';
    case 'Education Tools':
      return 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400';
    case 'Support Tools':
      return 'bg-cyan-100 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400';
    case 'HR Tools':
      return 'bg-orange-100 text-orange-600 dark:bg-orange-950/60 dark:text-orange-400';
    case 'Image Prompts':
      return 'bg-purple-100 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400';
    case 'Advertising Tools':
      return 'bg-blue-100 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400';
    case 'Code Tools':
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
    case 'Marketing Tools':
      return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400';
    case 'Book Writing':
      return 'bg-violet-100 text-violet-600 dark:bg-violet-950/60 dark:text-violet-400';
    case 'Website Content':
      return 'bg-sky-100 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400';
    default:
      return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400';
  }
};

// Category icon components
const getCategoryIcon = (category) => {
  switch (category) {
    case 'Writing':
      return <PenLine size={11} />;
    case 'Productivity':
      return <FileText size={11} />;
    case 'Creative':
      return <BookOpen size={11} />;
    case 'YouTube Tools':
      return <Youtube size={11} />;
    case 'Rewriting Tools':
      return <RefreshCw size={11} />;
    case 'SEO Tools':
      return <Globe size={11} />;
    case 'Social Media Tools':
      return <Share2 size={11} />;
    case 'Idea Generation':
      return <Lightbulb size={11} />;
    case 'Education Tools':
      return <GraduationCap size={11} />;
    case 'Support Tools':
      return <HeartHandshake size={11} />;
    case 'HR Tools':
      return <Users size={11} />;
    case 'Image Prompts':
      return <Image size={11} />;
    case 'Advertising Tools':
      return <Megaphone size={11} />;
    case 'Code Tools':
      return <Code2 size={11} />;
    case 'Marketing Tools':
      return <TrendingUp size={11} />;
    case 'Book Writing':
      return <BookOpenText size={11} />;
    case 'Website Content':
      return <Globe size={11} />;
    default:
      return <LayoutGrid size={11} />;
  }
};

export default function ToolsPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();

  // Search query state
  const [searchQuery, setSearchQuery] = useState('');

  // Collapse/Expand state for all categories
  const [expandedCats, setExpandedCats] = useState(() => {
    const activeTool = getTool(toolId);
    return activeTool ? { [activeTool.category]: true } : {};
  });

  // Scroll to top of window when active toolId changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [toolId]);

  // Keep active category expanded on route change
  useEffect(() => {
    const activeTool = getTool(toolId);
    if (activeTool) {
      setExpandedCats((prev) => ({ ...prev, [activeTool.category]: true }));
    }
  }, [toolId]);

  // If no toolId is present in path, redirect to the first available one
  if (!toolId) {
    return <Navigate to={`/tools/${firstAvailableTool().id}`} replace />;
  }

  const active = getTool(toolId);
  const ActiveComponent = active?.available ? active.component : null;

  // Filter tools based on search query
  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) return TOOLS;
    const q = searchQuery.toLowerCase();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Group filtered tools by category
  const groups = useMemo(() => {
    const grouped = {};
    for (const tool of filteredTools) {
      (grouped[tool.category] ||= []).push(tool);
    }
    return grouped;
  }, [filteredTools]);

  // Check if a category should be expanded (always true if searching)
  const isCatExpanded = (category) => {
    if (searchQuery.trim().length > 0) return true;
    return !!expandedCats[category];
  };

  const toggleCategory = (category) => {
    setExpandedCats((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Check if search results are empty
  const hasResults = Object.keys(groups).length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── Left sidebar ── */}
        <aside className="lg:sticky lg:top-[88px] lg:h-[calc(100vh-120px)] lg:w-64 lg:shrink-0 lg:overflow-y-auto thin-scroll pr-1 select-none">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <LayoutGrid size={16} /> Tools
            </h2>

            {/* Search Input Box */}
            <div className="relative my-2 px-1">
              <Search
                size={14}
                className="absolute left-3.5 top-2.5 text-slate-400 dark:text-slate-500"
              />
              <input
                type="text"
                placeholder="Search tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-1.5 pl-8 pr-7 text-xs text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 dark:border-slate-800 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-600 dark:focus:border-indigo-500 dark:focus:bg-slate-900 dark:focus:ring-indigo-950"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* No Results Placeholder */}
            {!hasResults && (
              <div className="py-8 text-center text-slate-400 dark:text-slate-500">
                <Search size={20} className="mx-auto mb-1.5 opacity-40" />
                <p className="text-xs">No tools found</p>
              </div>
            )}

            {/* Grouped Collapsible Categories */}
            {Object.entries(groups).map(([category, tools]) => {
              const expanded = isCatExpanded(category);
              return (
                <div
                  key={category}
                  className="mt-3 border-t border-slate-100 pt-3 first:mt-0 first:border-t-0 first:pt-0 dark:border-slate-800"
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category)}
                    className="flex w-full items-center justify-between rounded-xl px-2 py-1.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                  >
                    <span className="flex items-center gap-1.5">
                      <span
                        className={`inline-flex h-5 w-5 items-center justify-center rounded ${getCategoryColor(category)}`}
                      >
                        {getCategoryIcon(category)}
                      </span>
                      {category}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                    />
                  </button>

                  {expanded && (
                    <ul className="mt-1.5 space-y-1 border-l border-slate-100 pl-2 dark:border-slate-800/60 ml-4">
                      {tools.map((tool) => {
                        const Icon = tool.icon;
                        const isActive = tool.id === toolId;
                        return (
                          <li key={tool.id}>
                            <button
                              type="button"
                              disabled={!tool.available}
                              onClick={() => navigate(`/tools/${tool.id}`)}
                              className={`flex w-full items-center gap-2 rounded-xl px-2.5 py-1.5 text-left text-sm font-medium transition ${
                                isActive
                                  ? 'bg-indigo-600 text-white shadow-sm'
                                  : tool.available
                                    ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                    : 'cursor-not-allowed text-slate-400 dark:text-slate-600'
                              }`}
                            >
                              <span
                                className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : getCategoryColor(tool.category)
                                }`}
                              >
                                <Icon size={14} />
                              </span>
                              <span className="flex-1 truncate text-xs">{tool.name}</span>
                              {!tool.available && (
                                <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 dark:bg-slate-800 dark:text-slate-500">
                                  Soon
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </aside>

        {/* ── Main: active tool ── */}
        <main className="min-w-0 flex-1">
          {ActiveComponent ? (
            <ActiveComponent />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 px-6 py-20 text-center dark:border-slate-700 dark:bg-slate-900/40">
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                {active ? `${active.name} is coming soon` : 'Tool not found'}
              </h3>
              <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
                {active?.description || 'Pick a tool from the sidebar to get started.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
