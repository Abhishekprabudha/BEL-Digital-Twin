import { useMemo, useState } from 'react';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import { DomainBars, MultiLineChart } from '../components/Charts';
import { calculateEOClarity, calculateMissionReadiness, calculateReliabilityScore, calculateRFPerformance, calculateStructuralFatigue, calculateThermalRisk } from '../utils/simulation';

const domains = [
  'Structural Mechanics', 'Thermal Simulation', 'CFD / Cooling Airflow', 'High-Frequency Electromagnetics', 'Low-Frequency Electromagnetics', 'Optics / Photonics', 'Electronics Reliability', 'Embedded Control Logic', 'Functional Safety'
];

const formulas: Record<string, string> = {
  'Structural Mechanics': 'fatigue = f(vibration, mission duration, load factor) — synthetic ROM',
  'Thermal Simulation': 'thermalRisk = ambient + power load + duration − cooling reserve',
  'CFD / Cooling Airflow': 'coolingReserve = airflow efficiency − thermal demand',
  'High-Frequency Electromagnetics': 'rfQuality = base − thermal penalty − ageing penalty − synthetic interference penalty',
  'Low-Frequency Electromagnetics': 'lfConfidence = base − noise penalty − thermal drift — illustrative only',
  'Optics / Photonics': 'eoClarity = base − jitter penalty − thermal drift − atmospheric load',
  'Electronics Reliability': 'reliability = synthetic Weibull-inspired decay from temperature, cycles and load',
  'Embedded Control Logic': 'controlConfidence = transition coverage × assertion pass rate − anomaly penalty',
  'Functional Safety': 'safetyScore = validated controls + fallback state coverage − unresolved hazard penalty'
};

const chartKeys = ['Thermal risk', 'RF Performance', 'EO clarity', 'Mission Readiness'];
const chartColors = ['#2dd4ff', '#f6b73c', '#4ade80', '#fb7185'];

