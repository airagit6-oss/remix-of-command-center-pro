import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateApps, generateSparkline } from "@/lib/mockData";
import { cn } from "@/lib/utils";

/* ────────────────────────────────────────────────────────────────────────── */
/*  Premium SVG primitives                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

function Sparkline({
  data,
  stroke,
  fill,
  height = 36,
}: {
  data: { v: number }[];
  stroke: string;
  fill: string;
  height?: number;
}) {
  const w = 160;
  const max = Math.max(...data.map((d) => d.v), 1);
  const min = Math.min(...data.map((d) => d.v));
  const range = Math.max(max - min, 1);
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d.v - min) / range) * (height - 4) - 2}`);
  const path = `M${pts.join(" L")}`;
  const area = `${path} L${w},${height} L0,${height} Z`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spk-${stroke.replace(/[^a-z0-9]/gi, "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fill} stopOpacity="0.45" />
          <stop offset="100%" stopColor={fill} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#spk-${stroke.replace(/[^a-z0-9]/gi, "")})`} />
      <path d={path} fill="none" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function Ring({
  value,
  color,
  size = 56,
  label,
  sub,
}: {
  value: number;
  color: string;
  size?: number;
  label: string;
  sub?: string;
}) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(Math.max(value, 0), 100) / 100) * c;
  return (
    <div className="flex items-center gap-3">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="4" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-white/40">{label}</div>
        <div className="text-sm font-semibold text-white">{value}<span className="text-white/40">%</span></div>
        {sub && <div className="text-[10px] text-white/35">{sub}</div>}
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1">
        <span>{label}</span>
        <span className="text-white/70 font-mono">{value}%</span>
      </div>
      <div className="h-1.5 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${value}%`, background: color, boxShadow: `0 0 8px ${color}` }}
        />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────── */
/*  Domain                                                                    */
/* ────────────────────────────────────────────────────────────────────────── */

type Service = ReturnType<typeof generateApps>[number] & {
  id: string;
  tier: "Edge" | "Core" | "Data" | "AI" | "Payments";
  region: string;
  version: string;
  uptime: number;
  responseMs: number;
  cpu: number;
  ram: number;
  queue: number;
  cacheHit: number;
  dbLatency: number;
  wsStability: number;
  aiHealth: number;
  riskScore: number;
  securityScore: number;
  recoveryScore: number;
  costPerHour: number;
  revenueImpact: number;
  lastDeploy: string;
  anomalies: string[];
  dependencies: string[];
};

const TIERS: Service["tier"][] = ["Edge", "Core", "Data", "AI", "Payments"];
const REGIONS = ["us-east-1", "us-west-2", "eu-west-1", "eu-central-1", "ap-south-1", "ap-northeast-1"];

const enrich = (raw: ReturnType<typeof generateApps>): Service[] =>
  raw.map((a, i) => {
    const down = a.status === "Down";
    return {
      ...a,
      id: `svc-${i + 1}`,
      tier: TIERS[i % TIERS.length],
      region: REGIONS[i % REGIONS.length],
      version: `v${4 + (i % 3)}.${i + 1}.${Math.floor(Math.random() * 9)}`,
      uptime: down ? 92 + Math.random() * 4 : 99.4 + Math.random() * 0.59,
      responseMs: Math.floor(40 + Math.random() * (down ? 600 : 220)),
      cpu: Math.floor(20 + Math.random() * (down ? 70 : 55)),
      ram: Math.floor(30 + Math.random() * (down ? 60 : 50)),
      queue: Math.floor(Math.random() * (down ? 4200 : 600)),
      cacheHit: Math.floor(72 + Math.random() * 26),
      dbLatency: Math.floor(8 + Math.random() * (down ? 180 : 60)),
      wsStability: Math.floor(80 + Math.random() * 19),
      aiHealth: down ? Math.floor(35 + Math.random() * 25) : Math.floor(78 + Math.random() * 21),
      riskScore: down ? Math.floor(60 + Math.random() * 35) : Math.floor(5 + Math.random() * 35),
      securityScore: Math.floor(70 + Math.random() * 28),
      recoveryScore: Math.floor(60 + Math.random() * 38),
      costPerHour: +(0.4 + Math.random() * 9.6).toFixed(2),
      revenueImpact: Math.floor(800 + Math.random() * 24000),
      lastDeploy: `${Math.floor(Math.random() * 11) + 1}h ago`,
      anomalies: down
        ? ["Latency spike", "Memory drift", "Error burst"].slice(0, 1 + Math.floor(Math.random() * 3))
        : Math.random() > 0.55
          ? ["Cache cold-start"]
          : [],
      dependencies: ["postgres-primary", "redis-cluster", "kafka-events", "auth-service"].slice(0, 2 + (i % 3)),
    };
  });

