import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileInput,
  Database,
  Workflow,
  History,
  BarChart3,
  Info,
  BrainCircuit,
  X,
} from 'lucide-react';

const NAV = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/evaluate', label: 'New Evaluation', icon: FileInput },
  { to: '/knowledge-base', label: 'Knowledge Base', icon: Database },
  { to: '/architecture', label: 'Multi-Agent Architecture', icon: Workflow },
  { to: '/history', label: 'Evaluation History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/about', label: 'About Project', icon: Info },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`fixed z-40 inset-y-0 left-0 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-md shadow-brand-500/30">
              <BrainCircuit className="h-5 w-5 text-white" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-bold text-slate-900">Quality Evaluator</p>
              <p className="text-[11px] text-slate-500">AI Response Agent</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden btn-ghost !p-1.5"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </p>
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              location.pathname === item.to ||
              (item.to !== '/' && location.pathname.startsWith(item.to));
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon
                  className={`h-[18px] w-[18px] transition-colors ${
                    active ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span>{item.label}</span>
                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand-500" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-wider text-brand-100">
  AI Response Quality Evaluator
</p>

<p className="mt-1 text-sm font-bold">
  Multi-Agent Evaluation System
</p>

<p className="mt-1 text-[11px] text-brand-100 leading-relaxed">
  Evaluates AI-generated responses using Relevance, Accuracy,
  Hallucination, and Completeness analysis with RAG-powered
  knowledge retrieval and intelligent verdict generation.
</p>
          </div>
        </div>
      </aside>
    </>
  );
}
