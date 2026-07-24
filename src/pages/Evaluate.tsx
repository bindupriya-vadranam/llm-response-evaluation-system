import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileInput,
  Upload,
  FileText,
  X,
  Sparkles,
  Info,
  CheckCircle2,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Paperclip,
} from 'lucide-react';

const SAMPLE_QUESTION = 'Explain how transformer attention mechanisms work.';
const SAMPLE_RESPONSE =
  'Transformer attention allows a model to focus on different parts of the input sequence when producing each output token. It computes scaled dot-product attention using query, key, and value vectors, enabling parallel processing and long-range dependency capture without recurrence.';
const SAMPLE_REFERENCE =
  'Attention mechanisms compute a weighted sum of value vectors based on the similarity between query and key vectors, scaled by the square root of the dimension. Multi-head attention runs several attention functions in parallel to capture different representation subspaces.';

export default function Evaluate() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState(SAMPLE_QUESTION);
  const [response, setResponse] = useState(SAMPLE_RESPONSE);
  const [reference, setReference] = useState(SAMPLE_REFERENCE);
  const [files, setFiles] = useState<{ name: string; size: string }[]>([]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFiles((prev) => [...prev, { name: f.name, size: `${(f.size / 1024).toFixed(1)} KB` }]);
  };

  const removeFile = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  const canSubmit = question.trim() && response.trim();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!canSubmit) return;

  try {
    const res = await fetch("http://127.0.0.1:8000/evaluate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        response,
      }),
    });

    const data = await res.json();

    navigate("/results", {
      state: {
        result: data,
      },
    });

  } catch (err) {
    console.error(err);
    alert("Backend connection failed");
  }
};

  const loadSample = () => {
    setQuestion(SAMPLE_QUESTION);
    setResponse(SAMPLE_RESPONSE);
    setReference(SAMPLE_REFERENCE);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
            <FileInput className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Evaluation Input Module</h2>
            <p className="mt-1 text-sm text-slate-500 max-w-2xl">
              Provide a question, the AI response to evaluate, an optional reference answer, and any source documents for grounding.
            </p>
          </div>
        </div>
        <button onClick={loadSample} className="btn-secondary shrink-0">
          <Sparkles className="h-4 w-4" />
          Load Sample Data
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          {/* Question */}
          <div className="card p-5 animate-fade-in">
            <label className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-semibold text-slate-800">Question</span>
              <span className="text-rose-500 text-sm">*</span>
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              rows={3}
              placeholder="Enter the question posed to the AI…"
              className="input-field resize-none"
            />
            <p className="mt-1.5 text-xs text-slate-400">{question.length} characters</p>
          </div>

          {/* AI Response */}
          <div className="card p-5 animate-fade-in">
            <label className="flex items-center gap-2 mb-2">
              <MessageSquare className="h-4 w-4 text-brand-600" />
              <span className="text-sm font-semibold text-slate-800">AI Response</span>
              <span className="text-rose-500 text-sm">*</span>
            </label>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              rows={6}
              placeholder="Paste the AI-generated response to evaluate…"
              className="input-field resize-none"
            />
            <p className="mt-1.5 text-xs text-slate-400">{response.length} characters</p>
          </div>

          {/* Reference Answer */}
          <div className="card p-5 animate-fade-in">
            <label className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">Reference Answer</span>
              <span className="badge bg-slate-100 text-slate-500">Optional</span>
            </label>
            <textarea
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              rows={5}
              placeholder="Provide a known-good reference answer to improve accuracy scoring…"
              className="input-field resize-none"
            />
            <p className="mt-1.5 text-xs text-slate-400">{reference.length} characters</p>
          </div>

          {/* Upload */}
          <div className="card p-5 animate-fade-in">
            <label className="flex items-center gap-2 mb-3">
              <Paperclip className="h-4 w-4 text-slate-500" />
              <span className="text-sm font-semibold text-slate-800">Upload Source Document</span>
            </label>
            <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-8 text-center cursor-pointer transition-all hover:border-brand-300 hover:bg-brand-50/40">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm">
                <Upload className="h-5 w-5 text-brand-600" />
              </div>
              <p className="text-sm font-semibold text-slate-700">Click to upload or drag and drop</p>
              <p className="text-xs text-slate-400">PDF, DOCX, TXT — max 10 MB</p>
              <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={handleFile} />
            </label>

            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((f, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 animate-fade-in-fast">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-slate-800 truncate">{f.name}</p>
                      <p className="text-xs text-slate-400">{f.size}</p>
                    </div>
                    <button type="button" onClick={() => removeFile(i)} className="btn-ghost !p-1.5 text-slate-400 hover:text-rose-500">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar summary */}
        <div className="space-y-5">
          <div className="card p-5 sticky top-24 animate-fade-in">
            <h3 className="section-title mb-4">Evaluation Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Question</span>
                <span className={`flex items-center gap-1 font-semibold ${question.trim() ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {question.trim() ? 'Provided' : 'Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">AI Response</span>
                <span className={`flex items-center gap-1 font-semibold ${response.trim() ? 'text-emerald-600' : 'text-slate-400'}`}>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {response.trim() ? 'Provided' : 'Required'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Reference Answer</span>
                <span className="font-semibold text-slate-400">{reference.trim() ? 'Optional' : 'Optional'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Source Documents</span>
                <span className="font-semibold text-slate-600">{files.length} file{files.length !== 1 ? 's' : ''}</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-brand-50 p-3 flex gap-2">
              <Info className="h-4 w-4 text-brand-600 shrink-0 mt-0.5" />
              <p className="text-xs text-brand-700 leading-relaxed">
                Five judge agents will evaluate this response against the reference knowledge base. Processing typically takes a few seconds.
              </p>
            </div>

            <button type="submit" disabled={!canSubmit} className="mt-5 btn-primary w-full">
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