export default function MultiphysicsWorkbench() {
  const [active, setActive] = useState(domains[1]);
  const [ambient, setAmbient] = useState(38);
  const [power, setPower] = useState(72);
  const [cooling, setCooling] = useState(84);
  const [duration, setDuration] = useState(6);
  const thermal = calculateThermalRisk(ambient, power, cooling, duration);
  const structural = calculateStructuralFatigue(0.28, duration, 1.2);
  const rf = calculateRFPerformance(95, thermal, 150, 32);
  const eo = calculateEOClarity(0.18, thermal, 30);
  const reliability = calculateReliabilityScore(ambient + thermal * 0.08, 360, 1.15);
  const readiness = calculateMissionReadiness(89, rf, eo, thermal, reliability);

  const domainScores = useMemo(() => [
    { domain: 'Structural', score: Math.round(100 - structural * 0.38) },
    { domain: 'Thermal', score: Math.round(100 - thermal) },
    { domain: 'CFD', score: Math.round(cooling) },
    { domain: 'HF EM', score: Math.round(rf) },
    { domain: 'LF EM', score: Math.round(88 - thermal * 0.05) },
    { domain: 'Optics', score: Math.round(eo) },
    { domain: 'Reliability', score: Math.round(reliability) },
    { domain: 'Embedded', score: 93 },
    { domain: 'Safety', score: 91 }
  ], [cooling, eo, reliability, rf, structural, thermal]);

  const chartData = Array.from({ length: 10 }, (_, i) => {
    const step = i + 1;
    const nextThermal = calculateThermalRisk(ambient + i * 0.8, power + i * 1.3, cooling - i * 0.9, duration + i * 0.25);
    const nextRf = calculateRFPerformance(95, nextThermal, 150, 32);
    const nextEo = calculateEOClarity(0.18, nextThermal, 30);
    const nextReadiness = calculateMissionReadiness(89, nextRf, nextEo, nextThermal, reliability);

    return {
      step: `T+${step}`,
      'Thermal risk': Math.round(nextThermal),
      'RF Performance': Math.round(nextRf),
      'EO clarity': Math.round(nextEo),
      'Mission Readiness': Math.round(nextReadiness)
    };
  });

  return (
    <div>
      <PageHeader eyebrow="Multiphysics workbench" title="Surrogate / ROM-ready simulation bench across nine engineering domains" description="Each domain is a safe POC model that demonstrates the workflow. Production implementation can replace these utilities with high-fidelity solvers and HPC orchestration." />
      <div className="mb-4 flex flex-wrap gap-2">
        {domains.map((domain) => <button key={domain} onClick={() => setActive(domain)} className={`rounded-full border px-3 py-2 text-xs md:text-sm ${active === domain ? 'border-belcyan bg-belcyan/20 text-white' : 'border-white/10 bg-white/[0.03] text-slate-400 hover:text-white'}`}>{domain}</button>)}
      </div>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard title={active} kicker="POC surrogate / ROM model" action={<StatusBadge tone="amber">Replaceable solver</StatusBadge>}>
          <div className="rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4 text-sm leading-6 text-slate-300">
            <strong className="text-belcyan">Formula:</strong> {formulas[active]}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4">
            {[['Ambient temp', ambient, setAmbient, -10, 55, '°C'], ['Power load', power, setPower, 20, 100, '%'], ['Cooling efficiency', cooling, setCooling, 45, 100, '%'], ['Mission duration', duration, setDuration, 1, 12, 'h']].map(([label, value, setter, min, max, unit]) => (
              <label key={label as string} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-slate-300">
                <div className="mb-2 flex justify-between"><span>{label as string}</span><span className="text-white">{value as number}{unit as string}</span></div>
                <input type="range" min={min as number} max={max as number} value={value as number} onChange={(e) => (setter as (v:number)=>void)(Number(e.target.value))} className="w-full accent-cyan-400" />
              </label>
            ))}
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <ProgressBar label="Thermal risk" value={thermal} inverse />
            <ProgressBar label="RF performance" value={rf} />
            <ProgressBar label="EO clarity" value={eo} />
            <ProgressBar label="Mission readiness" value={readiness} />
          </div>
          <div className="report-paper mt-5 rounded-2xl p-4 text-sm leading-6 text-slate-300">
            <strong className="text-belamber">Risk interpretation:</strong> Scenario remains within synthetic demonstration limits. Thermal and RF indicators should be watched when power load rises or cooling reserve drops.
          </div>
        </GlassCard>
        <GlassCard title="Simulation result visualization" kicker="High-fidelity UI pattern" action={<button className="rounded-full border border-belcyan/40 bg-belcyan/10 px-4 py-2 text-sm text-belcyan">Export report</button>}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-4">
              <div className="mb-4 text-sm font-semibold text-slate-100">Domain readiness scores</div>
              <DomainBars data={domainScores} />
            </div>
            <div className="rounded-2xl border border-white/10 bg-[#06101d] p-4">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div className="text-sm font-semibold text-slate-100">Multiphysics parameter trends</div>
                <div className="flex flex-wrap gap-x-3 gap-y-2 text-[11px] text-slate-300">
                  {chartKeys.map((key, index) => (
                    <span key={key} className="inline-flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[index] }} />
                      {key}
                    </span>
                  ))}
                </div>
              </div>
              <MultiLineChart data={chartData} xKey="step" keys={chartKeys} height={280} />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-belgreen/20 bg-belgreen/10 p-4"><div className="text-sm text-slate-400">Simulation status</div><div className="mt-2 text-xl font-bold text-belgreen">Completed</div></div>
            <div className="rounded-2xl border border-belcyan/20 bg-belcyan/10 p-4"><div className="text-sm text-slate-400">Linked requirement</div><div className="mt-2 text-xl font-bold text-belcyan">REQ-SIM-014</div></div>
            <div className="rounded-2xl border border-belamber/20 bg-belamber/10 p-4"><div className="text-sm text-slate-400">Evidence package</div><div className="mt-2 text-xl font-bold text-belamber">Audit ready</div></div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
