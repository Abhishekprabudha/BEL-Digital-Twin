import records from '../data/predictive_maintenance.json';
import GlassCard from '../components/GlassCard';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { SeriesChart } from '../components/Charts';
import type { PredictiveRecord } from '../types';

export default function PredictiveOperations() {
  const data = records as PredictiveRecord[];
  const sorted = [...data].sort((a, b) => b.failureProbability - a.failureProbability);
  const highest = sorted[0];
  const avgRul = Math.round(data.reduce((a, b) => a + b.rulHours, 0) / data.length);
  const chartData = sorted.map((d) => ({ component: d.component.replace(' Module', '').replace(' and ', ' & '), failureProbability: d.failureProbability, anomalyScore: d.anomalyScore }));
  const trend = Array.from({ length: 10 }, (_, i) => ({ week: `W${i + 1}`, thermalFatigue: 28 + i * 4.1, rfDegradation: 18 + i * 5.2, coolingAnomaly: 22 + i * 3.6 }));

  return (
    <div>
      <PageHeader eyebrow="Predictive maintenance & operations" title="Forecast component risk before synthetic failure affects mission readiness" description="The POC combines RUL, failure probability, anomaly stream and operating envelope recommendations to show predictive operations and maintenance capability." />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Average RUL" value={avgRul} suffix="h" status="neutral" detail="Synthetic operating hours" />
        <MetricCard label="Highest risk component" value={highest.failureProbability} suffix="%" status="risk" detail={highest.component} />
        <MetricCard label="Active anomalies" value={data.filter((d) => d.anomalyScore > 30).length} status="watch" detail="Priority items for operator review" />
        <MetricCard label="Recommended envelope" value="Reduced" status="watch" detail="For RF power module trend" />
      </div>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassCard title="Failure probability by component" kicker="Forecast stream" action={<StatusBadge tone="amber">Synthetic RUL</StatusBadge>}>
          <SeriesChart data={chartData} xKey="component" yKey="failureProbability" type="bar" height={360} />
        </GlassCard>
        <GlassCard title="Anomaly trend" kicker="Predictive telemetry">
          <div className="space-y-4">
            <SeriesChart data={trend} xKey="week" yKey="rfDegradation" type="area" height={250} />
            <div className="rounded-2xl border border-belamber/20 bg-belamber/10 p-4 text-sm leading-6 text-slate-200">
              <strong className="text-belamber">Recommendation:</strong> RF Power Amplifier degradation trend detected. Mission can continue under reduced performance envelope. Recommended inspection within 42 synthetic operating hours.
            </div>
          </div>
        </GlassCard>
      </div>
      <GlassCard title="Component-level predictive actions" kicker="Operator maintenance board" className="mt-4">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="border-b border-white/10 text-xs uppercase tracking-[0.15em] text-slate-500">
              <tr><th className="py-3">Component</th><th>Trend</th><th>Failure probability</th><th>RUL</th><th>Anomaly score</th><th>Mission impact</th><th>Action</th></tr>
            </thead>
            <tbody>
              {sorted.map((row) => (
                <tr key={row.componentId} className="border-b border-white/5 align-top">
                  <td className="py-4 font-semibold text-slate-100">{row.component}</td>
                  <td><StatusBadge tone={row.trend === 'Rising' ? 'amber' : 'green'}>{row.trend}</StatusBadge></td>
                  <td className="pr-4"><ProgressBar value={row.failureProbability * 4} inverse /></td>
                  <td className="text-slate-300">{row.rulHours} synthetic h</td>
                  <td className="text-slate-300">{row.anomalyScore}</td>
                  <td><StatusBadge tone={row.missionImpact === 'High' ? 'red' : row.missionImpact === 'Medium' ? 'amber' : 'green'}>{row.missionImpact}</StatusBadge></td>
                  <td className="max-w-md leading-6 text-slate-300">{row.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
