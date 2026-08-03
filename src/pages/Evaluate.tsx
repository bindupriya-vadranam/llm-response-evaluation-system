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
  const [csvFile, setCsvFile] = useState<File | null>(null);
  

 
  

  const canSubmit = question.trim() && response.trim();
  const handleCsvUpload = (
  e: React.ChangeEvent<HTMLInputElement>
) => {

  if (e.target.files && e.target.files[0]) {
    setCsvFile(e.target.files[0]);
  }

};

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
const handleBatchUpload = async () => {

  if (!csvFile) {
    alert("Please select a CSV file.");
    return;
  }

  const formData = new FormData();

  formData.append("file", csvFile);

  try {

    const response = await fetch(
      "http://127.0.0.1:8000/batch-evaluate",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log(data);

    alert("Batch Evaluation Completed!");

  } catch (error) {

    console.log(error);

    alert("Batch Evaluation Failed");

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
              Provide a question, the AI response to evaluate, and an optional reference answer.
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
          </div>
          <div className="card p-5 animate-fade-in">

  <h3 className="text-lg font-semibold mb-3">
    Batch Evaluation
  </h3>

  <input
    type="file"
    accept=".csv"
    onChange={handleCsvUpload}
    className="border rounded-lg p-2 w-full"
  />

  {csvFile && (
    <p className="mt-3 text-green-600">
      Selected File: {csvFile.name}
    </p>
  )}

  <button
    type="button"
    onClick={handleBatchUpload}
    className="btn-primary mt-4"
  >
    Upload CSV & Batch Evaluate
  </button>

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
