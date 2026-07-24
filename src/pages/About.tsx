import {
  Info,
  Target,
  Boxes,
  Layers,
  Rocket,
  CheckCircle2,
  FileInput,
  Database,
  Workflow,
  Calculator,
  BarChart3,
  History,
  Code2,
  Server,
  Brain,
  BookOpen,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { MILESTONE_REQUIREMENTS, TECH_STACK, PROJECT_MODULES } from '../data/sampleData';

const MODULE_ICONS: Record<string, typeof FileInput> = {
  FileInput,
  Database,
  Workflow,
  Calculator,
  BarChart3,
  History,
};

const STACK_SECTIONS = [
  { title: 'Frontend', icon: Code2, items: TECH_STACK.frontend, color: 'text-brand-600 bg-brand-50', badge: 'bg-brand-50 text-brand-700' },
  { title: 'Backend', icon: Server, items: TECH_STACK.backend, color: 'text-emerald-600 bg-emerald-50', badge: 'bg-emerald-50 text-emerald-700', note: 'Display only' },
  { title: 'AI Stack', icon: Brain, items: TECH_STACK.ai, color: 'text-amber-600 bg-amber-50', badge: 'bg-amber-50 text-amber-700', note: 'Display only' },
  { title: 'Datasets', icon: BookOpen, items: TECH_STACK.datasets, color: 'text-rose-600 bg-rose-50', badge: 'bg-rose-50 text-rose-700' },
];

const FUTURE_SCOPE = [
  'Backend integration with FastAPI and LangChain orchestration',
  'Live OpenAI API evaluation with real-time scoring',
  'Custom fine-tuned judge agents for domain-specific accuracy',
  'Automated regression testing across model versions',
  'Team collaboration and shared evaluation workspaces',
  'Scheduled batch evaluations with alerting thresholds',
  'Exportable compliance reports for audit and governance',
];

export default function About() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="About Project"
        description="Scope, objectives, modules, and technology stack for the AI Response Quality Evaluator Agent."
        icon={Info}
      />

      {/* Project description */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Info className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Project Description</h3>
        </div>
        <p className="text-sm text-slate-600 leading-relaxed">
          The <span className="font-semibold text-slate-800">AI Response Quality Evaluator Agent</span> is a
          multi-agent system that automatically evaluates the quality of AI-generated responses. It assesses
          responses across four dimensions — relevance, accuracy, hallucination risk, and completeness — by
          grounding each evaluation against a curated reference knowledge base built from datasets like
          TruthfulQA and SQuAD. Specialized judge agents score each dimension independently, and a score
          aggregator produces a weighted overall quality verdict with explainable reasoning and actionable
          recommendations.
        </p>
        <p className="mt-3 text-sm text-slate-600 leading-relaxed">
          This is a <span className="font-semibold text-brand-700">Milestone 1 frontend prototype</span> built
          with React, Vite, and Tailwind CSS. It demonstrates the complete evaluation workflow using sample
          data. No backend logic or live AI evaluation is connected in this milestone.
        </p>
      </div>

      {/* Milestone 1 objectives */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Milestone 1 Objectives</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            'Research LLM evaluation methodologies and frameworks',
            'Design the multi-agent evaluation architecture',
            'Define scoring dimensions and agent responsibilities',
            'Build a reference knowledge base prototype',
            'Create the evaluation input module UI',
            'Deliver a prototype dashboard with sample data',
          ].map((obj, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-white text-xs font-bold">
                {i + 1}
              </span>
              <p className="text-sm text-slate-700">{obj}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Boxes className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Modules</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
          {PROJECT_MODULES.map((m) => {
            const Icon = MODULE_ICONS[m.icon] ?? FileInput;
            return (
              <div key={m.name} className="card card-hover p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600 mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-slate-900">{m.name}</p>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technology stack */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Technology Stack</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {STACK_SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="card p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  {s.note && <span className="badge bg-slate-100 text-slate-500">{s.note}</span>}
                </div>
                <p className="text-sm font-bold text-slate-900 mb-3">{s.title}</p>
                <div className="space-y-2">
                  {s.items.map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className={`h-1.5 w-1.5 rounded-full ${s.color.split(' ')[1].replace('bg-', 'bg-').replace('50', '500')}`} />
                      <span className="text-sm text-slate-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Milestone requirements */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <h3 className="section-title">Milestone 1 Requirements Covered</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {MILESTONE_REQUIREMENTS.map((r) => (
            <div key={r} className="flex items-center gap-2.5 rounded-lg bg-emerald-50/50 border border-emerald-100 px-3 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="text-sm text-slate-700">{r}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Future scope */}
      <div className="card p-6 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Rocket className="h-4 w-4 text-brand-600" />
          <h3 className="section-title">Future Scope</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FUTURE_SCOPE.map((f, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 p-3">
              <Rocket className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
              <p className="text-sm text-slate-600">{f}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
