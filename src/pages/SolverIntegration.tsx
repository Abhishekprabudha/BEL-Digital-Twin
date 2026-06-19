import adapters from '../data/solver_adapters.json';
import apiCatalog from '../data/api_catalog.json';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';

const pipeline = ['Data Ingestion', 'Pre-processing', 'Solver Orchestration', 'ROM Generation', 'Visualization', 'Analytics', 'Decision Recommendation', 'Digital Thread Update'];

export default function SolverIntegration() {
  return (
    <div>
      <PageHeader eyebrow="Solver & API integration" title="Open architecture for third-party solvers, microservices and on-prem HPC orchestration" description="The POC uses local JSON and mock services today, while showing how production can integrate open-source solvers, proprietary tools, telemetry streams, REST APIs and HPC/GPU job queues." />
      <GlassCard title="Computation pipeline" kicker="Microservices-ready blueprint" action={<StatusBadge tone="cyan">Mock API active</StatusBadge>}>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[1000px] items-center gap-3">
            {pipeline.map((step, idx) => (
              <div key={step} className="flex items-center gap-3">
                <div className="rounded-2xl border border-belcyan/25 bg-belcyan/10 px-4 py-4 text-center text-sm font-semibold text-slate-100">{step}</div>
                {idx < pipeline.length - 1 && <div className="h-px w-10 bg-belcyan/40" />}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.8fr]">
        <GlassCard title="Solver adapter catalog" kicker="Extensible integration layer">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {(adapters as Array<{name:string;type:string;status:string}>).map((adapter) => (
              <div key={adapter.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-white">{adapter.name}</div>
                    <div className="mt-1 text-sm text-slate-400">{adapter.type}</div>
                  </div>
                  <StatusBadge tone={adapter.status.includes('Mock') ? 'amber' : 'cyan'}>{adapter.status}</StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
        <GlassCard title="API endpoint cards" kicker="Local mock services now, REST later">
          <div className="space-y-3">
            {(apiCatalog as Array<{method:string;endpoint:string;purpose:string}>).map((api) => (
              <div key={api.endpoint} className="rounded-2xl border border-white/10 bg-[#06101d] p-4">
                <div className="flex items-center gap-3">
                  <StatusBadge tone={api.method === 'POST' ? 'amber' : 'green'}>{api.method}</StatusBadge>
                  <code className="text-sm text-belcyan">{api.endpoint}</code>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{api.purpose}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
      <GlassCard title="Architecture value to BEL" kicker="Why this matters" className="mt-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {[
            ['Heterogeneous data orchestration', 'Streaming, batch and edge telemetry can be normalized into a twin state model.'],
            ['Containerized computation pipelines', 'Each solver or ROM can run as an isolated service with queue and audit evidence.'],
            ['Advanced 3D visualization', 'Geometry, mesh, volumetric and point mapping can share a unified front-end.'],
            ['REST integration', 'Open interfaces enable PLM, ALM, test management and operations connectors.']
          ].map(([title, body]) => <div key={title} className="rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4"><div className="font-semibold text-white">{title}</div><p className="mt-2 text-sm leading-6 text-slate-300">{body}</p></div>)}
        </div>
      </GlassCard>
    </div>
  );
}
