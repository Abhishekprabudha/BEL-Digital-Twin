import type { ReactNode } from 'react';
import StatusBadge from './StatusBadge';

export type PageKey = 'command' | 'portfolio' | 'twin' | 'workbench' | 'scenario' | 'predictive' | 'thread' | 'solver' | 'deployment' | 'compliance' | 'story';

interface ShellProps {
  active: PageKey;
  onNavigate: (page: PageKey) => void;
  children: ReactNode;
}

const navItems: Array<{ key: PageKey; label: string; short: string }> = [
  { key: 'command', label: 'Command Center', short: '01' },
  { key: 'portfolio', label: 'Electronics Portfolio', short: '02' },
  { key: 'twin', label: '3D Digital Twin', short: '03' },
  { key: 'workbench', label: 'Multiphysics Workbench', short: '04' },
  { key: 'scenario', label: 'Mission Scenario Engine', short: '05' },
  { key: 'predictive', label: 'Predictive Operations', short: '06' },
  { key: 'thread', label: 'Digital Thread & Traceability', short: '07' },
  { key: 'solver', label: 'Solver & API Integration', short: '08' },
  { key: 'deployment', label: 'On-Prem Deployment Blueprint', short: '09' },
  { key: 'compliance', label: 'EOI Compliance Matrix', short: '10' },
  { key: 'story', label: 'Demo Story Mode', short: '11' }
];

export default function Shell({ active, onNavigate, children }: ShellProps) {
  return (
    <div className="min-h-screen bg-graphite bg-radial-grid">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-80 border-r border-white/10 bg-[#07111f]/95 p-5 backdrop-blur xl:block">
        <div className="mb-6 rounded-3xl border border-belcyan/20 bg-belcyan/5 p-5 shadow-glow">
          <div className="mb-3 text-xs uppercase tracking-[0.36em] text-belcyan">AIonOS × BEL</div>
          <div className="text-xl font-black leading-tight text-slate-50">Indigenous Digital Twin Mission Lab</div>
          <p className="mt-3 text-xs leading-5 text-slate-400">Safe synthetic POC for system-of-systems multiphysics digital engineering.</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <StatusBadge tone="green">On-prem ready</StatusBadge>
            <StatusBadge tone="cyan">Source-owned</StatusBadge>
          </div>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm ${active === item.key ? 'border-belcyan/50 bg-belcyan/14 text-white shadow-glow' : 'border-white/5 bg-white/[0.025] text-slate-400 hover:border-belcyan/25 hover:bg-belcyan/8 hover:text-slate-100'}`}
            >
              <span className={`grid h-8 w-8 place-items-center rounded-xl text-xs font-bold ${active === item.key ? 'bg-belcyan text-slate-950' : 'bg-slate-800 text-slate-400'}`}>{item.short}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-belamber/20 bg-belamber/10 p-4 text-xs leading-5 text-slate-300">
          <strong className="text-belamber">Safe POC notice:</strong> all telemetry, models and scenarios are fictional, non-sensitive and non-classified.
        </div>
      </aside>
      <header className="sticky top-0 z-10 border-b border-white/10 bg-graphite/88 px-4 py-3 backdrop-blur xl:hidden">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-belcyan">AIonOS × BEL</div>
            <div className="font-bold text-white">Digital Twin Mission Lab</div>
          </div>
          <StatusBadge tone="green">POC</StatusBadge>
        </div>
        <select value={active} onChange={(e) => onNavigate(e.target.value as PageKey)} className="w-full rounded-xl border border-belcyan/20 bg-panel px-3 py-2 text-sm text-white">
          {navItems.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
        </select>
      </header>
      <main className="px-4 py-6 xl:ml-80 xl:p-8">
        {children}
      </main>
    </div>
  );
}
