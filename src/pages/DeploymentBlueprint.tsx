import blueprint from '../data/deployment_blueprint.json';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

export default function DeploymentBlueprint() {
  const data = blueprint as { layers: string[]; deploymentOptions: string[]; security: string[] };
  return (
    <div>
      <PageHeader eyebrow="On-prem deployment blueprint" title="Secure, source-owned and air-gap-ready architecture for BEL autonomy" description="This page shows how the POC evolves into a layered service-oriented platform with auditability, VAPT readiness, offline operation and long-term source-code ownership." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.95fr_1.05fr]">
        <GlassCard title="Layered service-oriented architecture" kicker="Production blueprint" action={<StatusBadge tone="green">On-prem first</StatusBadge>}>
          <div className="space-y-3">
            {data.layers.map((layer, idx) => (
              <div key={layer} className="flex items-center gap-4 rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-belcyan text-sm font-black text-slate-950">{idx + 1}</div>
                <div className="font-semibold text-slate-100">{layer}</div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard title="Deployment topology" kicker="Secure delivery options">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {data.deploymentOptions.map((option) => <div key={option} className="rounded-3xl border border-belgreen/25 bg-belgreen/10 p-6"><div className="text-xl font-bold text-white">{option}</div><p className="mt-3 text-sm leading-6 text-slate-300">Packaged with local data, mock connectors, source handover discipline and no mandatory external API dependency.</p></div>)}
          </div>
          <div className="mt-5 rounded-3xl border border-belamber/25 bg-belamber/10 p-5 text-sm leading-6 text-slate-200"><strong className="text-belamber">IP handover posture:</strong> source code, dependency inventory, data, test-ready utilities, documentation, traceability artifacts and deployment instructions are structured for BEL ownership.</div>
        </GlassCard>
      </div>
      <GlassCard title="Security and assurance controls" kicker="Software SBU friendly" className="mt-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.security.map((control) => <div key={control} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="font-semibold text-white">{control}</div><p className="mt-2 text-sm leading-6 text-slate-400">Included as a POC-visible architecture control and production backlog item.</p></div>)}
        </div>
      </GlassCard>
    </div>
  );
}