const fmt = (n: number) => n.toLocaleString("en-US");

/* ────────────────────────────────────────────────────────────────────────── */
/*  Page                                                                      */
/* ────────────────────────────────────────────────────────────────────────── */

export default function AppsPage() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>(() => enrich(generateApps()));
  const [filter, setFilter] = useState<"All" | "Healthy" | "Degraded" | "Down" | "AI Risk">("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pulse, setPulse] = useState(0);

  // realtime telemetry tick (UI only)
  useEffect(() => {
    const id = setInterval(() => {
      setPulse((p) => p + 1);
      setServices((prev) =>
        prev.map((s) => ({
          ...s,
          cpu: Math.max(8, Math.min(98, s.cpu + Math.round((Math.random() - 0.5) * 6))),
          ram: Math.max(10, Math.min(96, s.ram + Math.round((Math.random() - 0.5) * 4))),
          responseMs: Math.max(20, s.responseMs + Math.round((Math.random() - 0.5) * 18)),
          queue: Math.max(0, s.queue + Math.round((Math.random() - 0.5) * 60)),
          sparkline: [...s.sparkline.slice(1), { t: s.sparkline.length, v: Math.max(0, Math.min(100, s.sparkline[s.sparkline.length - 1].v + Math.round((Math.random() - 0.5) * 18))) }],
        }))
      );
    }, 2400);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return services.filter((s) => {
      if (query && !s.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (filter === "Healthy") return s.status === "Running" && s.riskScore < 35;
      if (filter === "Degraded") return s.status === "Running" && s.riskScore >= 35;
      if (filter === "Down") return s.status === "Down";
      if (filter === "AI Risk") return s.riskScore >= 50 || s.anomalies.length > 1;
      return true;
    });
  }, [services, query, filter]);

  const stats = useMemo(() => {
    const total = services.length;
    const down = services.filter((s) => s.status === "Down").length;
    const healthy = services.filter((s) => s.status === "Running" && s.riskScore < 35).length;
    const avgUptime = services.reduce((a, s) => a + s.uptime, 0) / total;
    const totalRpm = services.reduce((a, s) => a + s.requestsMin, 0);
    const totalRevenue = services.reduce((a, s) => a + s.revenueImpact, 0);
    const totalCost = services.reduce((a, s) => a + s.costPerHour * 24, 0);
    const avgAi = services.reduce((a, s) => a + s.aiHealth, 0) / total;
    return { total, down, healthy, avgUptime, totalRpm, totalRevenue, totalCost, avgAi };
  }, [services]);

  const trafficSpark = useMemo(() => generateSparkline(28, 30, 100), []);
  const latencySpark = useMemo(() => generateSparkline(28, 20, 90), []);
  const errSpark = useMemo(() => generateSparkline(28, 5, 60), []);

  return (
    <div
      className="relative min-h-full -m-4 p-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(168,85,247,0.08), transparent 60%), linear-gradient(180deg, #060818 0%, #07091c 100%)",
      }}
    >
      {/* ambient grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
        }}
      />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="relative flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-300/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Mission Control · Live Telemetry
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white tracking-tight">
              Application Monitoring{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-[12px] text-white/45 mt-1">
              Realtime infrastructure intelligence · AI observability · self-healing telemetry
            </p>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300">
              SLA {stats.avgUptime.toFixed(2)}%
            </span>
            <span className="px-2.5 py-1 rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
              {stats.healthy}/{stats.total} healthy
            </span>
            <span className="px-2.5 py-1 rounded-md border border-amber-400/20 bg-amber-400/[0.06] text-amber-200">
              {stats.down} incidents
            </span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Global Throughput", value: `${fmt(stats.totalRpm)}/min`, sub: "+8.4% vs 24h", spark: trafficSpark, c: "#38bdf8" },
            { label: "Avg Response", value: `${Math.round(services.reduce((a, s) => a + s.responseMs, 0) / services.length)}ms`, sub: "p95 stable", spark: latencySpark, c: "#a78bfa" },
            { label: "AI Health Index", value: `${stats.avgAi.toFixed(1)}`, sub: "Predictive · 12h", spark: errSpark, c: "#34d399" },
            { label: "Revenue Flow", value: `$${fmt(stats.totalRevenue)}`, sub: `Cost $${stats.totalCost.toFixed(0)}/d`, spark: trafficSpark, c: "#f472b6" },
          ].map((k) => (
            <div
              key={k.label}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl p-4 overflow-hidden"
              style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 50px -30px rgba(0,0,0,0.6)" }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: k.c }} />
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{k.label}</div>
              <div className="mt-1 text-xl font-semibold text-white">{k.value}</div>
              <div className="text-[10px] text-white/40">{k.sub}</div>
              <div className="mt-2 -mx-1">
                <Sparkline data={k.spark} stroke={k.c} fill={k.c} height={32} />
              </div>
            </div>
          ))}
        </div>

        {/* AI intelligence strip */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-r from-cyan-500/[0.05] via-violet-500/[0.05] to-fuchsia-500/[0.05] backdrop-blur-xl p-3 overflow-hidden">
          <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: "radial-gradient(400px 80px at 30% 50%, rgba(56,189,248,0.25), transparent 70%)" }} />
          <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
            <div className="flex items-center gap-2 text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
              AI predicts <strong className="text-white">+18%</strong> traffic surge in 42m on <strong className="text-white">API Gateway</strong>
            </div>
            <div className="flex items-center gap-2 text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_#c4b5fd]" />
              Anomaly cluster on <strong className="text-white">Payment Processor</strong> · auto-healing armed
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />
              Failover ready · 3 regions hot-standby
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search service · region · version…"
              className="w-full h-9 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] text-white placeholder:text-white/30 px-3 outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(["All", "Healthy", "Degraded", "Down", "AI Risk"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={cn(
                  "px-3 h-7 rounded-lg text-[11px] tracking-wide transition",
                  filter === f
                    ? "bg-gradient-to-r from-cyan-400/20 to-violet-400/20 text-white border border-white/10"
                    : "text-white/55 hover:text-white"
                )}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => navigate("/admin/metrics")}
            className="ml-auto h-9 px-3 rounded-xl text-[12px] text-cyan-200 border border-cyan-400/20 bg-cyan-400/[0.06] hover:bg-cyan-400/[0.12] transition"
          >
            Open Metrics Lab →
          </button>
        </div>
      </div>

      {/* ── Service grid ──────────────────────────────────────────────── */}
      <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filtered.map((s) => {
          const isOpen = expanded === s.id;
          const down = s.status === "Down";
          const degraded = !down && s.riskScore >= 35;
          const accent = down ? "#fb7185" : degraded ? "#fbbf24" : "#34d399";
          const accentSoft = down ? "rgba(251,113,133,0.18)" : degraded ? "rgba(251,191,36,0.18)" : "rgba(52,211,153,0.18)";
          const tierColor = { Edge: "#22d3ee", Core: "#a78bfa", Data: "#34d399", AI: "#f472b6", Payments: "#fbbf24" }[s.tier];

          return (
            <div
              key={s.id}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl overflow-hidden transition hover:border-white/[0.12]"
              style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -40px rgba(0,0,0,0.8)" }}
            >
              {/* aurora */}
              <div
                className="pointer-events-none absolute -top-16 -right-12 h-44 w-44 rounded-full blur-3xl opacity-50"
                style={{ background: accentSoft }}
              />

              <button
                onClick={() => setExpanded(isOpen ? null : s.id)}
                className="relative w-full text-left p-4"
              >
                <div className="flex items-start gap-4">
                  {/* Logo */}
                  <div
                    className="relative h-12 w-12 rounded-xl flex items-center justify-center text-sm font-semibold text-white shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${tierColor}33, ${tierColor}11)`,
                      border: `1px solid ${tierColor}55`,
                      boxShadow: `0 0 20px -6px ${tierColor}88`,
                    }}
                  >
                    {s.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#07091c]" style={{ background: accent, boxShadow: `0 0 8px ${accent}` }} />
                  </div>

                  {/* Title block */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[14px] font-semibold text-white">{s.name}</span>
                      <span className="text-[10px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border" style={{ borderColor: `${tierColor}55`, color: tierColor, background: `${tierColor}10` }}>
                        {s.tier}
                      </span>
                      <span className="text-[10px] text-white/40 font-mono">{s.version}</span>
                      <span className="text-[10px] text-white/40">· {s.region}</span>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/55">
                      <span><span className="text-white font-mono">{fmt(s.activeUsers)}</span> users</span>
                      <span><span className="text-white font-mono">{fmt(s.requestsMin)}</span> req/min</span>
                      <span><span className="text-white font-mono">{s.responseMs}ms</span> p50</span>
                      <span className={cn(s.errorPercent > 3 ? "text-rose-300" : "text-white/55")}>
                        <span className={cn("font-mono", s.errorPercent > 3 ? "text-rose-200" : "text-white")}>{s.errorPercent}%</span> err
                      </span>
                      <span className="text-emerald-300/80"><span className="font-mono text-white">{s.uptime.toFixed(2)}%</span> uptime</span>
                    </div>
                  </div>

                  {/* Sparkline */}
                  <div className="hidden md:block w-44 shrink-0">
                    <Sparkline data={s.sparkline} stroke={accent} fill={accent} height={40} />
                    <div className="flex items-center justify-between mt-1 text-[10px] text-white/40">
                      <span>{s.lastDeploy}</span>
                      <span className="font-mono">${s.costPerHour}/h</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] uppercase tracking-[0.18em] px-2 py-1 rounded-md border"
                      style={{ background: accentSoft, borderColor: `${accent}55`, color: accent }}
                    >
                      {down ? "Down" : degraded ? "Degraded" : "Healthy"}
                    </span>
                    <span className="text-[10px] text-white/35">AI {s.aiHealth} · Risk {s.riskScore}</span>
                  </div>
                </div>

                {/* Mini telemetry row */}
                <div className="mt-4 grid grid-cols-4 gap-3">
                  <Bar label="CPU" value={s.cpu} color={s.cpu > 80 ? "#fb7185" : s.cpu > 60 ? "#fbbf24" : "#22d3ee"} />
                  <Bar label="RAM" value={s.ram} color={s.ram > 80 ? "#fb7185" : "#a78bfa"} />
                  <Bar label="Cache" value={s.cacheHit} color="#34d399" />
                  <Bar label="WS" value={s.wsStability} color="#f472b6" />
                </div>

                {s.anomalies.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-[10px] uppercase tracking-[0.16em] text-rose-300/80">AI alerts</span>
                    {s.anomalies.map((a) => (
                      <span key={a} className="text-[10px] px-2 py-0.5 rounded-md border border-rose-400/25 bg-rose-400/[0.08] text-rose-200">
                        {a}
                      </span>
                    ))}
                  </div>
                )}
              </button>

              {/* Expanded panel */}
              {isOpen && (
                <div className="relative px-4 pb-4 pt-1 border-t border-white/[0.05] bg-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {/* AI scores */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">AI Intelligence</div>
                      <Ring value={s.aiHealth} color="#22d3ee" label="Stability" sub="12h forecast" />
                      <Ring value={100 - s.riskScore} color="#a78bfa" label="Performance" sub="p95 weighted" />
                      <Ring value={s.securityScore} color="#34d399" label="Security" sub="zero-trust posture" />
                      <Ring value={s.recoveryScore} color="#f472b6" label="Recovery" sub="auto-heal armed" />
                    </div>

                    {/* Telemetry */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Realtime Telemetry</div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        {[
                          ["DB latency", `${s.dbLatency}ms`],
                          ["Queue depth", fmt(s.queue)],
                          ["Cache hit", `${s.cacheHit}%`],
                          ["WS stability", `${s.wsStability}%`],
                          ["Cost / hr", `$${s.costPerHour}`],
                          ["Revenue / d", `$${fmt(s.revenueImpact)}`],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-lg bg-white/[0.025] border border-white/[0.05] px-2.5 py-2">
                            <div className="text-[10px] uppercase tracking-[0.12em] text-white/40">{k}</div>
                            <div className="text-[13px] font-mono text-white">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div>
                        <div className="text-[10px] uppercase tracking-[0.16em] text-white/40 mb-1">Throughput · live</div>
                        <Sparkline data={s.sparkline} stroke="#22d3ee" fill="#22d3ee" height={48} />
                      </div>
                    </div>

                    {/* Dependency / timeline */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Service Graph</div>
                      <div className="flex flex-wrap gap-1.5">
                        {s.dependencies.map((d) => (
                          <span key={d} className="text-[11px] px-2 py-1 rounded-md border border-white/10 bg-white/[0.03] text-white/70 font-mono">
                            {d}
                          </span>
                        ))}
                      </div>
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40 pt-2">Self-Healing Timeline</div>
                      <div className="relative pl-4">
                        <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/30 to-transparent" />
                        {[
                          { t: "now", c: "#22d3ee", l: "Heartbeat OK · region " + s.region },
                          { t: s.lastDeploy, c: "#a78bfa", l: "Deploy " + s.version + " · canary green" },
                          { t: "1d", c: "#34d399", l: "Auto-scale +2 nodes triggered" },
                          { t: "2d", c: "#fbbf24", l: "Cache warmed · cold-start avoided" },
                        ].map((e, i) => (
                          <div key={i} className="relative pl-3 py-1 text-[11px]">
                            <span className="absolute -left-[3px] top-2.5 h-2 w-2 rounded-full" style={{ background: e.c, boxShadow: `0 0 8px ${e.c}` }} />
                            <span className="text-white/50 font-mono mr-2">{e.t}</span>
                            <span className="text-white/80">{e.l}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="col-span-full text-center text-white/40 text-sm py-12 border border-dashed border-white/10 rounded-2xl">
            No services match the current filter.
          </div>
        )}
      </div>

      <div className="relative mt-6 text-[10px] text-white/30 text-center">
        Telemetry tick #{pulse} · self-healing engine armed · zero-trust gateway active
      </div>
    </div>
  );
}