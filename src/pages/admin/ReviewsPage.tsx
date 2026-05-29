import {
  Star, Flag, Search, Filter, Download, Shield, Sparkles, AlertTriangle,
  CheckCircle2, XCircle, Trash2, Archive, Reply, MessageSquare, Activity,
  TrendingUp, TrendingDown, Users, Package, MapPin, Smartphone, Eye, Brain,
  FileText, Clock, Zap, BadgeCheck, Ban, RefreshCw, ChevronRight, Bell,
  AlertOctagon, History, Globe, Hash, X, MoreHorizontal, Pause, Play,
} from 'lucide-react';
import { useState, useMemo, useEffect, useRef } from 'react';
import { toast } from 'sonner';

// ─────────────────────────── Types & Seed Data ───────────────────────────
type ReviewStatus = 'pending' | 'approved' | 'rejected' | 'spam' | 'reported' | 'escalated' | 'archived';
type Sentiment = 'positive' | 'neutral' | 'negative';
type Device = 'desktop' | 'mobile' | 'tablet';

interface Review {
  id: string;
  user: string;
  email: string;
  product: string;
  rating: number;
  title: string;
  text: string;
  flagged: boolean;
  reported: number;
  status: ReviewStatus;
  verified: boolean;
  createdAt: number;
  country: string;
  device: Device;
  ip: string;
  sentiment: Sentiment;
  aiRisk: number;          // 0-100
  aiSpam: number;          // 0-100
  aiFake: number;          // 0-100
  aiToxicity: number;      // 0-100
  trustScore: number;      // 0-100
  prevReviews: number;
  orderId?: string;
  reply?: string;
  notes?: string;
}

const FIRST = ['Alex', 'Jenna', 'Carlos', 'Priya', 'Mei', 'Noah', 'Sara', 'Lucas', 'Aisha', 'Ivan', 'Yuki', 'Liam', 'Zara', 'Diego', 'Hana', 'Omar', 'Nora', 'Kai', 'Eva', 'Sam'];
const LAST = ['M.', 'K.', 'R.', 'S.', 'L.', 'T.', 'V.', 'P.', 'N.', 'O.'];
const PRODUCTS = ['EduFlow Pro', 'ShopEngine', 'FactoryOS', 'CRM Atlas', 'LedgerCore', 'PixelForge', 'CloudMesh', 'DataPrism', 'AuthGrid', 'StreamKit'];
const COUNTRIES = ['US', 'DE', 'IN', 'BR', 'JP', 'GB', 'FR', 'CA', 'AU', 'NL', 'SG', 'ZA'];
const DEVICES: Device[] = ['desktop', 'mobile', 'tablet'];
const TITLES = [
  'Game changer for our team', 'Solid but needs work', 'Crashed on day one',
  'Best in class support', 'Overpriced for what it does', 'Smooth onboarding',
  'Missing critical features', 'Exactly what we needed', 'Buggy release', 'Five stars all around',
];
const TEXTS = [
  'Best platform I have used in years. Incredible support team and the docs are top-tier.',
  'Slow checkout, missing features, and the dashboard freezes randomly.',
  'Solid platform for production planning. Onboarding could be smoother.',
  'AI features are a gimmick. Would not pay this much again.',
  'Customer success was outstanding — solved our migration in two days.',
  'Crashes on Safari, support ticket open for 11 days. Disappointing.',
  'Exactly what we needed for compliance reporting. 10/10.',
  'Missing webhook docs and the rate limits are way too aggressive.',
  'Beautiful UI, fast performance, fair pricing. No complaints.',
  'Refund process was painful and took 3 weeks of back-and-forth emails.',
];

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = <T,>(arr: T[]) => arr[rand(arr.length)];

function mkReview(i: number, offsetMs = 0): Review {
  const rating = Math.max(1, Math.min(5, Math.round(2 + Math.random() * 3.5)));
  const sentiment: Sentiment = rating >= 4 ? 'positive' : rating <= 2 ? 'negative' : 'neutral';
  const aiRisk = sentiment === 'negative' ? 30 + rand(60) : rand(40);
  return {
    id: `RV-${(10000 + i).toString(36).toUpperCase()}`,
    user: `${pick(FIRST)} ${pick(LAST)}`,
    email: `user${i}@${pick(['acme.io', 'corp.com', 'mail.dev', 'box.co'])}`,
    product: pick(PRODUCTS),
    rating,
    title: pick(TITLES),
    text: pick(TEXTS),
    flagged: Math.random() < 0.18,
    reported: Math.random() < 0.25 ? 1 + rand(5) : 0,
    status: (['pending', 'approved', 'pending', 'reported', 'approved', 'spam', 'escalated'] as ReviewStatus[])[rand(7)],
    verified: Math.random() < 0.72,
    createdAt: Date.now() - offsetMs - rand(1000 * 60 * 60 * 24 * 30),
    country: pick(COUNTRIES),
    device: pick(DEVICES),
    ip: `${rand(255)}.${rand(255)}.${rand(255)}.${rand(255)}`,
    sentiment,
    aiRisk,
    aiSpam: rand(100),
    aiFake: rand(100),
    aiToxicity: sentiment === 'negative' ? rand(70) : rand(25),
    trustScore: 40 + rand(60),
    prevReviews: rand(40),
    orderId: Math.random() < 0.7 ? `ORD-${rand(99999)}` : undefined,
    reply: undefined,
    notes: undefined,
  };
}

