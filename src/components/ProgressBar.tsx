import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  height?: string;
  delay?: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  max = 100,
  color = 'bg-brand-500',
  height = 'h-2.5',
  delay = 0,
  showLabel = false,
}: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const pct = Math.min(100, (value / max) * 100);

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay + 50);
    return () => clearTimeout(t);
  }, [pct, delay]);

  return (
    <div className="w-full">
      <div className={`w-full ${height} rounded-full bg-slate-100 overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-1000 ease-out`}
          style={{ width: `${width}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 flex justify-end">
          <span className="text-xs font-semibold text-slate-500">{value}%</span>
        </div>
      )}
    </div>
  );
}
