import { useEffect, useMemo, useState } from 'react';
import scenarios from '../data/scenarios.json';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { MultiLineChart } from '../components/Charts';
import type { Scenario, ScenarioImpact } from '../types';
import { calculateScenarioImpact } from '../utils/simulation';
import { runScenarioJob } from '../services/mockApi';

export default function MissionScenarioEngine() {
  const scenarioList = scenarios as Scenario[];
  const [selectedId, setSelectedId] = useState(scenarioList[0].id);
  const selected = scenarioList.find((s) => s.id === selectedId) ?? scenarioList[0];
  const [running, setRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [impact, setImpact] = useState<ScenarioImpact>(calculateScenarioImpact(selected));
  const [jobId, setJobId] = useState('JOB-READY');

  useEffect(() => {
    setImpact(calculateScenarioImpact(selected));
    setProgress(0);
    setJobId('JOB-READY');
  }, [selected]);

  useEffect(() => {
    if (!running) return;
    const timer = window.setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          window.clearInterval(timer);
          setRunning(false);
          return 100;
        }
        return Math.min(100, p + 5);
      });
    }, 160);
    return () => window.clearInterval(timer);
  }, [running]);

  async function handleRun() {
    setRunning(true);
    setProgress(0);
    const result = await runScenarioJob(selected.id);
    setImpact(result.impact);
    setJobId(result.jobId);
  }

  const timelineData = useMemo(() => Array.from({ length: 12 }, (_, i) => {
    const factor = i / 11;
    return {
      timestamp: `T+${i * 5}m`,
      missionReadiness: Math.round(92 - factor * (100 - impact.missionReadiness) + Math.sin(i) * 1.5),
      rfPerformance: Math.round(96 - factor * (100 - impact.rfPerformance) + Math.cos(i / 2) * 1.2),
      eoClarity: Math.round(96 - factor * (100 - impact.eoClarity) + Math.sin(i / 3) * 1.1)
    };
  }), [impact]);

  return (
    <div>
      <PageHeader eyebrow="Mission scenario engine" title="Time-dynamic scenario computation without exposing actionable military tactics" description="The POC demonstrates mission-level digital twin orchestration using fictional environmental changes, synthetic telemetry and safe surrogate impact calculations." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard title="Scenario library" kicker="Fictional and non-sensitive" action={<StatusBadge tone="cyan">{jobId}</StatusBadge>}>
          <div className="space-y-3">
            {scenarioList.map((scenario) => (
              <button key={scenario.id} onClick={() => setSelectedId(scenario.id)} className={`w-full rounded-2xl border p-4 text-left ${selected.id === scenario.id ? 'border-belcyan/50 bg-belcyan/12 shadow-glow' : 'border-white/10 bg-white/[0.03] hover:border-belcyan/25'}`}>
                <div className="font-semibold text-white">{scenario.name}</div>
                <div className="mt-1 text-sm leading-6 text-slate-400">{scenario.summary}</div>
              </button>
            ))}
          </div>
          <button onClick={handleRun} disabled={running} className="mt-5 w-full rounded-2xl border border-belgreen/40 bg-belgreen/15 px-5 py-4 font-bold text-belgreen hover:bg-belgreen/25 disabled:opacity-60">
            {running ? 'Running synthetic scenario...' : 'Run scenario'}
          </button>
          <div className="mt-5"><ProgressBar value={progress} label="Scenario timeline progress" /></div>
        </GlassCard>

        <GlassCard title={selected.name} kicker="Simulation result" action={<StatusBadge tone={impact.missionReadiness > 78 ? 'green' : 'amber'}>{impact.recommendedEnvelope}</StatusBadge>}>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Ambient</div><div className="text-2xl font-bold text-white">{selected.environment.ambientTemp}°C</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Humidity</div><div className="text-2xl font-bold text-white">{selected.environment.humidity}%</div></div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="text-xs uppercase text-slate-500">Synthetic EM load</div><div className="text-2xl font-bold text-white">{selected.environment.interferenceIndex}</div></div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <div className="space-y-3">
              <ProgressBar label="Thermal risk" value={impact.thermalRisk} inverse />
              <ProgressBar label="Structural fatigue risk" value={impact.structuralFatigue} inverse />
              <ProgressBar label="RF performance" value={impact.rfPerformance} />
              <ProgressBar label="EO clarity" value={impact.eoClarity} />
              <ProgressBar label="Reliability score" value={impact.reliabilityScore} />
              <ProgressBar label="Mission readiness" value={impact.missionReadiness} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-4">
              <div className="mb-2 text-sm font-semibold text-slate-100">Timeline outcome</div>
              <MultiLineChart data={timelineData} keys={["missionReadiness", "rfPerformance", "eoClarity"]} height={275} />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <GlassCard title="Scenario event timeline" kicker="Operator-visible sequence">
          <div className="space-y-3">
            {selected.timeline.map((event, idx) => (
              <div key={event} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className={`grid h-10 w-10 place-items-center rounded-full ${progress >= (idx + 1) * 25 ? 'bg-belgreen text-slate-950' : 'bg-slate-800 text-slate-400'}`}>{idx + 1}</div>
                <div className="font-medium text-slate-100">{event}</div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard title="AI-generated recommendations" kicker="Safe synthetic decision support">
          <div className="space-y-3">
            {impact.alerts.map((alert) => <div key={alert} className="rounded-2xl border border-belamber/20 bg-belamber/10 p-4 text-sm leading-6 text-slate-200">{alert}</div>)}
            {selected.mitigations.map((m) => <div key={m} className="rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4 text-sm leading-6 text-slate-300"><strong className="text-belcyan">Mitigation:</strong> {m}</div>)}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
