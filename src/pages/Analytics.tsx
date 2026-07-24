import {
  BarChart3,
  TrendingUp,
  ShieldAlert,
  PieChart,
  Activity,
  Database,
  HeartPulse,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import {
  ANALYTICS_SCORE_TREND,
  ANALYTICS_HALLUCINATION_TREND,
  ANALYTICS_DISTRIBUTION,
  RECENT_ACTIVITY,
} from '../data/sampleData';

function LineChart({ data, color, height = 180 }: { data: { day: string; score: number }[]; color: string; height?: number }) {
  const w = 600;
  const h = height;
  const pad = 36;
  const max = 100;
  const min = Math.min(...data.map((d) => d.score)) - 5;
  const range = max - min;
  const step = (w - pad * 2) / (data.length - 1);
  const points = data.map((d, i) => ({
    x: pad + i * step,
    y: pad + (1 - (d.score - min) / range) * (h - pad * 2),
    ...d,
  }));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
  const area = `${path} L ${points[points.length - 1].x} ${h - pad} L ${points[0].x} ${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} y1={pad + t * (h - pad * 2)} x2={w - pad} y2={pad + t * (h - pad * 2)} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      <path d={area} fill={`url(#grad-${color.replace('#', '')})`} />
      <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {points.map((p) => (
        <g key={p.day}>
          <circle cx={p.x} cy={p.y} r="4" fill="white" stroke={color} strokeWidth="2" />
          <text x={p.x} y={p.y - 10} textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">{p.score}</text>
          <text x={p.x} y={h - 12} textAnchor="middle" className="fill-slate-400 text-[10px]">{p.day}</text>
        </g>
      ))}
    </svg>
  );
}

function BarChart({ data, color, height = 180 }: { data: { day: string; rate: number }[]; color: string; height?: number }) {
  const w = 600;
  const h = height;
  const pad = 36;
  const max = Math.max(...data.map((d) => d.rate)) + 2;
  const step = (w - pad * 2) / data.length;
  const barW = step * 0.5;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height }}>
      {[0, 0.25, 0.5, 0.75, 1].map((t) => (
        <line key={t} x1={pad} y1={pad + t * (h - pad * 2)} x2={w - pad} y2={pad + t * (h - pad * 2)} stroke="#f1f5f9" strokeWidth="1" />
      ))}
      {data.map((d, i) => {
        const barH = (d.rate / max) * (h - pad * 2);
        const x = pad + i * step + (step - barW) / 2;
        const y = h - pad - barH;
        return (
          <g key={d.day}>
            <rect x={x} y={y} width={barW} height={barH} rx="4" fill={color} opacity="0.85">
              <animate attributeName="height" from="0" to={barH} dur="0.8s" fill="freeze" />
              <animate attributeName="y" from={h - pad} to={y} dur="0.8s" fill="freeze" />
            </rect>
            <text x={x + barW / 2} y={y - 6} textAnchor="middle" className="fill-slate-500 text-[10px] font-semibold">{d.rate}%</text>
            <text x={x + barW / 2} y={h - 12} textAnchor="middle" className="fill-slate-400 text-[10px]">{d.day}</text>
          </g>
        );
      })}
    </svg>
  );
}

function DonutChart({ data }: { data: { label: string; count: number; color: string }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  const size = 180;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
          {data.map((d) => {
            const frac = d.count / total;
            const dash = frac * circumference;
            const seg = (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
              />
            );
            offset += dash;
            return seg;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-400">Evaluations</span>
        </div>
      </div>
      <div className="space-y-2 flex-1">
        {data.map((d) => (
          <div key={d.label} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="text-sm text-slate-600">{d.label}</span>
            </div>
            <span className="text-sm font-semibold text-slate-900">{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Trends, distributions, and health metrics across all evaluations."
        icon={BarChart3}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {[
          { label: 'Avg Evaluation Score', value: '87.3%', icon: TrendingUp, color: 'bg-brand-50 text-brand-600' },
          { label: 'Avg Hallucination Rate', value: '4.8%', icon: ShieldAlert, color: 'bg-amber-50 text-amber-600' },
          { label: 'Total Evaluations', value: '1,248', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Knowledge Base Health', value: '99.2%', icon: HeartPulse, color: 'bg-rose-50 text-rose-600' },
        ].map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="card card-hover p-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${k.color} mb-3`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900">{k.value}</p>
              <p className="mt-1 stat-label">{k.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />
              <h3 className="section-title">Average Evaluation Score</h3>
            </div>
            <span className="badge bg-emerald-50 text-emerald-700">+5.2% this week</span>
          </div>
          <LineChart data={ANALYTICS_SCORE_TREND} color="#2563eb" />
        </div>

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <h3 className="section-title">Hallucination Trend</h3>
            </div>
            <span className="badge bg-emerald-50 text-emerald-700">-5pp this week</span>
          </div>
          <BarChart data={ANALYTICS_HALLUCINATION_TREND} color="#f59e0b" />
        </div>

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-brand-600" />
            <h3 className="section-title">Evaluation Distribution</h3>
          </div>
          <DonutChart data={ANALYTICS_DISTRIBUTION} />
        </div>

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-brand-600" />
            <h3 className="section-title">Recent Activity</h3>
          </div>
          <div className="space-y-1">
            {RECENT_ACTIVITY.map((a) => (
              <div key={a.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50">
                <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-slate-700 truncate">{a.title}</p>
                  <p className="text-xs text-slate-400 truncate">{a.detail}</p>
                </div>
                <span className="text-xs text-slate-400 whitespace-nowrap">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* KB health */}
      <div className="card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-emerald-600" />
          <h3 className="section-title">Knowledge Base Health</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Index Uptime', value: 99.9, suffix: '%', color: 'bg-emerald-500' },
            { label: 'Query Success Rate', value: 99.2, suffix: '%', color: 'bg-brand-500' },
            { label: 'Embedding Coverage', value: 98.5, suffix: '%', color: 'bg-amber-500' },
          ].map((m) => (
            <div key={m.label} className="rounded-xl border border-slate-200 p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">{m.label}</span>
                <span className="font-bold text-slate-900">{m.value}{m.suffix}</span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                <div className={`h-2.5 rounded-full ${m.color} transition-all duration-1000`} style={{ width: `${m.value}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
