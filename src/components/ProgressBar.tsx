interface ProgressBarProps {
  value: number;
  label?: string;
  inverse?: boolean;
}

export default function ProgressBar({ value, label, inverse = false }: ProgressBarProps) {
  const normalized = Math.max(0, Math.min(100, Math.round(value)));
  const tone = inverse
    ? normalized < 35 ? 'bg-belgreen' : normalized < 65 ? 'bg-belamber' : 'bg-belred'
    : normalized > 82 ? 'bg-belgreen' : normalized > 65 ? 'bg-belamber' : 'bg-belred';
  return (
    <div>
      {label && <div className="mb-1 flex justify-between text-xs text-slate-400"><span>{label}</span><span>{normalized}%</span></div>}
      <div className="h-2 rounded-full bg-slate-800/80">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${normalized}%` }} />
      </div>
    </div>
  );
}
