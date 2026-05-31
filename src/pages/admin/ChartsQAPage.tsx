import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

// Semantic chart tokens — kept in one place so QA can assert on them.
export const CHART_TOKENS = {
  accent: "hsl(var(--accent))",
  primary: "hsl(var(--primary))",
  success: "hsl(var(--mp-success))",
  warning: "hsl(var(--mp-warning))",
  destructive: "hsl(var(--destructive))",
  grid: "hsl(var(--border))",
  axis: "hsl(var(--muted-foreground))",
  popover: "hsl(var(--popover))",
  border: "hsl(var(--border))",
  foreground: "hsl(var(--foreground))",
  mutedForeground: "hsl(var(--muted-foreground))",
} as const;

const tooltipProps = {
  contentStyle: {
    background: CHART_TOKENS.popover,
    border: `1px solid ${CHART_TOKENS.border}`,
    borderRadius: 6,
    fontSize: 12,
  },
  labelStyle: { color: CHART_TOKENS.foreground },
  itemStyle: { color: CHART_TOKENS.mutedForeground },
};

type RangeKey = "1h" | "24h" | "7d" | "30d";
const RANGE_POINTS: Record<RangeKey, number> = { "1h": 30, "24h": 60, "7d": 90, "30d": 120 };

function series(n: number, seed: number) {
  return Array.from({ length: n }, (_, i) => ({
    t: i,
    a: 30 + Math.sin((i + seed) * 0.3) * 25 + Math.random() * 6,
    b: 50 + Math.cos((i + seed) * 0.25) * 20 + Math.random() * 5,
  }));
}

export default function ChartsQAPage() {
  const [range, setRange] = useState<RangeKey>("24h");
  const [live, setLive] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    if (!live) return;
    timer.current = window.setInterval(() => setTick((t) => t + 1), 1500);
    return () => { if (timer.current) window.clearInterval(timer.current); };
  }, [live]);

  const data = useMemo(() => series(RANGE_POINTS[range], tick), [range, tick]);

  return (
    <div className="space-y-4 p-4" data-testid="charts-qa-page">
      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-base font-semibold text-foreground">Charts &amp; Tooltip QA Harness</h1>
        <div className="ml-auto flex items-center gap-2">
          {(Object.keys(RANGE_POINTS) as RangeKey[]).map((k) => (
            <button
              key={k}
              data-testid={`range-${k}`}
              onClick={() => setRange(k)}
              className={`px-2 py-1 rounded text-xs border ${
                range === k
                  ? "bg-accent/15 border-accent text-accent"
                  : "bg-card border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
          <button
            data-testid="live-toggle"
            onClick={() => setLive((v) => !v)}
            className={`px-2 py-1 rounded text-xs border ${
              live
                ? "bg-primary/15 border-primary text-primary"
                : "bg-card border-border text-muted-foreground"
            }`}
          >
            {live ? "● LIVE" : "○ Paused"}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <Panel title="Area (accent)">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="qa-accent" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={CHART_TOKENS.accent} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={CHART_TOKENS.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_TOKENS.grid} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipProps} />
              <Area type="monotone" dataKey="a" stroke={CHART_TOKENS.accent} strokeWidth={2} fill="url(#qa-accent)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Line (primary + success)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_TOKENS.grid} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipProps} />
              <Line type="monotone" dataKey="a" stroke={CHART_TOKENS.primary} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="b" stroke={CHART_TOKENS.success} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Bar (warning)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.slice(0, 16)}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_TOKENS.grid} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="b" fill={CHART_TOKENS.warning} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Line (destructive)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_TOKENS.grid} />
              <XAxis dataKey="t" tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10, fill: CHART_TOKENS.axis }} tickLine={false} axisLine={false} />
              <Tooltip {...tooltipProps} />
              <Line type="monotone" dataKey="a" stroke={CHART_TOKENS.destructive} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Legend />
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-card p-3">
      <h2 className="text-xs font-medium text-muted-foreground mb-2">{title}</h2>
      {children}
    </section>
  );
}

function Legend() {
  const items: Array<[keyof typeof CHART_TOKENS, string]> = [
    ["accent", "--accent"], ["primary", "--primary"], ["success", "--mp-success"],
    ["warning", "--mp-warning"], ["destructive", "--destructive"],
    ["grid", "--border"], ["axis", "--muted-foreground"], ["popover", "--popover"],
  ];
  return (
    <section className="rounded-xl border border-border bg-card p-3" data-testid="token-legend">
      <h2 className="text-xs font-medium text-muted-foreground mb-2">Token legend</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
        {items.map(([k, label]) => (
          <div key={k} className="flex items-center gap-2">
            <span className="w-4 h-4 rounded border border-border" style={{ background: CHART_TOKENS[k] }} />
            <code className="text-muted-foreground">{label}</code>
          </div>
        ))}
      </div>
    </section>
  );
}