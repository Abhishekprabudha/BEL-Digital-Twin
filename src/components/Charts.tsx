import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

interface SeriesChartProps {
  data: Array<Record<string, string | number>>;
  xKey: string;
  yKey: string;
  type?: 'line' | 'area' | 'bar';
  height?: number;
}

const tooltipStyle = {
  background: '#0b1728',
  border: '1px solid rgba(45,212,255,0.25)',
  borderRadius: '12px',
  color: '#e5f2ff'
};

export function SeriesChart({ data, xKey, yKey, type = 'area', height = 220 }: SeriesChartProps) {
  if (type === 'bar') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(45,212,255,0.06)' }} />
          <Bar dataKey={yKey} radius={[8, 8, 0, 0]} fill="#2dd4ff" />
        </BarChart>
      </ResponsiveContainer>
    );
  }
  if (type === 'line') {
    return (
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
          <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
          <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey={yKey} stroke="#2dd4ff" strokeWidth={3} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    );
  }
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <defs>
          <linearGradient id={`gradient-${yKey}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2dd4ff" stopOpacity={0.45} />
            <stop offset="95%" stopColor="#2dd4ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Area type="monotone" dataKey={yKey} stroke="#2dd4ff" strokeWidth={3} fill={`url(#gradient-${yKey})`} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function MultiLineChart({ data, keys, xKey = 'timestamp', height = 240 }: { data: Array<Record<string, string | number>>; keys: string[]; xKey?: string; height?: number; }) {
  const colors = ['#2dd4ff', '#f6b73c', '#4ade80', '#fb7185'];
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        {keys.map((key, idx) => <Line key={key} dataKey={key} type="monotone" stroke={colors[idx % colors.length]} strokeWidth={2.5} dot={false} />)}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function DomainBars({ data }: { data: Array<{ domain: string; score: number }> }) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data} layout="vertical" margin={{ left: 90, right: 10, top: 10, bottom: 0 }}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} tickLine={false} axisLine={false} />
        <YAxis type="category" dataKey="domain" width={130} tick={{ fill: '#cbd5e1', fontSize: 11 }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(45,212,255,0.06)' }} />
        <Bar dataKey="score" radius={[0, 8, 8, 0]}>
          {data.map((entry) => <Cell key={entry.domain} fill={entry.score > 85 ? '#4ade80' : entry.score > 72 ? '#f6b73c' : '#fb7185'} />)}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
