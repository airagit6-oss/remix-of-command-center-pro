// @ts-nocheck
import { useState, useEffect, useMemo } from "react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { MetricPanel } from "@/components/dashboard/MetricPanel";
import { api } from "@/lib/api";
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Bar, BarChart, Line, LineChart, ComposedChart } from "recharts";
import {
  Activity, Brain, Cpu, Database, Globe2, Radio, ShieldCheck, Sparkles,
  TrendingUp, AlertTriangle, Zap, Server, Wifi, Mic, Search, ChevronRight,
  CircleDot, Rocket, LineChart as LineIcon
} from "lucide-react";

const chartTooltipStyle = {
  contentStyle: {
    background: "hsl(var(--popover))",
    border: "1px solid hsl(210,100%,52% / 0.25)",
    borderRadius: 8,
    fontSize: 12,
    boxShadow: "0 8px 40px hsl(210 100% 52% / 0.15)",
    backdropFilter: "blur(12px)",
  },
  labelStyle: { color: "hsl(var(--foreground))" },
  itemStyle: { color: "hsl(var(--muted-foreground))" },
};

/* ----------------------- Premium primitives ----------------------- */

function GlowDot({ color = "cyan" }: { color?: "cyan" | "green" | "purple" | "red" | "amber" }) {
  const map = {
    cyan: "bg-cyan-400 shadow-[0_0_12px_hsl(186_90%_55%/0.9)]",
    green: "bg-emerald-400 shadow-[0_0_12px_hsl(142_71%_45%/0.9)]",
    purple: "bg-fuchsia-400 shadow-[0_0_12px_hsl(280_80%_60%/0.9)]",
    red: "bg-red-400 shadow-[0_0_12px_hsl(0_72%_51%/0.9)]",
    amber: "bg-amber-400 shadow-[0_0_12px_hsl(38_92%_50%/0.9)]",
  } as const;
  return <span className={`relative inline-flex w-2 h-2 rounded-full ${map[color]}`}>
    <span className={`absolute inset-0 rounded-full ${map[color].split(" ")[0]} animate-ping opacity-60`} />
  </span>;
}

function HoloRing({ value, label, color = "210 100% 52%" }: { value: number; label: string; color?: string }) {
  const r = 26, c = 2 * Math.PI * r;
  return (
    <div className="flex items-center gap-3">
      <svg width="64" height="64" className="-rotate-90 drop-shadow-[0_0_8px_hsl(210_100%_52%/0.4)]">
        <circle cx="32" cy="32" r={r} stroke="hsl(var(--border))" strokeWidth="5" fill="none" />
        <circle cx="32" cy="32" r={r} stroke={`hsl(${color})`} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={c - (value / 100) * c} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease-out" }} />
      </svg>
      <div>
        <div className="text-lg font-semibold text-foreground dd-text-mono tabular-nums">{value}%</div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      </div>
    </div>
  );
}

/* ----------------------- Page ----------------------- */

