import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, ArrowDownRight, ArrowUpRight, Bot, Brain, Cpu,
  DollarSign, Flame, Globe2, Layers, Radar as RadarIcon, Radio, Rocket,
  ShieldAlert, Signal, Sparkles, Target, TrendingDown, TrendingUp, Users, Zap,
  Pause, Play, Search, X,
  Bell, Plus, Mail, MessageSquare, Webhook, Phone, ChevronRight, Trash2, Power,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, ComposedChart, Line,
  PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis,
} from "recharts";
import { generateTimeSeries } from "@/lib/mockData";
import { cn } from "@/lib/utils";

/* ───────────────── helpers ───────────────── */

const useTick = (ms = 1500) => {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((x) => x + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
};

const useCounter = (target: number, duration = 900) => {
  const [val, setVal] = useState(target);
  const from = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const startVal = from.current;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(startVal + (target - startVal) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
};

const fmtMoney = (n: number, d = 0) =>
  "$" + n.toLocaleString(undefined, { minimumFractionDigits: d, maximumFractionDigits: d });

const tt = {
  contentStyle: {
    background: "rgba(8,12,24,0.92)",
    border: "1px solid rgba(56,189,248,0.25)",
    borderRadius: 8,
    fontSize: 11,
    backdropFilter: "blur(8px)",
    boxShadow: "0 0 24px rgba(56,189,248,0.15)",
  },
  labelStyle: { color: "#7dd3fc" },
  itemStyle: { color: "#e2e8f0" },
};

/* ───────────────── shells ───────────────── */

const GlassPanel = ({
  children,
  className,
  glow = "cyan",
}: {
  children: React.ReactNode;
  className?: string;
  glow?: "cyan" | "emerald" | "violet" | "amber" | "rose";
}) => {
  const glowMap: Record<string, string> = {
    cyan: "before:bg-cyan-500/10 after:from-cyan-400/40",
    emerald: "before:bg-emerald-500/10 after:from-emerald-400/40",
    violet: "before:bg-violet-500/10 after:from-violet-400/40",
    amber: "before:bg-amber-500/10 after:from-amber-400/40",
    rose: "before:bg-rose-500/10 after:from-rose-400/40",
  };
  return (
    <div
      className={cn(
        "relative rounded-xl border border-white/[0.06] bg-gradient-to-b from-white/[0.03] to-transparent backdrop-blur-xl overflow-hidden",
        "before:content-[''] before:absolute before:inset-0 before:opacity-60 before:pointer-events-none",
        "after:content-[''] after:absolute after:inset-x-0 after:top-0 after:h-px after:bg-gradient-to-r after:via-transparent after:to-transparent",
        glowMap[glow],
        className,
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
};

/* ───────────────── KPI card ───────────────── */

type Kpi = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: "cyan" | "emerald" | "violet" | "amber" | "rose";
  ai: string;
};

const toneRing: Record<Kpi["tone"], string> = {
  cyan: "from-cyan-400/60 via-sky-500/30 to-transparent text-cyan-300",
  emerald: "from-emerald-400/60 via-emerald-500/30 to-transparent text-emerald-300",
  violet: "from-violet-400/60 via-fuchsia-500/30 to-transparent text-violet-300",
  amber: "from-amber-400/60 via-orange-500/30 to-transparent text-amber-300",
  rose: "from-rose-400/60 via-pink-500/30 to-transparent text-rose-300",
};

function KpiCell({ k }: { k: Kpi }) {
  const v = useCounter(k.value);
  const up = k.delta >= 0;
  const spark = useMemo(() => generateTimeSeries(20, 30, 80), [k.label]);
  const Icon = k.icon;
  return (
    <GlassPanel glow={k.tone} className="group p-3 transition-transform hover:-translate-y-0.5">
      <div className={cn("absolute -inset-px rounded-xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br pointer-events-none", toneRing[k.tone])} style={{ maskImage: "linear-gradient(black, transparent 60%)" }} />
      <div className="flex items-start justify-between">
        <div className={cn("h-7 w-7 rounded-md grid place-items-center bg-white/[0.04] border border-white/[0.06]", toneRing[k.tone].split(" ").pop())}>
          <Icon className="h-3.5 w-3.5" />
        </div>
        <div className={cn("flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
          up ? "text-emerald-300 bg-emerald-500/10" : "text-rose-300 bg-rose-500/10")}>
          {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {Math.abs(k.delta).toFixed(1)}%
        </div>
      </div>
      <div className="mt-2 text-[10px] uppercase tracking-[0.14em] text-slate-400">{k.label}</div>
      <div className="mt-0.5 font-mono text-xl font-semibold text-white tabular-nums">
        {k.prefix}{v.toLocaleString(undefined, { minimumFractionDigits: k.decimals ?? 0, maximumFractionDigits: k.decimals ?? 0 })}{k.suffix}
      </div>
      <div className="h-8 -mx-1 mt-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={spark}>
            <defs>
              <linearGradient id={`g-${k.label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0.5} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area dataKey="value" type="monotone" stroke="currentColor" strokeWidth={1.5}
              fill={`url(#g-${k.label})`} dot={false} isAnimationActive={false}
              className={toneRing[k.tone].split(" ").pop()} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
        <Sparkles className="h-2.5 w-2.5 text-violet-300" />
        <span className="truncate">{k.ai}</span>
      </div>
    </GlassPanel>
  );
}

/* ───────────────── command bar ───────────────── */

function CommandBar() {
  const t = useTick(1000);
  const rev = useCounter(184392 + (t % 100) * 37);
  const now = new Date();
  return (
    <GlassPanel className="px-3 sm:px-4 py-2.5">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-emerald-300 font-medium tracking-wider uppercase">Live · WS Sync</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <DollarSign className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-slate-400">Today</span>
          <span className="font-mono text-white tabular-nums">{fmtMoney(rev)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Users className="h-3.5 w-3.5 text-violet-300" />
          <span className="text-slate-400">Online</span>
          <span className="font-mono text-white tabular-nums">{12480 + (t % 23)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-slate-300">
          <Brain className="h-3.5 w-3.5 text-fuchsia-300" />
          <span className="text-slate-400">AI Forecast</span>
          <span className="font-mono text-emerald-300 tabular-nums">+18.4%</span>
        </div>
        <div className="ml-auto flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1.5"><Signal className="h-3 w-3 text-cyan-300" />OPS</span>
          <span className="flex items-center gap-1.5"><Cpu className="h-3 w-3 text-emerald-300" />47ms</span>
          <span className="hidden md:inline font-mono">{now.toLocaleTimeString("en-US", { hour12: false })} UTC</span>
        </div>
      </div>
    </GlassPanel>
  );
}

/* ───────────────── live feed ───────────────── */

type Severity = "info" | "success" | "warning" | "critical";
type FeedItem = { id: number; kind: string; tone: string; severity: Severity; msg: string; meta: string; t: string };

const feedSeed: Omit<FeedItem, "id" | "t">[] = [
  { kind: "PAY", tone: "emerald", severity: "success",  msg: "Payment captured · Acme Corp",        meta: "$12,400 · Enterprise" },
  { kind: "SUB", tone: "cyan",    severity: "info",     msg: "Subscription renewed · TechStart",    meta: "$890 · MRR +$890" },
  { kind: "AI",  tone: "violet",  severity: "info",     msg: "Anomaly: spike in LATAM signups",     meta: "+212% in 4m" },
  { kind: "ERR", tone: "rose",    severity: "critical", msg: "Failed charge · CloudNine",           meta: "3DS decline" },
  { kind: "UPG", tone: "amber",   severity: "warning",  msg: "Plan upgrade · DataFlow → Ent",       meta: "ARR +$48k" },
  { kind: "FRA", tone: "rose",    severity: "critical", msg: "Fraud signal · suspicious VPN",       meta: "score 92" },
  { kind: "PAY", tone: "emerald", severity: "success",  msg: "Payment captured · OrbitalAI",        meta: "$5,200 · Pro" },
  { kind: "AI",  tone: "violet",  severity: "info",     msg: "Upsell recommendation engaged",       meta: "+$1.2k expected" },
  { kind: "REF", tone: "amber",   severity: "warning",  msg: "Refund issued · NorthwindCo",         meta: "-$2,100" },
  { kind: "PAY", tone: "emerald", severity: "success",  msg: "Payment captured · Vertex Labs",      meta: "$8,750 · Pro" },
  { kind: "ERR", tone: "rose",    severity: "critical", msg: "Webhook timeout · billing.v2",        meta: "5xx · retry queued" },
  { kind: "SUB", tone: "cyan",    severity: "info",     msg: "Trial converted · Helios",            meta: "MRR +$249" },
];

const severityFilters: { id: Severity | "all"; label: string; cls: string }[] = [
  { id: "all",      label: "All",      cls: "text-slate-300 border-white/10 bg-white/[0.03]" },
  { id: "info",     label: "Info",     cls: "text-cyan-300 border-cyan-400/30 bg-cyan-500/10" },
  { id: "success",  label: "Success",  cls: "text-emerald-300 border-emerald-400/30 bg-emerald-500/10" },
  { id: "warning",  label: "Warning",  cls: "text-amber-300 border-amber-400/30 bg-amber-500/10" },
  { id: "critical", label: "Critical", cls: "text-rose-300 border-rose-400/30 bg-rose-500/10" },
];

function LiveFeed() {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState<Severity | "all">("all");
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    let id = 0;
    const push = () => {
      if (pausedRef.current) return;
      const seed = feedSeed[Math.floor(Math.random() * feedSeed.length)];
      setItems((prev) =>
        [{ ...seed, id: id++, t: new Date().toLocaleTimeString("en-US", { hour12: false }) }, ...prev].slice(0, 80),
      );
    };
    push(); push(); push();
    const i = setInterval(push, 1800);
    return () => clearInterval(i);
  }, []);

  const toneMap: Record<string, string> = {
    emerald: "text-emerald-300 bg-emerald-500/10 border-emerald-400/30",
    cyan: "text-cyan-300 bg-cyan-500/10 border-cyan-400/30",
    violet: "text-violet-300 bg-violet-500/10 border-violet-400/30",
    rose: "text-rose-300 bg-rose-500/10 border-rose-400/30",
    amber: "text-amber-300 bg-amber-500/10 border-amber-400/30",
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((it) => {
      if (sev !== "all" && it.severity !== sev) return false;
      if (!q) return true;
      return (
        it.msg.toLowerCase().includes(q) ||
        it.meta.toLowerCase().includes(q) ||
        it.kind.toLowerCase().includes(q)
      );
    });
  }, [items, query, sev]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: items.length, info: 0, success: 0, warning: 0, critical: 0 };
    items.forEach((i) => { c[i.severity] = (c[i.severity] || 0) + 1; });
    return c;
  }, [items]);

  return (
    <GlassPanel glow="cyan" className="h-full flex flex-col">
      {/* header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Ops Stream</span>
          <span className="text-[10px] text-slate-500 font-mono">· {filtered.length}/{items.length}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-[10px] font-mono flex items-center gap-1",
            paused ? "text-amber-300" : "text-emerald-300",
          )}>
            <span className={cn(
              "h-1.5 w-1.5 rounded-full",
              paused ? "bg-amber-400" : "bg-emerald-400 animate-pulse",
            )} />
            {paused ? "PAUSED" : "LIVE"}
          </span>
          <button
            onClick={() => setPaused((p) => !p)}
            className={cn(
              "h-6 px-2 inline-flex items-center gap-1 rounded border text-[10px] font-semibold tracking-wider uppercase transition",
              paused
                ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20"
                : "border-amber-400/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20",
            )}
            title={paused ? "Resume stream" : "Pause stream"}
          >
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {paused ? "Resume" : "Pause"}
          </button>
        </div>
      </div>

      {/* search + filters */}
      <div className="px-3 py-2 border-b border-white/[0.06] flex flex-col gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-slate-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search transactions, accounts, tags…"
            className="w-full h-7 pl-7 pr-7 rounded border border-white/10 bg-white/[0.03] text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-400/40 focus:bg-white/[0.05]"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {severityFilters.map((f) => {
            const active = sev === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setSev(f.id)}
                className={cn(
                  "h-6 px-2 rounded border text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1 transition",
                  active ? f.cls + " ring-1 ring-white/10" : "border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-slate-200",
                )}
              >
                {f.label}
                <span className="text-[9px] font-mono opacity-70">{counts[f.id] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* list */}
      <div className="flex-1 max-h-[420px] overflow-auto divide-y divide-white/[0.04]">
        {filtered.length === 0 && (
          <div className="px-3 py-8 text-center text-[11px] text-slate-500 font-mono">
            No events match your filters.
          </div>
        )}
        {filtered.map((it) => (
          <div key={it.id} className="px-3 py-2 flex items-start gap-2 animate-fade-in hover:bg-white/[0.02]">
            <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded border tabular-nums tracking-wider", toneMap[it.tone])}>
              {it.kind}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-slate-200 truncate">{it.msg}</div>
              <div className="text-[10px] text-slate-500 font-mono">{it.meta}</div>
            </div>
            <span className="text-[10px] text-slate-500 font-mono shrink-0">{it.t}</span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ───────────────── AI panel ───────────────── */

const aiInsights = [
  { icon: TrendingUp, tone: "emerald", title: "Revenue lift opportunity", body: "Bundle Pro + Analytics in EMEA → projected +$48k MRR", score: 92 },
  { icon: ShieldAlert, tone: "rose",   title: "Churn risk cluster",      body: "14 Enterprise accounts with declining usage (Tier-1)", score: 87 },
  { icon: Rocket,      tone: "cyan",   title: "Upsell sequence",         body: "9 accounts crossing 80% seat utilization this week", score: 81 },
  { icon: AlertTriangle, tone: "amber", title: "Payment anomaly",        body: "3.2× failure rate on IN-PAY corridor since 14:20 UTC", score: 76 },
];

function AiPanel() {
  const toneText: Record<string, string> = {
    emerald: "text-emerald-300", rose: "text-rose-300", cyan: "text-cyan-300", amber: "text-amber-300",
  };
  return (
    <GlassPanel glow="violet" className="h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Bot className="h-3.5 w-3.5 text-violet-300" />
          <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Revenue AI · Intel</span>
        </div>
        <span className="text-[10px] text-violet-300 font-mono">v4.2 · neural</span>
      </div>
      <div className="p-3 space-y-2">
        {aiInsights.map((i) => {
          const Icon = i.icon;
          return (
            <div key={i.title} className="group relative rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5 hover:border-violet-400/30 transition-colors">
              <div className="flex items-start gap-2">
                <Icon className={cn("h-3.5 w-3.5 mt-0.5", toneText[i.tone])} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-100">{i.title}</span>
                    <span className="text-[10px] font-mono text-violet-300">{i.score}%</span>
                  </div>
                  <p className="mt-0.5 text-[11px] text-slate-400 leading-snug">{i.body}</p>
                  <div className="mt-1.5 h-1 rounded-full bg-white/[0.05] overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-violet-400 to-cyan-400" style={{ width: `${i.score}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassPanel>
  );
}

/* ───────────────── Geo Intel ───────────────── */

const geo = [
  { country: "United States", code: "US", revenue: 482300, share: 38, delta: 6.2 },
  { country: "Germany",       code: "DE", revenue: 184500, share: 14, delta: 3.8 },
  { country: "United Kingdom",code: "GB", revenue: 162800, share: 12, delta: -1.4 },
  { country: "India",         code: "IN", revenue: 142600, share: 11, delta: 12.7 },
  { country: "Brazil",        code: "BR", revenue:  98200, share:  8, delta: 4.1 },
  { country: "Japan",         code: "JP", revenue:  72400, share:  6, delta: 2.0 },
  { country: "Australia",     code: "AU", revenue:  56800, share:  4, delta: -0.6 },
];

function GeoIntel() {
  return (
    <GlassPanel glow="cyan" className="h-full">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <Globe2 className="h-3.5 w-3.5 text-cyan-300" />
          <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Country Intelligence</span>
        </div>
        <span className="text-[10px] text-slate-500 font-mono">7 regions</span>
      </div>
      <div className="p-3 space-y-2">
        {geo.map((g) => (
          <div key={g.code} className="grid grid-cols-[auto_1fr_auto] items-center gap-2.5">
            <span className="text-[10px] font-mono text-cyan-300 w-8">{g.code}</span>
            <div className="min-w-0">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-slate-200 truncate">{g.country}</span>
                <span className="font-mono text-slate-400">{fmtMoney(g.revenue)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-sky-400 to-violet-400" style={{ width: `${g.share * 2.4}%` }} />
              </div>
            </div>
            <span className={cn("text-[10px] font-mono tabular-nums w-12 text-right",
              g.delta >= 0 ? "text-emerald-300" : "text-rose-300")}>
              {g.delta >= 0 ? "+" : ""}{g.delta.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

/* ───────────────── main page ───────────────── */

/* ───────────────── AI Alert Rules Console ───────────────── */

type RuleSeverity = "info" | "warning" | "critical";
type Channel = "email" | "slack" | "webhook" | "sms";
type Metric =
  | "revenue_drop" | "churn_spike" | "refund_surge" | "latency_p95"
  | "signup_anomaly" | "payment_failure" | "traffic_drop" | "conversion_dip";
type Condition = ">" | "<" | "±%" | "z-score";

interface AlertRule {
  id: string;
  name: string;
  enabled: boolean;
  metric: Metric;
  condition: Condition;
  threshold: number;
  window: string;
  confidence: number; // 0-100
  severity: RuleSeverity;
  channels: Channel[];
  escalation: { level: number; after: string; to: string }[];
  lastFired: string;
  fires24h: number;
}

const seedRules: AlertRule[] = [
  {
    id: "rule-001", name: "Revenue Drop > 12% (1h)", enabled: true,
    metric: "revenue_drop", condition: "±%", threshold: 12, window: "1h",
    confidence: 94, severity: "critical",
    channels: ["email", "slack", "sms"],
    escalation: [
      { level: 1, after: "0m", to: "On-call SRE" },
      { level: 2, after: "5m", to: "Revenue Lead" },
      { level: 3, after: "15m", to: "CFO + CTO" },
    ],
    lastFired: "2m ago", fires24h: 3,
  },
  {
    id: "rule-002", name: "Churn Spike (z>2.5)", enabled: true,
    metric: "churn_spike", condition: "z-score", threshold: 2.5, window: "24h",
    confidence: 88, severity: "warning",
    channels: ["slack", "email"],
    escalation: [
      { level: 1, after: "0m", to: "Growth Ops" },
      { level: 2, after: "30m", to: "Head of Retention" },
    ],
    lastFired: "1h ago", fires24h: 1,
  },
  {
    id: "rule-003", name: "Payment Failure Burst", enabled: true,
    metric: "payment_failure", condition: ">", threshold: 40, window: "15m",
    confidence: 97, severity: "critical",
    channels: ["webhook", "slack", "sms"],
    escalation: [
      { level: 1, after: "0m", to: "Payments On-call" },
      { level: 2, after: "3m", to: "Stripe Liaison" },
      { level: 3, after: "10m", to: "VP Engineering" },
    ],
    lastFired: "12m ago", fires24h: 7,
  },
  {
    id: "rule-004", name: "Conversion Dip (-8% MoM)", enabled: false,
    metric: "conversion_dip", condition: "±%", threshold: 8, window: "7d",
    confidence: 76, severity: "warning",
    channels: ["email"],
    escalation: [{ level: 1, after: "0m", to: "Growth Analyst" }],
    lastFired: "yesterday", fires24h: 0,
  },
  {
    id: "rule-005", name: "Signup Anomaly (AI)", enabled: true,
    metric: "signup_anomaly", condition: "z-score", threshold: 3.0, window: "1h",
    confidence: 91, severity: "info",
    channels: ["slack"],
    escalation: [{ level: 1, after: "0m", to: "Growth Bot" }],
    lastFired: "8m ago", fires24h: 12,
  },
  {
    id: "rule-006", name: "Refund Surge > $5k", enabled: true,
    metric: "refund_surge", condition: ">", threshold: 5000, window: "1h",
    confidence: 85, severity: "critical",
    channels: ["email", "slack", "webhook"],
    escalation: [
      { level: 1, after: "0m", to: "Finance Ops" },
      { level: 2, after: "10m", to: "CFO" },
    ],
    lastFired: "—", fires24h: 0,
  },
];

const metricLabels: Record<Metric, string> = {
  revenue_drop: "Revenue Drop", churn_spike: "Churn Spike",
  refund_surge: "Refund Surge", latency_p95: "Latency p95",
  signup_anomaly: "Signup Anomaly", payment_failure: "Payment Failures",
  traffic_drop: "Traffic Drop", conversion_dip: "Conversion Dip",
};

const sevStyle: Record<RuleSeverity, string> = {
  info: "text-cyan-300 bg-cyan-500/10 border-cyan-500/30",
  warning: "text-amber-300 bg-amber-500/10 border-amber-500/30",
  critical: "text-rose-300 bg-rose-500/10 border-rose-500/30",
};

const channelIcon: Record<Channel, typeof Mail> = {
  email: Mail, slack: MessageSquare, webhook: Webhook, sms: Phone,
};

function AlertRulesConsole() {
  const [rules, setRules] = useState<AlertRule[]>(seedRules);
  const [selectedId, setSelectedId] = useState<string>(seedRules[0].id);
  const [creating, setCreating] = useState(false);
  const [draft, setDraft] = useState<AlertRule>({
    id: "", name: "New Anomaly Rule", enabled: true,
    metric: "revenue_drop", condition: "±%", threshold: 10, window: "1h",
    confidence: 80, severity: "warning", channels: ["email"],
    escalation: [{ level: 1, after: "0m", to: "On-call" }],
    lastFired: "—", fires24h: 0,
  });

  const selected = rules.find((r) => r.id === selectedId) ?? rules[0];

  const toggleRule = (id: string) =>
    setRules((rs) => rs.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r)));

  const deleteRule = (id: string) => {
    setRules((rs) => rs.filter((r) => r.id !== id));
    if (selectedId === id && rules.length > 1) {
      setSelectedId(rules.find((r) => r.id !== id)!.id);
    }
  };

  const toggleChannel = (ch: Channel) =>
    setDraft((d) => ({
      ...d,
      channels: d.channels.includes(ch) ? d.channels.filter((c) => c !== ch) : [...d.channels, ch],
    }));

  const addEscalation = () =>
    setDraft((d) => ({
      ...d,
      escalation: [...d.escalation, { level: d.escalation.length + 1, after: "5m", to: "Team Lead" }],
    }));

  const saveDraft = () => {
    const id = `rule-${Math.random().toString(36).slice(2, 7)}`;
    setRules((rs) => [{ ...draft, id }, ...rs]);
    setSelectedId(id);
    setCreating(false);
  };

  const enabledCount = rules.filter((r) => r.enabled).length;
  const critCount = rules.filter((r) => r.severity === "critical" && r.enabled).length;
  const fires24h = rules.reduce((s, r) => s + r.fires24h, 0);

  return (
    <GlassPanel glow="rose">
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06] flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Brain className="h-3.5 w-3.5 text-rose-300" />
          <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">
            AI Alert Rules Console
          </span>
          <span className="text-[10px] font-mono text-rose-300 px-2 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center gap-1">
            <Bell className="h-3 w-3" /> {enabledCount}/{rules.length} active
          </span>
          <span className="text-[10px] font-mono text-amber-300 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            {critCount} critical
          </span>
          <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-white/[0.03] border border-white/[0.06]">
            {fires24h} fires/24h
          </span>
        </div>
        <button
          onClick={() => setCreating((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono uppercase tracking-wider border transition",
            creating
              ? "bg-slate-500/10 border-slate-500/30 text-slate-300"
              : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20",
          )}
        >
          {creating ? <X className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          {creating ? "Cancel" : "New Rule"}
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.3fr] gap-0">
        {/* List */}
        <div className="border-r border-white/[0.06] max-h-[520px] overflow-y-auto">
          {rules.map((r) => {
            const active = r.id === selectedId;
            return (
              <button
                key={r.id}
                onClick={() => { setSelectedId(r.id); setCreating(false); }}
                className={cn(
                  "w-full text-left px-3 py-2.5 border-b border-white/[0.04] transition group",
                  active ? "bg-white/[0.04]" : "hover:bg-white/[0.02]",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-1.5 w-1.5 rounded-full",
                      r.enabled ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" : "bg-slate-600",
                    )}
                  />
                  <span className="text-xs font-medium text-slate-100 truncate flex-1">{r.name}</span>
                  <span className={cn("text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border", sevStyle[r.severity])}>
                    {r.severity}
                  </span>
                </div>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono text-slate-500">
                  <span>{metricLabels[r.metric]}</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-cyan-400/80">{r.condition} {r.threshold}{r.condition === "±%" ? "%" : ""}</span>
                  <span className="text-slate-600">·</span>
                  <span>{r.window}</span>
                  <span className="ml-auto text-slate-500">{r.lastFired}</span>
                  <ChevronRight className={cn("h-3 w-3 transition", active ? "text-rose-300 translate-x-0.5" : "text-slate-600")} />
                </div>
                <div className="mt-1.5 flex items-center gap-1.5">
                  <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                      style={{ width: `${r.confidence}%` }}
                    />
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 w-14 text-right">conf {r.confidence}%</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail / Create */}
        <div className="p-3 max-h-[520px] overflow-y-auto">
          {creating ? (
            <div className="space-y-3">
              <div className="text-[10px] uppercase tracking-wider text-rose-300 font-mono flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI-Assisted Rule Builder
              </div>
              <input
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                className="w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/40"
                placeholder="Rule name"
              />
              <div className="grid grid-cols-2 gap-2">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Metric</span>
                  <select
                    value={draft.metric}
                    onChange={(e) => setDraft({ ...draft, metric: e.target.value as Metric })}
                    className="mt-1 w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/40"
                  >
                    {(Object.keys(metricLabels) as Metric[]).map((m) => (
                      <option key={m} value={m} className="bg-slate-900">{metricLabels[m]}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Condition</span>
                  <select
                    value={draft.condition}
                    onChange={(e) => setDraft({ ...draft, condition: e.target.value as Condition })}
                    className="mt-1 w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/40"
                  >
                    {[">", "<", "±%", "z-score"].map((c) => (
                      <option key={c} value={c} className="bg-slate-900">{c}</option>
                    ))}
                  </select>
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Threshold</span>
                  <input
                    type="number"
                    value={draft.threshold}
                    onChange={(e) => setDraft({ ...draft, threshold: +e.target.value })}
                    className="mt-1 w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/40"
                  />
                </label>
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Window</span>
                  <select
                    value={draft.window}
                    onChange={(e) => setDraft({ ...draft, window: e.target.value })}
                    className="mt-1 w-full bg-white/[0.03] border border-white/[0.08] rounded-md px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/40"
                  >
                    {["5m", "15m", "1h", "24h", "7d"].map((w) => (
                      <option key={w} value={w} className="bg-slate-900">{w}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    AI Confidence Floor
                  </span>
                  <span className="text-xs font-mono text-cyan-300">{draft.confidence}%</span>
                </div>
                <input
                  type="range" min={50} max={99} value={draft.confidence}
                  onChange={(e) => setDraft({ ...draft, confidence: +e.target.value })}
                  className="mt-1 w-full accent-cyan-400"
                />
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Severity</span>
                <div className="mt-1 grid grid-cols-3 gap-1.5">
                  {(["info", "warning", "critical"] as RuleSeverity[]).map((s) => (
                    <button
                      key={s}
                      onClick={() => setDraft({ ...draft, severity: s })}
                      className={cn(
                        "px-2 py-1.5 rounded-md border text-[10px] font-mono uppercase tracking-wider transition",
                        draft.severity === s ? sevStyle[s] : "border-white/[0.06] text-slate-500 hover:text-slate-300",
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Channels</span>
                <div className="mt-1 grid grid-cols-4 gap-1.5">
                  {(Object.keys(channelIcon) as Channel[]).map((c) => {
                    const Icon = channelIcon[c];
                    const on = draft.channels.includes(c);
                    return (
                      <button
                        key={c}
                        onClick={() => toggleChannel(c)}
                        className={cn(
                          "flex flex-col items-center gap-1 px-2 py-2 rounded-md border transition",
                          on
                            ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
                            : "border-white/[0.06] text-slate-500 hover:text-slate-300",
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        <span className="text-[9px] uppercase tracking-wider font-mono">{c}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">
                    Escalation Path
                  </span>
                  <button
                    onClick={addEscalation}
                    className="text-[10px] font-mono text-cyan-300 hover:text-cyan-200 flex items-center gap-1"
                  >
                    <Plus className="h-3 w-3" /> Add level
                  </button>
                </div>
                <div className="mt-1.5 space-y-1.5">
                  {draft.escalation.map((e, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300">
                        L{e.level}
                      </span>
                      <span className="text-slate-500">after</span>
                      <input
                        value={e.after}
                        onChange={(ev) => {
                          const arr = [...draft.escalation];
                          arr[i] = { ...e, after: ev.target.value };
                          setDraft({ ...draft, escalation: arr });
                        }}
                        className="w-12 bg-white/[0.03] border border-white/[0.08] rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500/40"
                      />
                      <span className="text-slate-500">→</span>
                      <input
                        value={e.to}
                        onChange={(ev) => {
                          const arr = [...draft.escalation];
                          arr[i] = { ...e, to: ev.target.value };
                          setDraft({ ...draft, escalation: arr });
                        }}
                        className="flex-1 bg-white/[0.03] border border-white/[0.08] rounded px-1.5 py-0.5 text-slate-100 focus:outline-none focus:border-cyan-500/40"
                      />
                      <button
                        onClick={() => setDraft({ ...draft, escalation: draft.escalation.filter((_, j) => j !== i) })}
                        className="text-slate-500 hover:text-rose-300"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={saveDraft}
                  className="flex-1 py-2 rounded-md bg-gradient-to-r from-cyan-500/20 to-violet-500/20 border border-cyan-500/40 text-xs font-medium text-cyan-100 hover:from-cyan-500/30 hover:to-violet-500/30 transition"
                >
                  Deploy Rule
                </button>
                <button
                  onClick={() => setCreating(false)}
                  className="px-3 py-2 rounded-md border border-white/[0.06] text-xs text-slate-400 hover:text-slate-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : selected ? (
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-semibold text-slate-100">{selected.name}</div>
                  <div className="mt-0.5 text-[10px] font-mono text-slate-500">
                    {metricLabels[selected.metric]} · trigger when {selected.condition} {selected.threshold}
                    {selected.condition === "±%" ? "%" : ""} over {selected.window}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleRule(selected.id)}
                    className={cn(
                      "p-1.5 rounded-md border transition",
                      selected.enabled
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                        : "border-white/[0.06] text-slate-500 hover:text-slate-300",
                    )}
                    title={selected.enabled ? "Disable" : "Enable"}
                  >
                    <Power className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => deleteRule(selected.id)}
                    className="p-1.5 rounded-md border border-white/[0.06] text-slate-500 hover:text-rose-300 hover:border-rose-500/30"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Confidence</div>
                  <div className="mt-1 font-mono text-lg text-cyan-300">{selected.confidence}%</div>
                  <div className="mt-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-400"
                      style={{ width: `${selected.confidence}%` }}
                    />
                  </div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Severity</div>
                  <div className={cn("mt-1 inline-block px-2 py-0.5 rounded border text-xs font-mono uppercase", sevStyle[selected.severity])}>
                    {selected.severity}
                  </div>
                </div>
                <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-mono">Fires 24h</div>
                  <div className="mt-1 font-mono text-lg text-rose-300">{selected.fires24h}</div>
                  <div className="text-[9px] font-mono text-slate-500">last {selected.lastFired}</div>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                  Notification Channels
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selected.channels.map((c) => {
                    const Icon = channelIcon[c];
                    return (
                      <span
                        key={c}
                        className="flex items-center gap-1 px-2 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-[10px] font-mono uppercase tracking-wider"
                      >
                        <Icon className="h-3 w-3" /> {c}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-mono mb-1.5">
                  Escalation Path
                </div>
                <div className="relative pl-4">
                  <div className="absolute left-1 top-1 bottom-1 w-px bg-gradient-to-b from-rose-500/60 via-amber-500/40 to-transparent" />
                  {selected.escalation.map((e) => (
                    <div key={e.level} className="relative pb-2 last:pb-0">
                      <div className="absolute -left-3 top-1 h-2 w-2 rounded-full bg-rose-400 shadow-[0_0_6px_rgba(251,113,133,0.8)]" />
                      <div className="flex items-center gap-2 text-[11px] font-mono">
                        <span className="px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[9px] uppercase">
                          Level {e.level}
                        </span>
                        <span className="text-slate-500">+{e.after}</span>
                        <ChevronRight className="h-3 w-3 text-slate-600" />
                        <span className="text-slate-200">{e.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-violet-500/20 bg-violet-500/[0.04] p-2.5">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-violet-300 font-mono mb-1">
                  <Bot className="h-3 w-3" /> AI Recommendation
                </div>
                <div className="text-[11px] text-slate-300 leading-relaxed">
                  Based on the last 30 days, lowering the threshold to{" "}
                  <span className="text-cyan-300 font-mono">
                    {Math.max(1, Math.round(selected.threshold * 0.85))}
                    {selected.condition === "±%" ? "%" : ""}
                  </span>{" "}
                  could catch anomalies <span className="text-emerald-300">~22% earlier</span> with{" "}
                  <span className="text-amber-300">+4% false positive risk</span>.
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-xs text-slate-500">
              No rules configured.
            </div>
          )}
        </div>
      </div>
    </GlassPanel>
  );
}

export default function RevenuePage() {
  const tick = useTick(2200);

  const forecast = useMemo(() => {
    const base = generateTimeSeries(36, 80000, 145000);
    return base.map((d, i) => ({
      ...d,
      actual: i < 26 ? d.value : null,
      forecast: i >= 24 ? Math.round(d.value * (1 + (i - 24) * 0.018)) : null,
      band: i >= 24 ? Math.round(d.value * 0.12) : 0,
    }));
  }, [tick]);

  const cohort = useMemo(
    () => Array.from({ length: 12 }, (_, i) => ({
      m: `M${i}`,
      retention: Math.max(38, Math.round(100 - i * 5.4 - Math.random() * 4)),
    })),
    [tick],
  );

  const radar = [
    { axis: "Profit",   v: 88 }, { axis: "Burn",    v: 42 },
    { axis: "ARR",      v: 92 }, { axis: "Churn",   v: 28 },
    { axis: "CAC",      v: 55 }, { axis: "LTV",     v: 81 },
  ];

  const funnel = [
    { stage: "Visits",   v: 184000, c: "#22d3ee" },
    { stage: "Trials",   v:  42000, c: "#38bdf8" },
    { stage: "Activated",v:  18400, c: "#818cf8" },
    { stage: "Paid",     v:   8200, c: "#a78bfa" },
    { stage: "Ent.",     v:   1240, c: "#f472b6" },
  ];

  const device = [
    { name: "Desktop", v: 58 }, { name: "Mobile", v: 31 }, { name: "Tablet", v: 8 }, { name: "API", v: 3 },
  ];
  const deviceColors = ["#22d3ee", "#a78bfa", "#34d399", "#f59e0b"];

  const txStream = useMemo(() => generateTimeSeries(48, 200, 1400), [tick]);

  const kpis: Kpi[] = [
    { label: "Total Revenue",        value: 4_812_440 + (tick % 50) * 130, prefix: "$", delta:  8.4, icon: DollarSign, tone: "emerald", ai: "Tracking +18% MoM · forecast green" },
    { label: "Revenue / Minute",     value: 3_241 + (tick % 30) * 12, prefix: "$",     delta:  4.2, icon: Zap,        tone: "cyan",    ai: "Stable burst pattern detected" },
    { label: "ARR",                  value: 58_240_000, prefix: "$",                   delta: 12.1, icon: Rocket,     tone: "violet",  ai: "Crossing $60M threshold in 14d" },
    { label: "MRR",                  value: 4_853_400, prefix: "$",                    delta:  6.7, icon: TrendingUp, tone: "emerald", ai: "Net expansion +3.2% w/w" },
    { label: "Net Profit",           value: 1_842_900, prefix: "$",                    delta:  9.2, icon: Target,     tone: "cyan",    ai: "Margin expanding to 38.2%" },
    { label: "Burn Rate",            value: 982_400, prefix: "$",                      delta: -2.1, icon: Flame,      tone: "amber",   ai: "Below plan · 14m runway" },
    { label: "Active Subscriptions", value: 48_392 + (tick % 9),                       delta:  3.4, icon: Users,      tone: "cyan",    ai: "Conversion +0.8% vs LW" },
    { label: "Enterprise Clients",   value: 1_284,                                     delta:  5.1, icon: Layers,     tone: "violet",  ai: "12 in legal pipeline" },
    { label: "Churn Rate",           value: 2.14, suffix: "%", decimals: 2,            delta: -0.4, icon: TrendingDown, tone: "rose",  ai: "Best quarter on record" },
    { label: "Expansion Revenue",    value: 412_800, prefix: "$",                      delta: 14.8, icon: Sparkles,   tone: "emerald", ai: "Upsell engine outperforming" },
  ];

  return (
    <div className="relative -m-6 p-4 sm:p-6 space-y-4 min-h-[calc(100vh-3rem)] bg-[radial-gradient(ellipse_at_top,rgba(56,189,248,0.08),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgba(139,92,246,0.07),transparent_55%),#040712] text-slate-200 overflow-hidden">
      {/* grid overlay */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{
        backgroundImage: "linear-gradient(rgba(255,255,255,.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.7) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />

      <div className="relative z-10 space-y-4">
        {/* header */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.32em] text-cyan-300/80">
              <span className="h-px w-6 bg-cyan-400/60" />
              Command Center · Revenue Ops
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-white tracking-tight">
              Revenue <span className="bg-gradient-to-r from-cyan-300 via-sky-300 to-violet-300 bg-clip-text text-transparent">Intelligence Grid</span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">Realtime AI-driven operational telemetry · all systems nominal</p>
          </div>
          <CommandBar />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {kpis.map((k) => <KpiCell key={k.label} k={k} />)}
        </div>

        {/* Forecast + Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <GlassPanel glow="cyan" className="xl:col-span-2">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Revenue Forecast · 36-day window</span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-slate-400">
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 bg-cyan-400 rounded" /> Actual</span>
                <span className="flex items-center gap-1"><span className="h-1.5 w-3 bg-violet-400 rounded" /> AI Forecast</span>
              </div>
            </div>
            <div className="p-3">
              <ResponsiveContainer width="100%" height={280}>
                <ComposedChart data={forecast}>
                  <defs>
                    <linearGradient id="rev-actual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="rev-forecast" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tt} />
                  <Area type="monotone" dataKey="actual"   stroke="#22d3ee" strokeWidth={2} fill="url(#rev-actual)"   dot={false} />
                  <Area type="monotone" dataKey="forecast" stroke="#a78bfa" strokeWidth={2} strokeDasharray="4 3" fill="url(#rev-forecast)" dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>

          <LiveFeed />
        </div>

        {/* AI + radar + cohort */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <AiPanel />
          <GlassPanel glow="emerald">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <RadarIcon className="h-3.5 w-3.5 text-emerald-300" />
                <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Profit vs Burn Radar</span>
              </div>
              <span className="text-[10px] text-emerald-300 font-mono">healthy</span>
            </div>
            <div className="p-2">
              <ResponsiveContainer width="100%" height={260}>
                <RadarChart data={radar}>
                  <PolarGrid stroke="rgba(148,163,184,0.15)" />
                  <PolarAngleAxis dataKey="axis" tick={{ fontSize: 10, fill: "#94a3b8" }} />
                  <Radar dataKey="v" stroke="#34d399" fill="#34d399" fillOpacity={0.25} strokeWidth={2} />
                  <Tooltip {...tt} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
          <GlassPanel glow="violet">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-violet-300" />
                <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Cohort Retention</span>
              </div>
              <span className="text-[10px] text-violet-300 font-mono">M0 → M11</span>
            </div>
            <div className="p-3">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={cohort}>
                  <defs>
                    <linearGradient id="cohort-grad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.95} />
                      <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.4} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(148,163,184,0.08)" strokeDasharray="3 3" />
                  <XAxis dataKey="m" tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#64748b" }} axisLine={false} tickLine={false} />
                  <Tooltip {...tt} />
                  <Bar dataKey="retention" fill="url(#cohort-grad)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassPanel>
        </div>

        {/* Geo + funnel + device */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <GeoIntel />
          <GlassPanel glow="cyan">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Target className="h-3.5 w-3.5 text-cyan-300" />
                <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Enterprise Conversion Funnel</span>
              </div>
            </div>
            <div className="p-3 space-y-2">
              {funnel.map((f, i) => {
                const max = funnel[0].v;
                const pct = (f.v / max) * 100;
                return (
                  <div key={f.stage}>
                    <div className="flex items-center justify-between text-[11px] mb-1">
                      <span className="text-slate-300">{f.stage}</span>
                      <span className="font-mono text-slate-400">{f.v.toLocaleString()}</span>
                    </div>
                    <div className="h-2.5 rounded-md bg-white/[0.04] overflow-hidden relative">
                      <div className="h-full rounded-md transition-all" style={{
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${f.c}, ${funnel[Math.min(i+1, funnel.length-1)].c})`,
                        boxShadow: `0 0 14px ${f.c}40`,
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassPanel>

          <GlassPanel glow="violet">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-violet-300" />
                <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Device Revenue Split</span>
              </div>
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
              {device.map((d, i) => (
                <div key={d.name} className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400">{d.name}</span>
                    <span className="h-2 w-2 rounded-full" style={{ background: deviceColors[i], boxShadow: `0 0 8px ${deviceColors[i]}` }} />
                  </div>
                  <div className="mt-1 font-mono text-lg text-white">{d.v}%</div>
                  <div className="mt-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${d.v}%`, background: deviceColors[i] }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassPanel>
        </div>

        {/* Tx stream */}
        <GlassPanel glow="emerald">
          <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-emerald-300" />
              <span className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Realtime Transactions Stream</span>
            </div>
            <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> streaming
            </span>
          </div>
          <div className="p-3">
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={txStream}>
                <defs>
                  <linearGradient id="tx-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#34d399" stopOpacity={1} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.3} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" tick={{ fontSize: 9, fill: "#64748b" }} axisLine={false} tickLine={false} interval={5} />
                <Tooltip {...tt} />
                <Bar dataKey="value" fill="url(#tx-grad)" radius={[2, 2, 0, 0]}>
                  {txStream.map((_, i) => (
                    <Cell key={i} fill={i === txStream.length - 1 ? "#f472b6" : "url(#tx-grad)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}
