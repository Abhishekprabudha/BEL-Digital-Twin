interface StatusBadgeProps {
  children: string;
  tone?: 'green' | 'amber' | 'cyan' | 'red' | 'slate';
}

const tones = {
  green: 'border-belgreen/30 bg-belgreen/10 text-belgreen',
  amber: 'border-belamber/30 bg-belamber/10 text-belamber',
  cyan: 'border-belcyan/30 bg-belcyan/10 text-belcyan',
  red: 'border-belred/30 bg-belred/10 text-belred',
  slate: 'border-slate-500/30 bg-slate-500/10 text-slate-300'
};

export default function StatusBadge({ children, tone = 'cyan' }: StatusBadgeProps) {
  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}
