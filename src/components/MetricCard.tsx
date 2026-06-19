interface MetricCardProps {
  label: string;
  value: string | number;
  suffix?: string;
  status?: 'good' | 'watch' | 'risk' | 'neutral';
  detail?: string;
}

const palette = {
  good: 'from-belgreen/20 to-belgreen/5 border-belgreen/30 text-belgreen',
  watch: 'from-belamber/20 to-belamber/5 border-belamber/30 text-belamber',
  risk: 'from-belred/20 to-belred/5 border-belred/30 text-belred',
  neutral: 'from-belcyan/20 to-belcyan/5 border-belcyan/30 text-belcyan'
};

export default function MetricCard({ label, value, suffix, status = 'neutral', detail }: MetricCardProps) {
  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-4 ${palette[status]}`}>
      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-3xl font-bold text-slate-50">{value}</span>
        {suffix && <span className="pb-1 text-sm text-slate-300">{suffix}</span>}
      </div>
      {detail && <div className="mt-2 text-xs leading-relaxed text-slate-400">{detail}</div>}
    </div>
  );
}
