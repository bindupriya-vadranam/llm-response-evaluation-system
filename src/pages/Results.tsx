import { Link, useLocation } from "react-router-dom";
import {
  Crosshair,
  Target,
  ShieldAlert,
  Brain,
  Lightbulb,
  CheckCircle2,
  Download,
  RotateCcw,
  ArrowRight,
  Award,
} from 'lucide-react';
import ScoreRing from '../components/ScoreRing';
import ProgressBar from '../components/ProgressBar';
import { bandColor } from '../data/sampleData';

export default function Results() {

  const { state } = useLocation();

  const result = state?.result;

  if (!result) {
    return <h2>No Evaluation Result Found</h2>;
  }

 const overall = Math.round(
  (
    result.relevance.score +
    result.accuracy.accuracy_score +
    result.hallucination.hallucination_score
  ) / 3
);

  const band = {
  bg: "bg-green-100",
  text: "text-green-700",
};
    const METRICS = [
  {
    name: "Relevance",
    score: result.relevance.score,
    icon: Crosshair,
    color: "bg-brand-500",
    desc: result.relevance.reason,
  },
  {
    name: "Accuracy",
    score: result.accuracy.accuracy_score,
    icon: Target,
    color: "bg-emerald-500",
    desc: result.accuracy.evidence,
  },
  {
    name: "Hallucination",
    score: result.hallucination.hallucination_score,
    icon: ShieldAlert,
    color: "bg-amber-500",
    desc: result.hallucination.status,
  },
];


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <Award className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Evaluation Results</h2>
            <p className="mt-1 text-sm text-slate-500">
              EVAL-2024-0148 · GPT-4o · Completed just now
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export
          </button>
          <Link to="/evaluate" className="btn-secondary">
            <RotateCcw className="h-4 w-4" />
            New Evaluation
          </Link>
        </div>
      </div>

      {/* Hero score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6 flex flex-col items-center justify-center animate-scale-in">
          <ScoreRing score={overall} size={180} color="#2563eb" label="Overall Score" />
          <span className={`badge mt-4 ${band.bg} ${band.text}`}>
            <CheckCircle2 className="h-3.5 w-3.5" />
            {overall >= 8 ? "Excellent" : overall >= 6 ? "Good" : "Poor"}
          </span>
        </div>

        <div className="lg:col-span-2 card p-6 animate-fade-in">
          <h3 className="section-title mb-5">Dimension Scores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {METRICS.map((m, i) => {
              const Icon = m.icon;
        const displayScore = m.score;
              return (
                <div key={m.name} className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{m.name}</span>
                    </div>
                    <span className="text-lg font-bold text-slate-900">
  {displayScore.toFixed(1)}/10
</span>
                  </div>
                  <ProgressBar value={displayScore} color={m.color} delay={i * 120} height="h-2" />
                  <p className="mt-2 text-xs text-slate-400">{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Score cards row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="card card-hover p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="h-4 w-4 text-brand-500" />
                <span className="text-xs font-semibold text-slate-500">{m.name}</span>
              </div>
              <p className="text-3xl font-bold text-slate-900">
                {m.score.toFixed(1)}/10
              </p>
            </div>
          );
        })}
      </div>

      {/* Reasoning + Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Brain className="h-4 w-4" />
            </div>
            <h3 className="section-title">AI Reasoning</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{result.relevance.reason}</p>
          <div className="mt-4 space-y-2">
            {[
  result.relevance.reason,
  result.accuracy.evidence,
  result.hallucination.status,
  ...result.hallucination.hallucinated_claims,
].map((point, i) => (
              <div key={i} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle2 className="h-4 w-4 text-brand-500 shrink-0 mt-0.5" />
                <span>{point}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Lightbulb className="h-4 w-4" />
            </div>
            <h3 className="section-title">Recommendation</h3>
          </div>
          <div className={`rounded-xl ${band.bg} ${band.text} p-4 mb-4`}>
            <p className="text-sm font-bold"> Verdict: {overall >= 8 ? "Excellent" : overall >= 6 ? "Good" : "Poor"}</p>
            <p className="text-xs mt-1 opacity-80">  Overall score {overall}/10 — safe for deployment</p>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed"> {result.accuracy.evidence}</p>
          <Link to="/history" className="mt-5 btn-secondary w-full">
            View in History
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
