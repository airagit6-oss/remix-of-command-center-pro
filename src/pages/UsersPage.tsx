// @ts-nocheck
import { useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────── */
/*  Visual primitives                              */
/* ─────────────────────────────────────────────── */

function Sparkline({ data, color, height = 28 }: { data: { v: number }[]; color: string; height?: number }) {
  const w = 120;
  const max = Math.max(...data.map((d) => d.v), 1);
  const min = Math.min(...data.map((d) => d.v));
  const range = Math.max(max - min, 1);
  const step = w / (data.length - 1);
  const pts = data.map((d, i) => `${i * step},${height - ((d.v - min) / range) * (height - 4) - 2}`);
  const id = `usr-spk-${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${pts.join(" L")} L${w},${height} L0,${height} Z`} fill={`url(#${id})`} />
      <path d={`M${pts.join(" L")}`} fill="none" stroke={color} strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function Ring({ value, color, size = 48, label }: { value: number; color: string; size?: number; label: string }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const o = c - (Math.min(Math.max(value, 0), 100) / 100) * c;
  return (
    <div className="flex items-center gap-2">
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth="3" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth="3"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={o}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: "stroke-dashoffset 700ms ease" }}
        />
      </svg>
      <div>
        <div className="text-[9px] uppercase tracking-[0.14em] text-white/40">{label}</div>
        <div className="text-[12px] font-semibold text-white">{value}<span className="text-white/40">%</span></div>
      </div>
    </div>
  );
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.12em] text-white/40 mb-1">
        <span>{label}</span>
        <span className="text-white/70 font-mono">{value}</span>
      </div>
      <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${value}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────── */
/*  Domain                                         */
/* ─────────────────────────────────────────────── */

type EnrichedUser = ReturnType<typeof generateUsers>[number] & {
  role: "Customer" | "Reseller" | "Franchise" | "Vendor" | "Admin";
  verified: "Email" | "MFA" | "KYC";
  plan: "Free" | "Pro" | "Business" | "Enterprise";
  trust: number;
  fraud: number;
  engagement: number;
  vip: number;
  churn: number;
  revenue: number;
  sessions: number;
  vpn: boolean;
  proxy: boolean;
  geoRisk: "Low" | "Medium" | "High";
  fingerprint: string;
  ip: string;
  lastAction: string;
  sparkline: { v: number }[];
  ai: string;
};

const ROLES: EnrichedUser["role"][] = ["Customer", "Reseller", "Franchise", "Vendor", "Admin"];
const PLANS: EnrichedUser["plan"][] = ["Free", "Pro", "Business", "Enterprise"];
const ACTIONS = ["viewed dashboard", "opened invoice", "ran export", "called API", "updated profile", "checked metrics", "downloaded report"];
const AI_TAGS = ["High intent", "Stable", "Power user", "At risk", "Loyal", "VIP candidate", "Anomaly cluster"];

function enrich(raw: any[]): EnrichedUser[] {
  return raw.map((u, i) => {
    return {
      ...u,
      role: u.role || ROLES[i % ROLES.length],
      verified: u.verified || (["Email", "MFA", "KYC"] as const)[i % 3],
      plan: u.plan || PLANS[i % PLANS.length],
      trust: u.trust || 85,
      fraud: u.fraud || 12,
      engagement: u.engagement || 70,
      vip: u.vip || 40,
      churn: u.churn || 20,
      revenue: u.revenue || 5000,
      sessions: u.sessions || 2,
      vpn: u.vpn || false,
      proxy: u.proxy || false,
      geoRisk: u.geoRisk || "Low",
      fingerprint: u.fingerprint || `fp_${i}`,
      ip: u.ip || "192.168.1.1",
      lastAction: u.lastAction || ACTIONS[i % ACTIONS.length],
      sparkline: u.sparkline || Array.from({ length: 18 }, (_, j) => ({ v: 50 + Math.sin(j * 0.5) * 20 })),
      ai: u.ai || AI_TAGS[i % AI_TAGS.length],
    };
  });
}

const initials = (name: string) => name.split(/[._\s]/).map((s) => s[0]).join("").slice(0, 2).toUpperCase();
const fmt = (n: number) => n.toLocaleString("en-US");

