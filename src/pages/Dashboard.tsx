import { Link } from 'react-router-dom';
import {
  ClipboardCheck,
  Gauge,
  ShieldAlert,
  Database,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ShieldAlert as ShieldAlertIcon,
  Database as DatabaseIcon,
  PlayCircle,
  FileDown,
  TrendingUp,
  TrendingDown,
  Activity,
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { RECENT_ACTIVITY, HISTORY_DATA } from '../data/sampleData';

const STATS = [
  { label: 'Total Evaluations', value: '1,248', delta: '+12.4%', up: true, icon: ClipboardCheck, color: 'from-brand-500 to-brand-700', ring: 'bg-brand-50 text-brand-600' },
  { label: 'Average Score', value: '87.3', delta: '+2.1%', up: true, icon: Gauge, color: 'from-emerald-500 to-emerald-700', ring: 'bg-emerald-50 text-emerald-600' },
  { label: 'Hallucination Rate', value: '4.8%', delta: '-1.3%', up: false, icon: ShieldAlert, color: 'from-amber-500 to-amber-700', ring: 'bg-amber-50 text-amber-600' },
  { label: 'Knowledge Base', value: 'Healthy', delta: '2 datasets', up: true, icon: Database, color: 'from-slate-600 to-slate-800', ring: 'bg-slate-100 text-slate-600' },
];

const ACTIVITY_ICONS: Record<string, typeof CheckCircle2> = {
  CheckCircle2,
  ShieldAlert: ShieldAlertIcon,
  Database: DatabaseIcon,
  PlayCircle,
  FileDown,
};

const ACTIVITY_TONE: Record<string, string> = {
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  info: 'bg-brand-50 text-brand-600',
};

export default function Dashboard() {
  const recent = HISTORY_DATA.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 p-6 sm:p-8 text-white animate-fade-in">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-brand-300/20 blur-2xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-brand-100 text-sm font-medium">
            <Sparkles className="h-4 w-4" />
            Welcome back
          </div>
          <h2 className="mt-2 text-2xl sm:text-3xl font-bold">AI Response Quality Evaluator Agent</h2>
          <p className="mt-2 max-w-2xl text-sm sm:text-base text-brand-100 leading-relaxed">
            A multi-agent system that evaluates AI-generated responses for relevance, accuracy,
            hallucination risk, and completeness — grounded against a curated reference knowledge base.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/evaluate" className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition-all hover:bg-brand-50 hover:shadow-md active:scale-[0.98]">
              <Sparkles className="h-4 w-4" />
              Start Evaluation
            </Link>
            <Link to="/architecture" className="inline-flex items-center gap-2 rounded-xl bg-brand-500/30 border border-white/20 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-brand-500/40 active:scale-[0.98]">
              View Architecture
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 stagger">
        {STATS.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card card-hover p-5">
              <div className="flex items-start justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.ring}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className={`badge ${s.up ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {s.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {s.delta}
                </span>
              </div>
              <p className="mt-4 stat-label">{s.label}</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent activity */}
        <div className="lg:col-span-2 card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-brand-600" />
              <h3 className="section-title">Recent Activity</h3>
            </div>
            <Link to="/history" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((a) => {
              const Icon = ACTIVITY_ICONS[a.icon] ?? CheckCircle2;
              return (
                <div key={a.id} className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-slate-50">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${ACTIVITY_TONE[a.tone]}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-500 truncate">{a.detail}</p>
                  </div>
                  <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project overview */}
        <div className="card p-5 animate-fade-in">
          <h3 className="section-title mb-4">Project Overview</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Milestone 1 Progress</span>
                <span className="font-semibold text-slate-900">100%</span>
              </div>
              <ProgressBar value={100} color="bg-emerald-500" delay={200} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Agents Deployed</span>
                <span className="font-semibold text-slate-900">5 / 5</span>
              </div>
              <ProgressBar value={100} color="bg-brand-500" delay={350} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Datasets Indexed</span>
                <span className="font-semibold text-slate-900">2 / 2</span>
              </div>
              <ProgressBar value={100} color="bg-brand-500" delay={500} />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600">Evaluation Coverage</span>
                <span className="font-semibold text-slate-900">78%</span>
              </div>
              <ProgressBar value={78} color="bg-amber-500" delay={650} />
            </div>
          </div>
          <Link to="/about" className="mt-5 btn-secondary w-full">
            About Project
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Recent evaluations */}
      <div className="card p-5 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="section-title">Recent Evaluations</h3>
          <Link to="/history" className="text-sm font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1">
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider text-slate-400 border-b border-slate-200">
                <th className="pb-3 font-semibold">Evaluation ID</th>
                <th className="pb-3 font-semibold">Question</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recent.map((h) => (
                <tr key={h.id} className="transition-colors hover:bg-slate-50">
                  <td className="py-3 font-mono text-xs text-slate-600">{h.id}</td>
                  <td className="py-3 text-slate-700 max-w-xs truncate">{h.question}</td>
                  <td className="py-3">
                    <span className={`font-semibold ${h.overallScore >= 90 ? 'text-emerald-600' : h.overallScore >= 75 ? 'text-brand-600' : 'text-amber-600'}`}>
                      {h.overallScore}%
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`badge ${
                      h.status === 'Completed' ? 'bg-emerald-50 text-emerald-700'
                      : h.status === 'Processing' ? 'bg-brand-50 text-brand-700'
                      : 'bg-rose-50 text-rose-700'
                    }`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        h.status === 'Completed' ? 'bg-emerald-500'
                        : h.status === 'Processing' ? 'bg-brand-500'
                        : 'bg-rose-500'
                      }`} />
                      {h.status}
                    </span>
                  </td>
                  <td className="py-3 text-slate-500 whitespace-nowrap">{h.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
