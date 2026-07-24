import {
  Database,
  CheckCircle2,
  FileDown,
  Filter,
  Scissors,
  Sparkles,
  Grid3x3,
  HeartPulse,
  ArrowRight,
  Layers,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import { KB_DATASETS, KB_PIPELINE, KB_INFRA } from '../data/sampleData';

const PIPELINE_ICONS: Record<string, typeof FileDown> = {
  FileDown,
  Filter,
  Scissors,
  Sparkles,
  Grid3x3,
};

const INFRA_ICONS: Record<string, typeof Database> = {
  Database,
  Sparkles,
  HeartPulse,
};

export default function KnowledgeBase() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Reference Knowledge Base"
        description="Curated datasets and the retrieval pipeline that grounds every evaluation."
        icon={Database}
      />

      {/* Datasets */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Datasets</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 stagger">
          {KB_DATASETS.map((d) => {
            const Icon = CheckCircle2;
            return (
              <div key={d.name} className="card card-hover p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{d.name}</p>
                      <p className="text-xs text-slate-500">{d.samples.toLocaleString()} samples</p>
                    </div>
                  </div>
                  <span className="badge bg-emerald-50 text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {d.status}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-slate-500">Index Accuracy</span>
                    <span className="font-semibold text-slate-700">{d.accuracy}%</span>
                  </div>
                  <ProgressBar value={d.accuracy} color="bg-emerald-500" delay={200} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pipeline */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <ArrowRight className="h-4 w-4 text-brand-600 rotate-90" />
          <h3 className="section-title">Pipeline</h3>
        </div>
        <div className="card p-6">
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            {KB_PIPELINE.map((p, i) => {
              const Icon = PIPELINE_ICONS[p.icon] ?? FileDown;
              return (
                <div key={p.name} className="relative animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                  <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-3 relative">
                      <Icon className="h-5 w-5" />
                      <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                        {i + 1}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">{p.name}</p>
                    <span className="badge bg-emerald-50 text-emerald-700 mt-2">
                      <CheckCircle2 className="h-3 w-3" />
                      {p.status}
                    </span>
                  </div>
                  {i < KB_PIPELINE.length - 1 && (
                    <div className="hidden sm:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-brand-200 to-transparent -z-0" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Infra */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Database className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Infrastructure</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger">
          {KB_INFRA.map((item) => {
            const Icon = INFRA_ICONS[item.icon] ?? Database;
            const isHealth = item.name === 'Knowledge Base Status';
            return (
              <div key={item.name} className={`card card-hover p-5 ${isHealth ? 'border-emerald-200 bg-emerald-50/30' : ''}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${isHealth ? 'bg-emerald-100 text-emerald-600' : 'bg-brand-50 text-brand-600'}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{item.name}</p>
                </div>
                <p className={`text-xl font-bold ${isHealth ? 'text-emerald-700' : 'text-slate-900'}`}>{item.value}</p>
                {isHealth && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse-soft" />
                    <span className="text-xs text-emerald-600 font-medium">All systems operational</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {[
          { label: 'Total Chunks', value: '12,480' },
          { label: 'Vector Dimensions', value: '384' },
          { label: 'Index Size', value: '184 MB' },
          { label: 'Avg Query Latency', value: '42 ms' },
        ].map((s) => (
          <div key={s.label} className="card p-4 text-center">
            <p className="text-2xl font-bold text-brand-700">{s.value}</p>
            <p className="mt-1 stat-label">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
