import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import ProgressBar from '../components/ProgressBar';
import StatusBadge from '../components/StatusBadge';
import capabilityMatrix from '../data/eoi_capability_matrix.json';

interface CapabilityItem {
  clause: string;
  title: string;
  evidence: string;
  showcase: string[];
  maturity: number;
}

const items = capabilityMatrix as CapabilityItem[];
const avgMaturity = Math.round(items.reduce((sum, item) => sum + item.maturity, 0) / items.length);
const priorityAdds = [
  'Add a technical ownership page with solver IP boundaries, source-code handover scope and in-house competency evidence.',
  'Add GPU/HPC benchmark panels covering solver, pre-processing and post-processing scalability.',
  'Add chip-aware system and electronics reliability workflows to show bidirectional semiconductor-to-platform fidelity.',
  'Add security governance artefacts: RBAC, audit, secrets, data classification, SBOM and vulnerability lifecycle.',
  'Add ROM/surrogate validation cards with error bounds, training data lineage and physics-preservation checks.'
];

export default function EoiCompliance() {
  const topMaturity = [...items].sort((a, b) => b.maturity - a.maturity).slice(0, 3);
  const lowerMaturity = [...items].sort((a, b) => a.maturity - b.maturity).slice(0, 4);

  return (
    <div>
      <PageHeader
        eyebrow="EOI response accelerator"
        title="Clause-by-clause showcase roadmap for the Indigenous Digital Twin Platform"
        description="A proposal-facing matrix that turns the tender requirements into visible product evidence, demo panels and technical artefacts to add to the codebase."
        right={<StatusBadge tone="green">14 clauses mapped</StatusBadge>}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
        <GlassCard title="Overall coverage" kicker="readiness index" className="lg:col-span-2">
          <div className="text-5xl font-black text-white">{avgMaturity}%</div>
          <p className="mt-3 text-sm leading-6 text-slate-300">Average showcase maturity across deep-tech ownership, modular architecture, multiphysics breadth, predictive operations, HPC scalability, mission scenarios, APIs and secure deployment.</p>
          <div className="mt-5"><ProgressBar value={avgMaturity} label="EOI demonstration readiness" /></div>
        </GlassCard>
        <GlassCard title="Strongest proof points" kicker="lead with these" className="lg:col-span-2">
          <div className="space-y-3">
            {topMaturity.map((item) => (
              <div key={item.clause} className="rounded-2xl border border-belgreen/20 bg-belgreen/10 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-100">Clause {item.clause}: {item.title}</div>
                  <StatusBadge tone="green">{`${item.maturity}%`}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.evidence}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <GlassCard title="Highest-impact additions" kicker="what to add next">
          <ol className="space-y-3 text-sm leading-6 text-slate-300">
            {priorityAdds.map((item, index) => (
              <li key={item} className="flex gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-belcyan text-xs font-black text-slate-950">{index + 1}</span>
                <span>{item}</span>
              </li>
            ))}
          </ol>
        </GlassCard>

        <GlassCard title="Gaps to make more explicit" kicker="demo differentiators">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {lowerMaturity.map((item) => (
              <div key={item.clause} className="rounded-2xl border border-belamber/20 bg-belamber/10 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div className="font-semibold text-slate-100">Clause {item.clause}</div>
                  <StatusBadge tone="amber">{`${item.maturity}%`}</StatusBadge>
                </div>
                <div className="text-sm font-semibold text-belamber">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.evidence}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard title="Clause compliance matrix" kicker="source-owned bid evidence" className="mt-4">
        <div className="grid grid-cols-1 gap-3 2xl:grid-cols-2">
          {items.map((item) => (
            <div key={item.clause} className="rounded-2xl border border-white/10 bg-white/[0.025] p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.24em] text-belcyan">Clause {item.clause}</div>
                  <div className="mt-1 text-lg font-bold text-white">{item.title}</div>
                </div>
                <StatusBadge tone={item.maturity >= 90 ? 'green' : item.maturity >= 84 ? 'cyan' : 'amber'}>{`${item.maturity}% ready`}</StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{item.evidence}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {item.showcase.map((showcase) => <StatusBadge key={showcase} tone="slate">{showcase}</StatusBadge>)}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
