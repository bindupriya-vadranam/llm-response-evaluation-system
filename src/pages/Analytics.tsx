import {
  Activity,
  BarChart3,
  Database,
  HeartPulse,
  PieChart,
  ShieldAlert,
  TrendingUp,
} from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import PageHeader from '../components/PageHeader';

/* =========================================================
   TYPES
========================================================= */

type EvaluationResult = {
  id?: string | number;

  model?: unknown;
  model_name?: unknown;
  modelName?: unknown;

  dataset?: unknown;
  dataset_name?: unknown;
  datasetName?: unknown;

  evaluation_mode?: unknown;
  evaluationMode?: unknown;
  mode?: unknown;

  verdict?: unknown;

  relevance_score?: unknown;
  accuracy_score?: unknown;
  hallucination_score?: unknown;
  completeness_score?: unknown;
  overall_score?: unknown;

  hallucinated_claims?: unknown;

  [key: string]: unknown;
};

type BatchData = {
  results?: EvaluationResult[];
  evaluations?: EvaluationResult[];

  [key: string]: unknown;
};

type ScoreTrendItem = {
  day: string;
  score: number;
};

type HallucinationTrendItem = {
  day: string;
  rate: number;
};

type DonutItem = {
  label: string;
  count: number;
  color: string;
};

type ActivityItem = {
  id: string | number;
  title: string;
  detail: string;
  time: string;
};

/* =========================================================
   HELPERS
========================================================= */

function normalize(value: unknown): string {
  return String(value ?? '')
    .trim()
    .toLowerCase();
}

function numberValue(value: unknown): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function firstValue(
  result: EvaluationResult,
  keys: string[],
  fallback: string
): string {
  for (const key of keys) {
    const value = result[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {
      return String(value).trim();
    }
  }

  return fallback;
}

function getModel(
  result: EvaluationResult
): string {
  return firstValue(
    result,
    ['model', 'model_name', 'modelName'],
    'Unknown'
  );
}

function getDataset(
  result: EvaluationResult
): string {
  return firstValue(
    result,
    [
      'dataset',
      'dataset_name',
      'datasetName',
    ],
    'Unknown'
  );
}

function getEvaluationMode(
  result: EvaluationResult
): string {
  return firstValue(
    result,
    [
      'evaluation_mode',
      'evaluationMode',
      'mode',
    ],
    'Batch'
  );
}

/* =========================================================
   LINE CHART
========================================================= */

function LineChart({
  data,
  color,
  height = 180,
}: {
  data: ScoreTrendItem[];
  color: string;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400"
        style={{ height }}
      >
        No evaluation data available
      </div>
    );
  }

  const width = 600;
  const padding = 36;

  const scores: number[] = data.map(
    (item: ScoreTrendItem) =>
      numberValue(item.score)
  );

  const rawMin = Math.min(...scores);
  const rawMax = Math.max(...scores);

  let min = Math.max(0, rawMin - 5);
  let max = Math.min(100, rawMax + 5);

  if (max <= min) {
    min = Math.max(0, rawMin - 10);
    max = Math.min(100, rawMax + 10);
  }

  if (max === min) {
    max = min + 1;
  }

  const range = max - min;

  const step =
    data.length === 1
      ? 0
      : (width - padding * 2) /
        (data.length - 1);

  const points = data.map(
    (
      item: ScoreTrendItem,
      index: number
    ) => {
      const x =
        data.length === 1
          ? width / 2
          : padding + index * step;

      const y =
        padding +
        (1 -
          (numberValue(item.score) - min) /
            range) *
          (height - padding * 2);

      return {
        ...item,
        x,
        y,
      };
    }
  );

  const path = points
    .map(
      (
        point: {
          day: string;
          score: number;
          x: number;
          y: number;
        },
        index: number
      ) =>
        `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
    )
    .join(' ');

  const firstPoint = points[0];
  const lastPoint =
    points[points.length - 1];

  const area = `${path}
    L ${lastPoint.x} ${height - padding}
    L ${firstPoint.x} ${height - padding}
    Z`;

  const gradientId =
    'analytics-line-gradient';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
    >
      <defs>
        <linearGradient
          id={gradientId}
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor={color}
            stopOpacity="0.25"
          />

          <stop
            offset="100%"
            stopColor={color}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      {(
        [0, 0.25, 0.5, 0.75, 1] as number[]
      ).map(
        (gridValue: number) => (
          <line
            key={gridValue}
            x1={padding}
            y1={
              padding +
              gridValue *
                (height - padding * 2)
            }
            x2={width - padding}
            y2={
              padding +
              gridValue *
                (height - padding * 2)
            }
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        )
      )}

      <path
        d={area}
        fill={`url(#${gradientId})`}
      />

      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map(
        (
          point: {
            day: string;
            score: number;
            x: number;
            y: number;
          },
          index: number
        ) => (
          <g
            key={`${point.day}-${index}`}
          >
            <circle
              cx={point.x}
              cy={point.y}
              r="4"
              fill="white"
              stroke={color}
              strokeWidth="2"
            />

            <text
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              className="fill-slate-500 text-[10px] font-semibold"
            >
              {point.score}
            </text>

            <text
              x={point.x}
              y={height - 12}
              textAnchor="middle"
              className="fill-slate-400 text-[10px]"
            >
              {point.day}
            </text>
          </g>
        )
      )}
    </svg>
  );
}