/* ─────────────────────────────────────────────── */
/*  Page                                           */
/* ─────────────────────────────────────────────── */

export default function UsersPage() {
  const [users, setUsers] = useState<EnrichedUser[]>([]);
  const [filter, setFilter] = useState<"All" | "Live" | "VIP" | "Risk" | "Churn">("All");
  const [role, setRole] = useState<"All" | EnrichedUser["role"]>("All");
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api.get('/users').then(data => {
      setUsers(enrich(data || []));
    });
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 2800);
    return () => clearInterval(id);
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      if (query && !`${u.name} ${u.id} ${u.location} ${u.currentApp}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (role !== "All" && u.role !== role) return false;
      if (filter === "Live") return u.status === "live";
      if (filter === "VIP") return u.vip >= 70;
      if (filter === "Risk") return u.fraud >= 60 || u.geoRisk === "High";
      if (filter === "Churn") return u.churn >= 55;
      return true;
    });
  }, [users, query, role, filter]);

  const stats = useMemo(() => {
    const live = users.filter((u) => u.status === "live").length;
    const vip = users.filter((u) => u.vip >= 70).length;
    const risk = users.filter((u) => u.fraud >= 60).length;
    const churn = Math.round(users.reduce((a, u) => a + u.churn, 0) / users.length);
    const revenue = users.reduce((a, u) => a + u.revenue, 0);
    const trust = Math.round(users.reduce((a, u) => a + u.trust, 0) / users.length);
    return { live, vip, risk, churn, revenue, trust, total: users.length };
  }, [users]);

  const trafficSpark = useMemo(() => Array.from({ length: 28 }, (_, i) => ({ v: 30 + Math.sin(i * 0.3) * 20 })), []);

  return (
    <div
      className="relative min-h-full -m-4 p-6 overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 10% -10%, rgba(56,189,248,0.08), transparent 60%), radial-gradient(900px 500px at 100% 0%, rgba(168,85,247,0.08), transparent 60%), linear-gradient(180deg, #060818 0%, #07091c 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
          maskImage: "radial-gradient(ellipse at 50% 0%, black 40%, transparent 75%)",
        }}
      />

      {/* Header */}
      <div className="relative flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cyan-300/70">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              Mission Control · User Intelligence
            </div>
            <h1 className="mt-1 text-2xl font-semibold text-white tracking-tight">
              Global Users{" "}
              <span className="bg-gradient-to-r from-cyan-300 via-sky-200 to-violet-300 bg-clip-text text-transparent">
                Command Center
              </span>
            </h1>
            <p className="text-[12px] text-white/45 mt-1">
              Realtime presence · AI trust scoring · session intelligence · zero-trust posture
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px]">
            <span className="px-2.5 py-1 rounded-md border border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300">
              {stats.live} live
            </span>
            <span className="px-2.5 py-1 rounded-md border border-cyan-400/20 bg-cyan-400/[0.06] text-cyan-300">
              Trust {stats.trust}
            </span>
            <span className="px-2.5 py-1 rounded-md border border-amber-400/20 bg-amber-400/[0.06] text-amber-200">
              {stats.risk} risk
            </span>
            <span className="px-2.5 py-1 rounded-md border border-fuchsia-400/20 bg-fuchsia-400/[0.06] text-fuchsia-200">
              {stats.vip} VIP
            </span>
          </div>
        </div>

        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { l: "Active Sessions", v: `${stats.live}/${stats.total}`, s: "real-time presence", c: "#34d399" },
            { l: "AI Trust Index", v: `${stats.trust}`, s: "weighted last 24h", c: "#22d3ee" },
            { l: "Churn Forecast", v: `${stats.churn}%`, s: "predictive · 30d", c: "#fbbf24" },
            { l: "Revenue (LTV)", v: `$${fmt(stats.revenue)}`, s: "across cohort", c: "#a78bfa" },
          ].map((k) => (
            <div
              key={k.l}
              className="relative rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl p-4 overflow-hidden"
              style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 50px -30px rgba(0,0,0,0.6)" }}
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30 blur-2xl" style={{ background: k.c }} />
              <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">{k.l}</div>
              <div className="mt-1 text-xl font-semibold text-white">{k.v}</div>
              <div className="text-[10px] text-white/40">{k.s}</div>
              <div className="mt-2 -mx-1">
                <Sparkline data={trafficSpark} color={k.c} height={28} />
              </div>
            </div>
          ))}
        </div>

        {/* AI strip */}
        <div className="relative rounded-2xl border border-white/[0.06] bg-gradient-to-r from-cyan-500/[0.05] via-violet-500/[0.05] to-fuchsia-500/[0.05] backdrop-blur-xl p-3 overflow-hidden">
          <div className="relative flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px]">
            <div className="flex items-center gap-2 text-cyan-200">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300 shadow-[0_0_8px_#22d3ee]" />
              AI flags <strong className="text-white">3 anomalies</strong> · impossible-travel signal in EU-Central
            </div>
            <div className="flex items-center gap-2 text-violet-200">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-300 shadow-[0_0_8px_#c4b5fd]" />
              <strong className="text-white">12 VIP candidates</strong> ready for upgrade outreach
            </div>
            <div className="flex items-center gap-2 text-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 shadow-[0_0_8px_#6ee7b7]" />
              Zero-trust posture: nominal · MFA coverage 87%
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search user, region, app, IP…"
            className="flex-1 min-w-[220px] max-w-md h-9 rounded-xl bg-white/[0.03] border border-white/10 text-[13px] text-white placeholder:text-white/30 px-3 outline-none focus:border-cyan-400/40 focus:bg-white/[0.05] transition"
          />
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(["All", "Live", "VIP", "Risk", "Churn"] as const).map((f) => (
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
          <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
            {(["All", ...ROLES] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={cn(
                  "px-2.5 h-7 rounded-lg text-[11px] tracking-wide transition",
                  role === r ? "bg-white/[0.08] text-white" : "text-white/55 hover:text-white"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User list */}
      <div className="relative space-y-2">
        {filtered.map((u) => {
          const isOpen = expanded === u.id;
          const live = u.status === "live";
          const accent = u.fraud >= 60 ? "#fb7185" : u.vip >= 70 ? "#f472b6" : live ? "#34d399" : "#64748b";
          const accentSoft = `${accent}22`;
          const roleColor = { Customer: "#22d3ee", Reseller: "#a78bfa", Franchise: "#fbbf24", Vendor: "#34d399", Admin: "#f472b6" }[u.role];

          return (
            <div
              key={u.id}
              className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.025] backdrop-blur-xl overflow-hidden transition hover:border-white/[0.12]"
              style={{ boxShadow: "0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px -40px rgba(0,0,0,0.8)" }}
            >
              <div className="pointer-events-none absolute -top-12 -right-8 h-36 w-36 rounded-full blur-3xl opacity-50" style={{ background: accentSoft }} />

              <button onClick={() => setExpanded(isOpen ? null : u.id)} className="relative w-full text-left p-3 md:p-4">
                <div className="flex items-start gap-3 md:gap-4">
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    <div
                      className="h-11 w-11 rounded-xl flex items-center justify-center text-[12px] font-semibold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${roleColor}33, ${roleColor}11)`,
                        border: `1px solid ${roleColor}55`,
                        boxShadow: `0 0 18px -8px ${roleColor}`,
                      }}
                    >
                      {initials(u.name)}
                    </div>
                    <span
                      className={cn("absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#07091c]", live && "animate-pulse")}
                      style={{ background: live ? "#34d399" : "#475569", boxShadow: live ? "0 0 8px #34d399" : "none" }}
                    />
                  </div>

                  {/* Identity */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-white truncate">{u.name}</span>
                      <span
                        className="text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border"
                        style={{ borderColor: `${roleColor}55`, color: roleColor, background: `${roleColor}10` }}
                      >
                        {u.role}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border border-white/10 text-white/55">
                        {u.plan}
                      </span>
                      <span className="text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border border-emerald-400/25 text-emerald-300/90 bg-emerald-400/[0.06]">
                        {u.verified}
                      </span>
                      {u.vpn && (
                        <span className="text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border border-amber-400/30 text-amber-200 bg-amber-400/[0.06]">
                          VPN
                        </span>
                      )}
                      {u.geoRisk === "High" && (
                        <span className="text-[9px] uppercase tracking-[0.14em] px-1.5 py-0.5 rounded-md border border-rose-400/30 text-rose-200 bg-rose-400/[0.08]">
                          Geo Risk
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-white/55">
                      <span className="font-mono text-white/40">{u.id}</span>
                      <span>· {u.location}</span>
                      <span>· {u.device}</span>
                      <span className="hidden md:inline">· last <span className="text-white/80">{u.lastAction}</span></span>
                    </div>
                  </div>

                  {/* Engagement bars */}
                  <div className="hidden lg:block w-44 shrink-0 space-y-1.5">
                    <Bar label="Trust" value={u.trust} color="#22d3ee" />
                    <Bar label="Engage" value={u.engagement} color="#a78bfa" />
                  </div>

                  {/* Sparkline */}
                  <div className="hidden md:block w-32 shrink-0">
                    <Sparkline data={u.sparkline} color={accent} height={32} />
                    <div className="flex justify-between mt-0.5 text-[10px] text-white/40">
                      <span>{u.sessions} sess</span>
                      <span className="font-mono">${fmt(u.revenue)}</span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span
                      className="text-[10px] uppercase tracking-[0.16em] px-2 py-1 rounded-md border"
                      style={{ background: accentSoft, borderColor: `${accent}55`, color: accent }}
                    >
                      {u.fraud >= 60 ? "Risk" : u.vip >= 70 ? "VIP" : live ? "Live" : "Idle"}
                    </span>
                    <span className="text-[10px] text-white/35 font-mono">{u.sessionDuration}</span>
                  </div>
                </div>
              </button>

              {/* Expanded */}
              {isOpen && (
                <div className="relative px-3 md:px-4 pb-4 pt-1 border-t border-white/[0.05] bg-black/20">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    {/* AI scores */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">AI Profile</div>
                      <div className="grid grid-cols-2 gap-3">
                        <Ring value={u.trust} color="#22d3ee" label="Trust" />
                        <Ring value={u.engagement} color="#a78bfa" label="Engage" />
                        <Ring value={u.vip} color="#f472b6" label="VIP" />
                        <Ring value={u.churn} color="#fbbf24" label="Churn" />
                      </div>
                      <div className="text-[11px] text-white/60">
                        Behaviour: <span className="text-white">{u.ai}</span>
                      </div>
                    </div>

                    {/* Session intelligence */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Session Intelligence</div>
                      <div className="grid grid-cols-2 gap-2 text-[12px]">
                        {[
                          ["IP", u.ip],
                          ["Fingerprint", u.fingerprint],
                          ["Active devices", String(u.sessions)],
                          ["Geo risk", u.geoRisk],
                          ["VPN", u.vpn ? "Detected" : "None"],
                          ["Proxy", u.proxy ? "Detected" : "None"],
                        ].map(([k, v]) => (
                          <div key={k} className="rounded-lg bg-white/[0.025] border border-white/[0.05] px-2.5 py-2">
                            <div className="text-[10px] uppercase tracking-[0.12em] text-white/40">{k}</div>
                            <div className="text-[12px] font-mono text-white truncate">{v}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3">
                      <div className="text-[10px] uppercase tracking-[0.18em] text-white/40">Activity Timeline</div>
                      <div className="relative pl-4">
                        <div className="absolute left-1.5 top-1 bottom-1 w-px bg-gradient-to-b from-cyan-400/40 via-violet-400/30 to-transparent" />
                        {[
                          { t: "now", c: "#22d3ee", l: `${u.lastAction} · ${u.currentApp}` },
                          { t: "2m", c: "#a78bfa", l: `Authenticated from ${u.location}` },
                          { t: "1h", c: "#34d399", l: `Subscription health verified (${u.plan})` },
                          { t: "6h", c: "#fbbf24", l: `MFA challenge passed · device trusted` },
                          { t: "1d", c: "#f472b6", l: `AI tag updated → ${u.ai}` },
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
          <div className="text-center text-white/40 text-sm py-12 border border-dashed border-white/10 rounded-2xl">
            No users match the current filter.
          </div>
        )}
      </div>

      <div className="relative mt-6 text-[10px] text-white/30 text-center">
        Presence tick #{tick} · zero-trust gateway active · self-healing session sync armed
      </div>
    </div>
  );
}