const SEED = Array.from({ length: 48 }, (_, i) => mkReview(i, i * 60_000));

// ─────────────────────────── Small UI primitives ───────────────────────────
const cls = (...xs: (string | false | undefined)[]) => xs.filter(Boolean).join(' ');

const StatusPill = ({ s }: { s: ReviewStatus }) => {
  const map: Record<ReviewStatus, string> = {
    approved: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
    spam: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30',
    reported: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    escalated: 'bg-red-500/10 text-red-400 border-red-500/30',
    archived: 'bg-muted text-muted-foreground border-border',
  };
  return <span className={cls('text-[10px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded border', map[s])}>{s}</span>;
};

const Stars = ({ n, size = 'sm' }: { n: number; size?: 'sm' | 'xs' }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={cls(size === 'xs' ? 'h-2.5 w-2.5' : 'h-3 w-3', i < n ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/30')} />
    ))}
  </div>
);

const KpiCard = ({ icon: Icon, label, value, delta, tone = 'primary' }: any) => (
  <div className="relative rounded-lg border border-border bg-card p-3 overflow-hidden group hover:border-primary/40 transition-colors">
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br from-primary/5 to-transparent transition-opacity pointer-events-none" />
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{label}</span>
      <Icon className={cls('h-3.5 w-3.5', tone === 'danger' ? 'text-rose-500' : tone === 'warn' ? 'text-amber-500' : tone === 'success' ? 'text-emerald-500' : 'text-primary')} />
    </div>
    <div className="text-xl font-bold text-foreground tabular-nums">{value}</div>
    {delta != null && (
      <div className={cls('text-[10px] font-mono mt-0.5 flex items-center gap-1', delta >= 0 ? 'text-emerald-500' : 'text-rose-500')}>
        {delta >= 0 ? <TrendingUp className="h-2.5 w-2.5" /> : <TrendingDown className="h-2.5 w-2.5" />}
        {delta >= 0 ? '+' : ''}{delta}%
      </div>
    )}
  </div>
);

const Sparkline = ({ data, color = 'hsl(var(--primary))' }: { data: number[]; color?: string }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100, h = 28;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-7" preserveAspectRatio="none">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={pts} />
    </svg>
  );
};

