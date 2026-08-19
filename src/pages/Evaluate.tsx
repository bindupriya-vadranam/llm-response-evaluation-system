import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileInput,
  Upload,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  BookOpen,
  X,
  BarChart3,
  Download,
  FileText,
  FileDown,
} from 'lucide-react';

const SAMPLE_QUESTION =
  'Explain how transformer attention mechanisms work.';

const SAMPLE_RESPONSE =
  'Transformer attention allows a model to focus on different parts of the input sequence when producing each output token. It computes scaled dot-product attention using query, key, and value vectors, enabling parallel processing and long-range dependency capture without recurrence.';

const SAMPLE_REFERENCE =
  'Attention mechanisms compute a weighted sum of value vectors based on the similarity between query and key vectors, scaled by the square root of the dimension. Multi-head attention runs several attention functions in parallel to capture different representation subspaces.';

export default function Evaluate() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState(SAMPLE_QUESTION);
  const [response, setResponse] = useState(SAMPLE_RESPONSE);
  const [reference, setReference] = useState(SAMPLE_REFERENCE);

  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [batchSummary, setBatchSummary] = useState<any>(null);

  // Batch evaluation state
  const [batchSuccess, setBatchSuccess] = useState(false);
  const [batchResult, setBatchResult] = useState<any>(null);
  const [batchLoading, setBatchLoading] = useState(false);

  const canSubmit = question.trim() && response.trim();

  const handleCsvUpload = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setBatchSuccess(false);
      setBatchResult(null);
    }
  };

  // Single Evaluation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit) return;

    try {
      const res = await fetch(
        'http://127.0.0.1:8000/evaluate',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            question,
            response,
          }),
        }
      );

      const data = await res.json();

      navigate('/results', {
        state: {
          result: data,
        },
      });

    } catch (err) {
      console.error(err);
      alert('Backend connection failed');
    }
  };

  // Batch Evaluation
  const handleBatchUpload = async () => {
    if (!csvFile) {
      alert('Please select a CSV file.');
      return;
    }

    setBatchLoading(true);
    setBatchSuccess(false);

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/batch-evaluate',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error('Batch evaluation failed');
      }

    const data = await response.json();

console.log("Batch Evaluation Response:", data);

if (data.summary) {
  setBatchSummary(data.summary);
}



// Normalize different possible backend response formats
const evaluatedResults =
  Array.isArray(data)
    ? data
    : Array.isArray(data.results)
    ? data.results
    : Array.isArray(data.evaluations)
    ? data.evaluations
    : Array.isArray(data.data)
    ? data.data
    : [];

// Store normalized results
setBatchResult({
  ...data,
  results: evaluatedResults,
  total: evaluatedResults.length,
});
localStorage.setItem(
  'batchEvaluationData',
  JSON.stringify({
    ...data,
    results: evaluatedResults,
    total: evaluatedResults.length,
  })
);

// Show professional success panel
setBatchSuccess(true);

    } catch (error) {
      console.error(error);
      alert('Batch Evaluation Failed');
    } finally {
      setBatchLoading(false);
    }
  };
    // Generate and download PDF report
  const handleGenerateReport = async () => {
    if (!batchResult) {
      alert('Please complete a batch evaluation first.');
      return;
    }

    try {
      const response = await fetch(
        'http://127.0.0.1:8000/generate-report',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(batchResult),
        }
      );

      if (!response.ok) {
        throw new Error('PDF report generation failed');
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = 'evaluation_report.pdf';

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      alert('Failed to generate PDF report');
    }
  };

  const loadSample = () => {
    setQuestion(SAMPLE_QUESTION);
    setResponse(SAMPLE_RESPONSE);
    setReference(SAMPLE_REFERENCE);
  };

  // Get number of evaluated questions from backend response
  const totalEvaluations =
  batchResult?.total ?? 0;

