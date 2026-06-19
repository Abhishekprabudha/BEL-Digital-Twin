interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  right?: React.ReactNode;
}

export default function PageHeader({ eyebrow, title, description, right }: PageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
      <div>
        <div className="mb-2 text-xs uppercase tracking-[0.32em] text-belamber">{eyebrow}</div>
        <h1 className="max-w-5xl text-3xl font-black tracking-tight text-gradient md:text-5xl">{title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-300 md:text-base">{description}</p>
      </div>
      {right}
    </div>
  );
}
