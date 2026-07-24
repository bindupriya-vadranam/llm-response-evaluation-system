import {
  User,
  FileInput,
  Workflow,
  Database,
  Crosshair,
  Target,
  ShieldAlert,
  ListChecks,
  Gavel,
  Calculator,
  FileText,
  ChevronDown,
  Network,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { ARCHITECTURE_NODES } from '../data/sampleData';

const ICONS: Record<string, typeof User> = {
  User,
  FileInput,
  Workflow,
  Database,
  Crosshair,
  Target,
  ShieldAlert,
  ListChecks,
  Gavel,
  Calculator,
  FileText,
};

const TIER_STYLES: Record<string, { ring: string; label: string; dot: string }> = {
  input: { ring: 'border-brand-200 bg-brand-50/50', label: 'Input', dot: 'bg-brand-500' },
  orchestration: { ring: 'border-slate-300 bg-slate-50', label: 'Orchestration', dot: 'bg-slate-500' },
  knowledge: { ring: 'border-emerald-200 bg-emerald-50/50', label: 'Knowledge', dot: 'bg-emerald-500' },
  agent: { ring: 'border-amber-200 bg-amber-50/50', label: 'Judge Agent', dot: 'bg-amber-500' },
  output: { ring: 'border-brand-700 bg-brand-700 text-white', label: 'Output', dot: 'bg-white' },
};

export default function Architecture() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Multi-Agent Architecture"
        description="The end-to-end evaluation workflow — from user input through judge agents to the final evaluation report."
        icon={Workflow}
      />

      {/* Legend */}
      <div className="flex flex-wrap gap-3 animate-fade-in">
        {Object.entries(TIER_STYLES).map(([key, style]) => (
          <span key={key} className="badge bg-white border border-slate-200 text-slate-600">
            <span className={`h-2 w-2 rounded-full ${style.dot}`} />
            {style.label}
          </span>
        ))}
      </div>

      {/* Flow diagram */}
      <div className="card p-6 sm:p-8">
        <div className="flex flex-col items-center">
          {ARCHITECTURE_NODES.map((node, i) => {
            const Icon = ICONS[node.icon] ?? User;
            const style = TIER_STYLES[node.tier] ?? TIER_STYLES.input;
            const isLast = i === ARCHITECTURE_NODES.length - 1;
            const isOutput = node.tier === 'output';
            return (
              <div key={node.id} className="flex flex-col items-center w-full max-w-md animate-flow-down" style={{ animationDelay: `${i * 80}ms` }}>
                <div
                  className={`relative w-full rounded-2xl border-2 px-5 py-4 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 ${
                    isOutput ? style.ring : `${style.ring} bg-white`
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                        isOutput ? 'bg-white/15 text-white' : 'bg-white text-slate-700 shadow-sm'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm font-bold ${isOutput ? 'text-white' : 'text-slate-900'}`}>{node.label}</p>
                      <p className={`text-xs ${isOutput ? 'text-brand-100' : 'text-slate-400'}`}>{style.label}</p>
                    </div>
                    <span className={`badge ${isOutput ? 'bg-white/15 text-white' : 'bg-white border border-slate-200 text-slate-500'}`}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                </div>

                {!isLast && (
                  <div className="flex flex-col items-center py-1.5">
                    <div className="h-6 w-0.5 bg-gradient-to-b from-slate-300 to-slate-200" />
                    <ChevronDown className="h-4 w-4 text-slate-300 -mt-1" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Agent responsibilities */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Network className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Agent Responsibilities</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {[
            { name: 'Relevance Judge', icon: Crosshair, desc: 'Measures how directly the response answers the question.', color: 'text-brand-600 bg-brand-50' },
            { name: 'Accuracy Judge', icon: Target, desc: 'Verifies factual claims against the knowledge base.', color: 'text-emerald-600 bg-emerald-50' },
            { name: 'Hallucination Detector', icon: ShieldAlert, desc: 'Flags fabricated or unsupported statements.', color: 'text-amber-600 bg-amber-50' },
            { name: 'Completeness Judge', icon: ListChecks, desc: 'Checks coverage of expected sub-topics and detail.', color: 'text-brand-600 bg-brand-50' },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <div key={a.name} className="card card-hover p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.color} mb-3`}>
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">{a.name}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{a.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
