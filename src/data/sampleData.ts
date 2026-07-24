export type ScoreBand = 'excellent' | 'good' | 'fair' | 'poor';

export interface MetricScore {
  name: string;
  score: number;
  icon: string;
  description: string;
}

export interface EvaluationResult {
  overall: number;
  relevance: number;
  accuracy: number;
  hallucinationRisk: number;
  completeness: number;
  verdict: string;
  verdictBand: ScoreBand;
  reasoning: string;
  recommendation: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  overallScore: number;
  status: 'Completed' | 'Processing' | 'Failed';
  date: string;
  model: string;
}

export const SAMPLE_RESULT: EvaluationResult = {
  overall: 92,
  relevance: 95,
  accuracy: 93,
  hallucinationRisk: 4,
  completeness: 91,
  verdict: 'High Quality Response',
  verdictBand: 'excellent',
  reasoning:
    'The AI response demonstrates strong alignment with the user query, accurately retrieves facts from the reference knowledge base, and covers the majority of expected sub-topics. Minor information gaps were detected in the completeness dimension, and a single low-confidence claim was flagged by the hallucination detection agent. No fabricated entities or unsupported statistics were found.',
  recommendation:
    'Proceed with deployment. Consider enriching the response with one additional supporting example to fully close the completeness gap. Monitor the flagged low-confidence claim in downstream usage.',
};

export const PROCESSING_STEPS = [
  { id: 'validate', label: 'Validating Inputs', icon: 'CheckCircle2' },
  { id: 'retrieve', label: 'Retrieving Context from Knowledge Base', icon: 'Database' },
  { id: 'relevance', label: 'Running Relevance Judge Agent', icon: 'Crosshair' },
  { id: 'accuracy', label: 'Running Accuracy Judge Agent', icon: 'Target' },
  { id: 'hallucination', label: 'Running Hallucination Detection Agent', icon: 'ShieldAlert' },
  { id: 'completeness', label: 'Running Completeness Judge Agent', icon: 'ListChecks' },
  { id: 'aggregate', label: 'Aggregating Scores', icon: 'Calculator' },
  { id: 'report', label: 'Generating Final Report', icon: 'FileText' },
];

export const ARCHITECTURE_NODES = [
  { id: 'user', label: 'User', icon: 'User', tier: 'input' },
  { id: 'input', label: 'Evaluation Input Module', icon: 'FileInput', tier: 'input' },
  { id: 'orchestrator', label: 'Orchestrator Layer', icon: 'Workflow', tier: 'orchestration' },
  { id: 'kb', label: 'Reference Knowledge Base', icon: 'Database', tier: 'knowledge' },
  { id: 'relevance', label: 'Relevance Judge Agent', icon: 'Crosshair', tier: 'agent' },
  { id: 'accuracy', label: 'Accuracy Judge Agent', icon: 'Target', tier: 'agent' },
  { id: 'hallucination', label: 'Hallucination Detection Agent', icon: 'ShieldAlert', tier: 'agent' },
  { id: 'completeness', label: 'Completeness Judge Agent', icon: 'ListChecks', tier: 'agent' },
  { id: 'verdict', label: 'Verdict Agent', icon: 'Gavel', tier: 'agent' },
  { id: 'aggregator', label: 'Score Aggregator', icon: 'Calculator', tier: 'orchestration' },
  { id: 'report', label: 'Evaluation Report', icon: 'FileText', tier: 'output' },
];

