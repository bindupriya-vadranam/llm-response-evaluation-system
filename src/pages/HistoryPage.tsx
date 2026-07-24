import { useState, useMemo } from 'react';
import {
  History,
  Search,
  Eye,
  ArrowUpDown,
  Filter,
  Download,
  CheckCircle2,
  Loader2,
  XCircle,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';
import { HISTORY_DATA } from '../data/sampleData';

const STATUS_BADGE: Record<string, { badge: string; dot: string; icon: typeof CheckCircle2 }> = {
  Completed: { badge: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500', icon: CheckCircle2 },
  Processing: { badge: 'bg-brand-50 text-brand-700', dot: 'bg-brand-500', icon: Loader2 },
  Failed: { badge: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500', icon: XCircle },
};

export default function HistoryPage() {
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortAsc, setSortAsc] = useState(false);

  const filtered = useMemo(() => {
    let rows = HISTORY_DATA.filter(
      (h) =>
        h.question.toLowerCase().includes(query.toLowerCase()) ||
        h.id.toLowerCase().includes(query.toLowerCase())
    );
    if (statusFilter !== 'All') rows = rows.filter((h) => h.status === statusFilter);
    rows = [...rows].sort((a, b) =>
      sortAsc ? a.overallScore - b.overallScore : b.overallScore - a.overallScore
    );
    return rows;
  }, [query, statusFilter, sortAsc]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluation History"
        description="Search, filter, and review all past evaluations."
        icon={History}
      />

      {/* Toolbar */}
      <div className="card p-4 animate-fade-in">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by question or evaluation ID…"
              className="input-field !py-2.5 pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400 hidden sm:block" />
            {['All', 'Completed', 'Processing', 'Failed'].map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  statusFilter === s
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <th className="px-5 py-3 font-semibold">Evaluation ID</th>
                <th className="px-5 py-3 font-semibold">Question</th>
                <th className="px-5 py-3 font-semibold">
                  <button onClick={() => setSortAsc((v) => !v)} className="inline-flex items-center gap-1 hover:text-slate-700">
                    Overall Score
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    No evaluations match your search.
                  </td>
                </tr>
              )}
              {filtered.map((h) => {
                const st = STATUS_BADGE[h.status];
                const StatusIcon = st.icon;
                return (
                  <tr key={h.id} className="transition-colors hover:bg-slate-50">
                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600 whitespace-nowrap">{h.id}</td>
                    <td className="px-5 py-3.5 text-slate-700 max-w-sm">
                      <p className="truncate">{h.question}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{h.model}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${h.overallScore >= 90 ? 'text-emerald-600' : h.overallScore >= 75 ? 'text-brand-600' : 'text-amber-600'}`}>
                          {h.overallScore}%
                        </span>
                        <div className="hidden sm:block w-16 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-1.5 rounded-full ${h.overallScore >= 90 ? 'bg-emerald-500' : h.overallScore >= 75 ? 'bg-brand-500' : 'bg-amber-500'}`}
                            style={{ width: `${h.overallScore}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`badge ${st.badge}`}>
                        <StatusIcon className={`h-3 w-3 ${h.status === 'Processing' ? 'animate-spin' : ''}`} />
                        {h.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{h.date}</td>
                    <td className="px-5 py-3.5 text-right">
                      <button className="btn-ghost !p-2 text-brand-600 hover:bg-brand-50" aria-label="View">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-200 text-xs text-slate-500">
          <span>Showing {filtered.length} of {HISTORY_DATA.length} evaluations</span>
          <div className="flex gap-1">
            <button className="btn-ghost !py-1.5 !px-3 disabled:opacity-40" disabled>Previous</button>
            <button className="btn-ghost !py-1.5 !px-3 disabled:opacity-40" disabled>Next</button>
          </div>
        </div>
      </div>
    </div>
  );
}
