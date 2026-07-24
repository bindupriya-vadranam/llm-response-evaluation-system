import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  Database,
  Crosshair,
  Target,
  ShieldAlert,
  ListChecks,
  Calculator,
  FileText,
  Loader2,
  BrainCircuit,
} from 'lucide-react';
import { PROCESSING_STEPS } from '../data/sampleData';

const ICONS: Record<string, typeof CheckCircle2> = {
  CheckCircle2,
  Database,
  Crosshair,
  Target,
  ShieldAlert,
  ListChecks,
  Calculator,
  FileText,
};

const STEP_DURATION = 650;

export default function Processing() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [overall, setOverall] = useState(0);

  useEffect(() => {
    const total = PROCESSING_STEPS.length;
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= total - 1) {
          clearInterval(stepTimer);
          return prev;
        }
        return prev + 1;
      });
    }, STEP_DURATION);

    const overallTimer = setInterval(() => {
      setOverall((prev) => Math.min(100, prev + 2));
    }, 120);

    const done = setTimeout(() => navigate('/results'), STEP_DURATION * total + 600);

    return () => {
      clearInterval(stepTimer);
      clearInterval(overallTimer);
      clearTimeout(done);
    };
  }, [navigate]);

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in">
        <div className="inline-flex items-center justify-center mb-4">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/30">
              <BrainCircuit className="h-9 w-9 text-white" />
            </div>
            <div className="absolute -inset-2 rounded-2xl border-2 border-brand-200 animate-ping opacity-40" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Evaluation Pipeline Running</h2>
        <p className="mt-2 text-sm text-slate-500">
          Five judge agents are evaluating the response against the reference knowledge base.
        </p>
      </div>

      {/* Overall progress */}
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-slate-700">Overall Progress</span>
          <span className="text-2xl font-bold text-brand-600 tabular-nums">{overall}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden">
          <div
            className="h-3 rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-200 ease-out"
            style={{ width: `${overall}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="card p-6">
        <div className="space-y-1">
          {PROCESSING_STEPS.map((step, i) => {
            const Icon = ICONS[step.icon] ?? CheckCircle2;
            const isDone = i < activeStep;
            const isActive = i === activeStep;
            const isPending = i > activeStep;
            return (
              <div
                key={step.id}
                className={`flex items-center gap-4 rounded-xl px-3 py-3 transition-all duration-300 ${
                  isActive ? 'bg-brand-50' : ''
                }`}
              >
                <div className="relative">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300 ${
                      isDone
                        ? 'bg-emerald-100 text-emerald-600'
                        : isActive
                        ? 'bg-brand-600 text-white shadow-md shadow-brand-500/30'
                        : 'bg-slate-100 text-slate-400'
                    }`}
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : isActive ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  {i < PROCESSING_STEPS.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-full -translate-x-1/2 w-0.5 h-3 ${
                        isDone ? 'bg-emerald-300' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className={`text-sm font-semibold transition-colors ${
                      isPending ? 'text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {step.label}
                  </p>
                  {isActive && (
                    <p className="text-xs text-brand-600 mt-0.5 animate-fade-in-fast">In progress…</p>
                  )}
                  {isDone && (
                    <p className="text-xs text-emerald-600 mt-0.5 animate-fade-in-fast">Completed</p>
                  )}
                </div>
                {isDone && (
                  <span className="badge bg-emerald-50 text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" />
                    Done
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        Redirecting to results automatically when complete…
      </p>
    </div>
  );
}