/* =========================================================
   BAR CHART
========================================================= */

function BarChart({
  data,
  color,
  height = 180,
}: {
  data: HallucinationTrendItem[];
  color: string;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-sm text-slate-400"
        style={{ height }}
      >
        No evaluation data available
      </div>
    );
  }

  const width = 600;
  const padding = 36;

  const rates: number[] = data.map(
    (item: HallucinationTrendItem) =>
      numberValue(item.rate)
  );

  const highestRate = Math.max(
    ...rates,
    1
  );

  const max = highestRate + 2;

  const step =
    (width - padding * 2) / data.length;

  const barWidth = step * 0.5;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full"
      style={{ height }}
    >
      {(
        [0, 0.25, 0.5, 0.75, 1] as number[]
      ).map(
        (gridValue: number) => (
          <line
            key={gridValue}
            x1={padding}
            y1={
              padding +
              gridValue *
                (height - padding * 2)
            }
            x2={width - padding}
            y2={
              padding +
              gridValue *
                (height - padding * 2)
            }
            stroke="#f1f5f9"
            strokeWidth="1"
          />
        )
      )}

      {data.map(
        (
          item: HallucinationTrendItem,
          index: number
        ) => {
          const rate = numberValue(
            item.rate
          );

          const barHeight =
            (rate / max) *
            (height - padding * 2);

          const x =
            padding +
            index * step +
            (step - barWidth) / 2;

          const y =
            height -
            padding -
            barHeight;

          return (
            <g
              key={`${item.day}-${index}`}
            >
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx="4"
                fill={color}
                opacity="0.85"
              />

              <text
                x={x + barWidth / 2}
                y={y - 6}
                textAnchor="middle"
                className="fill-slate-500 text-[10px] font-semibold"
              >
                {rate}%
              </text>

              <text
                x={x + barWidth / 2}
                y={height - 12}
                textAnchor="middle"
                className="fill-slate-400 text-[10px]"
              >
                {item.day}
              </text>
            </g>
          );
        }
      )}
    </svg>
  );
}

/* =========================================================
   DONUT CHART
========================================================= */