// ─────────────────────────── Main Page ───────────────────────────
const ReviewsPage = () => {
  const [reviews, setReviews] = useState<Review[]>(SEED);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeQueue, setActiveQueue] = useState<'all' | ReviewStatus>('all');
  const [search, setSearch] = useState('');
  const [ratingF, setRatingF] = useState<number | null>(null);
  const [productF, setProductF] = useState<string>('all');
  const [countryF, setCountryF] = useState<string>('all');
  const [verifiedF, setVerifiedF] = useState<'all' | 'yes' | 'no'>('all');
  const [riskF, setRiskF] = useState<'all' | 'low' | 'med' | 'high'>('all');
  const [drawer, setDrawer] = useState<Review | null>(null);
  const [liveOn, setLiveOn] = useState(true);
  const [feed, setFeed] = useState<{ id: string; user: string; product: string; rating: number; t: number }[]>([]);
  const [auditLog, setAuditLog] = useState<{ id: string; action: string; target: string; at: number; mod: string }[]>([
    { id: 'L1', action: 'approved', target: 'RV-A2BX', at: Date.now() - 60_000, mod: 'admin@boss' },
    { id: 'L2', action: 'spam.flag', target: 'RV-A2CD', at: Date.now() - 320_000, mod: 'mod.ops' },
    { id: 'L3', action: 'escalated', target: 'RV-A2D7', at: Date.now() - 900_000, mod: 'admin@boss' },
  ]);

  // Realtime feed simulator
  useEffect(() => {
    if (!liveOn) return;
    const tick = setInterval(() => {
      const r = mkReview(Date.now() % 99999);
      setFeed(prev => [{ id: r.id, user: r.user, product: r.product, rating: r.rating, t: Date.now() }, ...prev].slice(0, 14));
      if (Math.random() < 0.35) {
        setReviews(prev => [r, ...prev].slice(0, 200));
      }
    }, 2800);
    return () => clearInterval(tick);
  }, [liveOn]);

  const logAction = (action: string, target: string) => {
    setAuditLog(prev => [{ id: `L${Date.now()}`, action, target, at: Date.now(), mod: 'admin@boss' }, ...prev].slice(0, 30));
  };

  // Derived KPIs
  const k = useMemo(() => {
    const total = reviews.length;
    const approved = reviews.filter(r => r.status === 'approved').length;
    const pending = reviews.filter(r => r.status === 'pending').length;
    const rejected = reviews.filter(r => r.status === 'rejected').length;
    const spam = reviews.filter(r => r.status === 'spam').length;
    const reported = reviews.filter(r => r.reported > 0).length;
    const escalated = reviews.filter(r => r.status === 'escalated').length;
    const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
    const day = Date.now() - 86400_000;
    const week = Date.now() - 86400_000 * 7;
    const month = Date.now() - 86400_000 * 30;
    const today = reviews.filter(r => r.createdAt >= day).length;
    const thisWeek = reviews.filter(r => r.createdAt >= week).length;
    const thisMonth = reviews.filter(r => r.createdAt >= month).length;
    const verified = reviews.filter(r => r.verified).length;
    return { total, approved, pending, rejected, spam, reported, escalated, avg, today, thisWeek, thisMonth, verified };
  }, [reviews]);

  const distribution = useMemo(() => {
    const d = [0, 0, 0, 0, 0];
    reviews.forEach(r => d[r.rating - 1]++);
    const max = Math.max(...d, 1);
    return d.map((v, i) => ({ stars: i + 1, count: v, pct: (v / max) * 100 }));
  }, [reviews]);

  const trend = useMemo(() => Array.from({ length: 24 }, (_, i) => {
    const start = Date.now() - (24 - i) * 3600_000;
    return reviews.filter(r => r.createdAt >= start && r.createdAt < start + 3600_000).length + rand(3);
  }), [reviews]);

  const sentimentMix = useMemo(() => {
    const p = reviews.filter(r => r.sentiment === 'positive').length;
    const n = reviews.filter(r => r.sentiment === 'negative').length;
    const u = reviews.length - p - n;
    const t = Math.max(reviews.length, 1);
    return { p: (p / t) * 100, n: (n / t) * 100, u: (u / t) * 100 };
  }, [reviews]);

  // Filtering
  const filtered = useMemo(() => {
    return reviews.filter(r => {
      if (activeQueue !== 'all') {
        if (activeQueue === 'reported' && r.reported === 0) return false;
        if (activeQueue !== 'reported' && r.status !== activeQueue) return false;
      }
      if (search) {
        const q = search.toLowerCase();
        if (![r.user, r.product, r.text, r.title, r.id, r.email].some(v => v.toLowerCase().includes(q))) return false;
      }
      if (ratingF && r.rating !== ratingF) return false;
      if (productF !== 'all' && r.product !== productF) return false;
      if (countryF !== 'all' && r.country !== countryF) return false;
      if (verifiedF === 'yes' && !r.verified) return false;
      if (verifiedF === 'no' && r.verified) return false;
      if (riskF !== 'all') {
        if (riskF === 'low' && r.aiRisk > 33) return false;
        if (riskF === 'med' && (r.aiRisk <= 33 || r.aiRisk > 66)) return false;
        if (riskF === 'high' && r.aiRisk <= 66) return false;
      }
      return true;
    });
  }, [reviews, activeQueue, search, ratingF, productF, countryF, verifiedF, riskF]);

  // Actions
  const updateStatus = (ids: string[], status: ReviewStatus, label: string) => {
    setReviews(prev => prev.map(r => ids.includes(r.id) ? { ...r, status, flagged: status === 'rejected' ? r.flagged : false } : r));
    ids.forEach(id => logAction(label, id));
    toast.success(`${ids.length} review${ids.length > 1 ? 's' : ''} ${label}`);
    setSelected(new Set());
  };
  const bulkDelete = () => {
    if (selected.size === 0) return;
    if (!window.confirm(`Delete ${selected.size} reviews? This cannot be undone.`)) return;
    const ids = Array.from(selected);
    setReviews(prev => prev.filter(r => !selected.has(r.id)));
    ids.forEach(id => logAction('deleted', id));
    toast.success(`${ids.length} reviews deleted`);
    setSelected(new Set());
  };
  const exportCsv = () => {
    const header = ['id', 'user', 'product', 'rating', 'status', 'verified', 'country', 'aiRisk', 'createdAt'].join(',');
    const rows = filtered.map(r => [r.id, r.user, r.product, r.rating, r.status, r.verified, r.country, r.aiRisk, new Date(r.createdAt).toISOString()].join(','));
    const blob = new Blob([header + '\n' + rows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `reviews-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success(`Exported ${filtered.length} reviews to CSV`);
    logAction('export.csv', `${filtered.length} rows`);
  };

  const toggleSel = (id: string) => {
    setSelected(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };
  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };

  const queues: { id: 'all' | ReviewStatus; label: string; count: number; icon: any }[] = [
    { id: 'all', label: 'All', count: reviews.length, icon: MessageSquare },
    { id: 'pending', label: 'Pending', count: k.pending, icon: Clock },
    { id: 'reported', label: 'Reported', count: k.reported, icon: Flag },
    { id: 'spam', label: 'Spam', count: k.spam, icon: Ban },
    { id: 'escalated', label: 'Escalated', count: k.escalated, icon: AlertOctagon },
    { id: 'approved', label: 'Approved', count: k.approved, icon: CheckCircle2 },
    { id: 'rejected', label: 'Rejected', count: k.rejected, icon: XCircle },
    { id: 'archived', label: 'Archived', count: reviews.filter(r => r.status === 'archived').length, icon: Archive },
  ];

  return (
    <div className="space-y-4">
      {/* Command bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-500">REV-OPS ONLINE</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Reviews Command Center</h1>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">Marketplace Review Intelligence · Moderation · Trust & Safety</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setLiveOn(v => !v)} className={cls('flex items-center gap-1.5 text-xs font-mono px-2.5 py-1.5 rounded border', liveOn ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-muted border-border text-muted-foreground')}>
            {liveOn ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            {liveOn ? 'LIVE' : 'PAUSED'}
          </button>
          <button onClick={exportCsv} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded border border-border bg-card hover:bg-muted">
            <Download className="h-3 w-3" /> CSV
          </button>
          <button onClick={() => { toast.message('PDF report queued'); logAction('report.pdf', 'queued'); }} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded border border-border bg-card hover:bg-muted">
            <FileText className="h-3 w-3" /> PDF
          </button>
          <button onClick={() => toast.message('Scheduled weekly report enabled')} className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded border border-border bg-card hover:bg-muted">
            <Bell className="h-3 w-3" /> Schedule
          </button>
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <KpiCard icon={MessageSquare} label="Total" value={k.total} delta={6} />
        <KpiCard icon={CheckCircle2} label="Approved" value={k.approved} delta={4} tone="success" />
        <KpiCard icon={Clock} label="Pending" value={k.pending} delta={-2} tone="warn" />
        <KpiCard icon={XCircle} label="Rejected" value={k.rejected} delta={1} tone="danger" />
        <KpiCard icon={Ban} label="Spam" value={k.spam} delta={-5} tone="danger" />
        <KpiCard icon={Flag} label="Reported" value={k.reported} delta={3} tone="warn" />
        <KpiCard icon={Star} label="Avg Rating" value={k.avg.toFixed(2)} delta={0} tone="success" />
        <KpiCard icon={AlertOctagon} label="Escalated" value={k.escalated} delta={2} tone="danger" />
        <KpiCard icon={Activity} label="Today" value={k.today} delta={8} />
        <KpiCard icon={Activity} label="This Week" value={k.thisWeek} delta={12} />
        <KpiCard icon={Activity} label="This Month" value={k.thisMonth} delta={18} />
        <KpiCard icon={BadgeCheck} label="Verified" value={k.verified} delta={5} tone="success" />
      </div>

      {/* Analytics row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Rating Distribution</span>
            <Hash className="h-3 w-3 text-muted-foreground" />
          </div>
          <div className="space-y-1.5">
            {distribution.slice().reverse().map(d => (
              <div key={d.stars} className="flex items-center gap-2">
                <span className="text-[10px] font-mono w-6 text-muted-foreground">{d.stars}★</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-amber-400" style={{ width: `${d.pct}%` }} />
                </div>
                <span className="text-[10px] font-mono tabular-nums text-foreground w-8 text-right">{d.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">24h Review Trend</span>
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          </div>
          <Sparkline data={trend} />
          <div className="flex justify-between text-[9px] font-mono text-muted-foreground mt-1">
            <span>-24h</span><span>now</span>
          </div>
          <div className="mt-2 flex items-center gap-3 text-[10px] font-mono">
            <span className="text-emerald-500">peak {Math.max(...trend)}</span>
            <span className="text-muted-foreground">avg {(trend.reduce((s, v) => s + v, 0) / trend.length).toFixed(1)}</span>
          </div>
        </div>

        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Sentiment · AI</span>
            <Brain className="h-3 w-3 text-primary" />
          </div>
          <div className="h-2 flex rounded-full overflow-hidden bg-muted">
            <div className="bg-emerald-500" style={{ width: `${sentimentMix.p}%` }} />
            <div className="bg-amber-500" style={{ width: `${sentimentMix.u}%` }} />
            <div className="bg-rose-500" style={{ width: `${sentimentMix.n}%` }} />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono">
            <div><span className="text-emerald-500">●</span> POS {sentimentMix.p.toFixed(0)}%</div>
            <div><span className="text-amber-500">●</span> NEU {sentimentMix.u.toFixed(0)}%</div>
            <div><span className="text-rose-500">●</span> NEG {sentimentMix.n.toFixed(0)}%</div>
          </div>
          <div className="mt-2 pt-2 border-t border-border space-y-1 text-[10px] font-mono">
            <div className="flex justify-between"><span className="text-muted-foreground">Quality Score</span><span className="text-foreground">{(7 + Math.random() * 2).toFixed(1)}/10</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Reputation Index</span><span className="text-emerald-500">+{(82 + Math.random() * 10).toFixed(1)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CSAT</span><span className="text-foreground">{(88 + Math.random() * 8).toFixed(1)}%</span></div>
          </div>
        </div>
      </div>

      {/* Queue tabs */}
      <div className="flex flex-wrap gap-1 border-b border-border pb-2">
        {queues.map(q => {
          const Icon = q.icon;
          const active = activeQueue === q.id;
          return (
            <button key={q.id} onClick={() => setActiveQueue(q.id)} className={cls(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-medium border transition-colors',
              active ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-card border-border text-muted-foreground hover:text-foreground hover:border-foreground/30'
            )}>
              <Icon className="h-3 w-3" /> {q.label}
              <span className={cls('text-[10px] font-mono px-1 rounded', active ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground')}>{q.count}</span>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-border bg-card p-2.5 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search ID, user, product, content…" className="w-full bg-background border border-border rounded pl-7 pr-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50" />
        </div>
        <select value={ratingF ?? ''} onChange={e => setRatingF(e.target.value ? Number(e.target.value) : null)} className="bg-background border border-border rounded px-2 py-1.5 text-xs">
          <option value="">All Ratings</option>
          {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} ★</option>)}
        </select>
        <select value={productF} onChange={e => setProductF(e.target.value)} className="bg-background border border-border rounded px-2 py-1.5 text-xs">
          <option value="all">All Products</option>
          {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={countryF} onChange={e => setCountryF(e.target.value)} className="bg-background border border-border rounded px-2 py-1.5 text-xs">
          <option value="all">All Countries</option>
          {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={verifiedF} onChange={e => setVerifiedF(e.target.value as any)} className="bg-background border border-border rounded px-2 py-1.5 text-xs">
          <option value="all">Any Purchase</option>
          <option value="yes">Verified ✓</option>
          <option value="no">Unverified</option>
        </select>
        <select value={riskF} onChange={e => setRiskF(e.target.value as any)} className="bg-background border border-border rounded px-2 py-1.5 text-xs">
          <option value="all">All AI Risk</option>
          <option value="low">Low Risk</option>
          <option value="med">Medium Risk</option>
          <option value="high">High Risk</option>
        </select>
        <button onClick={() => { setSearch(''); setRatingF(null); setProductF('all'); setCountryF('all'); setVerifiedF('all'); setRiskF('all'); }} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">
          <X className="h-3 w-3" /> Reset
        </button>
      </div>

      {/* Bulk actions bar */}
      {selected.size > 0 && (
        <div className="rounded-lg border border-primary/40 bg-primary/5 p-2 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-mono text-primary">{selected.size} selected</span>
          <div className="h-4 w-px bg-border" />
          <button onClick={() => updateStatus(Array.from(selected), 'approved', 'approved')} className="text-xs px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approve</button>
          <button onClick={() => updateStatus(Array.from(selected), 'rejected', 'rejected')} className="text-xs px-2 py-1 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 flex items-center gap-1"><XCircle className="h-3 w-3" /> Reject</button>
          <button onClick={() => updateStatus(Array.from(selected), 'spam', 'marked.spam')} className="text-xs px-2 py-1 rounded bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 flex items-center gap-1"><Ban className="h-3 w-3" /> Mark Spam</button>
          <button onClick={() => updateStatus(Array.from(selected), 'archived', 'archived')} className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground hover:bg-muted/80 flex items-center gap-1"><Archive className="h-3 w-3" /> Archive</button>
          <button onClick={() => updateStatus(Array.from(selected), 'pending', 'restored')} className="text-xs px-2 py-1 rounded bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 flex items-center gap-1"><RefreshCw className="h-3 w-3" /> Restore</button>
          <button onClick={bulkDelete} className="text-xs px-2 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 flex items-center gap-1"><Trash2 className="h-3 w-3" /> Delete</button>
          <button onClick={exportCsv} className="text-xs px-2 py-1 rounded bg-card border border-border hover:bg-muted flex items-center gap-1"><Download className="h-3 w-3" /> Export</button>
        </div>
      )}

      {/* Main grid: table + side panels */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-3">
        {/* Review table */}
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between bg-muted/30">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={selectAll} className="h-3 w-3 accent-primary" />
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">{filtered.length} reviews</span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground">queue: {activeQueue}</span>
          </div>
          <div className="max-h-[640px] overflow-y-auto divide-y divide-border">
            {filtered.length === 0 && (
              <div className="p-10 text-center text-sm text-muted-foreground">No reviews match the current filters.</div>
            )}
            {filtered.map(r => (
              <div key={r.id} className={cls('px-3 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group', selected.has(r.id) && 'bg-primary/5')} onClick={() => setDrawer(r)}>
                <div className="flex items-start gap-2">
                  <input type="checkbox" checked={selected.has(r.id)} onChange={e => { e.stopPropagation(); toggleSel(r.id); }} onClick={e => e.stopPropagation()} className="mt-1 h-3 w-3 accent-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <span className="text-[10px] font-mono text-muted-foreground">{r.id}</span>
                      <span className="text-xs font-semibold text-foreground">{r.user}</span>
                      {r.verified && <span title="Verified purchase" className="flex items-center gap-0.5 text-[9px] font-mono text-emerald-500"><BadgeCheck className="h-3 w-3" /> VERIFIED</span>}
                      <span className="text-[10px] text-muted-foreground">on</span>
                      <span className="text-xs text-foreground">{r.product}</span>
                      <Stars n={r.rating} size="xs" />
                      <StatusPill s={r.status} />
                      {r.reported > 0 && <span className="text-[9px] font-mono px-1 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30"><Flag className="h-2.5 w-2.5 inline" /> {r.reported}</span>}
                      {r.aiRisk > 66 && <span className="text-[9px] font-mono px-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">AI RISK {r.aiRisk}</span>}
                    </div>
                    <p className="text-xs text-foreground/90 mb-1 truncate">
                      <span className="font-medium">{r.title}</span>
                      <span className="text-muted-foreground"> — {r.text}</span>
                    </p>
                    <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
                      <span className="flex items-center gap-0.5"><Globe className="h-2.5 w-2.5" /> {r.country}</span>
                      <span className="flex items-center gap-0.5"><Smartphone className="h-2.5 w-2.5" /> {r.device}</span>
                      <span>trust {r.trustScore}</span>
                      <span>spam {r.aiSpam}</span>
                      <span>fake {r.aiFake}</span>
                      <span>tox {r.aiToxicity}</span>
                      <span>{Math.round((Date.now() - r.createdAt) / 60_000)}m ago</span>
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1" onClick={e => e.stopPropagation()}>
                    <button title="Approve" onClick={() => updateStatus([r.id], 'approved', 'approved')} className="p-1 rounded hover:bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-3.5 w-3.5" /></button>
                    <button title="Reject" onClick={() => updateStatus([r.id], 'rejected', 'rejected')} className="p-1 rounded hover:bg-rose-500/10 text-rose-500"><XCircle className="h-3.5 w-3.5" /></button>
                    <button title="Spam" onClick={() => updateStatus([r.id], 'spam', 'marked.spam')} className="p-1 rounded hover:bg-fuchsia-500/10 text-fuchsia-400"><Ban className="h-3.5 w-3.5" /></button>
                    <button title="Open" onClick={() => setDrawer(r)} className="p-1 rounded hover:bg-muted text-muted-foreground"><ChevronRight className="h-3.5 w-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Side rail */}
        <div className="space-y-3">
          {/* Realtime feed */}
          <div className="rounded-lg border border-border bg-card">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <span className={cls('h-1.5 w-1.5 rounded-full', liveOn ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground')} />
                Live Feed
              </span>
              <Zap className="h-3 w-3 text-amber-500" />
            </div>
            <div className="max-h-48 overflow-y-auto divide-y divide-border">
              {feed.length === 0 && <div className="p-3 text-[11px] text-muted-foreground font-mono">Waiting for events…</div>}
              {feed.map(f => (
                <div key={f.id + f.t} className="px-3 py-1.5 text-[11px] flex items-center gap-2">
                  <Stars n={f.rating} size="xs" />
                  <span className="text-foreground truncate flex-1">{f.user}</span>
                  <span className="text-muted-foreground truncate">{f.product}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI ops */}
          <div className="rounded-lg border border-border bg-card p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Sparkles className="h-3 w-3 text-primary" /> AI Ops</span>
              <span className="text-[9px] font-mono text-emerald-500">ACTIVE</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              {[
                { l: 'Sentiment Analyzer', v: 'gemini-3-flash', s: 'ok' },
                { l: 'Spam Classifier', v: 'rules+ml', s: 'ok' },
                { l: 'Fake Review Detector', v: 'ensemble', s: 'ok' },
                { l: 'Toxicity Filter', v: 'perspective', s: 'ok' },
                { l: 'Fraud Pattern Engine', v: 'graph-v2', s: 'warn' },
              ].map(m => (
                <div key={m.l} className="flex items-center justify-between">
                  <span className="text-foreground">{m.l}</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-mono text-muted-foreground">{m.v}</span>
                    <span className={cls('h-1.5 w-1.5 rounded-full', m.s === 'ok' ? 'bg-emerald-500' : 'bg-amber-500')} />
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => toast.message('AI summary regenerated for visible reviews')} className="mt-2 w-full text-[11px] font-medium px-2 py-1.5 rounded bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30">
              Generate AI Summary
            </button>
          </div>

          {/* Audit log */}
          <div className="rounded-lg border border-border bg-card">
            <div className="px-3 py-2 border-b border-border flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5"><Shield className="h-3 w-3" /> Audit Log</span>
              <History className="h-3 w-3 text-muted-foreground" />
            </div>
            <div className="max-h-56 overflow-y-auto divide-y divide-border">
              {auditLog.map(l => (
                <div key={l.id} className="px-3 py-1.5 text-[10px] font-mono flex items-center justify-between">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-primary">{l.action}</span>
                    <span className="text-muted-foreground truncate">{l.target}</span>
                  </div>
                  <span className="text-muted-foreground">{Math.round((Date.now() - l.at) / 60_000)}m</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Investigation Drawer */}
      {drawer && <InvestigationDrawer review={drawer} onClose={() => setDrawer(null)} onAction={(s, label) => { updateStatus([drawer.id], s, label); setDrawer(null); }} onReply={(text) => { setReviews(prev => prev.map(r => r.id === drawer.id ? { ...r, reply: text } : r)); logAction('reply.sent', drawer.id); toast.success('Reply sent'); setDrawer(null); }} onNote={(text) => { setReviews(prev => prev.map(r => r.id === drawer.id ? { ...r, notes: text } : r)); logAction('note.added', drawer.id); toast.success('Note saved'); }} />}
    </div>
  );
};

// ─────────────────────────── Investigation Drawer ───────────────────────────
const InvestigationDrawer = ({ review, onClose, onAction, onReply, onNote }: {
  review: Review;
  onClose: () => void;
  onAction: (s: ReviewStatus, label: string) => void;
  onReply: (text: string) => void;
  onNote: (text: string) => void;
}) => {
  const [tab, setTab] = useState<'overview' | 'ai' | 'history' | 'reply'>('overview');
  const [replyText, setReplyText] = useState(review.reply ?? '');
  const [noteText, setNoteText] = useState(review.notes ?? '');

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-background/70 backdrop-blur-sm" onClick={onClose} />
      <aside className="w-full max-w-xl bg-card border-l border-border overflow-y-auto">
        <div className="sticky top-0 z-10 bg-card border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono text-muted-foreground">{review.id}</span>
            <StatusPill s={review.status} />
            {review.verified && <span className="text-[9px] font-mono text-emerald-500 flex items-center gap-0.5"><BadgeCheck className="h-3 w-3" /> VERIFIED</span>}
          </div>
          <button onClick={onClose} className="p-1 rounded hover:bg-muted text-muted-foreground"><X className="h-4 w-4" /></button>
        </div>

        <div className="p-4 space-y-3 border-b border-border">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Stars n={review.rating} />
              <span className="text-xs text-muted-foreground font-mono">{Math.round((Date.now() - review.createdAt) / 60_000)}m ago</span>
            </div>
            <h3 className="text-base font-semibold text-foreground">{review.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{review.text}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="flex items-center gap-1.5"><Users className="h-3 w-3 text-muted-foreground" /> {review.user} <span className="text-muted-foreground">({review.email})</span></div>
            <div className="flex items-center gap-1.5"><Package className="h-3 w-3 text-muted-foreground" /> {review.product}</div>
            <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" /> {review.country} · {review.ip}</div>
            <div className="flex items-center gap-1.5"><Smartphone className="h-3 w-3 text-muted-foreground" /> {review.device}</div>
            {review.orderId && <div className="flex items-center gap-1.5 col-span-2"><Hash className="h-3 w-3 text-muted-foreground" /> Order {review.orderId} <span className="text-emerald-500">· purchase verified</span></div>}
          </div>
        </div>

        <div className="flex border-b border-border">
          {(['overview', 'ai', 'history', 'reply'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} className={cls('flex-1 text-xs font-medium py-2 capitalize border-b-2 transition-colors', tab === t ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground')}>
              {t}
            </button>
          ))}
        </div>

        <div className="p-4 space-y-3">
          {tab === 'overview' && (
            <>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: 'Trust Score', v: review.trustScore, color: review.trustScore > 70 ? 'emerald' : 'amber' },
                  { l: 'AI Risk', v: review.aiRisk, color: review.aiRisk > 66 ? 'rose' : review.aiRisk > 33 ? 'amber' : 'emerald' },
                  { l: 'Spam Prob', v: review.aiSpam, color: review.aiSpam > 60 ? 'rose' : 'emerald' },
                  { l: 'Fake Prob', v: review.aiFake, color: review.aiFake > 60 ? 'rose' : 'emerald' },
                  { l: 'Toxicity', v: review.aiToxicity, color: review.aiToxicity > 50 ? 'rose' : 'emerald' },
                  { l: 'Reports', v: review.reported, color: review.reported > 0 ? 'orange' : 'emerald' },
                ].map(m => (
                  <div key={m.l} className="rounded border border-border p-2">
                    <div className="text-[10px] font-mono uppercase text-muted-foreground">{m.l}</div>
                    <div className="text-lg font-bold tabular-nums text-foreground">{m.v}</div>
                    <div className="h-1 mt-1 rounded-full bg-muted overflow-hidden">
                      <div className={cls('h-full', m.color === 'rose' ? 'bg-rose-500' : m.color === 'amber' ? 'bg-amber-500' : m.color === 'orange' ? 'bg-orange-500' : 'bg-emerald-500')} style={{ width: `${Math.min(100, m.v)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Internal Notes</div>
                <textarea value={noteText} onChange={e => setNoteText(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-xs h-20 focus:outline-none focus:border-primary/50" placeholder="Add moderation notes, escalation context…" />
                <button onClick={() => onNote(noteText)} className="mt-1 text-xs px-2 py-1 rounded bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20">Save Note</button>
              </div>
            </>
          )}
          {tab === 'ai' && (
            <div className="space-y-2 text-xs">
              <div className="rounded border border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center gap-1.5 mb-1.5"><Brain className="h-3 w-3 text-primary" /><span className="text-[10px] font-mono uppercase text-primary">AI Summary</span></div>
                <p className="text-foreground">
                  Customer expresses {review.sentiment} sentiment ({Math.round(review.aiRisk)}% risk). Key signals: {review.sentiment === 'negative' ? 'frustration with support, mention of refund delay' : 'praise for support, mention of value'}.
                  Recommended action: <span className="font-semibold text-primary">{review.aiRisk > 66 ? 'escalate to senior moderator' : review.aiRisk > 33 ? 'manual review' : 'auto-approve'}</span>.
                </p>
              </div>
              <div className="space-y-1.5">
                {['Sentiment', 'Spam Detection', 'Fake Review', 'Toxic Language', 'Fraud Pattern'].map((m, i) => {
                  const v = [review.sentiment === 'positive' ? 92 : review.sentiment === 'neutral' ? 60 : 30, 100 - review.aiSpam, 100 - review.aiFake, 100 - review.aiToxicity, 100 - review.aiRisk][i];
                  return (
                    <div key={m}>
                      <div className="flex justify-between text-[10px] font-mono"><span>{m}</span><span className="text-muted-foreground">confidence {v}%</span></div>
                      <div className="h-1.5 bg-muted rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-cyan-400" style={{ width: `${v}%` }} /></div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => toast.success('AI classification re-run complete')} className="w-full text-xs px-2 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 flex items-center justify-center gap-1.5"><RefreshCw className="h-3 w-3" /> Re-run AI Analysis</button>
            </div>
          )}
          {tab === 'history' && (
            <div className="space-y-2 text-xs">
              <div className="rounded border border-border p-2">
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Reviewer Profile</div>
                <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                  <div>Previous reviews: <span className="text-foreground">{review.prevReviews}</span></div>
                  <div>Trust score: <span className="text-foreground">{review.trustScore}</span></div>
                  <div>Verified buys: <span className="text-emerald-500">{Math.round(review.prevReviews * 0.7)}</span></div>
                  <div>Refunds: <span className="text-amber-500">{Math.round(review.prevReviews * 0.05)}</span></div>
                  <div>Abuse reports: <span className="text-rose-500">{Math.round(review.prevReviews * 0.02)}</span></div>
                  <div>Suspensions: <span className="text-foreground">0</span></div>
                </div>
              </div>
              <div className="rounded border border-border p-2">
                <div className="text-[10px] font-mono uppercase text-muted-foreground mb-1">Recent Reviews by {review.user}</div>
                <div className="space-y-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2 text-[11px]">
                      <Stars n={3 + rand(3)} size="xs" />
                      <span className="text-muted-foreground truncate flex-1">on {pick(PRODUCTS)}</span>
                      <span className="text-muted-foreground">{1 + i * 4}d</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          {tab === 'reply' && (
            <div className="space-y-2">
              <div className="text-[10px] font-mono uppercase text-muted-foreground">Public Author Response</div>
              <textarea value={replyText} onChange={e => setReplyText(e.target.value)} className="w-full bg-background border border-border rounded p-2 text-xs h-32 focus:outline-none focus:border-primary/50" placeholder="Thank you for your feedback…" />
              <div className="flex items-center gap-2">
                <button onClick={() => onReply(replyText)} disabled={!replyText.trim()} className="text-xs px-3 py-1.5 rounded bg-primary text-primary-foreground hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"><Reply className="h-3 w-3" /> Send Reply</button>
                <button onClick={() => toast.message('Suggested reply generated by AI')} className="text-xs px-3 py-1.5 rounded bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 flex items-center gap-1.5"><Sparkles className="h-3 w-3" /> AI Suggest</button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-3 grid grid-cols-2 sm:grid-cols-4 gap-2">
          <button onClick={() => onAction('approved', 'approved')} className="text-xs px-2 py-2 rounded bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center gap-1"><CheckCircle2 className="h-3 w-3" /> Approve</button>
          <button onClick={() => onAction('rejected', 'rejected')} className="text-xs px-2 py-2 rounded bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center gap-1"><XCircle className="h-3 w-3" /> Reject</button>
          <button onClick={() => onAction('spam', 'marked.spam')} className="text-xs px-2 py-2 rounded bg-fuchsia-500/10 text-fuchsia-400 hover:bg-fuchsia-500/20 border border-fuchsia-500/30 flex items-center justify-center gap-1"><Ban className="h-3 w-3" /> Spam</button>
          <button onClick={() => onAction('escalated', 'escalated')} className="text-xs px-2 py-2 rounded bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 border border-orange-500/30 flex items-center justify-center gap-1"><AlertOctagon className="h-3 w-3" /> Escalate</button>
        </div>
      </aside>
    </div>
  );
};

export default ReviewsPage;
