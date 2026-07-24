import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu, Search, Bell, ChevronRight, Sparkles } from 'lucide-react';

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  '/': { title: 'Dashboard', subtitle: 'Overview of evaluation activity and quality metrics' },
  '/evaluate': { title: 'New Evaluation', subtitle: 'Submit a question and AI response for quality assessment' },
  '/processing': { title: 'Processing', subtitle: 'Multi-agent evaluation pipeline in progress' },
  '/results': { title: 'Results', subtitle: 'Detailed quality scores and AI reasoning' },
  '/knowledge-base': { title: 'Reference Knowledge Base', subtitle: 'Datasets, pipeline, and vector store health' },
  '/architecture': { title: 'Multi-Agent Architecture', subtitle: 'End-to-end evaluation workflow diagram' },
  '/history': { title: 'Evaluation History', subtitle: 'Search and filter past evaluations' },
  '/analytics': { title: 'Analytics', subtitle: 'Trends and distributions across evaluations' },
  '/about': { title: 'About Project', subtitle: 'Project scope, objectives, and technology stack' },
};

interface TopBarProps {
  onMenu: () => void;
}

export default function TopBar({ onMenu }: TopBarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const meta = PAGE_TITLES[location.pathname] ?? { title: 'Dashboard', subtitle: '' };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button onClick={onMenu} className="lg:hidden btn-ghost !p-2" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>Workspace</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600 font-medium truncate">{meta.title}</span>
          </div>
          <h1 className="truncate text-lg font-bold text-slate-900 sm:text-xl">{meta.title}</h1>
        </div>

        <div className="hidden md:flex relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search evaluations…"
            className="w-56 rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-700 placeholder:text-slate-400 transition-all focus:border-brand-400 focus:bg-white focus:ring-4 focus:ring-brand-100 focus:outline-none"
          />
        </div>

        <button className="relative btn-ghost !p-2" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <button onClick={() => navigate('/evaluate')} className="btn-primary !py-2 hidden sm:inline-flex">
          <Sparkles className="h-4 w-4" />
          New Evaluation
        </button>

        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-sm font-bold text-white">
            AR
          </div>
          <div className="hidden lg:block leading-tight">
            <p className="text-sm font-semibold text-slate-800">Aarav Rao</p>
            <p className="text-[11px] text-slate-500">Evaluation Engineer</p>
          </div>
        </div>
      </div>
      <p className="px-4 sm:px-6 pb-3 text-sm text-slate-500 -mt-1">{meta.subtitle}</p>
    </header>
  );
}