function DonutChart({
  data,
}: {
  data: DonutItem[];
}) {
  const total = data.reduce(
    (
      sum: number,
      item: DonutItem
    ) =>
      sum + numberValue(item.count),
    0
  );

  if (total === 0) {
    return (
      <div className="flex items-center justify-center h-44 text-sm text-slate-400">
        No evaluations available
      </div>
    );
  }

  const size = 180;
  const stroke = 28;
  const radius =
    (size - stroke) / 2;

  const circumference =
    2 * Math.PI * radius;

  let offset = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div
        className="relative"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={stroke}
          />

          {data.map(
            (item: DonutItem) => {
              const count =
                numberValue(
                  item.count
                );

              const fraction =
                count / total;

              const dash =
                fraction *
                circumference;

              const segment = (
                <circle
                  key={item.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={item.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${dash} ${
                    circumference - dash
                  }`}
                  strokeDashoffset={-offset}
                  style={{
                    transition:
                      'stroke-dashoffset 0.8s ease-out',
                  }}
                />
              );

              offset += dash;

              return segment;
            }
          )}
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-slate-900">
            {total}
          </span>

          <span className="text-xs text-slate-400">
            Evaluations
          </span>
        </div>
      </div>

      <div className="space-y-2 flex-1">
        {data.map(
          (item: DonutItem) => (
            <div
              key={item.label}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      item.color,
                  }}
                />

                <span className="text-sm text-slate-600">
                  {item.label}
                </span>
              </div>

              <span className="text-sm font-semibold text-slate-900">
                {item.count}
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

/* =========================================================
   ANALYTICS PAGE
========================================================= */

export default function Analytics() {
  const [batchData, setBatchData] =
    useState<BatchData | null>(null);

  const [
    selectedModel,
    setSelectedModel,
  ] = useState<string>('All');

  const [
    selectedDataset,
    setSelectedDataset,
  ] = useState<string>('All');

  const [
    selectedMode,
    setSelectedMode,
  ] = useState<string>('All');

  /* =======================================================
     LOAD DATA
  ======================================================= */

  useEffect(() => {
    const loadData = () => {
      try {
        const storedData =
          localStorage.getItem(
            'batchEvaluationData'
          );

        if (!storedData) {
          setBatchData(null);
          return;
        }

        const parsed: unknown =
          JSON.parse(storedData);

        if (
          parsed !== null &&
          typeof parsed === 'object'
        ) {
          setBatchData(
            parsed as BatchData
          );
        } else {
          setBatchData(null);
        }
      } catch (error) {
        console.error(
          'Failed to load batch evaluation data:',
          error
        );

        setBatchData(null);
      }
    };

    loadData();

    window.addEventListener(
      'storage',
      loadData
    );

    return () => {
      window.removeEventListener(
        'storage',
        loadData
      );
    };
  }, []);

  /* =======================================================
     ALL RESULTS
  ======================================================= */

  const batchResults =
    useMemo<EvaluationResult[]>(
      () => {
        if (!batchData) {
          return [];
        }

        if (
          Array.isArray(
            batchData.results
          )
        ) {
          return batchData.results;
        }

        if (
          Array.isArray(
            batchData.evaluations
          )
        ) {
          return batchData.evaluations;
        }

        return [];
      },
      [batchData]
    );

  /* =======================================================
     FILTER OPTIONS
  ======================================================= */

  const models = useMemo<string[]>(
    () => {
      const values: string[] =
        batchResults.map(
          (
            result: EvaluationResult
          ) => getModel(result)
        );

      const unique = Array.from(
        new Map<string, string>(
          values.map(
            (value: string) => [
              normalize(value),
              value,
            ]
          )
        ).values()
      );

      return ['All', ...unique];
    },
    [batchResults]
  );

  const datasets = useMemo<string[]>(
    () => {
      const values: string[] =
        batchResults.map(
          (
            result: EvaluationResult
          ) => getDataset(result)
        );

      const unique = Array.from(
        new Map<string, string>(
          values.map(
            (value: string) => [
              normalize(value),
              value,
            ]
          )
        ).values()
      );

      return ['All', ...unique];
    },
    [batchResults]
  );

  const modes = useMemo<string[]>(
    () => {
      const values: string[] =
        batchResults.map(
          (
            result: EvaluationResult
          ) =>
            getEvaluationMode(result)
        );

      const unique = Array.from(
        new Map<string, string>(
          values.map(
            (value: string) => [
              normalize(value),
              value,
            ]
          )
        ).values()
      );

      return ['All', ...unique];
    },
    [batchResults]
  );

  /* =======================================================
     FILTER RESULTS
  ======================================================= */

  const filteredResults =
    useMemo<EvaluationResult[]>(
      () => {
        return batchResults.filter(
          (
            result: EvaluationResult
          ) => {
            const resultModel =
              normalize(
                getModel(result)
              );

            const resultDataset =
              normalize(
                getDataset(result)
              );

            const resultMode =
              normalize(
                getEvaluationMode(
                  result
                )
              );

            const modelMatch =
              selectedModel === 'All' ||
              resultModel ===
                normalize(
                  selectedModel
                );

            const datasetMatch =
              selectedDataset ===
                'All' ||
              resultDataset ===
                normalize(
                  selectedDataset
                );

            const modeMatch =
              selectedMode === 'All' ||
              resultMode ===
                normalize(
                  selectedMode
                );

            return (
              modelMatch &&
              datasetMatch &&
              modeMatch
            );
          }
        );
      },
      [
        batchResults,
        selectedModel,
        selectedDataset,
        selectedMode,
      ]
    );

  /* =======================================================
     SUMMARY
  ======================================================= */

  const filteredSummary =
    useMemo(
      () => {
        const total =
          filteredResults.length;

        if (total === 0) {
          return {
            totalEvaluations: 0,
            passCount: 0,
            needsImprovementCount: 0,
            failCount: 0,
            averageRelevance: 0,
            averageAccuracy: 0,
            averageHallucination: 0,
            averageCompleteness: 0,
            averageOverall: 0,
          };
        }

        const average = (
          key: keyof EvaluationResult
        ): number => {
          const sum =
            filteredResults.reduce(
              (
                totalValue: number,
                result: EvaluationResult
              ) =>
                totalValue +
                numberValue(
                  result[key]
                ),
              0
            );

          return Number(
            (
              sum / total
            ).toFixed(2)
          );
        };

        const passCount =
          filteredResults.filter(
            (
              result: EvaluationResult
            ) =>
              normalize(
                result.verdict
              ) === 'pass'
          ).length;

        const needsImprovementCount =
          filteredResults.filter(
            (
              result: EvaluationResult
            ) => {
              const verdict =
                normalize(
                  result.verdict
                );

              return (
                verdict ===
                  'needs improvement' ||
                verdict ===
                  'needs_improvement'
              );
            }
          ).length;

        const failCount =
          filteredResults.filter(
            (
              result: EvaluationResult
            ) =>
              normalize(
                result.verdict
              ) === 'fail'
          ).length;

        return {
          totalEvaluations: total,

          passCount,

          needsImprovementCount,

          failCount,

          averageRelevance:
            average(
              'relevance_score'
            ),

          averageAccuracy:
            average(
              'accuracy_score'
            ),

          averageHallucination:
            average(
              'hallucination_score'
            ),

          averageCompleteness:
            average(
              'completeness_score'
            ),

          averageOverall:
            average(
              'overall_score'
            ),
        };
      },
      [filteredResults]
    );

  /* =======================================================
     SCORE TREND
  ======================================================= */

  const scoreTrend =
    useMemo<ScoreTrendItem[]>(
      () =>
        filteredResults.map(
          (
            result: EvaluationResult,
            index: number
          ) => ({
            day: `Q${index + 1}`,

            score: Math.round(
              numberValue(
                result.overall_score
              ) * 10
            ),
          })
        ),
      [filteredResults]
    );

  /* =======================================================
     HALLUCINATION TREND
  ======================================================= */

  const hallucinationTrend =
    useMemo<
      HallucinationTrendItem[]
    >(
      () =>
        filteredResults.map(
          (
            result: EvaluationResult,
            index: number
          ) => {
            const score =
              numberValue(
                result.hallucination_score
              );

            const rate = Math.max(
              0,
              Math.min(
                100,
                (10 - score) * 10
              )
            );

            return {
              day: `Q${index + 1}`,
              rate: Math.round(rate),
            };
          }
        ),
      [filteredResults]
    );

  /* =======================================================
     RECENT ACTIVITY
  ======================================================= */

  const recentActivity =
    useMemo<ActivityItem[]>(
      () =>
        filteredResults.map(
          (
            result: EvaluationResult,
            index: number
          ) => ({
            id:
              result.id ??
              index + 1,

            title:
              'Evaluation completed',

            detail: `Q${
              index + 1
            } — Overall Score: ${(
              numberValue(
                result.overall_score
              ) * 10
            ).toFixed(1)}%`,

            time: 'Completed',
          })
        ),
      [filteredResults]
    );

  /* =======================================================
     CLEAR FILTERS
  ======================================================= */

  const clearFilters =
    (): void => {
      setSelectedModel('All');
      setSelectedDataset('All');
      setSelectedMode('All');
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Dashboard"
        description="Trends, distributions, and health metrics across all evaluations."
        icon={BarChart3}
      />

      {/* ===================================================
          FILTERS
      =================================================== */}

      <div className="card p-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* MODEL */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Model
            </label>

            <select
              value={selectedModel}
              onChange={(
                event: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setSelectedModel(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {models.map(
                (model: string) => (
                  <option
                    key={model}
                    value={model}
                  >
                    {model}
                  </option>
                )
              )}
            </select>
          </div>

          {/* DATASET */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Dataset
            </label>

            <select
              value={selectedDataset}
              onChange={(
                event: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setSelectedDataset(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {datasets.map(
                (dataset: string) => (
                  <option
                    key={dataset}
                    value={dataset}
                  >
                    {dataset}
                  </option>
                )
              )}
            </select>
          </div>

          {/* MODE */}

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Evaluation Mode
            </label>

            <select
              value={selectedMode}
              onChange={(
                event: React.ChangeEvent<HTMLSelectElement>
              ) =>
                setSelectedMode(
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"
            >
              {modes.map(
                (mode: string) => (
                  <option
                    key={mode}
                    value={mode}
                  >
                    {mode}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* FILTER STATUS */}

        <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-slate-500">
            Showing{' '}
            <span className="font-semibold text-slate-800">
              {filteredResults.length}
            </span>{' '}
            of{' '}
            <span className="font-semibold text-slate-800">
              {batchResults.length}
            </span>{' '}
            evaluations
          </p>

          {(selectedModel !== 'All' ||
            selectedDataset !==
              'All' ||
            selectedMode !== 'All') && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* ===================================================
          KPI CARDS
      =================================================== */}

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 stagger">
        {[
          {
            label:
              'Avg Evaluation Score',
            value: `${(
              filteredSummary.averageOverall *
              10
            ).toFixed(1)}%`,
            icon: TrendingUp,
            color:
              'bg-brand-50 text-brand-600',
          },

          {
            label:
              'Avg Relevance Score',
            value: `${filteredSummary.averageRelevance}/10`,
            icon: Activity,
            color:
              'bg-blue-50 text-blue-600',
          },

          {
            label:
              'Avg Accuracy Score',
            value: `${filteredSummary.averageAccuracy}/10`,
            icon: ShieldAlert,
            color:
              'bg-amber-50 text-amber-600',
          },

          {
            label:
              'Avg Completeness Score',
            value: `${filteredSummary.averageCompleteness}/10`,
            icon: HeartPulse,
            color:
              'bg-rose-50 text-rose-600',
          },

          {
            label:
              'Avg Hallucination Score',
            value: `${filteredSummary.averageHallucination}/10`,
            icon: ShieldAlert,
            color:
              'bg-purple-50 text-purple-600',
          },

          {
            label:
              'Total Evaluations',
            value:
              filteredSummary.totalEvaluations,
            icon: BarChart3,
            color:
              'bg-emerald-50 text-emerald-600',
          },
        ].map(
          (
            card: {
              label: string;
              value: string | number;
              icon: typeof TrendingUp;
              color: string;
            }
          ) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="card card-hover p-4"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.color} mb-3`}
                >
                  <Icon className="h-5 w-5" />
                </div>

                <p className="text-2xl font-bold text-slate-900">
                  {card.value}
                </p>

                <p className="mt-1 stat-label">
                  {card.label}
                </p>
              </div>
            );
          }
        )}
      </div>

      {/* ===================================================
          VERDICT SUMMARY
      =================================================== */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* PASS */}

        <div className="card card-hover p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">
                Pass
              </p>

              <p className="mt-2 text-3xl font-bold text-emerald-600">
                {filteredSummary.passCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Successful evaluations
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50">
              <Activity className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>

        {/* NEEDS IMPROVEMENT */}

        <div className="card card-hover p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">
                Needs Improvement
              </p>

              <p className="mt-2 text-3xl font-bold text-amber-600">
                {
                  filteredSummary.needsImprovementCount
                }
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Responses requiring improvement
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
              <TrendingUp className="h-6 w-6 text-amber-600" />
            </div>
          </div>
        </div>

        {/* FAIL */}

        <div className="card card-hover p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="stat-label">
                Fail
              </p>

              <p className="mt-2 text-3xl font-bold text-red-600">
                {filteredSummary.failCount}
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Unacceptable evaluations
              </p>
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50">
              <ShieldAlert className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================
          CHARTS
      =================================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SCORE TREND */}

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand-600" />

              <h3 className="section-title">
                Average Evaluation Score
              </h3>
            </div>

            <span className="badge bg-blue-50 text-blue-700">
              Filtered
            </span>
          </div>

          <LineChart
            data={scoreTrend}
            color="#2563eb"
          />
        </div>

        {/* HALLUCINATION */}

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-amber-600" />

              <h3 className="section-title">
                Hallucination Trend
              </h3>
            </div>

            <span className="badge bg-amber-50 text-amber-700">
              Filtered
            </span>
          </div>

          <BarChart
            data={hallucinationTrend}
            color="#f59e0b"
          />
        </div>

        {/* DISTRIBUTION */}

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-4 w-4 text-brand-600" />

            <h3 className="section-title">
              Evaluation Distribution
            </h3>
          </div>

          <DonutChart
            data={[
              {
                label: 'Pass',
                count:
                  filteredSummary.passCount,
                color: '#10b981',
              },

              {
                label:
                  'Needs Improvement',
                count:
                  filteredSummary.needsImprovementCount,
                color: '#f59e0b',
              },

              {
                label: 'Fail',
                count:
                  filteredSummary.failCount,
                color: '#ef4444',
              },
            ]}
          />
        </div>

        {/* RECENT ACTIVITY */}

        <div className="card p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-4 w-4 text-brand-600" />

            <h3 className="section-title">
              Recent Activity
            </h3>
          </div>

          <div className="space-y-1">
            {recentActivity.length >
            0 ? (
              recentActivity
                .slice(0, 5)
                .map(
                  (
                    activity: ActivityItem
                  ) => (
                    <div
                      key={String(
                        activity.id
                      )}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-slate-50"
                    >
                      <span className="h-2 w-2 rounded-full bg-brand-500 shrink-0" />

                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-slate-700 truncate">
                          {
                            activity.title
                          }
                        </p>

                        <p className="text-xs text-slate-400 truncate">
                          {
                            activity.detail
                          }
                        </p>
                      </div>

                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {
                          activity.time
                        }
                      </span>
                    </div>
                  )
                )
            ) : (
              <div className="py-8 text-center text-sm text-slate-400">
                No evaluation activity available
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================
          KNOWLEDGE BASE HEALTH
      =================================================== */}

      <div className="card p-5 animate-fade-in">
        <div className="flex items-center gap-2 mb-4">
          <Database className="h-4 w-4 text-emerald-600" />

          <h3 className="section-title">
            Knowledge Base Health
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              label: 'Index Uptime',
              value: 99.9,
              suffix: '%',
              color:
                'bg-emerald-500',
            },

            {
              label:
                'Query Success Rate',
              value: 99.2,
              suffix: '%',
              color:
                'bg-brand-500',
            },

            {
              label:
                'Embedding Coverage',
              value: 98.5,
              suffix: '%',
              color:
                'bg-amber-500',
            },
          ].map(
            (
              metric: {
                label: string;
                value: number;
                suffix: string;
                color: string;
              }
            ) => (
              <div
                key={metric.label}
                className="rounded-xl border border-slate-200 p-4"
              >
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-600">
                    {metric.label}
                  </span>

                  <span className="font-bold text-slate-900">
                    {metric.value}
                    {metric.suffix}
                  </span>
                </div>

                <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${metric.color} transition-all duration-1000`}
                    style={{
                      width: `${metric.value}%`,
                    }}
                  />
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}