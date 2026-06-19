import { useEffect, useState } from 'react';
import DigitalTwin3D, { type TwinMode } from '../components/DigitalTwin3D';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { useTelemetry } from '../hooks/useTelemetry';
import equipmentCatalog from '../data/equipment_catalog.json';
import type { EquipmentAsset, Subsystem } from '../types';

const modes: Array<{ key: TwinMode; label: string }> = [
  { key: 'health', label: 'Component health mode' },
  { key: 'heat', label: 'Heat map mode' },
  { key: 'stress', label: 'Stress mode' },
  { key: 'rf', label: 'RF signal mode' },
  { key: 'eo', label: 'EO clarity mode' }
];

export default function DigitalTwinPage() {
  const equipment = equipmentCatalog as EquipmentAsset[];
  const [equipmentId, setEquipmentId] = useState(equipment[0].id);
  const selectedEquipment = equipment.find((item) => item.id === equipmentId) ?? equipment[0];
  const { subsystems } = useTelemetry(1400, equipmentId);
  const [mode, setMode] = useState<TwinMode>('health');
  const [selected, setSelected] = useState<Subsystem>(subsystems[0]);
  const selectedLive = subsystems.find((s) => s.id === selected?.id) ?? subsystems[0];

  useEffect(() => {
    setSelected(subsystems[0]);
  }, [equipmentId]);

  return (
    <div>
      <PageHeader
        eyebrow="3D system-of-systems twin"
        title="Clickable synthetic defence electronics payload with physics overlays"
        description="Subsystem-level 3D interaction now spans multiple BEL-relevant radar and defence-electronics concepts, with synthetic telemetry, model links and maintenance recommendations without using sensitive or classified data."
      />
      <div className="mb-4 grid grid-cols-1 gap-3 rounded-3xl border border-belcyan/20 bg-belcyan/8 p-4 lg:grid-cols-[0.8fr_1.2fr]">
        <label className="text-sm font-semibold text-slate-200">
          Select electronics twin
          <select value={equipmentId} onChange={(event) => setEquipmentId(event.target.value)} className="mt-2 w-full rounded-2xl border border-belcyan/25 bg-[#081526] px-4 py-3 text-sm text-white outline-none focus:border-belcyan">
            {equipment.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
          </select>
        </label>
        <div className="text-sm leading-6 text-slate-300">
          <div className="flex flex-wrap items-center gap-2"><span className="text-lg font-bold text-white">{selectedEquipment.family}</span><StatusBadge tone="cyan">{selectedEquipment.classification}</StatusBadge></div>
          <p className="mt-2">{selectedEquipment.description}</p>
        </div>
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {modes.map((item) => (
          <button key={item.key} onClick={() => setMode(item.key)} className={`rounded-full border px-4 py-2 text-sm ${mode === item.key ? 'border-belcyan bg-belcyan/20 text-white' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'}`}>{item.label}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassCard title="Digital twin spatial model" kicker="Simplified 3D geometry">
          <div className="h-[620px]"><DigitalTwin3D subsystems={subsystems} selectedId={selectedLive.id} mode={mode} onSelect={setSelected} geometry={selectedEquipment.geometry} /></div>
        </GlassCard>
        <GlassCard title={selectedLive.name} kicker="Selected subsystem" action={<StatusBadge tone={selectedLive.failureProbability > 10 ? 'amber' : 'green'}>{selectedLive.type}</StatusBadge>}>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Health</div><div className="mt-1 text-3xl font-bold text-white">{selectedLive.health}%</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Temperature</div><div className="mt-1 text-3xl font-bold text-white">{selectedLive.temperature}°C</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Vibration</div><div className="mt-1 text-3xl font-bold text-white">{selectedLive.vibration}</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Failure probability</div><div className="mt-1 text-3xl font-bold text-white">{selectedLive.failureProbability}%</div></div>
          </div>
          <div className="mt-5 space-y-3">
            <ProgressBar label="Signal quality" value={selectedLive.signalQuality} />
            <ProgressBar label="Remaining useful life confidence" value={Math.min(100, selectedLive.rul / 10)} />
            <ProgressBar label="Failure risk" value={selectedLive.failureProbability * 4} inverse />
          </div>
          <div className="mt-5 rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4">
            <div className="text-sm font-semibold text-belcyan">Maintenance recommendation</div>
            <p className="mt-2 text-sm leading-6 text-slate-300">{selectedLive.recommendation}</p>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="mb-2 text-xs uppercase text-slate-500">Models</div>{selectedLive.models.map((m) => <div key={m} className="text-slate-200">{m}</div>)}</div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="mb-2 text-xs uppercase text-slate-500">Requirements</div>{selectedLive.requirements.map((m) => <div key={m} className="text-slate-200">{m}</div>)}</div>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3"><div className="mb-2 text-xs uppercase text-slate-500">Tests</div>{selectedLive.tests.map((m) => <div key={m} className="text-slate-200">{m}</div>)}</div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