const completedEvaluations =
  batchResult?.completed ?? totalEvaluations;
  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">

        <div className="flex items-start gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FileInput className="h-5 w-5" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Evaluation Input Module
            </h2>

            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Provide a question, the AI response to evaluate, and an optional
              reference answer.
            </p>
          </div>

        </div>

        <button
          onClick={loadSample}
          className="btn-secondary shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          Load Sample Data
        </button>

      </div>


      {/* ============================================= */}
      {/* BATCH SUCCESS PANEL */}
      {/* ============================================= */}

      {batchSuccess && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 p-6 shadow-sm animate-fade-in">

          {/* Success Header */}
          <div className="flex items-start justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-sm">
                <CheckCircle2 className="h-7 w-7" />
              </div>

              <div>

                <h3 className="text-xl font-bold text-emerald-800">
                  Batch Evaluation Completed Successfully! 🎉
                </h3>

                <p className="mt-1 text-sm text-emerald-700">
                  Your CSV file has been processed and the AI responses
                  have been evaluated successfully.
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={() => setBatchSuccess(false)}
              className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>

          </div>


          {/* Summary Cards */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-brand-50 p-2 text-brand-600">
                  <FileText className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Total Questions
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {totalEvaluations}
                  </p>
                </div>

              </div>

            </div>


            {/* Completed */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Completed
                  </p>

                  <p className="text-xl font-bold text-slate-900">
                    {completedEvaluations}
                  </p>
                </div>

              </div>

            </div>


            {/* Status */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-purple-50 p-2 text-purple-600">
                  <BarChart3 className="h-5 w-5" />
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Status
                  </p>

                  <p className="text-xl font-bold text-emerald-600">
                    Completed
                  </p>
                </div>

              </div>

            </div>


            {/* File */}
            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">

              <div className="flex items-center gap-3">

                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Upload className="h-5 w-5" />
                </div>

                <div className="min-w-0">

                  <p className="text-xs text-slate-500">
                    CSV File
                  </p>

                  <p
                    className="truncate text-sm font-bold text-slate-900"
                    title={csvFile?.name}
                  >
                    {csvFile?.name || 'Uploaded CSV'}
                  </p>

                </div>

              </div>

            </div>

          </div>
{/* Batch Statistics */}
{batchSummary && (
  <div className="mt-6">

    <h4 className="mb-3 text-sm font-semibold text-slate-700">
      Evaluation Summary
    </h4>

    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

      {/* Pass */}
      <div className="rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">
          Pass
        </p>
        <p className="mt-1 text-2xl font-bold text-emerald-600">
          {batchSummary.pass_count}
        </p>
      </div>

      {/* Needs Improvement */}
      <div className="rounded-xl border border-amber-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">
          Needs Improvement
        </p>
        <p className="mt-1 text-2xl font-bold text-amber-600">
          {batchSummary.needs_improvement_count}
        </p>
      </div>

      {/* Fail */}
      <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">
          Fail
        </p>
        <p className="mt-1 text-2xl font-bold text-red-600">
          {batchSummary.fail_count}
        </p>
      </div>

      {/* Overall */}
      <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
        <p className="text-xs text-slate-500">
          Average Overall
        </p>
        <p className="mt-1 text-2xl font-bold text-blue-600">
          {batchSummary.average_overall}/10
        </p>
      </div>

    </div>

    {/* Dimension Scores */}
    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-xs text-slate-500">
          Average Relevance
        </p>
        <p className="mt-1 text-lg font-bold text-slate-800">
          {batchSummary.average_relevance}/10
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-xs text-slate-500">
          Average Accuracy
        </p>
        <p className="mt-1 text-lg font-bold text-slate-800">
          {batchSummary.average_accuracy}/10
        </p>
      </div>

      <div className="rounded-xl bg-white p-4 shadow-sm border">
        <p className="text-xs text-slate-500">
          Average Completeness
        </p>
        <p className="mt-1 text-lg font-bold text-slate-800">
          {batchSummary.average_completeness}/10
        </p>
      </div>

    </div>

  </div>
)}

          {/* Action Buttons */}
          <div className="mt-5 flex flex-wrap gap-3">

            <button
              type="button"
              onClick={() => navigate('/analytics')}
              className="btn-primary"
            >
              <BarChart3 className="h-4 w-4" />
              View Dashboard
            </button>
                        <button
              type="button"
              onClick={handleGenerateReport}
              className="btn-secondary"
            >
              <FileDown className="h-4 w-4" />
              Export PDF Report
            </button>


            <button
              type="button"
              onClick={() => {
                const blob = new Blob(
                  [JSON.stringify(batchResult, null, 2)],
                  {
                    type: 'application/json',
                  }
                );

                const url = URL.createObjectURL(blob);

                const a = document.createElement('a');
                a.href = url;
                a.download = 'batch-evaluation-results.json';

                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);

                URL.revokeObjectURL(url);
              }}
              className="btn-secondary"
            >
              <Download className="h-4 w-4" />
              Download Results
            </button>

          </div>

        </div>
      )}


      {/* ============================================= */}
      {/* MAIN EVALUATION FORM */}
      {/* ============================================= */}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >

        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-5">

          {/* Question */}
          <div className="card p-5 animate-fade-in">

            <label className="flex items-center gap-2 mb-2">

              <HelpCircle className="h-4 w-4 text-brand-600" />

              <span className="text-sm font-semibold text-slate-800">
                Question
              </span>

              <span className="text-rose-500 text-sm">
                *
              </span>

            </label>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Enter the question posed to the AI..."
              className="input-field resize-none"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              {question.length} characters
            </p>

          </div>


          {/* AI Response */}
          <div className="card p-5 animate-fade-in">

            <label className="flex items-center gap-2 mb-2">

              <MessageSquare className="h-4 w-4 text-brand-600" />

              <span className="text-sm font-semibold text-slate-800">
                AI Response
              </span>

              <span className="text-rose-500 text-sm">
                *
              </span>

            </label>

            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              placeholder="Paste the AI-generated response to evaluate..."
              className="input-field resize-none"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              {response.length} characters
            </p>

          </div>


          {/* Reference Answer */}
          <div className="card p-5 animate-fade-in">

            <label className="flex items-center gap-2 mb-2">

              <BookOpen className="h-4 w-4 text-slate-500" />

              <span className="text-sm font-semibold text-slate-800">
                Reference Answer
              </span>

              <span className="badge bg-slate-100 text-slate-500">
                Optional
              </span>

            </label>

            <textarea
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              rows={5}
              placeholder="Provide a known-good reference answer to improve accuracy scoring..."
              className="input-field resize-none"
            />

            <p className="mt-1.5 text-xs text-slate-400">
              {reference.length} characters
            </p>

          </div>


          {/* Batch Evaluation */}
          <div className="card p-5 animate-fade-in">

            <h3 className="text-lg font-semibold mb-3">
              Batch Evaluation
            </h3>

            <p className="text-sm text-slate-500 mb-4">
              Upload a CSV file containing multiple questions and AI
              responses for batch evaluation.
            </p>

            <input
              type="file"
              accept=".csv"
              onChange={handleCsvUpload}
              className="border rounded-lg p-2 w-full"
            />

            {csvFile && (
              <div className="mt-3 flex items-center gap-2 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">
                <CheckCircle2 className="h-4 w-4" />

                <span>
                  Selected File:
                  <strong className="ml-1">
                    {csvFile.name}
                  </strong>
                </span>
              </div>
            )}

            <button
              type="button"
              onClick={handleBatchUpload}
              disabled={batchLoading}
              className="btn-primary mt-4"
            >
              {batchLoading ? (
                <>
                  <Sparkles className="h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload CSV & Batch Evaluate
                </>
              )}
            </button>

          </div>

        </div>


        {/* SIDEBAR */}
        <div className="space-y-5">

          <div className="card p-5 sticky top-24 animate-fade-in">

            <h3 className="section-title mb-4">
              Evaluation Summary
            </h3>

            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Question
                </span>

                <span
                  className={`flex items-center gap-1 font-semibold ${
                    question.trim()
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  {question.trim()
                    ? 'Provided'
                    : 'Required'}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  AI Response
                </span>

                <span
                  className={`flex items-center gap-1 font-semibold ${
                    response.trim()
                      ? 'text-emerald-600'
                      : 'text-slate-400'
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />

                  {response.trim()
                    ? 'Provided'
                    : 'Required'}
                </span>

              </div>


              <div className="flex items-center justify-between">

                <span className="text-slate-500">
                  Reference Answer
                </span>

                <span className="font-semibold text-slate-400">
                  Optional
                </span>

              </div>

            </div>


            <div className="mt-5 rounded-xl bg-brand-50 p-3 flex gap-2">

              <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />

              <p className="text-xs text-brand-700 leading-relaxed">
                Five judge agents will evaluate this response against
                the reference knowledge base. Processing typically takes
                a few seconds.
              </p>

            </div>


            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-5 btn-primary w-full"
            >
              <Sparkles className="h-4 w-4" />
              Evaluate Response
            </button>

            <p className="mt-2 text-center text-xs text-slate-400">
              You will be redirected to the processing pipeline.
            </p>

          </div>

        </div>

      </form>

    </div>
  );
}