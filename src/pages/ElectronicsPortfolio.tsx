import equipmentCatalog from '../data/equipment_catalog.json';
import GlassCard from '../components/GlassCard';
import MetricCard from '../components/MetricCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import DigitalTwin3D from '../components/DigitalTwin3D';
import { useTelemetry } from '../hooks/useTelemetry';
import type { EquipmentAsset } from '../types';

export default function ElectronicsPortfolio() {
  const equipment = equipmentCatalog as EquipmentAsset[];
  const featured = equipment[0];
  const { point, subsystems } = useTelemetry(1300, featured.id);
  const radarCount = equipment.filter((item) => item.family === 'Radar').length;
  const avgReadiness = Math.round(equipment.reduce((acc, item) => acc + item.readiness, 0) / equipment.length);
  const syntheticLoad = Math.round((point.powerLoad * featured.telemetryBias.thermal + point.syntheticInterferenceIndex * featured.telemetryBias.rf) / 2);

  return (
    <div>
      <PageHeader
        eyebrow="BEL electronics catalogue"
        title="Synthetic twins for radars, EW, communications, IFF and electro-optics"
        description="A safe portfolio view that expands the demonstrator beyond one radar payload. Each card uses fictional, non-sensitive data and can be visualized with the same animated 3D twin and telemetry blending pipeline."
        right={<StatusBadge tone="cyan">{`${equipment.length} synthetic products`}</StatusBadge>}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <MetricCard label="Radar variants" value={radarCount} status="neutral" detail="AESA, coastal surveillance and weapon locating concepts" />
        <MetricCard label="Portfolio readiness" value={avgReadiness} suffix="%" status="good" detail="Average synthetic readiness across electronics" />
        <MetricCard label="Live synthetic load" value={syntheticLoad} suffix="%" status={syntheticLoad > 70 ? 'watch' : 'good'} detail="Derived from power and interference telemetry" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 2xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard title="Featured animated twin" kicker={featured.name} action={<StatusBadge tone="green">Same 3D animation</StatusBadge>}>
          <div className="min-h-[440px]"><DigitalTwin3D subsystems={subsystems} mode="rf" compact geometry={featured.geometry} /></div>
        </GlassCard>
        <GlassCard title="Portfolio synthetic data model" kicker="Non-sensitive demonstrator dataset">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {equipment.map((item) => (
              <div key={item.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-white">{item.name}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-belcyan">{item.family}</div>
                  </div>
                  <StatusBadge tone={item.readiness > 88 ? 'green' : item.readiness > 84 ? 'cyan' : 'amber'}>{`${item.readiness}% ready`}</StatusBadge>
                </div>
                <p className="min-h-16 text-sm leading-6 text-slate-300">{item.description}</p>
                <div className="mt-3 space-y-2">
                  <ProgressBar label="Baseline health" value={item.health} />
                  <ProgressBar label="RF telemetry bias" value={Math.round(item.telemetryBias.rf * 80)} />
                  <ProgressBar label="Thermal sensitivity" value={Math.round(item.telemetryBias.thermal * 70)} inverse />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
