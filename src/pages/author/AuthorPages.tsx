import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Rocket, BarChart2, DollarSign, KeyRound, HardDrive, Download,
  Search, Star, LifeBuoy, GitBranch, Cpu, Wallet, Settings, Radio, Sparkles,
  CheckCircle2, AlertTriangle, TrendingUp, Users, Activity, Globe, ShieldCheck,
  Clock, FileText, Layers, RefreshCw, Upload, Plus, Megaphone, MessageSquare,
  Receipt, BadgeCheck, Heart, Eye, Tag, Zap, Lock, Server, Mail, Image as ImageIcon,
  Code2, Gauge, FileCode, Smartphone, Monitor,
} from 'lucide-react';
import { listProducts } from '@/lib/productStore';
import type { Product } from '@/lib/marketplaceData';
import { useGallery, formatFileSize } from '@/lib/galleryManager';
import { fetchAuditLogs, type AuditLog } from '@/lib/auditLog';
import { fetchActivityLogs, type ActivityLog } from '@/lib/activityTimeline';
import { fetchNotifications, type Notification } from '@/lib/notifications';
import { useAuth } from '@/contexts/AuthContext';

/* ============================================================
   Shared shell primitives
   ============================================================ */

type Accent = 'cyan' | 'fuchsia' | 'emerald' | 'amber';

const accentRing: Record<Accent, string> = {
  cyan:    'from-cyan-500/20 to-cyan-500/0 text-cyan-300 border-cyan-500/20',
  fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-300 border-fuchsia-500/20',
  emerald: 'from-emerald-500/20 to-emerald-500/0 text-emerald-300 border-emerald-500/20',
  amber:   'from-amber-500/20 to-amber-500/0 text-amber-300 border-amber-500/20',
};