export const HISTORY_DATA: HistoryItem[] = [
  { id: 'EVAL-2024-0148', question: 'Explain how transformer attention mechanisms work.', overallScore: 94, status: 'Completed', date: '2024-11-14 10:24', model: 'GPT-4o' },
  { id: 'EVAL-2024-0147', question: 'What is the capital of Australia?', overallScore: 99, status: 'Completed', date: '2024-11-14 09:51', model: 'Claude 3.5' },
  { id: 'EVAL-2024-0146', question: 'Summarize the key points of the Paris Agreement.', overallScore: 88, status: 'Completed', date: '2024-11-13 16:40', model: 'GPT-4o' },
  { id: 'EVAL-2024-0145', question: 'How does RAG improve LLM factual accuracy?', overallScore: 91, status: 'Completed', date: '2024-11-13 14:12', model: 'Llama 3.1' },
  { id: 'EVAL-2024-0144', question: 'Describe the water cycle in detail.', overallScore: 76, status: 'Completed', date: '2024-11-13 11:05', model: 'Mistral Large' },
  { id: 'EVAL-2024-0143', question: 'What are the side effects of metformin?', overallScore: 67, status: 'Failed', date: '2024-11-12 17:30', model: 'GPT-4o' },
  { id: 'EVAL-2024-0142', question: 'Explain quantum entanglement simply.', overallScore: 85, status: 'Completed', date: '2024-11-12 15:18', model: 'Claude 3.5' },
  { id: 'EVAL-2024-0141', question: 'List the planets in order from the sun.', overallScore: 98, status: 'Completed', date: '2024-11-12 09:42', model: 'GPT-4o' },
  { id: 'EVAL-2024-0140', question: 'What is gradient descent in machine learning?', overallScore: 90, status: 'Completed', date: '2024-11-11 19:55', model: 'Llama 3.1' },
  { id: 'EVAL-2024-0139', question: 'How does photosynthesis produce oxygen?', overallScore: 82, status: 'Completed', date: '2024-11-11 13:20', model: 'Mistral Large' },
  { id: 'EVAL-2024-0138', question: 'Compare supervised and unsupervised learning.', overallScore: 89, status: 'Processing', date: '2024-11-11 10:08', model: 'GPT-4o' },
  { id: 'EVAL-2024-0137', question: 'What causes inflation in an economy?', overallScore: 73, status: 'Completed', date: '2024-11-10 21:14', model: 'Claude 3.5' },
];

export const RECENT_ACTIVITY = [
  { id: 1, title: 'Evaluation completed', detail: 'EVAL-2024-0148 scored 94%', time: '2 min ago', icon: 'CheckCircle2', tone: 'success' },
  { id: 2, title: 'Hallucination flagged', detail: 'EVAL-2024-0143 — 2 unsupported claims', time: '1 hr ago', icon: 'ShieldAlert', tone: 'warning' },
  { id: 3, title: 'Knowledge base reindexed', detail: 'ChromaDB — 12,480 chunks', time: '3 hr ago', icon: 'Database', tone: 'info' },
  { id: 4, title: 'New evaluation started', detail: 'EVAL-2024-0138 — GPT-4o', time: '5 hr ago', icon: 'PlayCircle', tone: 'info' },
  { id: 5, title: 'Dataset loaded', detail: 'TruthfulQA — 8,159 samples', time: 'Yesterday', icon: 'FileDown', tone: 'success' },
];

export const KB_DATASETS = [
  { name: 'TruthfulQA', status: 'Loaded', samples: 8159, accuracy: 98.2, icon: 'CheckCircle2' },
  { name: 'SQuAD', status: 'Loaded', samples: 87599, accuracy: 96.7, icon: 'CheckCircle2' },
];

export const KB_PIPELINE = [
  { name: 'Dataset Loading', status: 'Complete', icon: 'FileDown' },
  { name: 'Preprocessing', status: 'Complete', icon: 'Filter' },
  { name: 'Chunking', status: 'Complete', icon: 'Scissors' },
  { name: 'Embedding Generation', status: 'Complete', icon: 'Sparkles' },
  { name: 'Vector Indexing', status: 'Complete', icon: 'Grid3x3' },
];

