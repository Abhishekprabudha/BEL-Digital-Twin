import assets from '../data/assets.json';
import simulationRuns from '../data/simulation_runs.json';
import GlassCard from '../components/GlassCard';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import DigitalTwin3D from '../components/DigitalTwin3D';
import { MultiLineChart } from '../components/Charts';
import { useTelemetry } from '../hooks/useTelemetry';
import type { Asset } from '../types';

export default function CommandCenter() {
  const asset = (assets as Asset[])[0];
  const { point, subsystems, points } = useTelemetry(1200);
  const avgHealth = Math.round(subsystems.reduce((acc, s) => acc + s.health, 0) / subsystems.length);
  const avgReliability = Math.round(subsystems.reduce((acc, s) => acc + (100 - s.failureProbability), 0) / subsystems.length);
  const thermalRisk = Math.round(Math.max(0, point.ambientTemp * 0.6 + point.powerLoad * 0.42 - point.coolingEfficiency * 0.35));
  const stressRisk = Math.round(point.vibration * 100);
  const alerts = subsystems.filter((s) => s.failureProbability > 8).slice(0, 4);
  const chartData = points.filter((_, i) => i % 5 === 0).map((p) => ({ timestamp: p.timestamp, missionReadiness: Math.round(p.missionReadiness), rfQuality: Math.round(p.rfQuality), eoClarity: Math.round(p.eoClarity) }));

  return (
    <div>
      <PageHeader
        eyebrow="Executive command center"
        title="BEL-owned multiphysics twin from design simulation to mission assurance"
        description="A high-impact synthetic POC showing real-time telemetry, physics-preserving surrogate models, scenario intelligence, predictive operations and digital thread evidence in one sovereign interface."
        right={<StatusBadge tone="green">{asset.classification}</StatusBadge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard label="Overall twin health" value={avgHealth} suffix="%" status="good" detail="Aggregated from ten synthetic subsystems" />
        <MetricCard label="Mission readiness" value={Math.round(point.missionReadiness)} suffix="%" status={point.missionReadiness > 82 ? 'good' : 'watch'} detail="Live readiness from telemetry stream" />
        <MetricCard label="Thermal risk" value={thermalRisk} suffix="%" status={thermalRisk > 60 ? 'risk' : thermalRisk > 42 ? 'watch' : 'good'} detail="Ambient + power load - cooling reserve" />
        <MetricCard label="Component reliability" value={avgReliability} suffix="%" status="neutral" detail="Failure probability inverse score" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-[1.15fr_0.85fr]">
        <GlassCard title={asset.name} kicker="Interactive command visualization" action={<StatusBadge tone="cyan">Digital thread active</StatusBadge>}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="min-h-[440px]"><DigitalTwin3D subsystems={subsystems} mode="rf" compact geometry="rotating-dish" /></div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-3 text-sm font-semibold text-slate-100">Live telemetry stream</div>
                <ProgressBar value={point.rfQuality} label="RF performance index" />
                <div className="mt-3"><ProgressBar value={point.eoClarity} label="EO clarity index" /></div>
                <div className="mt-3"><ProgressBar value={100 - stressRisk} label="Structural confidence" /></div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl border border-belcyan/20 bg-belcyan/10 p-3"><div className="text-slate-400">Active simulation jobs</div><div className="mt-1 text-2xl font-bold text-white">{simulationRuns.length}</div></div>
                <div className="rounded-xl border border-belgreen/20 bg-belgreen/10 p-3"><div className="text-slate-400">Telemetry streams</div><div className="mt-1 text-2xl font-bold text-white">8</div></div>
                <div className="rounded-xl border border-belamber/20 bg-belamber/10 p-3"><div className="text-slate-400">Source code handover</div><div className="mt-1 text-lg font-bold text-belamber">Ready</div></div>
                <div className="rounded-xl border border-belcyan/20 bg-belcyan/10 p-3"><div className="text-slate-400">On-prem packaging</div><div className="mt-1 text-lg font-bold text-belcyan">Ready</div></div>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard title="AI recommendations" kicker="Predictive decisions" action={<StatusBadge tone="amber">Synthetic</StatusBadge>}>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="rounded-2xl border border-belamber/20 bg-belamber/10 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="font-semibold text-slate-100">{alert.name}</div>
                  <StatusBadge tone={alert.failureProbability > 12 ? 'red' : 'amber'}>{`${alert.failureProbability}% risk`}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{alert.recommendation}</p>
              </div>
            ))}
            <div className="safe-badge rounded-2xl p-4 text-sm leading-6 text-slate-200">
              <strong>Source-owned autonomy:</strong> the POC is structured as a handover-ready codebase with synthetic data, unit-test-ready utilities, audit trail and deployment blueprint.
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <GlassCard title="Readiness trend" kicker="Live synthetic telemetry" className="xl:col-span-2">
          <MultiLineChart data={chartData} keys={["missionReadiness", "rfQuality", "eoClarity"]} />
        </GlassCard>
        <GlassCard title="Platform thesis" kicker="Bid-winning posture">
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <p><strong className="text-belcyan">Not a dashboard:</strong> a physics-anchored digital thread for concept, simulation, operation and support.</p>
            <p><strong className="text-belamber">Not black-box:</strong> source-owned, modular, on-premise-first and solver-extensible.</p>
            <p><strong className="text-belgreen">Not static:</strong> scenario engine, predictive risk, traceability and audit-ready IV&V evidence.</p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
