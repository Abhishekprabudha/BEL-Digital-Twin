import { useEffect, useState } from 'react';
import story from '../data/demo_story.json';
import GlassCard from '../components/GlassCard';
import PageHeader from '../components/PageHeader';
import StatusBadge from '../components/StatusBadge';
import ProgressBar from '../components/ProgressBar';

type StoryStep = { step: number; title: string; narration: string; value: string };

export default function DemoStoryMode() {
  const steps = story as StoryStep[];
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((i) => (i + 1) % steps.length), 2600);
    return () => window.clearInterval(timer);
  }, [playing, steps.length]);

  const step = steps[active];
  return (
    <div>
      <PageHeader eyebrow="Demo story mode" title="A 7-minute guided boardroom narrative for BEL evaluators" description="Use this mode to present the prototype as a crisp story: twin creation, telemetry, scenario, multiphysics impact, prediction, mitigation, traceability and BEL autonomy." right={<StatusBadge tone="green">7-minute story</StatusBadge>} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassCard title="Story controls" kicker="Presenter mode">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPlaying((v) => !v)} className="rounded-2xl border border-belgreen/40 bg-belgreen/10 px-4 py-4 font-bold text-belgreen">{playing ? 'Pause story' : 'Play story'}</button>
            <button onClick={() => setActive((a) => (a + 1) % steps.length)} className="rounded-2xl border border-belcyan/40 bg-belcyan/10 px-4 py-4 font-bold text-belcyan">Next step</button>
          </div>
          <div className="mt-5"><ProgressBar value={((active + 1) / steps.length) * 100} label="Narrative progress" /></div>
          <div className="mt-5 space-y-2">
            {steps.map((s, idx) => <button key={s.step} onClick={() => setActive(idx)} className={`w-full rounded-2xl border p-3 text-left text-sm ${idx === active ? 'border-belcyan bg-belcyan/15 text-white' : 'border-white/10 bg-white/[0.03] text-slate-400'}`}><span className="mr-3 text-belcyan">{s.step}</span>{s.title}</button>)}
          </div>
        </GlassCard>
        <GlassCard title={`Step ${step.step}: ${step.title}`} kicker="Narration card" action={<StatusBadge tone="amber">Presenter script</StatusBadge>}>
          <div className="rounded-[2rem] border border-belcyan/30 bg-gradient-to-br from-belcyan/15 to-belamber/10 p-8 shadow-glow">
            <div className="text-4xl font-black text-gradient md:text-6xl">{step.title}</div>
            <p className="mt-6 text-2xl font-semibold leading-snug text-white">{step.narration}</p>
            <div className="mt-8 rounded-2xl border border-belgreen/30 bg-belgreen/10 p-5 text-lg leading-8 text-slate-100"><strong className="text-belgreen">Value:</strong> {step.value}</div>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-belcyan/20 bg-belcyan/8 p-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-500">Message</div><div className="mt-2 font-semibold text-white">Sovereign platform</div></div>
            <div className="rounded-2xl border border-belamber/20 bg-belamber/8 p-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-500">Evidence</div><div className="mt-2 font-semibold text-white">Traceable POC</div></div>
            <div className="rounded-2xl border border-belgreen/20 bg-belgreen/8 p-4"><div className="text-xs uppercase tracking-[0.16em] text-slate-500">Outcome</div><div className="mt-2 font-semibold text-white">Bid confidence</div></div>
          </div>
          <div className="mt-5 text-center text-lg font-bold text-slate-100">From design simulation to mission assurance — BEL-owned, indigenous, multiphysics digital twin infrastructure.</div>
        </GlassCard>
      </div>
    </div>
  );
}
