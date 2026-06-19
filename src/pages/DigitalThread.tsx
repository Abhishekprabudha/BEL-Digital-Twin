import { useState } from 'react';
import traceability from '../data/requirements_traceability.json';
import audit from '../data/audit_trail.json';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import { generateTraceabilityReport } from '../services/mockApi';
import type { TraceabilityRow } from '../types';

const nodes = ['Concept', 'Requirement', 'Design', 'Simulation', 'Test', 'Manufacture', 'Operation', 'Support', 'Lessons Learned', 'Design Feedback'];

export default function DigitalThread() {
  const rows = traceability as TraceabilityRow[];
  const [report, setReport] = useState<string>('No export generated yet');
  const [busy, setBusy] = useState(false);
  async function createReport() {
    setBusy(true);
    const result = await generateTraceabilityReport();
    setReport(`${result.reportId} · ${result.status} · ${result.rows.length} rows`);
    setBusy(false);
  }
  return (
    <div>
      <PageHeader eyebrow="Digital thread & traceability" title="Every insight links back to requirement, model, simulation, test and decision evidence" description="BEL evaluators should see governance strength: traceability matrix, audit trail, IV&V package, validation evidence and design-feedback loop in one place." />
      <GlassCard title="Digital thread graph" kicker="Engineering truth flow" action={<StatusBadge tone="green">Traceable</StatusBadge>}>
        <div className="overflow-x-auto pb-2">
          <div className="flex min-w-[1100px] items-center gap-3">
            {nodes.map((node, idx) => (
              <div key={node} className="flex items-center gap-3">
                <div className="relative rounded-2xl border border-belcyan/25 bg-belcyan/10 px-4 py-3 text-center text-sm font-semibold text-white shadow-glow">
                  {node}
                  <div className="absolute inset-x-5 -bottom-1 h-1 rounded-full bg-belcyan/60 pulse-soft" />
                </div>
                {idx < nodes.length - 1 && <div className="h-px w-14 overflow-hidden bg-belcyan/20"><div className="h-px w-14 bg-belcyan flow-animation" /></div>}
              </div>
            ))}
          </div>
        </div>
      </GlassCard>
      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_0.45fr]">
        <GlassCard title="Traceability matrix" kicker="Requirement-to-evidence chain" action={<button onClick={createReport} disabled={busy} className="rounded-full border border-belgreen/40 bg-belgreen/10 px-4 py-2 text-sm font-semibold text-belgreen">{busy ? 'Generating...' : 'Generate Traceability Report'}</button>}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left text-sm">
              <thead className="border-b border-white/10 text-xs uppercase tracking-[0.12em] text-slate-500">
                <tr><th className="py-3">Requirement</th><th>Domain</th><th>Design</th><th>Simulation</th><th>Telemetry</th><th>Test</th><th>Validation</th><th>Defect</th><th>Decision</th><th>Export</th></tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.requirementId} className="border-b border-white/5">
                    <td className="max-w-sm py-4"><div className="font-semibold text-belcyan">{row.requirementId}</div><div className="mt-1 text-xs leading-5 text-slate-400">{row.description}</div></td>
                    <td className="text-slate-300">{row.domain}</td>
                    <td className="text-slate-300">{row.designModel}</td>
                    <td className="text-slate-300">{row.simulationRun}</td>
                    <td className="text-slate-300">{row.telemetrySource}</td>
                    <td className="text-slate-300">{row.testCase}</td>
                    <td><StatusBadge tone={row.validationResult === 'Pass' ? 'green' : 'amber'}>{row.validationResult}</StatusBadge></td>
                    <td className="text-slate-300">{row.defect}</td>
                    <td className="text-slate-300">{row.decisionLog}</td>
                    <td><StatusBadge tone="cyan">{row.exportStatus}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
        <div className="space-y-4">
          <GlassCard title="Export actions" kicker="IV&V package">
            <div className="space-y-3">
              {['Export Test Evidence', 'View Simulation Audit Trail', 'View IV&V Package'].map((action) => <button key={action} className="w-full rounded-2xl border border-belcyan/25 bg-belcyan/8 px-4 py-3 text-left font-semibold text-belcyan hover:bg-belcyan/15">{action}</button>)}
            </div>
            <div className="report-paper mt-4 rounded-2xl p-4 text-sm leading-6 text-slate-300">{report}</div>
          </GlassCard>
          <GlassCard title="Audit trail" kicker="Evidence log">
            <div className="space-y-3">
              {(audit as Array<{time:string;actor:string;event:string;evidence:string}>).map((item) => <div key={item.evidence} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-sm"><div className="flex items-center justify-between"><span className="font-semibold text-white">{item.actor}</span><span className="text-slate-500">{item.time}</span></div><p className="mt-1 leading-5 text-slate-300">{item.event}</p><div className="mt-2 text-belcyan">{item.evidence}</div></div>)}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