export function Kpi({ icon: Icon, label, value, sub, accent = 'cyan', trend }: {
  icon: typeof Package; label: string; value: string | number; sub?: string; accent?: Accent; trend?: number;
}) {
  const ring = accentRing[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4 hover:border-cyan-500/40 transition group">
      <div className={`absolute inset-0 bg-gradient-to-br ${ring.split(' ').slice(0,2).join(' ')} pointer-events-none opacity-80 group-hover:opacity-100`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
          {trend !== undefined && (
            <div className={`mt-1 text-[10px] inline-flex items-center gap-0.5 ${trend >= 0 ? 'text-emerald-300' : 'text-red-300'}`}>
              <TrendingUp className="h-3 w-3" /> {trend >= 0 ? '+' : ''}{trend}%
            </div>
          )}
        </div>
        <div className={`h-9 w-9 rounded-lg border ${ring} grid place-items-center bg-background/40`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

export function Section({ title, icon: Icon, action, children, className = '' }: {
  title: string; icon: typeof Package; action?: React.ReactNode; children: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-md border border-border bg-background/40 grid place-items-center">
            <Icon className="h-3.5 w-3.5 text-cyan-300" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function PageHeader({ eyebrow, title, subtitle, action }: {
  eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background p-5">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            {eyebrow}
            <span className="text-emerald-400 font-medium">· Live</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

function ProgressBar({ value, tone = 'cyan' }: { value: number; tone?: 'cyan' | 'fuchsia' | 'emerald' | 'amber' }) {
  const cls = {
    cyan: 'from-cyan-400 to-fuchsia-500',
    fuchsia: 'from-fuchsia-400 to-pink-500',
    emerald: 'from-emerald-400 to-cyan-400',
    amber: 'from-amber-400 to-orange-500',
  }[tone];
  return (
    <div className="h-1.5 rounded-full bg-border overflow-hidden">
      <div className={`h-full bg-gradient-to-r ${cls}`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}

/* ---------- Chart primitives (zero-dep SVG) ---------- */

function Sparkline({ data, color = '#22d3ee', fill = true, height = 60 }: { data: number[]; color?: string; fill?: boolean; height?: number }) {
  const w = 320, h = height, p = 4;
  const max = Math.max(...data, 1), min = Math.min(...data, 0);
  const x = (i: number) => p + (i / Math.max(1, data.length - 1)) * (w - 2 * p);
  const y = (v: number) => h - p - ((v - min) / Math.max(1, max - min)) * (h - 2 * p);
  const d = data.map((v, i) => `${i ? 'L' : 'M'}${x(i)},${y(v)}`).join(' ');
  const area = `${d} L${x(data.length - 1)},${h} L${x(0)},${h} Z`;
  const id = `g-${color.replace('#', '')}`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && <path d={area} fill={`url(#${id})`} />}
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BarSeries({ data, color = '#a78bfa', height = 60 }: { data: number[]; color?: string; height?: number }) {
  const w = 320, h = height, p = 2;
  const max = Math.max(...data, 1);
  const bw = (w - 2 * p) / data.length - 2;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" preserveAspectRatio="none">
      {data.map((v, i) => {
        const bh = (v / max) * (h - 2 * p);
        return <rect key={i} x={p + i * (bw + 2)} y={h - p - bh} width={bw} height={bh} rx="1" fill={color} opacity={0.4 + (v / max) * 0.6} />;
      })}
    </svg>
  );
}

function DonutChart({ slices, size = 120 }: { slices: { v: number; c: string; label: string }[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.v, 0) || 1;
  const r = size / 2 - 8, cx = size / 2, cy = size / 2, c = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="hsl(var(--border))" strokeWidth="10" />
        {slices.map((s, i) => {
          const frac = s.v / total;
          const dash = `${frac * c} ${c}`;
          const off = -acc * c;
          acc += frac;
          return <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.c} strokeWidth="10" strokeDasharray={dash} strokeDashoffset={off} strokeLinecap="butt" />;
        })}
      </svg>
      <ul className="space-y-1 text-xs">
        {slices.map(s => (
          <li key={s.label} className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full" style={{ background: s.c }} />
            <span className="text-muted-foreground">{s.label}</span>
            <span className="ml-auto text-foreground tabular-nums">{Math.round((s.v / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Heatmap({ rows = 7, cols = 24, seed = 1 }: { rows?: number; cols?: number; seed?: number }) {
  const cells = Array.from({ length: rows * cols }, (_, i) => ((Math.sin(i * 12.9898 + seed) + 1) / 2));
  return (
    <div className="grid gap-0.5" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
      {cells.map((v, i) => (
        <div key={i} className="aspect-square rounded-[2px]" style={{ background: `rgba(34,211,238,${0.08 + v * 0.7})` }} title={`${Math.round(v * 100)}%`} />
      ))}
    </div>
  );
}

function Funnel({ stages }: { stages: { label: string; value: number; color: string }[] }) {
  const max = Math.max(...stages.map(s => s.value), 1);
  return (
    <ul className="space-y-2">
      {stages.map((s, i) => {
        const w = (s.value / max) * 100;
        const conv = i ? (s.value / stages[i - 1].value) * 100 : 100;
        return (
          <li key={s.label} className="flex items-center gap-3">
            <span className="w-32 text-xs text-muted-foreground truncate">{s.label}</span>
            <div className="flex-1 h-7 rounded-md bg-background/40 border border-border relative overflow-hidden">
              <div className="absolute inset-y-0 left-0" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${s.color}66, ${s.color})` }} />
              <span className="absolute inset-0 grid place-items-center text-[11px] text-foreground tabular-nums">{s.value.toLocaleString()}</span>
            </div>
            <span className="w-12 text-right text-[10px] text-emerald-300 tabular-nums">{conv.toFixed(0)}%</span>
          </li>
        );
      })}
    </ul>
  );
}

function GeoBars({ rows }: { rows: { country: string; flag: string; pct: number; sales: number }[] }) {
  return (
    <ul className="space-y-2">
      {rows.map(r => (
        <li key={r.country} className="grid grid-cols-[1fr_auto] gap-3 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs mb-1">
              <span>{r.flag}</span>
              <span className="text-foreground">{r.country}</span>
              <span className="ml-auto text-muted-foreground tabular-nums">{r.sales}</span>
            </div>
            <ProgressBar value={r.pct} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/* ============================================================
   Shared data hooks
   ============================================================ */

function useAuthorContext() {
  const [products, setProducts] = useState<Product[]>(() => listProducts());
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pulse, setPulse] = useState(0);
  const gallery = useGallery();

  useEffect(() => {
    let alive = true;
    Promise.all([fetchAuditLogs(), fetchActivityLogs(), fetchNotifications()]).then(([a, ac, n]) => {
      if (!alive) return;
      setAudit(a); setActivity(ac); setNotifications(n);
    });
    setProducts(listProducts());
    const id = setInterval(() => setPulse(p => p + 1), 4000);
    return () => { alive = false; clearInterval(id); };
  }, []);

  return { products, audit, activity, notifications, pulse, gallery };
}

function useAnimatedCounter(target: number, ms = 1200) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
}

/* ============================================================
   #/author/dashboard — cinematic command center
   ============================================================ */

export function AuthorDashboardPage() {
  const { user } = useAuth();
  const { products, activity, pulse } = useAuthorContext();

  const totals = useMemo(() => {
    const users = products.reduce((s, p) => s + p.users, 0);
    const revenue = products.reduce((s, p) => s + p.users * (p.subscription.monthly || 5), 0);
    const avgRating = products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0;
    return { users, revenue, avgRating };
  }, [products]);

  const animRevenue = useAnimatedCounter(totals.revenue);
  const animUsers   = useAnimatedCounter(totals.users);
  const animSales   = useAnimatedCounter(Math.round(totals.users * 0.18));

  const earnSeries = useMemo(() => Array.from({ length: 28 }, (_, i) => 2200 + Math.round(900 * Math.sin(i / 3) + (i * 60))), []);
  const salesSeries = useMemo(() => Array.from({ length: 24 }, (_, i) => 40 + Math.round(35 * Math.sin(i / 2.4) + (i % 5) * 6 + pulse)), [pulse]);
  const funnel = useMemo(() => ([
    { label: 'Marketplace impressions', value: 184200, color: '#22d3ee' },
    { label: 'Product views',           value:  84200, color: '#67e8f9' },
    { label: 'Add to cart',             value:  18420, color: '#a78bfa' },
    { label: 'Checkout started',        value:   7820, color: '#d946ef' },
    { label: 'Purchases',               value:   4120, color: '#10b981' },
  ]), []);

  const geo = [
    { country: 'United States', flag: '🇺🇸', pct: 92, sales: 1840 },
    { country: 'Germany',       flag: '🇩🇪', pct: 64, sales: 1280 },
    { country: 'India',         flag: '🇮🇳', pct: 58, sales: 1160 },
    { country: 'United Kingdom',flag: '🇬🇧', pct: 49, sales:  980 },
    { country: 'Brazil',        flag: '🇧🇷', pct: 38, sales:  760 },
    { country: 'Japan',         flag: '🇯🇵', pct: 32, sales:  640 },
  ];

  const aiSuggestions = [
    { icon: Tag,         text: 'Reduce price on “Hospital ERP” by 8% — predicted +14% conversions.' },
    { icon: Search,      text: 'Add keyword “HIPAA dashboard” — 4.2k monthly searches, low competition.' },
    { icon: ImageIcon,   text: '3 products missing high-DPI screenshots — uploading could lift CTR by ~9%.' },
    { icon: GitBranch,   text: 'Ship pending v1.4 release of “Cloud Kitchen POS” to recover 220 stalled installs.' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Author command"
        title={`Welcome back, ${user?.name ?? 'author'}`}
        subtitle={`${products.length} products · realtime sync engaged · pulse #${pulse}`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/author/upload" className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-3 py-2 text-xs hover:bg-cyan-500/20">
              <Upload className="h-3.5 w-3.5" /> Upload
            </Link>
            <Link to="/author/products" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)] hover:opacity-90 transition">
              <Plus className="h-4 w-4" /> Publish new product
            </Link>
          </div>
        }
      />

      {/* Headline KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Kpi icon={DollarSign}  label="Revenue 30d"   value={`$${animRevenue.toLocaleString()}`} sub="all channels"   accent="emerald" trend={12} />
        <Kpi icon={Activity}    label="Sales 30d"     value={animSales.toLocaleString()}         sub="orders"         accent="cyan"    trend={8}  />
        <Kpi icon={Package}     label="Active"        value={products.filter(p=>p.status!=='inactive').length} sub={`${products.length} total`} accent="fuchsia" />
        <Kpi icon={Clock}       label="Pending review"value={Math.max(1, Math.round(products.length * 0.08))}  sub="avg 18h"       accent="amber" />
        <Kpi icon={AlertTriangle} label="Refunds"     value={Math.round(animSales * 0.018)}      sub="1.8% rate"      accent="amber"   trend={-3} />
        <Kpi icon={Star}        label="Avg rating"    value={totals.avgRating.toFixed(2)}        sub="catalog-wide"   accent="emerald" />
      </div>

      {/* Health scores */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Conversion rate',     value: '4.2%', tone: 'cyan'    as const, pct: 64 },
          { label: 'Customer retention',  value: '88%',  tone: 'emerald' as const, pct: 88 },
          { label: 'Product health',      value: 'A+',   tone: 'fuchsia' as const, pct: 92 },
          { label: 'SEO visibility',      value: '74',   tone: 'amber'   as const, pct: 74 },
        ].map(c => (
          <div key={c.label} className="rounded-xl border border-border bg-card/60 p-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{c.label}</span>
              <span className="text-sm font-semibold text-foreground tabular-nums">{c.value}</span>
            </div>
            <div className="mt-3"><ProgressBar value={c.pct} tone={c.tone} /></div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Earnings · 28 days" icon={TrendingUp} className="lg:col-span-2"
          action={<span className="text-[10px] text-emerald-300 inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>live</span>}>
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-2xl font-semibold text-foreground tabular-nums">${(earnSeries.reduce((s,v)=>s+v,0)).toLocaleString()}</div>
              <div className="text-[11px] text-muted-foreground">vs prev period <span className="text-emerald-300">+18.4%</span></div>
            </div>
            <div className="text-[10px] text-muted-foreground">USD</div>
          </div>
          <Sparkline data={earnSeries} color="#22d3ee" height={120} />
        </Section>
        <Section title="Realtime sales ticker" icon={Activity}>
          <div className="text-2xl font-semibold text-foreground tabular-nums">{(animSales).toLocaleString()}</div>
          <div className="text-[11px] text-emerald-300 mb-2">+{Math.max(1, pulse * 2)} in the last hour</div>
          <BarSeries data={salesSeries} color="#d946ef" height={80} />
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            {[
              { k: 'Now',  v: 12 + (pulse % 6) },
              { k: '1h',   v: 184 },
              { k: '24h',  v: 4120 },
            ].map(s => (
              <div key={s.k} className="rounded-md border border-border bg-background/40 py-1.5">
                <div className="text-sm text-foreground tabular-nums">{s.v}</div>
                <div className="text-[10px] text-muted-foreground">{s.k}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>

      {/* Funnel + Donut + Geo */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Conversion funnel" icon={Gauge} className="lg:col-span-2">
          <Funnel stages={funnel} />
        </Section>
        <Section title="Revenue mix" icon={DollarSign}>
          <DonutChart slices={[
            { v: 62, c: '#22d3ee', label: 'Subscriptions' },
            { v: 21, c: '#d946ef', label: 'One-time' },
            { v: 11, c: '#10b981', label: 'Reseller' },
            { v:  6, c: '#f59e0b', label: 'Upgrades' },
          ]} />
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Geographic heatmap · sales 24h" icon={Globe} className="lg:col-span-2">
          <Heatmap rows={7} cols={28} seed={pulse + 7} />
          <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
          </div>
        </Section>
        <Section title="Top regions" icon={Globe}>
          <GeoBars rows={geo} />
        </Section>
      </div>

      {/* Top products + AI + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Top performers" icon={TrendingUp} className="lg:col-span-2"
          action={<Link to="/author/products" className="text-[11px] text-cyan-300 hover:underline">All products →</Link>}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                  <th className="text-left py-2">Product</th>
                  <th className="text-right">Users</th>
                  <th className="text-right">Rating</th>
                  <th className="text-right">Conv.</th>
                  <th className="text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {products.slice().sort((a,b)=>b.users-a.users).slice(0,7).map((p, i) => (
                  <tr key={p.id} className="hover:bg-accent/30 transition">
                    <td className="py-2">
                      <div className="flex items-center gap-2 min-w-0">
                        {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-7 w-7 rounded object-cover"/>}
                        <div className="min-w-0">
                          <div className="text-foreground truncate">{p.name}</div>
                          <div className="text-[10px] text-muted-foreground capitalize">{p.category}</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-right tabular-nums text-foreground">{p.users.toLocaleString()}</td>
                    <td className="text-right text-amber-300 tabular-nums">⭐ {p.rating.toFixed(1)}</td>
                    <td className="text-right tabular-nums text-foreground">{(3.4 + (i % 5) * 0.4).toFixed(1)}%</td>
                    <td className="text-right">
                      <div className="inline-block w-20 h-6">
                        <Sparkline data={Array.from({length:14},(_,j)=>5+Math.round(8*Math.sin(j+i)+j))} color={i%2 ? '#a78bfa' : '#22d3ee'} fill={false} height={24} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>
        <Section title="AI recommendations" icon={Sparkles}>
          <ul className="space-y-2">
            {aiSuggestions.map((s, i) => (
              <li key={i} className="rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 p-3 hover:border-fuchsia-500/40 transition cursor-pointer">
                <div className="flex items-start gap-2">
                  <s.icon className="h-3.5 w-3.5 mt-0.5 text-fuchsia-300 shrink-0"/>
                  <p className="text-xs text-foreground leading-relaxed">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Reviews + Support + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Recent reviews" icon={Star}>
          <ul className="space-y-3">
            {products.slice(0, 4).map((p, i) => (
              <li key={p.id} className="rounded-md border border-border bg-background/40 p-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground truncate">{p.name}</span>
                  <span className="text-amber-300">{'★'.repeat(5-(i%2))}</span>
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground line-clamp-2">“Worked exactly as expected — saved us hundreds of hours integrating.”</p>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Support inbox" icon={LifeBuoy}>
          <ul className="space-y-2">
            {[
              { p: 'high',   t: 'Activation key not accepted', m: 'EU customer · 3m ago' },
              { p: 'normal', t: 'Refund request — duplicate purchase', m: '14m ago' },
              { p: 'low',    t: 'Feature request: SSO via Okta', m: '1h ago' },
              { p: 'normal', t: 'Upgrade billing question', m: '2h ago' },
            ].map((t, i) => (
              <li key={i} className="flex items-start gap-2 rounded-md border border-border bg-background/40 px-2.5 py-2">
                <span className={`mt-1 h-1.5 w-1.5 rounded-full ${t.p==='high'?'bg-red-400':t.p==='normal'?'bg-amber-400':'bg-emerald-400'}`} />
                <div className="min-w-0">
                  <div className="text-xs text-foreground truncate">{t.t}</div>
                  <div className="text-[10px] text-muted-foreground">{t.m}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Activity stream" icon={Activity}>
          <ul className="space-y-2 max-h-72 overflow-auto pr-1">
            {(activity.length ? activity : Array.from({length:6},(_,i)=>({id:String(i), activity: ['New 5-star review','Sale completed','Deployment promoted','AI scan passed','Refund processed','New follower'][i], timestamp: new Date(Date.now()-i*3.6e6).toISOString()}))).slice(0, 10).map((a:any) => (
              <li key={a.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-foreground truncate">{a.activity}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   Products
   ============================================================ */

export function AuthorProductsPage() {
  const { products } = useAuthorContext();
  const [tab, setTab] = useState<'all'|'published'|'draft'|'rejected'>('all');
  const [q, setQ] = useState('');

  const filtered = useMemo(() => products.filter(p => {
    if (tab === 'published' && p.status !== 'active') return false;
    if (tab === 'draft' && p.status !== 'inactive') return false;
    if (tab === 'rejected' && p.status !== 'maintenance') return false;
    return !q || p.name.toLowerCase().includes(q.toLowerCase());
  }), [products, tab, q]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Portfolio" title="Your products" subtitle={`${products.length} assets across the catalog`}
        action={
          <div className="flex items-center gap-2">
            <Link to="/admin/products" className="text-xs text-cyan-300 hover:underline">Operations Center →</Link>
            <Link to="/author/upload" className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white">
              <Upload className="h-3.5 w-3.5"/> New upload
            </Link>
          </div>
        }
      />
      <div className="flex flex-wrap items-center gap-2 justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card/60 p-1">
          {([
            ['all','All'],['published','Published'],['draft','Draft'],['rejected','Rejected'],
          ] as const).map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`px-3 py-1 text-xs rounded-md ${tab===k ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-foreground border border-cyan-500/30':'text-muted-foreground hover:text-foreground'}`}>
              {label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-md border border-border bg-card/60 px-2 py-1.5 w-72 max-w-full">
          <Search className="h-3.5 w-3.5 text-muted-foreground" />
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search products…" className="bg-transparent outline-none text-xs flex-1 text-foreground placeholder:text-muted-foreground" />
        </div>
      </div>

      <Section title="Catalog" icon={Package}
        action={<div className="flex items-center gap-2 text-[10px] text-muted-foreground"><button className="px-2 py-1 rounded border border-border hover:bg-accent">Bulk export</button><button className="px-2 py-1 rounded border border-border hover:bg-accent">Bulk archive</button></div>}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map(p => (
            <div key={p.id} className="group rounded-lg border border-border bg-background/40 overflow-hidden hover:border-cyan-500/40 hover:shadow-[0_0_24px_-12px_rgba(34,211,238,0.6)] transition">
              <div className="relative">
                {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-28 w-full object-cover" />}
                <span className="absolute top-2 left-2 text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-cyan-300">v1.4.0</span>
                <span className={`absolute top-2 right-2 text-[9px] uppercase px-1.5 py-0.5 rounded ${p.status==='active'?'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30':'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>{p.status}</span>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                  <div className="text-[11px] text-muted-foreground capitalize">{p.category}</div>
                </div>
                <div className="grid grid-cols-4 gap-1 text-[10px] text-center">
                  <div className="rounded bg-background/60 border border-border py-1"><div className="text-foreground tabular-nums">{p.users.toLocaleString()}</div><div className="text-muted-foreground">users</div></div>
                  <div className="rounded bg-background/60 border border-border py-1"><div className="text-foreground tabular-nums">${(p.subscription.monthly * Math.max(1, Math.round(p.users * 0.08))).toLocaleString()}</div><div className="text-muted-foreground">rev</div></div>
                  <div className="rounded bg-background/60 border border-border py-1"><div className="text-foreground tabular-nums">{(3.4+(p.users%5)*0.3).toFixed(1)}%</div><div className="text-muted-foreground">conv</div></div>
                  <div className="rounded bg-background/60 border border-border py-1"><div className="text-amber-300 tabular-nums">{p.rating.toFixed(1)}</div><div className="text-muted-foreground">rating</div></div>
                </div>
                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 className="h-3 w-3"/> healthy</span>
                  <span className="text-fuchsia-300">update available</span>
                </div>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-xs text-muted-foreground col-span-full text-center py-6">No products match.</p>}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   Upload Center
   ============================================================ */

export function AuthorUploadCenterPage() {
  const [drag, setDrag] = useState(false);
  const [stage, setStage] = useState<'idle'|'uploading'|'validating'|'ready'>('idle');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (stage !== 'uploading') return;
    const id = setInterval(() => setProgress(p => {
      if (p >= 100) { clearInterval(id); setStage('validating'); setTimeout(() => setStage('ready'), 1400); return 100; }
      return p + 6;
    }), 140);
    return () => clearInterval(id);
  }, [stage]);

  const startMock = () => { setProgress(0); setStage('uploading'); };

  const checks = [
    { label: 'Package structure',  ok: true,  detail: 'manifest.json found · valid' },
    { label: 'Malware scan',       ok: true,  detail: 'no signatures matched' },
    { label: 'Dependency audit',   ok: true,  detail: '0 critical · 1 medium' },
    { label: 'License headers',    ok: stage==='ready', detail: 'MIT detected on 142 files' },
    { label: 'Bundle size',        ok: true,  detail: '4.8 MB · under 25 MB limit' },
  ];

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Upload" title="Upload Center" subtitle="Drag, validate, AI-enrich and publish to the marketplace" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Package upload" icon={Upload} className="lg:col-span-2">
          <div
            onDragEnter={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDragOver={e=>e.preventDefault()}
            onDrop={e=>{e.preventDefault();setDrag(false);startMock();}}
            className={`rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-cyan-400 bg-cyan-500/5':'border-border bg-background/40 hover:border-cyan-500/40'}`}
          >
            <div className="mx-auto h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 grid place-items-center mb-3">
              <Upload className="h-6 w-6 text-cyan-300" />
            </div>
            <p className="text-sm text-foreground">Drop your <strong>.zip</strong> package or <button onClick={startMock} className="text-cyan-300 hover:underline">browse</button></p>
            <p className="text-[11px] text-muted-foreground mt-1">Source code · binaries · documentation · screenshots</p>
          </div>

          {stage !== 'idle' && (
            <div className="mt-4 space-y-3">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-foreground">hospital-erp-v1.4.2.zip</span>
                  <span className="text-muted-foreground tabular-nums">{progress}%</span>
                </div>
                <ProgressBar value={progress} tone="cyan" />
                <div className="mt-1 text-[10px] text-muted-foreground">
                  {stage==='uploading' && 'Uploading to secure vault…'}
                  {stage==='validating' && 'Validating package · scanning for malware · auditing deps…'}
                  {stage==='ready' && <span className="text-emerald-300">Package ready · all checks passed</span>}
                </div>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {checks.map(c => (
                  <li key={c.label} className="flex items-center gap-2 text-xs rounded-md border border-border bg-background/40 px-2.5 py-1.5">
                    {c.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <Clock className="h-3.5 w-3.5 text-amber-300 animate-spin" />}
                    <div className="min-w-0">
                      <div className="text-foreground">{c.label}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{c.detail}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>

        <Section title="Readiness score" icon={Gauge}>
          <div className="text-center">
            <div className="mx-auto relative h-28 w-28">
              <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--border))" strokeWidth="2.5"/>
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="#22d3ee" strokeWidth="2.5" strokeDasharray={`${stage==='ready'?94:72} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 grid place-items-center">
                <div>
                  <div className="text-2xl font-semibold text-foreground tabular-nums">{stage==='ready'?94:72}</div>
                  <div className="text-[9px] uppercase tracking-wider text-muted-foreground">score</div>
                </div>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">Marketplace compliance: <span className="text-emerald-300">passes minimum bar</span></p>
          </div>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Product details" icon={FileText}>
          <div className="space-y-3 text-sm">
            <Field label="Title" placeholder="Enterprise Hospital ERP" />
            <Field label="Short description" placeholder="HIPAA-ready clinical management for 50–500 bed facilities" />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Category" placeholder="Healthcare" />
              <Field label="Subcategory" placeholder="EMR & EHR" />
            </div>
            <Field label="Demo URL" placeholder="https://demo.example.com" />
            <Field label="Documentation URL" placeholder="https://docs.example.com" />
            <div className="grid grid-cols-3 gap-3">
              <Field label="Price ($)" placeholder="89" />
              <Field label="Monthly ($)" placeholder="29" />
              <Field label="License" placeholder="Regular / Extended" />
            </div>
          </div>
        </Section>

        <Section title="AI assistant" icon={Sparkles}>
          <ul className="space-y-2">
            {[
              { icon: Tag,    title: 'AI SEO generator',   note: 'Generates title, keywords, meta from package.' },
              { icon: FileText, title: 'AI description helper', note: 'Rewrites description for clarity + SEO.' },
              { icon: Search, title: 'AI keyword optimizer', note: 'Suggests 12 keywords with monthly volume.' },
              { icon: ImageIcon, title: 'AI screenshot enhancer', note: 'Auto-cleans & captions screenshots.' },
            ].map(i => (
              <li key={i.title} className="flex items-center gap-3 rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 px-3 py-2 hover:border-fuchsia-500/40 cursor-pointer">
                <i.icon className="h-4 w-4 text-fuchsia-300"/>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-foreground">{i.title}</div>
                  <div className="text-[10px] text-muted-foreground">{i.note}</div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/10">Run</button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Compatibility & assets" icon={Layers}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {[
            { icon: Code2, label: 'Frameworks', items: ['React','Vue','Laravel','Node.js'] },
            { icon: Monitor, label: 'Browsers', items: ['Chrome','Safari','Firefox','Edge'] },
            { icon: Smartphone, label: 'Devices', items: ['Desktop','Tablet','Mobile'] },
            { icon: FileCode, label: 'Languages', items: ['TypeScript','PHP','Python'] },
          ].map(g => (
            <div key={g.label} className="rounded-lg border border-border bg-background/40 p-3">
              <div className="flex items-center gap-2 mb-2 text-foreground"><g.icon className="h-3.5 w-3.5 text-cyan-300"/>{g.label}</div>
              <div className="flex flex-wrap gap-1.5">
                {g.items.map(t => <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-background/60 border border-border text-muted-foreground">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Upload logs" icon={FileText}>
        <pre className="text-[11px] text-muted-foreground bg-background/40 rounded-md p-3 max-h-48 overflow-auto leading-relaxed">
{`[12:04:11] connect · vault-edge-us1
[12:04:12] tls 1.3 handshake · 38ms
[12:04:12] chunk 1/16 · 256kb
[12:04:14] chunk 16/16 · sha256 verified
[12:04:14] malware scan · clamav-3 · 0 signatures
[12:04:15] deps · 0 critical · 1 medium (lodash@4.17.20 → 4.17.21)
[12:04:16] license · MIT detected
[12:04:16] manifest · valid
[12:04:17] ai-seo · ready
[12:04:17] readiness · 94/100 — publishable`}
        </pre>
      </Section>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      <input placeholder={placeholder} className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/40 outline-none"/>
    </label>
  );
}

/* ============================================================
   Product Updates / Changelog
   ============================================================ */

export function AuthorProductUpdatesPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Versioning" title="Product Updates" subtitle="Semantic versions, changelogs and adoption analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={GitBranch} label="Pending releases" value={3} sub="awaiting review" accent="amber" />
        <Kpi icon={Rocket}    label="Shipped /30d"    value={14} sub="3 hotfixes" accent="cyan" />
        <Kpi icon={Activity}  label="Adoption rate"   value="74%" sub="installs on latest" accent="emerald" trend={6} />
        <Kpi icon={AlertTriangle} label="Deprecated"  value={2} sub="EOL within 30d" accent="fuchsia" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Version timeline" icon={GitBranch} className="lg:col-span-2">
          <ol className="relative border-l border-border pl-5 space-y-4">
            {[
              { v: 'v1.4.2', tag: 'patch',  date: 'today',     notes: 'Fix HL7 message parsing on Windows', tone: 'emerald' as const },
              { v: 'v1.4.0', tag: 'minor',  date: '4 days ago', notes: 'New billing module · 32 endpoints added', tone: 'cyan' as const },
              { v: 'v1.3.5', tag: 'patch',  date: '11 days ago',notes: 'Security patch · OpenSSL 3.0.13', tone: 'amber' as const },
              { v: 'v1.3.0', tag: 'minor',  date: '3 weeks ago',notes: 'Telemedicine integration GA', tone: 'fuchsia' as const },
              { v: 'v1.0.0', tag: 'major',  date: '4 months ago', notes: 'Initial GA release', tone: 'cyan' as const },
            ].map(r => (
              <li key={r.v} className="text-sm">
                <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-background" />
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium">{r.v}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${r.tone==='emerald'?'border-emerald-500/30 text-emerald-300':r.tone==='amber'?'border-amber-500/30 text-amber-300':r.tone==='fuchsia'?'border-fuchsia-500/30 text-fuchsia-300':'border-cyan-500/30 text-cyan-300'}`}>{r.tag}</span>
                  <span className="text-[10px] text-muted-foreground">{r.date}</span>
                </div>
                <p className="text-xs text-muted-foreground">{r.notes}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Schedule release" icon={Clock}>
          <div className="space-y-3 text-sm">
            <Field label="Version" placeholder="1.4.3" />
            <Field label="Channel" placeholder="stable / beta / alpha" />
            <Field label="Rollout %" placeholder="25" />
            <label className="block">
              <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Release notes</span>
              <textarea rows={4} placeholder="What's new in this version…" className="w-full rounded-md border border-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-cyan-500/40 outline-none" />
            </label>
            <div className="flex items-center gap-2">
              <button className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-2 text-xs font-medium text-white">
                <Rocket className="h-3.5 w-3.5"/> Schedule
              </button>
              <button className="px-3 py-2 text-xs rounded-md border border-amber-500/30 bg-amber-500/5 text-amber-300 inline-flex items-center gap-1.5">
                <RefreshCw className="h-3.5 w-3.5"/> Rollback
              </button>
            </div>
          </div>
        </Section>
      </div>

      <Section title="Update adoption" icon={TrendingUp}>
        <Sparkline data={[10, 25, 38, 49, 58, 64, 70, 74, 76, 78, 80, 82, 84]} color="#10b981" height={100}/>
        <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
          {products.slice(0,3).map((p,i) => (
            <div key={p.id} className="rounded-md border border-border bg-background/40 py-2">
              <div className="text-foreground truncate">{p.name}</div>
              <div className="text-cyan-300 tabular-nums">{74 - i*8}%</div>
              <div className="text-[10px] text-muted-foreground">on v1.4.x</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   Releases (existing kept, simplified)
   ============================================================ */

export function AuthorReleasesPage() {
  const { products } = useAuthorContext();
  const channels = [
    { name: 'Alpha',  count: Math.max(1, Math.round(products.length * 0.15)), tone: 'amber'   as const },
    { name: 'Beta',   count: Math.max(1, Math.round(products.length * 0.30)), tone: 'fuchsia' as const },
    { name: 'Stable', count: products.length,                                  tone: 'emerald' as const },
  ];
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Release management" title="Releases" subtitle="Version, stage and ship your products" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {channels.map(c => (<Kpi key={c.name} icon={GitBranch} label={`${c.name} channel`} value={c.count} sub="rollout window 24h" accent={c.tone} />))}
      </div>
      <Section title="Pending releases" icon={Rocket}>
        <ul className="divide-y divide-border text-sm">
          {products.slice(0, 8).map((p, i) => (
            <li key={p.id} className="py-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-foreground truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">v1.{i+2}.0 · staged · {p.users} testers</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[11px] text-emerald-300 inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> AI passed</span>
                <button className="text-xs px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20">Promote</button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   Sales Analytics + Revenue Insights
   ============================================================ */

export function AuthorSalesAnalyticsPage() {
  const { products } = useAuthorContext();
  const totals = useMemo(() => ({
    daily:   products.length * 12,
    monthly: products.length * 320,
    yearly:  products.length * 3800,
    refund:  products.length * 6,
  }), [products]);

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Sales analytics" title="Sales Analytics" subtitle="Daily, monthly, yearly performance" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Activity}     label="Daily sales"   value={totals.daily}   accent="cyan"    trend={6}/>
        <Kpi icon={BarChart2}    label="Monthly sales" value={totals.monthly} accent="fuchsia" trend={11}/>
        <Kpi icon={TrendingUp}   label="Yearly sales"  value={totals.yearly}  accent="emerald" trend={28}/>
        <Kpi icon={AlertTriangle}label="Refunds"       value={totals.refund}  accent="amber" trend={-3}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Daily volume · 30d" icon={BarChart2} className="lg:col-span-2">
          <BarSeries data={Array.from({length: 30}, (_, i) => 18 + Math.round(14*Math.sin(i/2) + (i%6)*4))} color="#22d3ee" height={140}/>
        </Section>
        <Section title="Traffic acquisition" icon={Globe}>
          <DonutChart slices={[
            { v: 48, c: '#22d3ee', label: 'Organic search' },
            { v: 22, c: '#d946ef', label: 'Direct' },
            { v: 16, c: '#10b981', label: 'Marketplace' },
            { v: 14, c: '#f59e0b', label: 'Referral' },
          ]}/>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Conversion funnel" icon={Gauge} className="lg:col-span-2">
          <Funnel stages={[
            { label: 'Page views',     value: 84200, color: '#22d3ee' },
            { label: 'Demo clicks',    value: 24800, color: '#67e8f9' },
            { label: 'Cart adds',      value:  9420, color: '#a78bfa' },
            { label: 'Checkouts',      value:  4820, color: '#d946ef' },
            { label: 'Paid',           value:  3120, color: '#10b981' },
          ]}/>
        </Section>
        <Section title="Device split" icon={Smartphone}>
          <DonutChart slices={[
            { v: 62, c: '#22d3ee', label: 'Desktop' },
            { v: 28, c: '#d946ef', label: 'Mobile' },
            { v: 10, c: '#f59e0b', label: 'Tablet' },
          ]}/>
        </Section>
      </div>

      <Section title="Marketplace ranking" icon={BadgeCheck}>
        <ul className="space-y-2 text-sm">
          {products.slice(0, 8).map((p, i) => (
            <li key={p.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-muted-foreground w-6 tabular-nums">#{i+1}</span>
                <span className="text-foreground truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="text-emerald-300">↑ {2 + (i % 4)}</span>
                <span className="text-muted-foreground">score {92 - i * 2}</span>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorRevenueInsightsPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Revenue insights" title="Revenue Insights" subtitle="AI-powered revenue forecasting and segmentation" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={DollarSign} label="MRR"        value="$48,240" accent="emerald" trend={14}/>
        <Kpi icon={TrendingUp} label="ARR"        value="$578k"   accent="cyan"    trend={22}/>
        <Kpi icon={Users}      label="ARPU"       value="$34"     accent="fuchsia" trend={4}/>
        <Kpi icon={AlertTriangle} label="Churn"   value="2.1%"    accent="amber"   trend={-1}/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Revenue forecast · 90d" icon={TrendingUp} className="lg:col-span-2">
          <Sparkline data={Array.from({length:90},(_,i)=>1400 + i*22 + Math.round(300*Math.sin(i/6)))} color="#10b981" height={140}/>
          <p className="mt-2 text-[11px] text-muted-foreground">AI forecast confidence <span className="text-emerald-300">87%</span> · trend <span className="text-emerald-300">accelerating</span></p>
        </Section>
        <Section title="Customer segments" icon={Users}>
          <DonutChart slices={[
            { v: 52, c: '#22d3ee', label: 'SMB' },
            { v: 28, c: '#d946ef', label: 'Mid-market' },
            { v: 14, c: '#10b981', label: 'Enterprise' },
            { v:  6, c: '#f59e0b', label: 'Self-serve' },
          ]}/>
        </Section>
      </div>

      <Section title="Top revenue products" icon={DollarSign}>
        <BarSeries data={[8200, 6400, 5800, 4900, 3700, 3100, 2800, 2200, 1900, 1400]} color="#d946ef" height={120}/>
      </Section>
    </div>
  );
}

/* ============================================================
   Existing simpler analytics (kept as alias)
   ============================================================ */

export function AuthorAnalyticsPage() { return <AuthorSalesAnalyticsPage/>; }

/* ============================================================
   Revenue / Earnings
   ============================================================ */

export function AuthorRevenuePage() {
  const { products } = useAuthorContext();
  const subRev = products.reduce((s, p) => s + p.subscription.monthly * Math.max(1, Math.round(p.users * 0.08)), 0);
  const resRev = Math.round(subRev * 0.18);
  const refunds = Math.round(subRev * 0.02);
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Revenue" title="Earnings" subtitle="Subscription, reseller and refund analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={DollarSign}    label="Subscription MRR" value={`$${subRev.toLocaleString()}`} sub="monthly"     accent="emerald"/>
        <Kpi icon={Users}         label="Reseller share"   value={`$${resRev.toLocaleString()}`} sub="18% of MRR"  accent="fuchsia"/>
        <Kpi icon={Wallet}        label="Pending payout"   value={`$${Math.round(subRev * 0.4).toLocaleString()}`} sub="next cycle" accent="cyan"/>
        <Kpi icon={AlertTriangle} label="Refunds"          value={`$${refunds.toLocaleString()}`} sub="2% of MRR" accent="amber"/>
      </div>
      <Section title="Revenue by product" icon={BarChart2}>
        <ul className="divide-y divide-border text-sm">
          {products.slice().sort((a, b) => b.users - a.users).slice(0, 10).map(p => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <span className="text-foreground truncate">{p.name}</span>
              <span className="text-emerald-300 tabular-nums">${(p.subscription.monthly * Math.max(1, Math.round(p.users * 0.08))).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   Payouts + Tax Invoices
   ============================================================ */

export function AuthorPayoutsPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Finance" title="Payouts" subtitle="Pending, history and methods" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Wallet}       label="Available"      value="$12,840" sub="ready to withdraw" accent="cyan"/>
        <Kpi icon={Clock}        label="Pending"        value="$3,420"  sub="clearing 48h"      accent="amber"/>
        <Kpi icon={CheckCircle2} label="Paid /YTD"      value="$184,200" sub="22 transfers"     accent="emerald"/>
        <Kpi icon={Receipt}      label="Fees /YTD"      value="$4,210"  sub="2.3% blended"      accent="fuchsia"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Payout timeline" icon={Wallet} className="lg:col-span-2">
          <ol className="relative border-l border-border pl-5 space-y-3 text-sm">
            {Array.from({ length: 6 }).map((_, i) => {
              const status = i===0?'queued':i===1?'processing':'paid';
              return (
                <li key={i}>
                  <span className={`absolute -left-1.5 h-3 w-3 rounded-full ring-2 ring-background ${status==='paid'?'bg-emerald-400':status==='processing'?'bg-amber-400':'bg-cyan-400'}`} />
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-foreground">ACH-{82940 + i}</div>
                      <div className="text-[10px] text-muted-foreground">{new Date(Date.now() - i*14*86400000).toLocaleDateString()} · Bank •••• 4421</div>
                    </div>
                    <div className="text-right">
                      <div className="text-emerald-300 tabular-nums">${(8200 + i*740).toLocaleString()}</div>
                      <div className={`text-[10px] uppercase tracking-wider ${status==='paid'?'text-emerald-300':status==='processing'?'text-amber-300':'text-cyan-300'}`}>{status}</div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </Section>
        <Section title="Withdrawal methods" icon={Wallet}>
          <ul className="space-y-2 text-sm">
            {[
              { name: 'Bank ACH',     detail: '•••• 4421 · Chase · default', tone: 'cyan' },
              { name: 'PayPal',       detail: 'author@studio.com', tone: 'fuchsia' },
              { name: 'Wire (SWIFT)', detail: 'manual · min $500', tone: 'amber' },
              { name: 'USDC',         detail: '0x9f3…b2a · Polygon', tone: 'emerald' },
            ].map(m => (
              <li key={m.name} className="rounded-md border border-border bg-background/40 px-3 py-2 flex items-center justify-between">
                <div>
                  <div className="text-foreground">{m.name}</div>
                  <div className="text-[10px] text-muted-foreground">{m.detail}</div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent">Edit</button>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

export function AuthorTaxInvoicesPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Taxes" title="Tax Invoices" subtitle="Statements, fee breakdowns and deductions" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Receipt} label="Invoices /YTD" value={22} accent="cyan"/>
        <Kpi icon={DollarSign} label="Gross /YTD" value="$184,200" accent="emerald"/>
        <Kpi icon={FileText} label="Marketplace fee" value="$22,104" sub="12% blended" accent="fuchsia"/>
        <Kpi icon={AlertTriangle} label="Withholding" value="$5,210" sub="W-9 on file" accent="amber"/>
      </div>
      <Section title="Invoice ledger" icon={Receipt}
        action={<button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent">Export CSV</button>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left py-2">Invoice</th>
                <th className="text-left">Period</th>
                <th className="text-right">Gross</th>
                <th className="text-right">Fee</th>
                <th className="text-right">Net</th>
                <th className="text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({length: 8}).map((_, i) => (
                <tr key={i}>
                  <td className="py-2 text-foreground">INV-2026-{(120 - i).toString().padStart(4, '0')}</td>
                  <td className="text-muted-foreground">2026 · W{20 - i}</td>
                  <td className="text-right tabular-nums text-foreground">${(8200 + i*420).toLocaleString()}</td>
                  <td className="text-right tabular-nums text-amber-300">-${Math.round((8200 + i*420) * 0.12).toLocaleString()}</td>
                  <td className="text-right tabular-nums text-emerald-300">${Math.round((8200 + i*420) * 0.88).toLocaleString()}</td>
                  <td className="text-right text-[11px]">
                    <span className="px-2 py-0.5 rounded border border-emerald-500/30 bg-emerald-500/5 text-emerald-300">paid</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   Reviews / Comments / Support
   ============================================================ */

export function AuthorReviewsPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Reputation" title="Reviews & Ratings" subtitle="Moderate, reply and analyze sentiment" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Star} label="Avg rating" value="4.7" sub={`${products.reduce((s,p)=>s+p.reviews,0).toLocaleString()} reviews`} accent="amber"/>
        <Kpi icon={MessageSquare} label="Awaiting reply" value={6} accent="fuchsia"/>
        <Kpi icon={CheckCircle2} label="Verified" value="92%" accent="emerald"/>
        <Kpi icon={AlertTriangle} label="Disputes" value={2} accent="amber"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Sentiment breakdown" icon={Activity}>
          <DonutChart slices={[
            { v: 72, c: '#10b981', label: 'Positive' },
            { v: 20, c: '#f59e0b', label: 'Neutral' },
            { v:  8, c: '#ef4444', label: 'Negative' },
          ]}/>
        </Section>
        <Section title="Rating distribution" icon={Star} className="lg:col-span-2">
          <ul className="space-y-2 text-xs">
            {[{r:5,p:74},{r:4,p:18},{r:3,p:5},{r:2,p:2},{r:1,p:1}].map(b => (
              <li key={b.r} className="flex items-center gap-3">
                <span className="w-10 text-amber-300">{'★'.repeat(b.r)}</span>
                <div className="flex-1"><ProgressBar value={b.p} tone={b.r>=4?'emerald':b.r===3?'amber':'fuchsia'}/></div>
                <span className="w-10 text-right text-muted-foreground tabular-nums">{b.p}%</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Recent reviews" icon={Star}>
        <ul className="divide-y divide-border text-sm">
          {products.slice(0, 8).map((p, i) => (
            <li key={p.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-foreground truncate">{p.name}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded border border-emerald-500/30 text-emerald-300 inline-flex items-center gap-1"><CheckCircle2 className="h-2.5 w-2.5"/> verified</span>
                </div>
                <div className="text-amber-300 text-xs mb-1">{'★'.repeat(5-(i%2))}</div>
                <p className="text-[11px] text-muted-foreground line-clamp-2">“Saved our team three months of integration work — best ERP we've used.”</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button className="text-xs px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/> AI reply</button>
                <button className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-accent text-muted-foreground">Respond</button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorCommentsPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Engagement" title="Comments & Support" subtitle="Pre-sales questions, public comments and replies" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={MessageSquare} label="Open" value={14} accent="cyan"/>
        <Kpi icon={CheckCircle2}  label="Resolved /7d" value={42} accent="emerald"/>
        <Kpi icon={AlertTriangle} label="Spam blocked" value={28} accent="amber"/>
        <Kpi icon={Sparkles}      label="AI drafts" value={9} accent="fuchsia"/>
      </div>

      <Section title="Conversations" icon={MessageSquare}>
        <ul className="divide-y divide-border text-sm">
          {[
            { who: 'Sarah K.', t: 'Does this support multi-tenant Postgres?', p: 'pre-sales', tone: 'cyan' },
            { who: 'Diego M.', t: 'Can I get a 14-day extended trial?', p: 'pre-sales', tone: 'cyan' },
            { who: 'Aiko T.',  t: 'Refund please — bought wrong tier.', p: 'support', tone: 'amber' },
            { who: 'Liam R.',  t: 'Loving v1.4 — any chance of dark mode?', p: 'feedback', tone: 'fuchsia' },
            { who: 'Mei L.',   t: 'Spam: visit my link', p: 'spam', tone: 'red' },
          ].map((c, i) => (
            <li key={i} className="py-3 flex items-start gap-3">
              <span className="h-7 w-7 grid place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-[10px] font-semibold text-white shrink-0">{c.who.slice(0,1)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-foreground">{c.who}</span>
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded border ${c.tone==='red'?'border-red-500/30 text-red-300':c.tone==='amber'?'border-amber-500/30 text-amber-300':c.tone==='fuchsia'?'border-fuchsia-500/30 text-fuchsia-300':'border-cyan-500/30 text-cyan-300'}`}>{c.p}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{i*3+1}m</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5">{c.t}</p>
              </div>
              <div className="flex flex-col gap-1 shrink-0">
                <button className="text-[10px] px-2 py-1 rounded border border-cyan-500/30 text-cyan-300 inline-flex items-center gap-1"><Sparkles className="h-2.5 w-2.5"/> AI</button>
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Reply</button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorSupportPage() {
  const { notifications } = useAuthorContext();
  const open = notifications.length ? notifications.slice(0, 6) : Array.from({length: 5}).map((_, i) => ({ id: String(i), message: ['Activation key not accepted','Refund request - duplicate purchase','SSO via Okta','Upgrade billing question','Stuck during onboarding'][i], created_at: new Date(Date.now()-i*3.6e6).toISOString() }));
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Customer success" title="Support Tickets" subtitle="Inbox, SLAs and AI-assisted replies" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={LifeBuoy}     label="Open tickets" value={open.length} sub="awaiting reply" accent="amber"/>
        <Kpi icon={Clock}        label="First-reply SLA" value="2h 18m" sub="target <4h" accent="cyan"/>
        <Kpi icon={Sparkles}     label="AI drafts ready" value={Math.floor(open.length * 0.8)} accent="fuchsia"/>
        <Kpi icon={CheckCircle2} label="Resolved /7d" value="48" sub="92% CSAT" accent="emerald"/>
      </div>
      <Section title="Inbox" icon={LifeBuoy}>
        <ul className="divide-y divide-border text-sm">
          {open.map((n:any, i) => (
            <li key={n.id} className="py-2.5 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[9px] uppercase px-1.5 py-0.5 rounded ${i%3===0?'bg-red-500/10 text-red-300 border border-red-500/30':i%3===1?'bg-amber-500/10 text-amber-300 border border-amber-500/30':'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'}`}>
                    {i%3===0?'high':i%3===1?'normal':'low'}
                  </span>
                  <span className="text-[10px] text-muted-foreground">SLA {2+i}h</span>
                  {i%2===0 && <span className="text-[10px] text-cyan-300">📎 attachment</span>}
                </div>
                <div className="text-foreground truncate">{n.message}</div>
                <div className="text-[10px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {['Thanks!','Resolved','Need more info'].map(c => (
                  <button key={c} className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground hidden md:inline">{c}</button>
                ))}
                <button className="text-xs px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 inline-flex items-center gap-1"><Sparkles className="h-3 w-3"/> AI reply</button>
              </div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   Licenses + Customers
   ============================================================ */

export function AuthorLicensesPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Licensing" title="Licenses" subtitle="Active keys, activations and domains" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={KeyRound}     label="Regular"      value={Math.round(products.reduce((s,p)=>s+p.users*0.7,0)).toLocaleString()} accent="cyan"/>
        <Kpi icon={KeyRound}     label="Extended"     value={Math.round(products.reduce((s,p)=>s+p.users*0.25,0)).toLocaleString()} accent="fuchsia"/>
        <Kpi icon={ShieldCheck}  label="Enterprise"   value={Math.round(products.reduce((s,p)=>s+p.users*0.05,0)).toLocaleString()} accent="emerald"/>
        <Kpi icon={AlertTriangle}label="Expired /30d" value={42} accent="amber"/>
      </div>

      <Section title="License keys" icon={KeyRound}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Array.from({length:6}).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-background/40 p-3 hover:border-cyan-500/30 transition">
              <div className="flex items-center justify-between text-xs">
                <span className={`px-2 py-0.5 rounded ${i%3===0?'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30':i%3===1?'bg-amber-500/10 text-amber-300 border border-amber-500/30':'bg-red-500/10 text-red-300 border border-red-500/30'}`}>
                  {i%3===0?'active':i%3===1?'expiring':'blocked'}
                </span>
                <span className="text-muted-foreground">{2+i}/5 activations</span>
              </div>
              <div className="mt-2 font-mono text-sm text-cyan-300 tracking-wider">LIC-{(8200+i).toString(36).toUpperCase()}-XK4{i}9</div>
              <div className="mt-1 text-[10px] text-muted-foreground">customer{i}@enterprise.com · domain.app{i}.com</div>
              <div className="mt-2 flex items-center gap-1.5">
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Renew</button>
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Revoke</button>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

export function AuthorCustomersPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Customers" title="Customers" subtitle="Purchase history and health scores" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Users}        label="Total customers" value={products.reduce((s,p)=>s+p.users,0).toLocaleString()} accent="cyan"/>
        <Kpi icon={TrendingUp}   label="New /30d"        value={1284} accent="emerald" trend={9}/>
        <Kpi icon={Heart}        label="Retention"       value="88%" accent="fuchsia"/>
        <Kpi icon={AlertTriangle}label="At risk"         value={62} accent="amber"/>
      </div>
      <Section title="Customer directory" icon={Users}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border">
                <th className="text-left py-2">Customer</th>
                <th className="text-left">Products</th>
                <th className="text-right">Spent</th>
                <th className="text-right">Health</th>
                <th className="text-right">Last seen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {Array.from({length: 8}).map((_, i) => {
                const score = 92 - i*6;
                return (
                  <tr key={i} className="hover:bg-accent/30">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <span className="h-7 w-7 grid place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-[10px] font-semibold text-white">{String.fromCharCode(65+i)}</span>
                        <div>
                          <div className="text-foreground">{['Acme Corp','Globex','Initech','Umbrella','Cyberdyne','Hooli','Vandelay','Stark'][i]}</div>
                          <div className="text-[10px] text-muted-foreground">user{i}@enterprise.com</div>
                        </div>
                      </div>
                    </td>
                    <td className="text-muted-foreground">{1 + (i%3)}</td>
                    <td className="text-right tabular-nums text-emerald-300">${(820 + i*340).toLocaleString()}</td>
                    <td className="text-right"><span className={`tabular-nums ${score>80?'text-emerald-300':score>60?'text-amber-300':'text-red-300'}`}>{score}</span></td>
                    <td className="text-right text-[11px] text-muted-foreground">{i+1}d ago</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   Followers
   ============================================================ */

export function AuthorFollowersPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Audience" title="Followers" subtitle="Growth and audience analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Users}      label="Followers"    value="12,840" accent="cyan" trend={14}/>
        <Kpi icon={TrendingUp} label="New /30d"     value="+1,284" accent="emerald" trend={22}/>
        <Kpi icon={Eye}        label="Profile views"value="48,210" accent="fuchsia"/>
        <Kpi icon={Heart}      label="Engagement"   value="6.4%"   accent="amber"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Growth · 30 days" icon={TrendingUp} className="lg:col-span-2">
          <Sparkline data={Array.from({length:30},(_,i)=>10000+i*94+Math.round(60*Math.sin(i/2)))} color="#22d3ee" height={120}/>
        </Section>
        <Section title="Audience by region" icon={Globe}>
          <GeoBars rows={[
            { country: 'United States', flag: '🇺🇸', pct: 92, sales: 3840 },
            { country: 'Germany',       flag: '🇩🇪', pct: 64, sales: 2280 },
            { country: 'Brazil',        flag: '🇧🇷', pct: 48, sales: 1760 },
            { country: 'Japan',         flag: '🇯🇵', pct: 32, sales: 1140 },
          ]}/>
        </Section>
      </div>

      <Section title="Top followers" icon={BadgeCheck}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {Array.from({length: 8}).map((_, i) => (
            <li key={i} className="flex items-center gap-3 rounded-md border border-border bg-background/40 px-3 py-2">
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 grid place-items-center text-[10px] font-semibold text-white">{String.fromCharCode(65+i)}</span>
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate">{['Sarah K.','Diego M.','Aiko T.','Liam R.','Mei L.','Noah P.','Olivia S.','Mateo V.'][i]}</div>
                <div className="text-[10px] text-muted-foreground">{2+i*3} purchases · ${(420+i*180).toLocaleString()} LTV</div>
              </div>
              <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Message</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   Marketing Center
   ============================================================ */

export function AuthorMarketingPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Growth" title="Marketing Center" subtitle="Campaigns, coupons and creative assets" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Megaphone}  label="Live campaigns" value={4}  accent="cyan"/>
        <Kpi icon={Tag}        label="Active coupons" value={12} accent="fuchsia"/>
        <Kpi icon={Users}      label="Referral sign-ups" value={284} accent="emerald" trend={18}/>
        <Kpi icon={Eye}        label="Banner impressions" value="84k" accent="amber"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Campaign builder" icon={Megaphone} className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <Field label="Campaign name" placeholder="Summer Launch 2026"/>
            <Field label="Channel" placeholder="Email · Social · UTM"/>
            <Field label="Start"   placeholder="2026-06-01"/>
            <Field label="End"     placeholder="2026-06-30"/>
            <Field label="UTM source" placeholder="newsletter"/>
            <Field label="UTM medium" placeholder="email"/>
          </div>
          <button className="mt-3 inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-2 text-xs font-medium text-white"><Megaphone className="h-3.5 w-3.5"/> Launch campaign</button>
        </Section>
        <Section title="Coupon manager" icon={Tag}>
          <ul className="space-y-2 text-sm">
            {[
              { code: 'LAUNCH25', off: '25% off', use: '128/500', tone: 'emerald' },
              { code: 'BLACKFRI',  off: '40% off', use: '320/1000', tone: 'fuchsia' },
              { code: 'WELCOME10', off: '$10 off', use: '∞', tone: 'cyan' },
              { code: 'ENT2026',   off: 'Free upgrade', use: '12/50', tone: 'amber' },
            ].map(c => (
              <li key={c.code} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <div>
                  <div className="font-mono text-foreground">{c.code}</div>
                  <div className="text-[10px] text-muted-foreground">{c.off} · {c.use}</div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Edit</button>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Social media kit" icon={ImageIcon}>
          <div className="grid grid-cols-2 gap-2">
            {['1080×1080','1920×1080','1200×630','1080×1920'].map(s => (
              <div key={s} className="aspect-video rounded-md border border-border bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 grid place-items-center text-[10px] text-muted-foreground">{s}</div>
            ))}
          </div>
        </Section>
        <Section title="Landing previews" icon={Eye}>
          <div className="space-y-2">
            {['Hero · Pricing','One-pager · CTA','Comparison vs alt'].map(t => (
              <div key={t} className="rounded-md border border-border bg-background/40 p-2 flex items-center gap-3">
                <div className="h-10 w-16 rounded bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20"/>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-foreground truncate">{t}</div>
                  <div className="text-[10px] text-muted-foreground">edited 2d ago</div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded border border-border hover:bg-accent text-muted-foreground">Open</button>
              </div>
            ))}
          </div>
        </Section>
        <Section title="QR campaigns" icon={Zap}>
          <div className="flex items-center gap-3">
            <div className="h-24 w-24 rounded-md border border-border bg-[repeating-conic-gradient(#22d3ee_0_25%,transparent_0_50%)] bg-[length:8px_8px] opacity-80"/>
            <div className="text-xs text-muted-foreground">
              <div className="text-foreground">launch-25.app/c/qr</div>
              <div>scans: <span className="text-cyan-300 tabular-nums">1,284</span></div>
              <div>conv: <span className="text-emerald-300 tabular-nums">4.8%</span></div>
              <button className="mt-2 text-[10px] px-2 py-1 rounded border border-border hover:bg-accent">Download SVG</button>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   AI Insights
   ============================================================ */

export function AuthorAiInsightsPage() {
  const cards = [
    { icon: Tag,       title: 'Price optimization', value: '+12%', note: 'AI recommends $89 → $94 on top 3 products.', tone: 'emerald' as const },
    { icon: Search,    title: 'SEO opportunities',  value: '24',   note: 'High-volume keywords with weak competitors.',  tone: 'cyan'    as const },
    { icon: Activity,  title: 'Refund prediction',  value: '0.7%', note: 'Next 30 days · model confidence 91%.',         tone: 'amber'   as const },
    { icon: TrendingUp,title: 'Revenue forecast',   value: '$62k', note: 'Next 30 days · +14% vs prior.',                tone: 'fuchsia' as const },
  ];
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="AI" title="AI Insights" subtitle="Predictive intelligence across your portfolio" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {cards.map(c => (
          <Kpi key={c.title} icon={c.icon} label={c.title} value={c.value} sub={c.note} accent={c.tone}/>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Competitor tracker" icon={Eye} className="lg:col-span-2">
          <ul className="divide-y divide-border text-sm">
            {[
              { who: 'MediCore Pro',  delta: '-$10 price', tone: 'amber' },
              { who: 'ClinicOS',      delta: 'new v2.0 release', tone: 'cyan' },
              { who: 'HealthSuite',   delta: '+4 reviews', tone: 'fuchsia' },
              { who: 'CarePilot',     delta: 'new keyword: HIPAA dashboard', tone: 'emerald' },
            ].map((c, i) => (
              <li key={i} className="py-2 flex items-center justify-between">
                <span className="text-foreground">{c.who}</span>
                <span className={`text-[11px] ${c.tone==='amber'?'text-amber-300':c.tone==='cyan'?'text-cyan-300':c.tone==='fuchsia'?'text-fuchsia-300':'text-emerald-300'}`}>{c.delta}</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Trending keywords" icon={Search}>
          <ul className="space-y-1.5 text-xs">
            {[
              ['HIPAA dashboard',  '+42%'],
              ['cloud ERP',        '+28%'],
              ['salon POS',        '+19%'],
              ['ai inventory',     '+14%'],
              ['multi-tenant SaaS','+11%'],
            ].map(([k, t]) => (
              <li key={k} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-2.5 py-1.5">
                <span className="text-foreground">{k}</span>
                <span className="text-emerald-300 tabular-nums">{t}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="AI suggestions queue" icon={Sparkles}>
        <ul className="space-y-2">
          {[
            'Generate changelog for v1.4.2 hotfix from commit history.',
            'Summarize 14 support tickets from this week → 3 themes detected.',
            'Suggest improvement: lazy-load 3rd-party scripts on landing (+0.6s LCP).',
            'Draft 6 social posts for the v1.4.0 launch campaign.',
          ].map((s, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-fuchsia-500/20 bg-fuchsia-500/5 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <Sparkles className="h-3.5 w-3.5 text-fuchsia-300"/>
                <span className="text-xs text-foreground truncate">{s}</span>
              </div>
              <button className="text-[10px] px-2 py-1 rounded border border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-500/10">Run</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   Storage / Downloads / SEO / Deployments / AI Scans  (kept simple)
   ============================================================ */

export function AuthorStoragePage() {
  const { gallery } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Storage & CDN" title="Storage operations" subtitle="Media, source vault and delivery analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={HardDrive} label="Media" value={formatFileSize(gallery.stats.totalSizeBytes)} sub={`${gallery.stats.totalMedia} files`} accent="cyan"/>
        <Kpi icon={Layers}    label="Compression saved" value={formatFileSize(gallery.stats.compressionSavedBytes)} sub="auto-WebP" accent="emerald"/>
        <Kpi icon={Globe}     label="CDN regions" value="14" sub="edge POPs" accent="fuchsia"/>
        <Kpi icon={Activity}  label="Bandwidth / 24h" value="2.4 TB" sub="cached 92%" accent="amber"/>
      </div>
      <Section title="Per-bucket usage" icon={HardDrive}>
        <ul className="space-y-2 text-sm">
          {(Object.entries(gallery.stats.byCategory) as [string, number][]).map(([cat, count]) => {
            const pct = Math.round((count / Math.max(1, gallery.stats.totalMedia)) * 100);
            return (
              <li key={cat}>
                <div className="flex items-center justify-between text-xs">
                  <span className="capitalize text-muted-foreground">{cat}</span>
                  <span className="tabular-nums text-foreground">{count}</span>
                </div>
                <ProgressBar value={pct} />
              </li>
            );
          })}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorDownloadsPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Distribution" title="Downloads" subtitle="Per-product download analytics" />
      <Section title="Download leaderboard" icon={Download}>
        <ul className="divide-y divide-border text-sm">
          {products.slice().sort((a,b)=>b.users-a.users).slice(0, 12).map((p, i) => (
            <li key={p.id} className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <span className="text-xs text-muted-foreground w-5 tabular-nums">#{i+1}</span>
                <span className="text-foreground truncate">{p.name}</span>
              </div>
              <span className="text-cyan-300 tabular-nums">{(p.users * 2).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorSeoPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Discovery" title="SEO Tools" subtitle="Indexing, impressions, click-through" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Search}     label="Indexed pages" value={products.length * 4} sub="all crawled" accent="cyan"/>
        <Kpi icon={Activity}   label="Impressions /7d" value={(products.length * 9200).toLocaleString()} sub="rolling" accent="fuchsia"/>
        <Kpi icon={TrendingUp} label="CTR" value="6.4%" sub="vs 4.1% median" accent="emerald"/>
        <Kpi icon={AlertTriangle} label="SEO issues" value={Math.max(0, products.length - 18)} sub="missing alt-text" accent="amber"/>
      </div>
      <Section title="Top organic keywords" icon={Search}>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          {['hospital management software', 'school erp', 'cloud kitchen pos', 'wholesale b2b marketplace', 'manufacturing erp', 'home healthcare app', 'cleaning service software', 'salon booking'].map(k => (
            <li key={k} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
              <span className="text-foreground">{k}</span>
              <span className="text-[11px] text-emerald-300">+{Math.floor(Math.random()*30)}%</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorDeploymentsPage() {
  const { products, pulse } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Deployments" title="Deployment center" subtitle={`Build, ship & verify · heartbeat #${pulse}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Rocket}   label="Live deployments" value={products.length} sub="all healthy" accent="emerald"/>
        <Kpi icon={Clock}    label="Avg build time"   value="2m 14s" sub="-12% wk/wk" accent="cyan"/>
        <Kpi icon={Activity} label="Queue depth"      value={Math.max(0, 4 - (pulse % 5))} sub="workers idle" accent="fuchsia"/>
        <Kpi icon={ShieldCheck} label="Verification"  value="100%" sub="post-deploy checks" accent="amber"/>
      </div>
      <Section title="Recent deployments" icon={Rocket}>
        <ul className="divide-y divide-border text-sm">
          {products.slice(0, 6).map((p, i) => (
            <li key={p.id} className="py-2 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-foreground truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">deploy-{(pulse + i).toString(36)} · 2m {12+i}s · stable</div>
              </div>
              <span className="text-emerald-300 inline-flex items-center gap-1 text-xs"><CheckCircle2 className="h-3 w-3" /> live</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

export function AuthorAiScansPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="AI operations" title="AI product scans" subtitle="Malware, dependency, memory and install testing" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Cpu}           label="Scans /24h"    value={products.length * 3} sub="auto-triggered" accent="cyan"/>
        <Kpi icon={ShieldCheck}   label="Malware clean" value={`${products.length}/${products.length}`} sub="0 flagged" accent="emerald"/>
        <Kpi icon={AlertTriangle} label="Issues found"  value={Math.max(0, products.length - 20)} sub="medium severity" accent="amber"/>
        <Kpi icon={Sparkles}      label="AI tips"       value={products.length * 2} sub="optimization hints" accent="fuchsia"/>
      </div>
      <Section title="AI scan timeline" icon={Cpu}>
        <ol className="relative border-l border-border pl-4 space-y-3">
          {products.slice(0, 8).map((p, i) => (
            <li key={p.id} className="text-sm">
              <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-background" />
              <div className="text-foreground truncate">{p.name}</div>
              <div className="text-[11px] text-muted-foreground">scan #{1024 + i} · {i % 3 === 0 ? '1 hint' : 'no issues'} · dependency tree {i*2 + 14} nodes</div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* ============================================================
   Security
   ============================================================ */

export function AuthorSecurityPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Security" title="Security Center" subtitle="2FA, sessions, API keys and audit trail" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={ShieldCheck}   label="Security score" value="A+" sub="hardened" accent="emerald"/>
        <Kpi icon={Lock}          label="2FA"            value="ON"  sub="TOTP · WebAuthn" accent="cyan"/>
        <Kpi icon={Server}        label="Active sessions" value={3}  sub="2 desktops · 1 phone" accent="fuchsia"/>
        <Kpi icon={AlertTriangle} label="Threats /30d"   value={0}   sub="0 blocked" accent="amber"/>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Active sessions" icon={Server}>
          <ul className="divide-y divide-border text-sm">
            {[
              { dev: 'MacBook Pro · Chrome', ip: '74.125.224.72', loc: 'San Francisco, US', cur: true },
              { dev: 'iPhone 15 · Safari',   ip: '99.227.18.4',   loc: 'Toronto, CA',       cur: false },
              { dev: 'Windows · Edge',       ip: '88.12.66.91',   loc: 'Berlin, DE',        cur: false },
            ].map((s, i) => (
              <li key={i} className="py-2 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-foreground">{s.dev} {s.cur && <span className="text-[10px] text-emerald-300 ml-1">· current</span>}</div>
                  <div className="text-[10px] text-muted-foreground">{s.ip} · {s.loc}</div>
                </div>
                {!s.cur && <button className="text-[10px] px-2 py-1 rounded border border-red-500/30 text-red-300 hover:bg-red-500/10">Revoke</button>}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="API keys" icon={KeyRound}>
          <ul className="space-y-2 text-sm">
            {[
              { name: 'Production · webhook',  key: 'sk_live_x82…41q', tone: 'emerald' },
              { name: 'Staging · analytics',   key: 'sk_test_4kf…9zb', tone: 'cyan' },
              { name: 'CI/CD · deploy',        key: 'sk_ci_pn3…8rd',   tone: 'fuchsia' },
            ].map(k => (
              <li key={k.name} className="rounded-md border border-border bg-background/40 px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-foreground">{k.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground truncate">{k.key}</div>
                </div>
                <button className="text-[10px] px-2 py-1 rounded border border-amber-500/30 text-amber-300 hover:bg-amber-500/10 inline-flex items-center gap-1">
                  <RefreshCw className="h-3 w-3"/> Rotate
                </button>
              </li>
            ))}
            <button className="w-full text-xs px-3 py-2 rounded-md border border-dashed border-border hover:border-cyan-500/40 text-muted-foreground hover:text-cyan-300 inline-flex items-center justify-center gap-1"><Plus className="h-3.5 w-3.5"/> Create new key</button>
          </ul>
        </Section>
      </div>

      <Section title="Audit trail" icon={FileText}>
        <ol className="relative border-l border-border pl-5 space-y-2 text-sm">
          {[
            'Password changed · MacBook Pro',
            'New API key created · CI/CD',
            'Session signed out · Windows · Edge',
            '2FA enabled · WebAuthn key registered',
            'Login from new device · Toronto, CA',
          ].map((e, i) => (
            <li key={i} className="text-foreground">
              <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-background"/>
              {e}
              <span className="ml-2 text-[10px] text-muted-foreground">{i*3+2}h ago</span>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* ============================================================
   Settings
   ============================================================ */

export function AuthorSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Configuration" title="Author Settings" subtitle="Profile, payouts, notifications and branding" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Profile" icon={Settings}>
          <div className="space-y-2 text-sm">
            <Row k="Display name" v={user?.name ?? '—'} />
            <Row k="Email" v={user?.email ?? '—'} />
            <Row k="Role" v="Author" />
            <Row k="Member since" v="2024" />
          </div>
        </Section>
        <Section title="Branding" icon={ImageIcon}>
          <div className="space-y-2 text-sm">
            <Row k="Studio name" v="Acme Studio" />
            <Row k="Public URL" v="market.app/@acme" />
            <Row k="Theme color" v="#22d3ee" />
            <Row k="Logo" v="acme-logo.svg" />
          </div>
        </Section>
        <Section title="Payment & payouts" icon={Wallet}>
          <div className="space-y-2 text-sm">
            <Row k="Method" v="Bank ACH" />
            <Row k="Bank" v="•••• 4421" />
            <Row k="Cycle" v="Weekly · Friday" />
            <Row k="Minimum" v="$50" />
          </div>
        </Section>
        <Section title="Notifications" icon={Mail}>
          {['New review', 'Refund request', 'AI scan failure', 'Payout processed', 'Follower milestone'].map(n => (
            <label key={n} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-foreground">{n}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-background accent-cyan-400" />
            </label>
          ))}
        </Section>
        <Section title="Connected accounts" icon={Globe}>
          <ul className="space-y-2 text-sm">
            {[
              { name: 'GitHub', detail: '@acme · 4 repos', ok: true },
              { name: 'Stripe', detail: 'acct_1Nf…8z', ok: true },
              { name: 'Slack',  detail: 'not connected', ok: false },
            ].map(a => (
              <li key={a.name} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <div>
                  <div className="text-foreground">{a.name}</div>
                  <div className="text-[10px] text-muted-foreground">{a.detail}</div>
                </div>
                <button className={`text-[10px] px-2 py-1 rounded border ${a.ok?'border-emerald-500/30 text-emerald-300':'border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10'}`}>{a.ok?'connected':'connect'}</button>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Danger zone" icon={AlertTriangle}>
          <div className="space-y-2 text-sm">
            <button className="w-full text-left px-3 py-2 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground inline-flex items-center gap-2">
              <Upload className="h-3.5 w-3.5" /> Export portfolio
            </button>
            <button className="w-full text-left px-3 py-2 rounded-md border border-amber-500/30 bg-amber-500/5 text-amber-300 hover:bg-amber-500/10 inline-flex items-center gap-2">
              <RefreshCw className="h-3.5 w-3.5" /> Rotate API keys
            </button>
          </div>
        </Section>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-foreground">{v}</span>
    </div>
  );
}
