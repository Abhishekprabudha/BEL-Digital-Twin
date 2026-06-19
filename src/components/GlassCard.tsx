import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  title?: string;
  kicker?: string;
  action?: ReactNode;
}

export default function GlassCard({ children, className = '', title, kicker, action }: GlassCardProps) {
  return (
    <section className={`glass rounded-2xl p-5 ${className}`}>
      {(title || kicker || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {kicker && <p className="mb-1 text-xs uppercase tracking-[0.28em] text-belcyan/80">{kicker}</p>}
            {title && <h3 className="text-lg font-semibold text-slate-100">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
