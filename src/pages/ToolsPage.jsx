import { useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';
import { TOOLS, getTool, firstAvailableTool } from '../tools/registry.js';

// Group tools by their category for the sidebar.
function groupByCategory(tools) {
  const groups = {};
  for (const tool of tools) {
    (groups[tool.category] ||= []).push(tool);
  }
  return groups;
}

export default function ToolsPage() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  const groups = useMemo(() => groupByCategory(TOOLS), []);

  // No tool in the URL → redirect to the first available one.
  if (!toolId) {
    return <Navigate to={`/tools/${firstAvailableTool().id}`} replace />;
  }

  const active = getTool(toolId);
  const ActiveComponent = active?.available ? active.component : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* ── Left sidebar ── */}
        <aside className="lg:w-64 lg:shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="flex items-center gap-2 px-2 py-2 text-sm font-bold text-slate-800 dark:text-slate-100">
              <LayoutGrid size={16} /> Tools
            </h2>

            {Object.entries(groups).map(([category, tools]) => (
              <div key={category} className="mt-2">
                <p className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {category}
                </p>
                <ul className="space-y-1">
                  {tools.map((tool) => {
                    const Icon = tool.icon;
                    const isActive = tool.id === toolId;
                    return (
                      <li key={tool.id}>
                        <button
                          type="button"
                          disabled={!tool.available}
                          onClick={() => navigate(`/tools/${tool.id}`)}
                          className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                            isActive
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : tool.available
                                ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                                : 'cursor-not-allowed text-slate-400 dark:text-slate-600'
                          }`}
                        >
                          <Icon size={16} className="shrink-0" />
                          <span className="flex-1 truncate">{tool.name}</span>
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
              </div>
            ))}
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