export default function OverviewPage() {
  const [kpi, setKpi] = useState<any[]>([]);
  const [usersData] = useState(() => Array.from({ length: 30 }, (_, i) => ({ name: i, value: 8000 + Math.sin(i * 0.3) * 3500 })));
  const [revenueData] = useState(() => Array.from({ length: 30 }, (_, i) => ({ name: i, value: 1500 + Math.sin(i * 0.4) * 1250 })));
  const [appUsageData] = useState(() => ['WebApp', 'Mobile', 'API', 'Analytics', 'Auth', 'CDN'].map((n, i) => ({
    name: n, value: 500 + i * 800
  })));
  const [errorData] = useState(() => Array.from({ length: 30 }, (_, i) => ({ name: i, value: Math.sin(i * 0.5) * 4 })));
  const [latencyData] = useState(() => Array.from({ length: 30 }, (_, i) => ({ name: i, value: 20 + Math.sin(i * 0.3) * 140 })));
  const [systemData] = useState(() => Array.from({ length: 30 }, (_, i) => ({
    name: i, value: 30 + Math.sin(i * 0.4) * 30, ram: 40 + i * 2, cpu: 30 + Math.sin(i * 0.4) * 30
  })));

  // Realtime executive metrics
  const [pulse, setPulse] = useState({
    cpu: 47, ram: 62, db: 71, queue: 18, cdn: 99, ai: 96,
    txns: 1284, sessions: 8421, mrr: 184320, threats: 2,
    forecast: 12.4,
  });
  const [time, setTime] = useState(new Date());
  const [feed, setFeed] = useState<{ id: number; type: string; msg: string; t: string; sev: "ok" | "warn" | "err" | "info" }[]>([
    { id: 1, type: "TXN", msg: "Stripe payment €4,820 · Acme Corp", t: "now", sev: "ok" },
    { id: 2, type: "AI",  msg: "Anomaly detected on /api/checkout latency", t: "2s", sev: "warn" },
    { id: 3, type: "SUB", msg: "New annual subscription · Pro Plan ×3", t: "5s", sev: "ok" },
    { id: 4, type: "SEC", msg: "Login from new device · review session", t: "9s", sev: "info" },
    { id: 5, type: "RES", msg: "Reseller payout queued · $12,400", t: "14s", sev: "info" },
  ]);

  useEffect(() => {
    api.get('/overview/kpi').then(data => {
      setKpi(data || []);
    });
    const iv = setInterval(() => {
      api.get('/overview/kpi').then(data => {
        setKpi(data || []);
      });
    }, 5000);
    const ivp = setInterval(() => {
      setPulse(p => ({
        cpu: Math.max(20, Math.min(95, p.cpu + ((Date.now() % 10) - 5) * 1)),
        ram: Math.max(30, Math.min(95, p.ram + ((Date.now() % 6) - 3) * 1)),
        db: Math.max(40, Math.min(98, p.db + ((Date.now() % 5) - 2.5) * 1)),
        queue: Math.max(0, Math.min(120, p.queue + Math.round((Date.now() % 8) - 4))),
        cdn: Math.max(95, Math.min(100, p.cdn + ((Date.now() % 1) - 0.5) * 0.4)),
        ai: Math.max(88, Math.min(99.9, p.ai + ((Date.now() % 2) - 1) * 0.4)),
        txns: p.txns + (Date.now() % 6),
        sessions: p.sessions + Math.floor((Date.now() % 24) - 10),
        mrr: p.mrr + Math.floor(Date.now() % 240),
        threats: Math.max(0, p.threats + (Date.now() % 100 > 92 ? 1 : 0)),
        forecast: +(p.forecast + ((Date.now() % 10) - 5) * 0.08).toFixed(2),
      }));
    }, 1800);
    const ivt = setInterval(() => setTime(new Date()), 1000);
    const ivf = setInterval(() => {
      const samples = [
        { type: "TXN", msg: "Card payment $238 · Customer #29481", sev: "ok" as const },
        { type: "AI",  msg: "Predictive model: revenue +3.2% next 24h", sev: "info" as const },
        { type: "SEC", msg: "Failed login burst blocked (rate-limit)", sev: "warn" as const },
        { type: "MKT", msg: "Marketplace · 14 trending products surge", sev: "info" as const },
        { type: "ERR", msg: "Webhook retry succeeded · Stripe", sev: "ok" as const },
        { type: "LIC", msg: "License activated · Enterprise tier", sev: "ok" as const },
      ];
      const s = samples[Date.now() % samples.length];
      setFeed(f => [{ id: Date.now(), t: "now", ...s }, ...f].slice(0, 8));
    }, 3200);
    return () => { clearInterval(iv); clearInterval(ivp); clearInterval(ivt); clearInterval(ivf); };
  }, []);

  const heartbeat = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    x: i, y: 50 + Math.sin(i * 0.6) * 18 + (i % 7 === 0 ? 22 : 0)
  })), []);

  const sevColor = (s: string) =>
    s === "ok" ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" :
    s === "warn" ? "text-amber-400 border-amber-500/30 bg-amber-500/10" :
    s === "err" ? "text-red-400 border-red-500/30 bg-red-500/10" :
    "text-cyan-400 border-cyan-500/30 bg-cyan-500/10";

  return (
    <div className="relative space-y-4">
      {/* Ambient cyber background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
        <div className="absolute top-1/3 -right-40 w-[520px] h-[520px] rounded-full bg-fuchsia-500/10 blur-[120px] animate-pulse" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-0 left-1/3 w-[520px] h-[520px] rounded-full bg-blue-600/10 blur-[120px] animate-pulse" style={{ animationDelay: "3s" }} />
        <div className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(hsl(210 100% 60% / 0.4) 1px, transparent 1px), linear-gradient(90deg, hsl(210 100% 60% / 0.4) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          }}
        />
      </div>

      {/* Executive Command Bar */}
      <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[hsl(220_25%_7%/0.85)] via-[hsl(220_22%_5%/0.85)] to-[hsl(260_30%_8%/0.85)] backdrop-blur-xl p-4 shadow-[0_8px_40px_hsl(210_100%_52%/0.12)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 pr-4 border-r border-white/10">
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_24px_hsl(186_90%_55%/0.6)]">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[hsl(220_22%_5%)] animate-pulse" />
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-cyan-300/70">Boss Command Center</div>
              <div className="text-sm font-semibold text-foreground flex items-center gap-2">
                JARVIS <Sparkles className="w-3 h-3 text-cyan-400" /> <span className="text-emerald-400 text-xs font-normal">all systems nominal</span>
              </div>
            </div>
          </div>

          {/* AI search */}
          <div className="flex-1 min-w-[260px] relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-cyan-300/70" />
            <input
              placeholder="Ask Jarvis · 'show revenue last 24h', 'find at-risk subs', 'spike on /checkout'..."
              className="w-full h-9 pl-9 pr-20 rounded-lg bg-black/40 border border-cyan-500/20 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-400/60 focus:border-cyan-400/50 transition-all"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button className="p-1.5 rounded-md hover:bg-cyan-500/10 text-cyan-300/70 hover:text-cyan-300 transition-colors">
                <Mic className="w-3.5 h-3.5" />
              </button>
              <kbd className="hidden md:inline-flex h-5 px-1.5 items-center text-[10px] rounded bg-white/5 border border-white/10 text-muted-foreground">⌘K</kbd>
            </div>
          </div>

          {/* Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Pill icon={<Wifi className="w-3 h-3" />} color="green" label={`SYNC ${pulse.cdn.toFixed(1)}%`} />
            <Pill icon={<ShieldCheck className="w-3 h-3" />} color={pulse.threats > 3 ? "red" : "green"} label={`SEC ${pulse.threats} alerts`} />
            <Pill icon={<Activity className="w-3 h-3" />} color="cyan" label={`${pulse.sessions.toLocaleString()} live`} />
            <Pill icon={<Globe2 className="w-3 h-3" />} color="purple" label={time.toUTCString().slice(17, 25) + " UTC"} />
          </div>
        </div>

        {/* Revenue ticker */}
        <div className="mt-4 flex items-center gap-3 overflow-hidden border-t border-white/5 pt-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-cyan-300/80 shrink-0">
            <Radio className="w-3 h-3 animate-pulse" /> LIVE TAPE
          </div>
          <div className="flex-1 overflow-hidden whitespace-nowrap">
            <div className="inline-flex gap-8 animate-[marquee_38s_linear_infinite] dd-text-mono text-xs">
              {[
                ["MRR", `$${(pulse.mrr / 1000).toFixed(1)}k`, "+2.4%"],
                ["TXN/min", `${pulse.txns}`, "+0.8%"],
                ["Active Subs", kpi.activeSubs.value.toLocaleString(), `${kpi.activeSubs.change}%`],
                ["AI Req/s", `${(pulse.ai * 12).toFixed(0)}`, "+1.2%"],
                ["Reseller GMV", "$1.28M", "+5.1%"],
                ["Marketplace", "$842k", "+3.7%"],
                ["Latency p95", `${Math.round(pulse.cpu * 1.3)}ms`, "-4%"],
                ["Errors", `${kpi.errorRate.value}%`, `${kpi.errorRate.change}%`],
              ].concat([
                ["MRR", `$${(pulse.mrr / 1000).toFixed(1)}k`, "+2.4%"],
                ["TXN/min", `${pulse.txns}`, "+0.8%"],
                ["Active Subs", kpi.activeSubs.value.toLocaleString(), `${kpi.activeSubs.change}%`],
              ]).map(([k, v, d], i) => (
                <span key={i} className="inline-flex items-center gap-2">
                  <span className="text-muted-foreground">{k}</span>
                  <span className="text-foreground font-semibold">{v}</span>
                  <span className={String(d).startsWith("-") ? "text-red-400" : "text-emerald-400"}>{d}</span>
                  <span className="text-muted-foreground/40">·</span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Row (existing, wrapped in glow halos) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          ["Active Users", kpi.activeUsers, "blue"],
          ["Req/sec", kpi.requestsPerSec, "green"],
          ["Error Rate", kpi.errorRate, "red"],
          ["Revenue/min", kpi.revenuePerMin, "yellow"],
          ["Active Subs", kpi.activeSubs, "purple"],
        ].map(([title, k, color]: any, i) => (
          <div key={i} className="group relative">
            <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-cyan-500/30 via-transparent to-fuchsia-500/30 opacity-0 group-hover:opacity-100 blur-md transition-opacity" />
            <div className="relative">
              <KpiCard
                title={title}
                value={k.value}
                change={k.change}
                color={color}
                prefix={title === "Revenue/min" ? "$" : ""}
                suffix={title === "Error Rate" ? "%" : ""}
              />
              <div className="absolute top-2 right-2 flex items-center gap-1">
                <GlowDot color={color === "red" ? "red" : color === "green" ? "green" : color === "purple" ? "purple" : color === "yellow" ? "amber" : "cyan"} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* AI Command Panel + Heartbeat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[hsl(220_25%_6%/0.8)] to-[hsl(260_30%_7%/0.8)] backdrop-blur-xl p-4">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-cyan-500/10 blur-3xl" />
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-300/80">AI Intelligence Stream</h3>
              <GlowDot color="cyan" />
            </div>
            <span className="text-[10px] text-muted-foreground dd-text-mono">model: jarvis-v7 · forecast +{pulse.forecast}%</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <HoloRing value={Math.round(pulse.ai)} label="AI Health" color="186 90% 55%" />
            <HoloRing value={Math.round(pulse.cdn)} label="Uptime" color="142 71% 45%" />
            <HoloRing value={Math.round(pulse.db)} label="DB Load" color="280 80% 60%" />
            <HoloRing value={Math.round(pulse.cpu)} label="Compute" color="38 92% 50%" />
          </div>

          <div className="space-y-2">
            {[
              { icon: TrendingUp, wrap: "bg-emerald-500/15 border border-emerald-500/30", ic: "text-emerald-400", t: "Revenue forecast", v: `+${pulse.forecast}% next 24h · confidence 94%` },
              { icon: AlertTriangle, wrap: "bg-amber-500/15 border border-amber-500/30", ic: "text-amber-400", t: "Anomaly", v: "Spike on /api/checkout latency · auto-mitigation engaged" },
              { icon: Rocket, wrap: "bg-cyan-500/15 border border-cyan-500/30", ic: "text-cyan-400", t: "Optimization", v: "Promote Pro Plan to 412 trial users (LTV +$48k est.)" },
              { icon: ShieldCheck, wrap: "bg-fuchsia-500/15 border border-fuchsia-500/30", ic: "text-fuchsia-400", t: "Fraud watch", v: `${pulse.threats} suspicious sessions · 0 confirmed` },
            ].map((r, i) => (
              <div key={i} className="group flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-cyan-500/30 transition-all px-3 py-2">
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${r.wrap}`}>
                  <r.icon className={`w-3.5 h-3.5 ${r.ic}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-foreground">{r.t}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{r.v}</div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Realtime activity feed */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[hsl(220_22%_5%/0.8)] backdrop-blur-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-xs uppercase tracking-[0.2em] text-emerald-300/80">Live Activity</h3>
            </div>
            <span className="text-[10px] text-muted-foreground dd-text-mono">{feed.length} events</span>
          </div>
          <div className="space-y-1.5 max-h-[320px] overflow-hidden">
            {feed.map((f) => (
              <div key={f.id} className="animate-fade-in flex items-start gap-2 rounded-md border border-white/5 bg-white/[0.02] px-2.5 py-2">
                <span className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider border ${sevColor(f.sev)}`}>
                  {f.type}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[11px] text-foreground truncate">{f.msg}</div>
                  <div className="text-[10px] text-muted-foreground dd-text-mono">{f.t}</div>
                </div>
                <CircleDot className={`w-2.5 h-2.5 shrink-0 mt-1 ${
                  f.sev === "ok" ? "text-emerald-400" : f.sev === "warn" ? "text-amber-400" : f.sev === "err" ? "text-red-400" : "text-cyan-400"
                }`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Grid (existing, glass-wrapped) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <GlassWrap>
          <MetricPanel title="Users Activity">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={usersData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#userGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>

        <GlassWrap>
          <MetricPanel title="Revenue Stream">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--mp-success))" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="hsl(var(--mp-success))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="value" stroke="hsl(var(--mp-success))" strokeWidth={2} fill="url(#revGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>

        <GlassWrap>
          <MetricPanel title="App Usage">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={appUsageData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <defs>
                  <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" />
                  </linearGradient>
                </defs>
                <Bar dataKey="value" fill="url(#barGrad)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <GlassWrap>
          <MetricPanel title="Error Rate">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={errorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>

        <GlassWrap>
          <MetricPanel title="API Latency (ms)">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Line type="monotone" dataKey="value" stroke="hsl(var(--mp-warning))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>

        <GlassWrap>
          <MetricPanel title="CPU / RAM">
            <ResponsiveContainer width="100%" height={200}>
              <ComposedChart data={systemData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} />
                <Tooltip {...chartTooltipStyle} />
                <Area type="monotone" dataKey="cpu" stroke="hsl(var(--accent))" fill="hsl(var(--accent))" fillOpacity={0.18} strokeWidth={1.5} dot={false} name="CPU %" />
                <Line type="monotone" dataKey="ram" stroke="hsl(var(--accent))" strokeWidth={1.5} dot={false} name="RAM %" />
              </ComposedChart>
            </ResponsiveContainer>
          </MetricPanel>
        </GlassWrap>
      </div>

      {/* Infrastructure strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Cpu, label: "CPU", v: pulse.cpu, suffix: "%", ic: "text-cyan-400" },
          { icon: Server, label: "RAM", v: pulse.ram, suffix: "%", ic: "text-fuchsia-400" },
          { icon: Database, label: "DB", v: pulse.db, suffix: "%", ic: "text-amber-400" },
          { icon: Activity, label: "Queue", v: pulse.queue, suffix: " jobs", ic: "text-emerald-400" },
          { icon: Globe2, label: "CDN", v: pulse.cdn.toFixed(1), suffix: "%", ic: "text-cyan-400" },
          { icon: Zap, label: "AI Engine", v: pulse.ai.toFixed(1), suffix: "%", ic: "text-fuchsia-400" },
        ].map((m, i) => {
          const pct = typeof m.v === "number" ? Math.min(100, m.v) : Number(m.v);
          const ok = pct < 75;
          return (
            <div key={i} className="relative overflow-hidden rounded-xl border border-white/10 bg-[hsl(220_22%_5%/0.7)] backdrop-blur-xl p-3 hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all group">
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-cyan-500/5 to-transparent transition-opacity" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <m.icon className={`w-3.5 h-3.5 ${m.ic}`} />
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
                </div>
                <GlowDot color={ok ? "green" : "amber"} />
              </div>
              <div className="relative mt-2 text-lg font-semibold text-foreground dd-text-mono tabular-nums">
                {m.v}{m.suffix}
              </div>
              <div className="relative mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${
                    ok ? "from-emerald-500 to-cyan-400" : "from-amber-500 to-red-500"
                  } transition-all duration-700 shadow-[0_0_8px_currentColor]`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Marquee + fade-in keyframes */}
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
      `}</style>
    </div>
  );
}

/* ----------------------- Sub-components ----------------------- */

function Pill({ icon, label, color }: { icon: React.ReactNode; label: string; color: "green" | "red" | "cyan" | "purple" | "amber" }) {
  const map = {
    green: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    red: "border-red-500/30 bg-red-500/10 text-red-300",
    cyan: "border-cyan-500/30 bg-cyan-500/10 text-cyan-300",
    purple: "border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300",
    amber: "border-amber-500/30 bg-amber-500/10 text-amber-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-md border text-[11px] font-medium dd-text-mono ${map[color]}`}>
      {icon}{label}
    </span>
  );
}

function GlassWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="group relative">
      <div className="absolute -inset-px rounded-lg bg-gradient-to-br from-cyan-500/20 via-transparent to-fuchsia-500/20 opacity-0 group-hover:opacity-100 blur transition-opacity" />
      <div className="relative rounded-lg border border-white/10 bg-[hsl(220_22%_5%/0.6)] backdrop-blur-xl overflow-hidden">
        {children}
      </div>
    </div>
  );
}