export const KB_INFRA = [
  { name: 'Vector Database', value: 'ChromaDB', icon: 'Database' },
  { name: 'Embedding Model', value: 'Sentence Transformers', icon: 'Sparkles' },
  { name: 'Knowledge Base Status', value: 'Healthy', icon: 'HeartPulse' },
];

export const ANALYTICS_SCORE_TREND = [
  { day: 'Mon', score: 84 },
  { day: 'Tue', score: 88 },
  { day: 'Wed', score: 86 },
  { day: 'Thu', score: 91 },
  { day: 'Fri', score: 89 },
  { day: 'Sat', score: 93 },
  { day: 'Sun', score: 92 },
];

export const ANALYTICS_HALLUCINATION_TREND = [
  { day: 'Mon', rate: 9 },
  { day: 'Tue', rate: 7 },
  { day: 'Wed', rate: 8 },
  { day: 'Thu', rate: 6 },
  { day: 'Fri', rate: 5 },
  { day: 'Sat', rate: 4 },
  { day: 'Sun', rate: 4 },
];

export const ANALYTICS_DISTRIBUTION = [
  { label: 'Excellent (90+)', count: 42, color: '#16a34a' },
  { label: 'Good (75-89)', count: 28, color: '#2563eb' },
  { label: 'Fair (60-74)', count: 14, color: '#f59e0b' },
  { label: 'Poor (<60)', count: 6, color: '#dc2626' },
];

export const MILESTONE_REQUIREMENTS = [
  'LLM Evaluation Research',
  'Hallucination Detection',
  'RAG Architecture',
  'RAGAS',
  'TruLens',
  'System Architecture',
  'Agent Responsibilities',
  'Scoring Dimensions',
  'Orchestration Flow',
  'Data Models',
  'Evaluation Input Module',
  'Reference Knowledge Base',
  'Prototype Dashboard',
  'Tech Stack',
];

export const TECH_STACK = {
  frontend: ['React', 'Vite', 'Tailwind CSS', 'React Router', 'Lucide React Icons'],
  backend: ['FastAPI'],
  ai: ['LangChain', 'Sentence Transformers', 'ChromaDB', 'OpenAI API'],
  datasets: ['TruthfulQA', 'SQuAD'],
};

export const PROJECT_MODULES = [
  { name: 'Evaluation Input Module', desc: 'Capture question, AI response, reference answer, and source documents.', icon: 'FileInput' },
  { name: 'Reference Knowledge Base', desc: 'Curated datasets indexed in a vector store for grounding evaluation.', icon: 'Database' },
  { name: 'Multi-Agent Judge Layer', desc: 'Specialized agents for relevance, accuracy, hallucination, and completeness.', icon: 'Workflow' },
  { name: 'Score Aggregator', desc: 'Combines agent outputs into a weighted overall quality score.', icon: 'Calculator' },
  { name: 'Results Dashboard', desc: 'Visualizes scores, reasoning, and actionable recommendations.', icon: 'BarChart3' },
  { name: 'Evaluation History', desc: 'Searchable log of past evaluations with status and trends.', icon: 'History' },
];

export function bandFromScore(score: number): ScoreBand {
  if (score >= 90) return 'excellent';
  if (score >= 75) return 'good';
  if (score >= 60) return 'fair';
  return 'poor';
}

export function bandColor(band: ScoreBand) {
  return {
    excellent: { bg: 'bg-emerald-50', text: 'text-emerald-700', ring: 'text-emerald-500', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
    good: { bg: 'bg-brand-50', text: 'text-brand-700', ring: 'text-brand-500', bar: 'bg-brand-500', dot: 'bg-brand-500' },
    fair: { bg: 'bg-amber-50', text: 'text-amber-700', ring: 'text-amber-500', bar: 'bg-amber-500', dot: 'bg-amber-500' },
    poor: { bg: 'bg-rose-50', text: 'text-rose-700', ring: 'text-rose-500', bar: 'bg-rose-500', dot: 'bg-rose-500' },
  }[band];
}
