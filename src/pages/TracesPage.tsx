import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, AlertTriangle, Brain, ChevronRight, Command, Cpu, Database, Download,
  Filter, Gauge, Globe, HardDrive, Layers, Network, Pause, Pin, Play, Radar,
  Search, Server, Signal, Sparkles, TrendingUp, X, Zap, Bell, Radio, Hexagon,
  CircuitBoard, Workflow, ShieldAlert, Boxes, Waves,
} from "lucide-react";
import {
  Area, AreaChart, Bar, BarChart, Line, LineChart, ResponsiveContainer,
  Tooltip as RTooltip, XAxis, YAxis, CartesianGrid,
} from "recharts";

/* ============================================================ */
/*  HOOKS                                                       */
/* ============================================================ */

function useTick(ms = 1500) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setT((v) => v + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
  return t;
}

function useCounter(target: number, duration = 900) {
  const [val, setVal] = useState(target);
  const prev = useRef(target);
  useEffect(() => {
    const start = performance.now();
    const from = prev.current;
    let raf = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(from + (target - from) * eased);
      if (k < 1) raf = requestAnimationFrame(step);
      else prev.current = target;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

/* ============================================================ */
/*  MOCK GENERATORS                                             */
/* ============================================================ */

const SERVICES = [
  "api-gateway", "auth-svc", "payments", "checkout", "billing",
  "search-idx", "media-cdn", "ml-router", "graphql", "notifier",
];
const OPS = [
  "GET /v2/catalog", "POST /auth/login", "POST /pay/intent",
  "GET /user/me", "POST /order/create", "GET /search?q=*",
  "POST /upload", "GET /feed", "POST /ml/embed", "DELETE /session",
];
const REGIONS = ["us-east-1", "eu-west-1", "ap-south-1", "sa-east-1", "us-west-2"];
const COUNTRIES = ["🇺🇸 US", "🇩🇪 DE", "🇮🇳 IN", "🇯🇵 JP", "🇧🇷 BR", "🇬🇧 GB", "🇫🇷 FR"];
const DEVICES = ["macOS·Chrome", "iOS·Safari", "Android·Chrome", "Win·Edge", "Linux·Firefox"];
const STATUSES = [200, 200, 200, 200, 200, 201, 204, 304, 400, 401, 403, 404, 429, 500, 502, 503];

type Trace = {
  id: string; reqId: string; service: string; op: string; endpoint: string;
  user: string; device: string; country: string; region: string;
  status: number; duration: number; mem: number; queries: number;
  queue: number; errors: number; ts: number; pinned?: boolean;
};

const rand = (a: number, b: number) => Math.floor(a + Math.random() * (b - a));
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const hex = (n: number) => Math.random().toString(16).slice(2, 2 + n);

function makeTrace(): Trace {
  const status = pick(STATUSES);
  return {
    id: hex(10),
    reqId: `req_${hex(8)}`,
    service: pick(SERVICES),
    op: pick(OPS),
    endpoint: `/api${pick(OPS).split(" ")[1] ?? "/v1"}`,
    user: `u_${hex(6)}`,
    device: pick(DEVICES),
    country: pick(COUNTRIES),
    region: pick(REGIONS),
    status,
    duration: rand(8, status >= 500 ? 4200 : 1200),
    mem: rand(8, 512),
    queries: rand(0, 24),
    queue: rand(0, 9),
    errors: status >= 400 ? rand(1, 4) : 0,
    ts: Date.now() - rand(0, 60_000),
  };
}

/* ============================================================ */
/*  PRESENTATIONAL PRIMITIVES                                   */
/* ============================================================ */

function Glow({ color = "cyan" }: { color?: "cyan" | "violet" | "emerald" | "rose" | "amber" }) {
  const map: Record<string, string> = {
    cyan: "from-cyan-500/20", violet: "from-violet-500/20",
    emerald: "from-emerald-500/20", rose: "from-rose-500/20", amber: "from-amber-500/20",
  };
  return (
    <div className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-to-br ${map[color]} via-transparent to-transparent opacity-60`} />
  );
}

function Panel({ children, className = "", glow }: { children: React.ReactNode; className?: string; glow?: "cyan" | "violet" | "emerald" | "rose" | "amber" }) {
  return (
    <div className={`relative overflow-hidden rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-xl shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_30px_80px_-40px_rgba(0,200,255,0.25)] ${className}`}>
      {glow && <Glow color={glow} />}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

function PulseDot({ color = "bg-emerald-400" }: { color?: string }) {
  return (
    <span className="relative inline-flex h-2 w-2">
      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-60`} />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

function MiniSpark({ data, stroke = "#22d3ee" }: { data: number[]; stroke?: string }) {
  const d = data.map((v, i) => ({ i, v }));
  return (
    <div className="h-10 w-full">
      <ResponsiveContainer>
        <AreaChart data={d}>
          <defs>
            <linearGradient id={`g-${stroke}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.5} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={stroke} strokeWidth={1.5} fill={`url(#g-${stroke})`} isAnimationActive={false} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ============================================================ */
/*  COMMAND BAR                                                 */
/* ============================================================ */

function CommandBar() {
  const tick = useTick(2000);
  const rps = useCounter(12_400 + (tick % 7) * 220);
  return (
    <Panel className="px-4 py-3" glow="cyan">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Hexagon className="h-4 w-4 text-cyan-400" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-300/80">Trace · APM Command</span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 rounded-md border border-white/10 bg-black/30 px-2 py-1">
          <Search className="h-3.5 w-3.5 text-white/50" />
          <input
            placeholder="Search traces, request_id, user, endpoint…"
            className="w-72 bg-transparent text-xs text-white/90 placeholder:text-white/30 outline-none"
          />
          <kbd className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] text-white/50">⌘K</kbd>
        </div>
        <button className="hidden md:flex items-center gap-1.5 rounded-md border border-violet-400/30 bg-violet-500/10 px-2 py-1 text-[11px] text-violet-200 hover:bg-violet-500/20 transition">
          <Sparkles className="h-3.5 w-3.5" /> AI Command
        </button>
        <div className="ml-auto flex items-center gap-3 text-[11px] text-white/70">
          <div className="flex items-center gap-1.5"><PulseDot color="bg-emerald-400" /> WS Sync</div>
          <div className="flex items-center gap-1.5"><Radio className="h-3 w-3 text-cyan-400" /> {Math.round(rps).toLocaleString()} req/s</div>
          <select className="rounded-md border border-white/10 bg-black/40 px-1.5 py-1 text-[11px] outline-none">
            <option>prod</option><option>staging</option><option>dev</option>
          </select>
          <select className="rounded-md border border-white/10 bg-black/40 px-1.5 py-1 text-[11px] outline-none">
            {REGIONS.map((r) => <option key={r}>{r}</option>)}
          </select>
          <select className="rounded-md border border-white/10 bg-black/40 px-1.5 py-1 text-[11px] outline-none">
            <option>Last 15m</option><option>1h</option><option>24h</option><option>7d</option>
          </select>
          <button className="relative rounded-md border border-white/10 bg-black/40 p-1.5 hover:bg-white/5">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
          </button>
        </div>
      </div>
    </Panel>
  );
}

/* ============================================================ */
/*  KPI GRID                                                    */
/* ============================================================ */

type Kpi = {
  label: string; value: number; suffix?: string; prefix?: string;
  delta: number; color: "cyan" | "violet" | "emerald" | "rose" | "amber";
  icon: React.ComponentType<{ className?: string; color?: string }>; spark: number[];
};

const SPARK = (n = 24) => Array.from({ length: n }, () => rand(20, 95));

function KpiCell({ k }: { k: Kpi }) {
  const v = useCounter(k.value);
  const colorMap = {
    cyan: "#22d3ee", violet: "#a78bfa", emerald: "#34d399", rose: "#fb7185", amber: "#fbbf24",
  };
  return (
    <Panel className="p-3" glow={k.color}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <k.icon className="h-3.5 w-3.5" color={colorMap[k.color]} />
          <span className="text-[10px] uppercase tracking-[0.18em] text-white/50">{k.label}</span>
        </div>
        <span className={`text-[10px] font-medium ${k.delta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
          {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta)}%
        </span>
      </div>
      <div className="mt-1 font-mono text-xl font-semibold text-white tabular-nums">
        {k.prefix}{Math.round(v).toLocaleString()}{k.suffix}
      </div>
      <MiniSpark data={k.spark} stroke={colorMap[k.color]} />
    </Panel>
  );
}

function KpiGrid() {
  const tick = useTick(2500);
  const kpis: Kpi[] = useMemo(() => [
    { label: "Requests/s",   value: 12_400 + (tick % 5) * 180, suffix: "",   delta: 4.2, color: "cyan",    icon: Activity, spark: SPARK() },
    { label: "Avg Latency",  value: 142 + (tick % 9),         suffix: "ms", delta: -3.1, color: "emerald", icon: Gauge,    spark: SPARK() },
    { label: "p95",          value: 489 + (tick % 7) * 3,     suffix: "ms", delta: 2.4,  color: "amber",   icon: TrendingUp,spark: SPARK() },
    { label: "p99",          value: 1240 + (tick % 11) * 6,   suffix: "ms", delta: 7.8,  color: "rose",    icon: Zap,      spark: SPARK() },
    { label: "Error %",      value: 0,                        suffix: "%",  delta: -0.4, color: "rose",    icon: AlertTriangle, spark: SPARK() },
    { label: "Sessions",     value: 38_200,                   suffix: "",   delta: 1.1,  color: "violet",  icon: Signal,   spark: SPARK() },
    { label: "Queue Load",   value: 64,                       suffix: "%",  delta: 5.7,  color: "amber",   icon: Layers,   spark: SPARK() },
    { label: "DB Latency",   value: 18,                       suffix: "ms", delta: -2.0, color: "emerald", icon: Database, spark: SPARK() },
    { label: "Throughput",   value: 942,                      suffix: "MB/s",delta: 3.2,  color: "cyan",    icon: Network,  spark: SPARK() },
    { label: "CPU",          value: 47,                       suffix: "%",  delta: 1.4,  color: "violet",  icon: Cpu,      spark: SPARK() },
    { label: "Memory",       value: 71,                       suffix: "%",  delta: 0.8,  color: "amber",   icon: Boxes,    spark: SPARK() },
    { label: "Disk I/O",     value: 312,                      suffix: "MB/s",delta: -1.2, color: "emerald", icon: HardDrive,spark: SPARK() },
    { label: "CDN Traffic",  value: 4_120,                    suffix: "Gbps",delta: 6.0,  color: "cyan",    icon: Globe,    spark: SPARK() },
    { label: "Cache Hit",    value: 96,                       suffix: "%",  delta: 0.3,  color: "emerald", icon: CircuitBoard, spark: SPARK() },
    { label: "Live Users",   value: 18_420,                   suffix: "",   delta: 9.4,  color: "violet",  icon: Waves,    spark: SPARK() },
  ], [tick]);
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
      {kpis.map((k) => <KpiCell key={k.label} k={k} />)}
    </div>
  );
}

/* ============================================================ */
/*  CHARTS ROW                                                  */
/* ============================================================ */

function chartTooltipStyle(): React.ComponentProps<typeof RTooltip>["contentStyle"] {
  return {
    background: "rgba(8,12,22,0.92)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 8, fontSize: 11, color: "#e5f3ff",
  };
}

function LatencyChart() {
  const data = useMemo(() => Array.from({ length: 60 }, (_, i) => ({
    t: i, p50: 80 + Math.sin(i / 5) * 18 + rand(0, 6),
    p95: 320 + Math.sin(i / 4) * 70 + rand(0, 22),
    p99: 780 + Math.cos(i / 6) * 180 + rand(0, 60),
  })), []);
  return (
    <Panel className="p-3" glow="cyan">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white/90">Latency · p50 / p95 / p99</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-white/50">
          <PulseDot /> live
        </div>
      </div>
      <div className="mt-2 h-44">
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
            <RTooltip contentStyle={chartTooltipStyle()} />
            <Line dataKey="p50" stroke="#34d399" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Line dataKey="p95" stroke="#fbbf24" strokeWidth={1.5} dot={false} isAnimationActive={false} />
            <Line dataKey="p99" stroke="#fb7185" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function ThroughputChart() {
  const data = useMemo(() => Array.from({ length: 40 }, (_, i) => ({
    t: i, ok: rand(180, 420), err: rand(0, 40),
  })), []);
  return (
    <Panel className="p-3" glow="violet">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/90">Throughput / Errors</span>
        </div>
        <span className="text-[10px] text-white/50">last 40 min</span>
      </div>
      <div className="mt-2 h-44">
        <ResponsiveContainer>
          <BarChart data={data} barSize={5}>
            <CartesianGrid stroke="rgba(255,255,255,0.04)" strokeDasharray="3 3" />
            <XAxis dataKey="t" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
            <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} stroke="rgba(255,255,255,0.1)" />
            <RTooltip contentStyle={chartTooltipStyle()} />
            <Bar dataKey="ok" stackId="a" fill="#22d3ee" />
            <Bar dataKey="err" stackId="a" fill="#fb7185" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Panel>
  );
}

function Heatmap() {
  const cells = Array.from({ length: 7 * 24 }, () => Math.random());
  return (
    <Panel className="p-3" glow="emerald">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radar className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white/90">Request Heatmap · 7d × 24h</span>
        </div>
        <span className="text-[10px] text-white/50">UTC</span>
      </div>
      <div className="mt-3 grid grid-cols-24 gap-[2px]" style={{ gridTemplateColumns: "repeat(24,minmax(0,1fr))" }}>
        {cells.map((v, i) => (
          <div key={i} className="aspect-square rounded-[2px]"
               style={{ background: `hsl(${180 - v * 80}, 90%, ${15 + v * 35}%)`, opacity: 0.5 + v * 0.5 }} />
        ))}
      </div>
      <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
        <span>low</span>
        <div className="h-1 w-32 rounded-full bg-gradient-to-r from-emerald-900 via-cyan-500 to-rose-500" />
        <span>high</span>
      </div>
    </Panel>
  );
}

/* ============================================================ */
/*  INFRA MAP                                                   */
/* ============================================================ */

function InfraMap() {
  const nodes = [
    { id: "gw",  x: 50,  y: 60, label: "Gateway",  c: "#22d3ee" },
    { id: "au",  x: 160, y: 30, label: "Auth",     c: "#a78bfa" },
    { id: "or",  x: 160, y: 100,label: "Orders",   c: "#a78bfa" },
    { id: "pm",  x: 280, y: 40, label: "Payments", c: "#fbbf24" },
    { id: "db",  x: 400, y: 30, label: "Postgres", c: "#34d399" },
    { id: "rd",  x: 400, y: 100,label: "Redis",    c: "#fb7185" },
    { id: "kf",  x: 280, y: 130,label: "Kafka",    c: "#22d3ee" },
    { id: "cdn", x: 50,  y: 130,label: "CDN",      c: "#34d399" },
  ];
  const links = [
    ["gw","au"],["gw","or"],["au","pm"],["or","pm"],["pm","db"],
    ["or","kf"],["kf","rd"],["gw","cdn"],["pm","rd"],
  ];
  const map = Object.fromEntries(nodes.map(n => [n.id, n]));
  return (
    <Panel className="p-3" glow="cyan">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Workflow className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white/90">Live Infra Map · Service Mesh</span>
        </div>
        <span className="text-[10px] text-emerald-400 flex items-center gap-1"><PulseDot /> 9 services healthy</span>
      </div>
      <div className="mt-2">
        <svg viewBox="0 0 460 170" className="w-full h-44">
          <defs>
            <radialGradient id="nodeg">
              <stop offset="0%" stopColor="rgba(255,255,255,0.25)" />
              <stop offset="100%" stopColor="rgba(0,0,0,0)" />
            </radialGradient>
          </defs>
          {links.map(([a,b], i) => {
            const A = map[a], B = map[b];
            return (
              <g key={i}>
                <line x1={A.x} y1={A.y} x2={B.x} y2={B.y} stroke="rgba(255,255,255,0.12)" strokeWidth={1} />
                <circle r="2" fill="#22d3ee">
                  <animateMotion dur={`${2 + (i % 3)}s`} repeatCount="indefinite"
                    path={`M ${A.x} ${A.y} L ${B.x} ${B.y}`} />
                </circle>
              </g>
            );
          })}
          {nodes.map((n) => (
            <g key={n.id} transform={`translate(${n.x},${n.y})`}>
              <circle r="22" fill="url(#nodeg)" />
              <circle r="10" fill={n.c} opacity="0.2" />
              <circle r="6" fill={n.c} />
              <text y="26" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.7)" fontFamily="ui-monospace">
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </Panel>
  );
}

/* ============================================================ */
/*  AI INTEL PANEL                                              */
/* ============================================================ */

function AiIntel() {
  const insights = [
    { sev: "critical", title: "Latency anomaly on payments-svc", desc: "p99 spiked +312% vs 1h baseline. Likely Stripe upstream.", conf: 92, icon: AlertTriangle, c: "rose" },
    { sev: "warning",  title: "Predicted queue saturation in 18m", desc: "Kafka lag rising at 12k msg/min — autoscale recommended.", conf: 81, icon: Brain, c: "amber" },
    { sev: "info",     title: "Traffic forecast: +28% next hour", desc: "Campaign push detected from us-east-1 edge nodes.", conf: 76, icon: TrendingUp, c: "cyan" },
    { sev: "info",     title: "AI Root-cause for trace 9f2ac", desc: "DB connection pool exhausted → Redis fallback timeout.", conf: 88, icon: Sparkles, c: "violet" },
  ];
  const colorMap: Record<string, string> = { rose: "border-rose-500/30 bg-rose-500/5", amber: "border-amber-500/30 bg-amber-500/5", cyan: "border-cyan-500/30 bg-cyan-500/5", violet: "border-violet-500/30 bg-violet-500/5" };
  return (
    <Panel className="p-3" glow="violet">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="h-4 w-4 text-violet-400" />
          <span className="text-xs font-semibold text-white/90">AI Intelligence Layer</span>
        </div>
        <button className="text-[10px] text-violet-300 hover:text-violet-200">configure ›</button>
      </div>
      <div className="mt-2 space-y-1.5">
        {insights.map((i, idx) => (
          <div key={idx} className={`rounded-lg border px-2.5 py-2 ${colorMap[i.c]}`}>
            <div className="flex items-start gap-2">
              <i.icon className={`h-3.5 w-3.5 mt-0.5 text-${i.c}-400`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold text-white truncate">{i.title}</span>
                  <span className="text-[10px] font-mono text-white/60">conf {i.conf}%</span>
                </div>
                <p className="text-[10px] text-white/55 mt-0.5 line-clamp-2">{i.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================ */
/*  TRACE TABLE + DRAWER                                        */
/* ============================================================ */

function StatusPill({ s }: { s: number }) {
  const cls =
    s < 300 ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300" :
    s < 400 ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-300" :
    s < 500 ? "border-amber-500/30 bg-amber-500/10 text-amber-300" :
              "border-rose-500/30 bg-rose-500/10 text-rose-300";
  return <span className={`inline-flex items-center rounded-md border px-1.5 py-0.5 font-mono text-[10px] ${cls}`}>{s}</span>;
}

function DurationBar({ ms }: { ms: number }) {
  const w = Math.min(100, (ms / 2000) * 100);
  const c = ms < 200 ? "bg-emerald-400" : ms < 600 ? "bg-cyan-400" : ms < 1500 ? "bg-amber-400" : "bg-rose-400";
  return (
    <div className="flex items-center gap-2">
      <div className="h-1 w-16 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full ${c}`} style={{ width: `${w}%` }} />
      </div>
      <span className="font-mono text-[11px] text-white/80 tabular-nums w-12 text-right">{ms}ms</span>
    </div>
  );
}

function TraceDrawer({ trace, onClose }: { trace: Trace; onClose: () => void }) {
  const spans = useMemo(() => [
    { svc: "api-gateway", op: "GET /v2/orders", start: 0, dur: 12, c: "#22d3ee" },
    { svc: "auth-svc",    op: "verifyJWT",      start: 12, dur: 6,  c: "#a78bfa" },
    { svc: "orders-svc",  op: "load order",     start: 22, dur: 48, c: "#34d399" },
    { svc: "postgres",    op: "SELECT orders",  start: 30, dur: 22, c: "#fbbf24" },
    { svc: "redis",       op: "GET cache",      start: 70, dur: 4,  c: "#fb7185" },
    { svc: "payments",    op: "POST stripe",    start: 80, dur: 140,c: "#a78bfa" },
    { svc: "kafka",       op: "publish event",  start: 222, dur: 8, c: "#22d3ee" },
  ], []);
  const total = 240;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="w-full max-w-3xl h-full overflow-y-auto border-l border-white/10 bg-gradient-to-b from-[#070b14] to-[#04070d] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur">
          <div className="flex items-center gap-2 min-w-0">
            <span className="rounded-md border border-cyan-400/30 bg-cyan-500/10 px-1.5 py-0.5 font-mono text-[10px] text-cyan-300">TRACE</span>
            <span className="font-mono text-xs text-white/90 truncate">{trace.id}</span>
            <StatusPill s={trace.status} />
            <span className="text-[10px] text-white/40">· {trace.service} · {trace.op}</span>
          </div>
          <button onClick={onClose} className="rounded-md border border-white/10 p-1 hover:bg-white/5">
            <X className="h-4 w-4 text-white/70" />
          </button>
        </div>

        <div className="p-4 space-y-3">
          {/* Summary */}
          <Panel className="p-3" glow="violet">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="h-3.5 w-3.5 text-violet-400" />
              <span className="text-[11px] font-semibold text-white">AI Root-Cause</span>
            </div>
            <p className="text-[11px] text-white/70 leading-relaxed">
              Slowdown originated in <b className="text-violet-300">payments-svc</b> upstream call (140ms).
              DB query on <b className="text-amber-300">orders</b> table acceptable. Recommend retry-budget bump
              and circuit breaker tuning. Suggested fix: enable <code className="text-cyan-300">stripe.idempotency_v2</code>.
            </p>
          </Panel>

          {/* Waterfall */}
          <Panel className="p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-white/80">Request Waterfall · {total}ms</span>
              <span className="text-[10px] text-white/40">{spans.length} spans</span>
            </div>
            <div className="space-y-1.5">
              {spans.map((s, i) => (
                <div key={i} className="grid grid-cols-[120px_1fr_60px] items-center gap-2">
                  <div className="text-[10px] text-white/60 truncate">{s.svc}</div>
                  <div className="relative h-4 rounded bg-white/[0.03] overflow-hidden">
                    <div className="absolute top-0 h-full rounded" style={{
                      left: `${(s.start / total) * 100}%`,
                      width: `${(s.dur / total) * 100}%`,
                      background: `linear-gradient(90deg, ${s.c}cc, ${s.c}66)`,
                      boxShadow: `0 0 12px ${s.c}66`,
                    }} />
                    <span className="relative z-10 px-2 text-[10px] text-white/80 leading-4">{s.op}</span>
                  </div>
                  <div className="text-right font-mono text-[10px] text-white/70">{s.dur}ms</div>
                </div>
              ))}
            </div>
          </Panel>

          {/* Meta grid */}
          <div className="grid grid-cols-2 gap-2">
            {[
              ["Request ID", trace.reqId],
              ["User", trace.user],
              ["Device", trace.device],
              ["Country", trace.country],
              ["Region", trace.region],
              ["Endpoint", trace.endpoint],
              ["Memory", `${trace.mem} MB`],
              ["DB Queries", String(trace.queries)],
              ["Queue events", String(trace.queue)],
              ["Errors", String(trace.errors)],
            ].map(([k, v]) => (
              <Panel key={k} className="px-3 py-2">
                <div className="text-[10px] uppercase tracking-wider text-white/40">{k}</div>
                <div className="font-mono text-[11px] text-white/90 truncate">{v}</div>
              </Panel>
            ))}
          </div>

          {/* Headers/Payload */}
          <Panel className="p-3">
            <div className="text-[11px] font-semibold text-white/80 mb-2">Headers</div>
            <pre className="rounded-md border border-white/10 bg-black/40 p-2 font-mono text-[10px] text-cyan-200/90 overflow-x-auto">
{`x-request-id: ${trace.reqId}
authorization: Bearer •••••
user-agent: ${trace.device}
x-region: ${trace.region}
x-trace: ${trace.id}`}
            </pre>
          </Panel>

          <div className="flex gap-2">
            <button className="flex-1 rounded-md border border-cyan-400/30 bg-cyan-500/10 px-3 py-2 text-[11px] text-cyan-200 hover:bg-cyan-500/20">Replay Request</button>
            <button className="flex-1 rounded-md border border-violet-400/30 bg-violet-500/10 px-3 py-2 text-[11px] text-violet-200 hover:bg-violet-500/20">AI Debug</button>
            <button className="flex-1 rounded-md border border-white/10 bg-white/5 px-3 py-2 text-[11px] text-white/80 hover:bg-white/10">Export JSON</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TraceTable() {
  const [rows, setRows] = useState<Trace[]>(() => Array.from({ length: 24 }, makeTrace));
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");
  const [sev, setSev] = useState<"all" | "ok" | "warn" | "err">("all");
  const [group, setGroup] = useState(false);
  const [open, setOpen] = useState<Trace | null>(null);
  const pRef = useRef(paused);
  pRef.current = paused;

  useEffect(() => {
    const id = setInterval(() => {
      if (pRef.current) return;
      setRows((r) => [makeTrace(), ...r].slice(0, 120));
    }, 1200);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (sev === "ok" && r.status >= 400) return false;
      if (sev === "warn" && !(r.status >= 400 && r.status < 500)) return false;
      if (sev === "err" && r.status < 500) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return r.id.includes(q) || r.reqId.includes(q) || r.service.includes(q) ||
             r.op.toLowerCase().includes(q) || r.user.includes(q);
    });
  }, [rows, query, sev]);

  const grouped = useMemo(() => {
    if (!group) return null;
    const m = new Map<string, Trace[]>();
    filtered.forEach((r) => { (m.get(r.service) ?? m.set(r.service, []).get(r.service)!).push(r); });
    return Array.from(m.entries());
  }, [filtered, group]);

  const togglePin = (id: string) => setRows((r) => r.map((x) => x.id === id ? { ...x, pinned: !x.pinned } : x));

  const sevPill = (key: typeof sev, label: string, count: number, color: string) => (
    <button onClick={() => setSev(key)}
      className={`flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] transition ${
        sev === key ? `border-${color}-400/40 bg-${color}-500/10 text-${color}-200` : "border-white/10 bg-black/30 text-white/60 hover:bg-white/5"
      }`}>
      <PulseDot color={`bg-${color}-400`} />
      {label}
      <span className="font-mono text-white/40">{count}</span>
    </button>
  );

  const counts = useMemo(() => ({
    all: rows.length,
    ok: rows.filter(r => r.status < 400).length,
    warn: rows.filter(r => r.status >= 400 && r.status < 500).length,
    err: rows.filter(r => r.status >= 500).length,
  }), [rows]);

  const Row = ({ t }: { t: Trace }) => (
    <div onClick={() => setOpen(t)}
      className="grid grid-cols-[100px_90px_130px_1fr_60px_140px_50px_50px_60px] gap-2 px-3 py-1.5 text-[11px] border-b border-white/[0.04] hover:bg-cyan-500/[0.04] cursor-pointer group transition">
      <div className="flex items-center gap-1.5 min-w-0">
        <button onClick={(e) => { e.stopPropagation(); togglePin(t.id); }}
          className={`p-0.5 ${t.pinned ? "text-amber-400" : "text-white/20 group-hover:text-white/50"}`}>
          <Pin className="h-3 w-3" />
        </button>
        <span className="font-mono text-cyan-300 truncate">{t.id}</span>
      </div>
      <span className="font-mono text-white/40 truncate">{t.reqId}</span>
      <span className="text-white/80 truncate">{t.service}</span>
      <span className="font-mono text-white/60 truncate">{t.op}</span>
      <StatusPill s={t.status} />
      <DurationBar ms={t.duration} />
      <span className="font-mono text-white/50 text-right">{t.queries}</span>
      <span className="font-mono text-white/50 text-right">{t.mem}m</span>
      <span className="text-white/40 text-right">{Math.round((Date.now() - t.ts) / 1000)}s</span>
    </div>
  );

  return (
    <Panel glow="cyan">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-white/10 p-3">
        <div className="flex items-center gap-2 mr-2">
          <Layers className="h-4 w-4 text-cyan-400" />
          <span className="text-xs font-semibold text-white/90">Live Traces</span>
          <PulseDot color={paused ? "bg-amber-400" : "bg-emerald-400"} />
          <span className="text-[10px] text-white/50">{paused ? "PAUSED" : "STREAMING"}</span>
        </div>
        <div className="flex items-center gap-1.5 rounded-md border border-white/10 bg-black/30 px-2 py-1 min-w-[220px]">
          <Search className="h-3 w-3 text-white/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="trace_id, req_id, user, op…"
            className="flex-1 bg-transparent text-[11px] text-white/90 placeholder:text-white/30 outline-none" />
          {query && <button onClick={() => setQuery("")}><X className="h-3 w-3 text-white/40" /></button>}
        </div>
        <div className="flex items-center gap-1">
          {sevPill("all", "All", counts.all, "cyan")}
          {sevPill("ok", "2xx/3xx", counts.ok, "emerald")}
          {sevPill("warn", "4xx", counts.warn, "amber")}
          {sevPill("err", "5xx", counts.err, "rose")}
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          <button onClick={() => setGroup((g) => !g)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] transition ${group ? "border-violet-400/40 bg-violet-500/10 text-violet-200" : "border-white/10 bg-black/30 text-white/60 hover:bg-white/5"}`}>
            <Filter className="h-3 w-3" /> Group by service
          </button>
          <button onClick={() => setPaused((p) => !p)}
            className={`flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] ${paused ? "border-emerald-400/40 bg-emerald-500/10 text-emerald-200" : "border-amber-400/40 bg-amber-500/10 text-amber-200"}`}>
            {paused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button className="flex items-center gap-1 rounded-md border border-white/10 bg-black/30 px-2 py-1 text-[10px] text-white/70 hover:bg-white/5">
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="grid grid-cols-[100px_90px_130px_1fr_60px_140px_50px_50px_60px] gap-2 px-3 py-2 border-b border-white/10 bg-black/20 text-[10px] uppercase tracking-wider text-white/40 font-semibold">
        <span>Trace</span><span>Request</span><span>Service</span><span>Operation</span>
        <span>Status</span><span>Duration</span><span className="text-right">Q</span>
        <span className="text-right">Mem</span><span className="text-right">Age</span>
      </div>

      {/* Rows */}
      <div className="max-h-[520px] overflow-y-auto">
        {grouped
          ? grouped.map(([svc, list]) => (
              <div key={svc}>
                <div className="sticky top-0 z-10 flex items-center gap-2 border-b border-white/5 bg-gradient-to-r from-violet-500/10 to-transparent px-3 py-1.5 backdrop-blur">
                  <ChevronRight className="h-3 w-3 text-violet-300" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-violet-200">{svc}</span>
                  <span className="text-[10px] font-mono text-white/40">· {list.length} traces</span>
                </div>
                {list.map((t) => <Row key={t.id} t={t} />)}
              </div>
            ))
          : filtered.map((t) => <Row key={t.id} t={t} />)
        }
        {filtered.length === 0 && (
          <div className="p-10 text-center text-xs text-white/40">No traces match current filters.</div>
        )}
      </div>

      {open && <TraceDrawer trace={open} onClose={() => setOpen(null)} />}
    </Panel>
  );
}

/* ============================================================ */
/*  ERROR CENTER + GEO                                          */
/* ============================================================ */

function ErrorCenter() {
  const errs = [
    { code: "TypeError: cannot read .id of undefined", svc: "checkout", users: 142, count: 821, c: "rose" },
    { code: "TimeoutError: stripe.charge.create", svc: "payments", users: 38, count: 204, c: "amber" },
    { code: "QueryError: deadlock_detected", svc: "orders-db", users: 12, count: 67, c: "rose" },
    { code: "RateLimitError: 429 upstream", svc: "search-idx", users: 88, count: 412, c: "amber" },
  ];
  return (
    <Panel className="p-3" glow="rose">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-rose-400" />
          <span className="text-xs font-semibold text-white/90">Error Center · Live Exceptions</span>
        </div>
        <button className="text-[10px] text-rose-300 hover:text-rose-200">view all ›</button>
      </div>
      <div className="mt-2 space-y-1.5">
        {errs.map((e, i) => (
          <div key={i} className="rounded-lg border border-white/10 bg-black/30 p-2.5 hover:bg-white/[0.03] cursor-pointer transition">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-mono text-[11px] text-rose-200 truncate">{e.code}</div>
                <div className="text-[10px] text-white/40 mt-0.5">{e.svc} · affecting <b className="text-white/70">{e.users}</b> users</div>
              </div>
              <span className="rounded-md border border-rose-400/30 bg-rose-500/10 px-1.5 py-0.5 font-mono text-[10px] text-rose-300">×{e.count}</span>
            </div>
            <MiniSpark data={SPARK(20)} stroke="#fb7185" />
          </div>
        ))}
      </div>
    </Panel>
  );
}

function GeoTraffic() {
  const regions = [
    { r: "us-east-1", v: 38, c: "#22d3ee" },
    { r: "eu-west-1", v: 27, c: "#a78bfa" },
    { r: "ap-south-1", v: 18, c: "#34d399" },
    { r: "sa-east-1", v: 9,  c: "#fbbf24" },
    { r: "us-west-2", v: 8,  c: "#fb7185" },
  ];
  return (
    <Panel className="p-3" glow="emerald">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-4 w-4 text-emerald-400" />
          <span className="text-xs font-semibold text-white/90">Geo Traffic Distribution</span>
        </div>
        <span className="text-[10px] text-white/50">live</span>
      </div>
      <div className="mt-2 space-y-2">
        {regions.map((r) => (
          <div key={r.r}>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-white/70 font-mono">{r.r}</span>
              <span className="font-mono text-white/60">{r.v}%</span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{
                width: `${r.v * 2.5}%`,
                background: `linear-gradient(90deg, ${r.c}, ${r.c}55)`,
                boxShadow: `0 0 8px ${r.c}88`,
              }} />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1 text-center text-[10px]">
        {COUNTRIES.map((c) => (
          <div key={c} className="rounded border border-white/10 bg-black/30 px-1 py-1 text-white/70">{c}</div>
        ))}
      </div>
    </Panel>
  );
}

/* ============================================================ */
/*  PAGE                                                        */
/* ============================================================ */

export default function TracesPage() {
  return (
    <div className="relative min-h-full -m-3 md:-m-4 p-3 md:p-4 space-y-3 bg-[#04070d] text-white">
      {/* atmosphere */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0a1628_0%,#04070d_55%,#000_100%)]" />
        <div className="absolute inset-0 opacity-[0.03]"
             style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      </div>

      <CommandBar />
      <KpiGrid />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2"><LatencyChart /></div>
        <ThroughputChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2"><InfraMap /></div>
        <AiIntel />
      </div>

      <TraceTable />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2"><Heatmap /></div>
        <GeoTraffic />
      </div>

      <ErrorCenter />

      <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-white/40">
        <div className="flex items-center gap-3">
          <Command className="h-3 w-3" />
          <span><kbd className="rounded border border-white/10 px-1">⌘K</kbd> command</span>
          <span><kbd className="rounded border border-white/10 px-1">F</kbd> filter</span>
          <span><kbd className="rounded border border-white/10 px-1">P</kbd> pause</span>
          <span><kbd className="rounded border border-white/10 px-1">/</kbd> search</span>
        </div>
        <div className="flex items-center gap-2"><PulseDot /> OpenTelemetry · WS connected</div>
      </div>
    </div>
  );
}
