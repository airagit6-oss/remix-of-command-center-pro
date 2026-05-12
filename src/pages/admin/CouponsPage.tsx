import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronDown,
  Copy,
  Globe2,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Trash2,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

type CouponType =
  | 'Percentage'
  | 'Flat'
  | 'BOGO'
  | 'Free Shipping'
  | 'Trial'
  | 'Subscription'
  | 'First Purchase'
  | 'VIP'
  | 'Festival'
  | 'Flash'
  | 'Referral'
  | 'Influencer'
  | 'Franchise'
  | 'AI Dynamic'
  | 'Hidden';

type Coupon = {
  code: string;
  description: string;
  type: CouponType;
  discountLabel: string;
  discountValue: number;
  used: number;
  limit: number; // 0 = unlimited
  startDate: string;
  endDate: string; // ISO or 'No expiry'
  exp: string; // legacy display
  countries: string[];
  currency: string;
  createdBy: string;
  lastUsed: string;
  fraud: number;
  revenue: number;
  active: boolean;
  spark: number[];
};

const seed: Coupon[] = [
  {
    code: 'SUMMER25',
    description: 'Seasonal summer campaign — 25% storefront-wide.',
    type: 'Percentage',
    discountLabel: '25% off',
    discountValue: 25,
    used: 142,
    limit: 500,
    startDate: 'Jun 01, 2025',
    endDate: 'Jul 31, 2025',
    exp: 'Jul 31, 2025',
    countries: ['US', 'UK', 'CA', 'DE'],
    currency: 'USD',
    createdBy: 'Alex Mercer',
    lastUsed: '2m ago',
    fraud: 6,
    revenue: 38420,
    active: true,
    spark: [4, 8, 12, 18, 22, 28, 36, 44, 52, 60, 68, 78],
  },
  {
    code: 'WELCOME10',
    description: 'Auto-applied for first-time signups.',
    type: 'First Purchase',
    discountLabel: '10% off',
    discountValue: 10,
    used: 892,
    limit: 0,
    startDate: 'Jan 01, 2025',
    endDate: 'No expiry',
    exp: 'No expiry',
    countries: ['Global'],
    currency: 'Multi',
    createdBy: 'System Auto',
    lastUsed: 'Just now',
    fraud: 3,
    revenue: 124800,
    active: true,
    spark: [20, 24, 28, 32, 38, 44, 52, 58, 64, 72, 80, 92],
  },
  {
    code: 'BFCM50',
    description: 'Black Friday flash sale — half off everything.',
    type: 'Flash',
    discountLabel: '50% off',
    discountValue: 50,
    used: 500,
    limit: 500,
    startDate: 'Nov 24, 2024',
    endDate: 'Dec 01, 2024',
    exp: 'Dec 1, 2024',
    countries: ['Global'],
    currency: 'Multi',
    createdBy: 'Sarah Kapoor',
    lastUsed: '142d ago',
    fraud: 18,
    revenue: 92400,
    active: false,
    spark: [42, 48, 56, 62, 68, 60, 48, 32, 18, 8, 4, 2],
  },
  {
    code: 'VIP100',
    description: 'Reserved for top 1% lifetime spenders.',
    type: 'VIP',
    discountLabel: '$100 off',
    discountValue: 100,
    used: 24,
    limit: 100,
    startDate: 'Mar 01, 2025',
    endDate: 'Dec 31, 2025',
    exp: 'Dec 31, 2025',
    countries: ['Global'],
    currency: 'USD',
    createdBy: 'Mike Romero',
    lastUsed: '1h ago',
    fraud: 1,
    revenue: 28200,
    active: true,
    spark: [2, 3, 4, 6, 8, 10, 12, 14, 16, 18, 22, 24],
  },
  {
    code: 'SHIPFREE',
    description: 'Free shipping over $40 — auto-stacks with sales.',
    type: 'Free Shipping',
    discountLabel: 'Free shipping',
    discountValue: 0,
    used: 1240,
    limit: 0,
    startDate: 'Feb 01, 2025',
    endDate: 'No expiry',
    exp: 'No expiry',
    countries: ['US', 'CA'],
    currency: 'USD',
    createdBy: 'System Auto',
    lastUsed: '3m ago',
    fraud: 2,
    revenue: 0,
    active: true,
    spark: [30, 38, 44, 52, 58, 66, 72, 80, 88, 96, 104, 116],
  },
  {
    code: 'AIBOOST',
    description: 'AI-tuned discount adjusting to user LTV.',
    type: 'AI Dynamic',
    discountLabel: '12–35% off',
    discountValue: 22,
    used: 318,
    limit: 1000,
    startDate: 'Apr 14, 2025',
    endDate: 'Aug 14, 2025',
    exp: 'Aug 14, 2025',
    countries: ['Global'],
    currency: 'Multi',
    createdBy: 'AI Engine',
    lastUsed: '8m ago',
    fraud: 4,
    revenue: 64200,
    active: true,
    spark: [6, 10, 14, 20, 26, 34, 42, 50, 58, 66, 74, 82],
  },
  {
    code: 'REFER20',
    description: 'Referral reward — both sides get $20.',
    type: 'Referral',
    discountLabel: '$20 off',
    discountValue: 20,
    used: 412,
    limit: 5000,
    startDate: 'Jan 15, 2025',
    endDate: 'No expiry',
    exp: 'No expiry',
    countries: ['Global'],
    currency: 'USD',
    createdBy: 'Growth Bot',
    lastUsed: '22m ago',
    fraud: 11,
    revenue: 18400,
    active: true,
    spark: [8, 12, 14, 18, 22, 24, 28, 32, 36, 40, 44, 48],
  },
  {
    code: 'GHOST88',
    description: 'Hidden coupon — surfaced only via partner links.',
    type: 'Hidden',
    discountLabel: '88% off',
    discountValue: 88,
    used: 6,
    limit: 50,
    startDate: 'May 01, 2025',
    endDate: 'May 31, 2025',
    exp: 'May 31, 2025',
    countries: ['JP', 'KR', 'SG'],
    currency: 'USD',
    createdBy: 'Anya Sokolova',
    lastUsed: '4h ago',
    fraud: 28,
    revenue: 1840,
    active: true,
    spark: [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6],
  },
];

const typeTone: Record<CouponType, string> = {
  Percentage: 'from-sky-300/25 to-sky-200/5 text-sky-200 border-sky-300/30',
  Flat: 'from-emerald-300/25 to-emerald-200/5 text-emerald-200 border-emerald-300/30',
  BOGO: 'from-fuchsia-300/25 to-fuchsia-200/5 text-fuchsia-200 border-fuchsia-300/30',
  'Free Shipping': 'from-cyan-300/25 to-cyan-200/5 text-cyan-200 border-cyan-300/30',
  Trial: 'from-indigo-300/25 to-indigo-200/5 text-indigo-200 border-indigo-300/30',
  Subscription: 'from-violet-300/25 to-violet-200/5 text-violet-200 border-violet-300/30',
  'First Purchase': 'from-teal-300/25 to-teal-200/5 text-teal-200 border-teal-300/30',
  VIP: 'from-amber-200/30 to-amber-100/5 text-amber-100 border-amber-200/40',
  Festival: 'from-pink-300/25 to-pink-200/5 text-pink-200 border-pink-300/30',
  Flash: 'from-orange-300/25 to-orange-200/5 text-orange-200 border-orange-300/30',
  Referral: 'from-lime-300/25 to-lime-200/5 text-lime-200 border-lime-300/30',
  Influencer: 'from-rose-300/25 to-rose-200/5 text-rose-200 border-rose-300/30',
  Franchise: 'from-blue-300/25 to-blue-200/5 text-blue-200 border-blue-300/30',
  'AI Dynamic': 'from-violet-400/30 to-cyan-300/10 text-violet-100 border-violet-300/40',
  Hidden: 'from-zinc-200/20 to-zinc-100/5 text-zinc-200 border-zinc-300/20',
};

const Sparkline = ({ data, tone = 'cyan' }: { data: number[]; tone?: 'cyan' | 'amber' | 'rose' | 'emerald' }) => {
  const w = 120;
  const h = 32;
  const max = Math.max(...data, 1);
  const min = Math.min(...data);
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / Math.max(max - min, 1)) * h;
      return `${x},${y}`;
    })
    .join(' ');
  const color =
    tone === 'amber'
      ? 'hsl(38 92% 65%)'
      : tone === 'rose'
        ? 'hsl(350 90% 70%)'
        : tone === 'emerald'
          ? 'hsl(160 80% 60%)'
          : 'hsl(190 90% 70%)';
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <defs>
        <linearGradient id={`spk-${tone}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={`0,${h} ${pts} ${w},${h}`} fill={`url(#spk-${tone})`} stroke="none" />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const Ring = ({ value, tone = 'cyan', label }: { value: number; tone?: 'cyan' | 'amber' | 'rose' | 'emerald' | 'violet'; label: string }) => {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  const color =
    tone === 'amber'
      ? 'hsl(38 92% 65%)'
      : tone === 'rose'
        ? 'hsl(350 90% 70%)'
        : tone === 'emerald'
          ? 'hsl(160 80% 60%)'
          : tone === 'violet'
            ? 'hsl(265 90% 75%)'
            : 'hsl(190 90% 70%)';
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width="56" height="56" viewBox="0 0 56 56" className="-rotate-90">
        <circle cx="28" cy="28" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="4" fill="none" />
        <circle
          cx="28"
          cy="28"
          r={r}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
      <div className="-mt-7 text-sm font-semibold text-white">{Math.round(value)}</div>
    </div>
  );
};

const Bar = ({ value, tone }: { value: number; tone: 'cyan' | 'amber' | 'rose' | 'emerald' }) => {
  const color =
    tone === 'amber'
      ? 'from-amber-400/80 to-amber-200/40'
      : tone === 'rose'
        ? 'from-rose-400/80 to-rose-200/40'
        : tone === 'emerald'
          ? 'from-emerald-400/80 to-emerald-200/40'
          : 'from-cyan-400/80 to-cyan-200/40';
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
      <div
        className={`h-full bg-gradient-to-r ${color} transition-all duration-700`}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

const fmt = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `$${(n / 1_000).toFixed(1)}k` : `$${n}`;

type FilterKey = 'all' | 'active' | 'inactive' | 'risk' | 'expiring';

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', percent: '10', limit: '', exp: '', type: 'Percentage' as CouponType });
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<FilterKey>('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 4000);
    return () => clearInterval(id);
  }, []);

  // gentle realtime: nudge usage on active coupons
  useEffect(() => {
    setCoupons((prev) =>
      prev.map((c) =>
        c.active && (c.limit === 0 || c.used < c.limit)
          ? { ...c, used: c.used + (Math.random() < 0.4 ? 1 : 0), revenue: c.revenue + Math.floor(Math.random() * 60) }
          : c,
      ),
    );
  }, [tick]);

  const stats = useMemo(() => {
    const totalRev = coupons.reduce((s, c) => s + c.revenue, 0);
    const totalUses = coupons.reduce((s, c) => s + c.used, 0);
    const active = coupons.filter((c) => c.active).length;
    const avgFraud = Math.round(coupons.reduce((s, c) => s + c.fraud, 0) / Math.max(coupons.length, 1));
    return { totalRev, totalUses, active, avgFraud };
  }, [coupons]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return coupons.filter((c) => {
      if (q && !`${c.code} ${c.description} ${c.type}`.toLowerCase().includes(q)) return false;
      if (filter === 'active' && !c.active) return false;
      if (filter === 'inactive' && c.active) return false;
      if (filter === 'risk' && c.fraud < 15) return false;
      if (filter === 'expiring') {
        if (c.endDate === 'No expiry') return false;
        const days = (new Date(c.endDate).getTime() - Date.now()) / 86400000;
        if (!(days >= 0 && days < 45)) return false;
      }
      return true;
    });
  }, [coupons, query, filter]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const code = form.code.trim().toUpperCase();
    const pct = Number(form.percent);
    if (!code) return toast.error('Coupon code is required');
    if (!/^[A-Z0-9_-]{3,20}$/.test(code)) return toast.error('Code must be 3–20 chars (A-Z, 0-9, _ or -)');
    if (Number.isNaN(pct) || pct <= 0 || pct > 100) return toast.error('Discount must be 1–100');
    if (coupons.some((c) => c.code === code)) return toast.error('Coupon code already exists');
    setBusy(true);
    setTimeout(() => {
      const limit = Number(form.limit) || 0;
      setCoupons((prev) => [
        {
          code,
          description: 'Custom campaign coupon.',
          type: form.type,
          discountLabel: `${pct}% off`,
          discountValue: pct,
          used: 0,
          limit,
          startDate: 'Today',
          endDate: form.exp.trim() || 'No expiry',
          exp: form.exp.trim() || 'No expiry',
          countries: ['Global'],
          currency: 'Multi',
          createdBy: 'You',
          lastUsed: '—',
          fraud: 2,
          revenue: 0,
          active: true,
          spark: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
        ...prev,
      ]);
      toast.success(`Coupon ${code} created`);
      setForm({ code: '', percent: '10', limit: '', exp: '', type: 'Percentage' });
      setOpen(false);
      setBusy(false);
    }, 250);
  };

  const toggle = (code: string) => {
    setCoupons((prev) => prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c)));
    const c = coupons.find((x) => x.code === code);
    toast.success(`Coupon ${code} ${c?.active ? 'paused' : 'activated'}`);
  };

  const remove = (code: string) => {
    if (!window.confirm(`Delete coupon ${code}?`)) return;
    setCoupons((prev) => prev.filter((c) => c.code !== code));
    toast.success(`Coupon ${code} deleted`);
  };

  const duplicate = (code: string) => {
    const src = coupons.find((c) => c.code === code);
    if (!src) return;
    let i = 2;
    let next = `${code}-V${i}`;
    while (coupons.some((c) => c.code === next)) next = `${code}-V${++i}`;
    setCoupons((prev) => [{ ...src, code: next, used: 0, revenue: 0, active: false }, ...prev]);
    toast.success(`Duplicated as ${next}`);
  };

  return (
    <div className="relative min-h-full bg-[radial-gradient(1200px_600px_at_20%_-10%,hsl(220_80%_25%/0.35),transparent_60%),radial-gradient(900px_500px_at_100%_0%,hsl(280_70%_35%/0.25),transparent_55%),linear-gradient(180deg,hsl(225_45%_8%),hsl(225_50%_5%))] -m-6 p-6 text-white">
      {/* HEADER */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-cyan-200/80">
            <Sparkles className="h-3 w-3" /> Global Coupon Engine
          </div>
          <h1 className="bg-gradient-to-r from-white via-white to-cyan-200 bg-clip-text text-3xl font-semibold tracking-tight text-transparent">
            Coupon Command Center
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Realtime promotions, AI-tuned discounting, fraud radar, and global campaign orchestration.
          </p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-xl border border-cyan-300/30 bg-gradient-to-r from-cyan-400/20 via-sky-400/20 to-violet-400/20 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_30px_-5px_hsl(190_90%_60%/0.4)] transition hover:shadow-[0_0_40px_-2px_hsl(190_90%_60%/0.6)]"
        >
          <Plus className="h-4 w-4" />
          New campaign
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
        </button>
      </div>

      {/* KPI HERO */}
      <div className="mb-5 grid grid-cols-1 gap-3 md:grid-cols-4">
        {[
          { label: 'Coupon Revenue', value: fmt(stats.totalRev), foot: 'Realtime · all campaigns', icon: TrendingUp, tone: 'cyan' as const, spark: [10, 14, 18, 22, 28, 36, 44, 52, 62, 72, 84, 98] },
          { label: 'Active Campaigns', value: `${stats.active}/${coupons.length}`, foot: 'Auto-managed schedule', icon: Activity, tone: 'emerald' as const, spark: [3, 4, 4, 5, 5, 6, 6, 7, 7, 7, 8, 8] },
          { label: 'Total Redemptions', value: stats.totalUses.toLocaleString(), foot: 'Across all regions', icon: Zap, tone: 'violet' as const, spark: [40, 48, 58, 68, 80, 92, 110, 124, 142, 168, 196, 224] },
          { label: 'Fraud Index', value: `${stats.avgFraud}%`, foot: 'AI fraud radar', icon: ShieldCheck, tone: 'amber' as const, spark: [12, 10, 8, 14, 18, 12, 10, 8, 6, 9, 8, 7] },
        ].map((k) => (
          <div
            key={k.label}
            className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-xl transition hover:border-white/20 hover:bg-white/[0.05]"
          >
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/10 via-violet-400/5 to-transparent blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-white/50">{k.label}</div>
                <div className="mt-1 text-2xl font-semibold tracking-tight text-white">{k.value}</div>
                <div className="mt-1 text-[11px] text-white/40">{k.foot}</div>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/5 p-1.5 text-cyan-200">
                <k.icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <Sparkline data={k.spark} tone={k.tone === 'violet' ? 'cyan' : k.tone} />
            </div>
          </div>
        ))}
      </div>

      {/* AI INTEL STRIP */}
      <div className="mb-5 flex flex-wrap items-center gap-2 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-violet-500/10 via-cyan-500/5 to-transparent p-3 text-xs text-white/70 backdrop-blur-xl">
        <Brain className="h-4 w-4 text-violet-200" />
        <span className="font-semibold text-violet-100">AI Coupon Engine</span>
        <span className="mx-1 text-white/30">•</span>
        <span className="rounded-full border border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-emerald-200">+18% redemption forecast for AIBOOST</span>
        <span className="rounded-full border border-amber-300/20 bg-amber-400/10 px-2 py-0.5 text-amber-100">GHOST88 farming pattern detected · 3 IPs throttled</span>
        <span className="rounded-full border border-rose-300/20 bg-rose-400/10 px-2 py-0.5 text-rose-200">BFCM50 archived · campaign expired</span>
        <span className="ml-auto inline-flex items-center gap-1 text-cyan-200">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
          </span>
          Live
        </span>
      </div>

      {/* CONTROLS */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search coupons, type, description…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-9 pr-3 text-sm text-white placeholder:text-white/30 outline-none backdrop-blur-xl transition focus:border-cyan-300/40"
          />
        </div>
        {([
          ['all', 'All'],
          ['active', 'Active'],
          ['inactive', 'Paused'],
          ['risk', 'AI risk'],
          ['expiring', 'Expiring'],
        ] as [FilterKey, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
              filter === k
                ? 'border-cyan-300/40 bg-cyan-400/10 text-cyan-100'
                : 'border-white/10 bg-white/[0.03] text-white/60 hover:border-white/20 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* COUPON LIST */}
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
        <div className="grid grid-cols-12 border-b border-white/10 bg-white/[0.03] px-5 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
          <div className="col-span-3">Campaign</div>
          <div className="col-span-2">Type / Discount</div>
          <div className="col-span-2">Usage</div>
          <div className="col-span-2">Window</div>
          <div className="col-span-2">Performance</div>
          <div className="col-span-1 text-right">Actions</div>
        </div>

        <div className="divide-y divide-white/5">
          {filtered.map((c) => {
            const usagePct = c.limit ? Math.min(100, (c.used / c.limit) * 100) : Math.min(100, c.used / 20);
            const fraudTone: 'emerald' | 'amber' | 'rose' = c.fraud < 10 ? 'emerald' : c.fraud < 20 ? 'amber' : 'rose';
            const sparkTone: 'cyan' | 'amber' | 'rose' | 'emerald' = !c.active ? 'rose' : fraudTone === 'rose' ? 'amber' : 'cyan';
            const isOpen = expanded === c.code;
            const daysLeft =
              c.endDate === 'No expiry' ? null : Math.ceil((new Date(c.endDate).getTime() - Date.now()) / 86400000);
            return (
              <div key={c.code} className="group">
                <div
                  onClick={() => setExpanded(isOpen ? null : c.code)}
                  className="grid cursor-pointer grid-cols-12 items-center gap-2 px-5 py-4 transition hover:bg-white/[0.03]"
                >
                  {/* Campaign */}
                  <div className="col-span-3 flex items-center gap-3">
                    <div className={`relative grid h-11 w-11 place-items-center rounded-xl border bg-gradient-to-br ${typeTone[c.type]}`}>
                      <Ticket className="h-5 w-5" />
                      {c.active && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[hsl(225_50%_5%)]" />
                        </span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold tracking-wider text-white">{c.code}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard?.writeText(c.code);
                            toast.success('Copied');
                          }}
                          className="rounded-md p-1 text-white/40 hover:bg-white/10 hover:text-white"
                          aria-label="Copy code"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="truncate text-xs text-white/50">{c.description}</div>
                    </div>
                  </div>

                  {/* Type / Discount */}
                  <div className="col-span-2">
                    <span className={`inline-flex items-center gap-1 rounded-full border bg-gradient-to-r px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${typeTone[c.type]}`}>
                      {c.type}
                    </span>
                    <div className="mt-1 bg-gradient-to-r from-white via-cyan-100 to-violet-200 bg-clip-text text-base font-semibold tracking-tight text-transparent">
                      {c.discountLabel}
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="col-span-2">
                    <div className="mb-1 flex items-center justify-between text-[11px] text-white/60">
                      <span className="font-mono text-white/80">
                        {c.used.toLocaleString()}
                        <span className="text-white/30"> / {c.limit ? c.limit.toLocaleString() : '∞'}</span>
                      </span>
                      <span className="text-white/40">{Math.round(usagePct)}%</span>
                    </div>
                    <Bar value={usagePct} tone={usagePct > 90 ? 'rose' : usagePct > 60 ? 'amber' : 'cyan'} />
                    <div className="mt-1 text-[10px] text-white/40">Last used · {c.lastUsed}</div>
                  </div>

                  {/* Window */}
                  <div className="col-span-2">
                    <div className="text-xs text-white/70">{c.endDate}</div>
                    <div className="mt-0.5 text-[10px] text-white/40">
                      {daysLeft === null
                        ? 'No expiry'
                        : daysLeft < 0
                          ? `Expired ${Math.abs(daysLeft)}d ago`
                          : daysLeft === 0
                            ? 'Expires today'
                            : `${daysLeft}d remaining`}
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 text-[10px] text-white/50">
                      <Globe2 className="h-3 w-3" /> {c.countries.slice(0, 2).join(', ')}
                      {c.countries.length > 2 && ` +${c.countries.length - 2}`}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="col-span-2 flex items-center gap-3">
                    <Sparkline data={c.spark} tone={sparkTone} />
                    <div>
                      <div className="text-sm font-semibold text-white">{fmt(c.revenue)}</div>
                      <div className={`inline-flex items-center gap-0.5 text-[10px] ${c.active ? 'text-emerald-300' : 'text-white/40'}`}>
                        <ArrowUpRight className="h-3 w-3" /> revenue
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 flex items-center justify-end gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggle(c.code);
                      }}
                      className={`rounded-lg border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider transition ${
                        c.active
                          ? 'border-emerald-300/30 bg-emerald-400/10 text-emerald-200 hover:bg-emerald-400/20'
                          : 'border-white/10 bg-white/5 text-white/50 hover:bg-white/10'
                      }`}
                    >
                      {c.active ? 'Live' : 'Off'}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicate(c.code);
                      }}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white"
                      aria-label="Duplicate"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(c.code);
                      }}
                      className="rounded-lg p-1.5 text-white/40 hover:bg-rose-400/10 hover:text-rose-300"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                    <ChevronDown className={`h-4 w-4 text-white/30 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {isOpen && (
                  <div className="grid grid-cols-12 gap-4 border-t border-white/5 bg-gradient-to-b from-white/[0.02] to-transparent px-5 py-5">
                    {/* Intelligence rings */}
                    <div className="col-span-12 flex items-center justify-around rounded-xl border border-white/10 bg-white/[0.02] p-4 lg:col-span-4">
                      <Ring value={Math.max(20, 100 - c.fraud * 2)} tone="cyan" label="Trust" />
                      <Ring value={usagePct} tone={usagePct > 90 ? 'rose' : 'emerald'} label="Usage" />
                      <Ring value={c.fraud} tone={fraudTone} label="Fraud" />
                      <Ring value={c.active ? 88 : 24} tone="violet" label="AI Score" />
                    </div>

                    {/* Meta */}
                    <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-5">
                      {[
                        ['Created by', c.createdBy],
                        ['Currency', c.currency],
                        ['Start', c.startDate],
                        ['End', c.endDate],
                        ['Countries', c.countries.join(' · ')],
                        ['Discount value', c.discountLabel],
                      ].map(([k, v]) => (
                        <div key={k} className="rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2">
                          <div className="text-[10px] uppercase tracking-wider text-white/40">{k}</div>
                          <div className="mt-0.5 text-xs text-white/85">{v}</div>
                        </div>
                      ))}
                    </div>

                    {/* Self-healing timeline */}
                    <div className="col-span-12 rounded-xl border border-white/10 bg-white/[0.02] p-4 lg:col-span-3">
                      <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-white/50">
                        <Activity className="h-3 w-3" /> Self-healing timeline
                      </div>
                      <ol className="relative space-y-2 border-l border-white/10 pl-3">
                        {[
                          { t: 'Now', d: c.active ? 'Auto-monitoring redemptions' : 'Campaign paused', tone: c.active ? 'emerald' : 'rose' },
                          { t: '2h', d: 'AI fraud sweep completed', tone: 'cyan' },
                          { t: '1d', d: 'Region weights rebalanced', tone: 'violet' },
                          { t: '3d', d: 'Schedule auto-optimized', tone: 'amber' },
                        ].map((e, i) => (
                          <li key={i} className="text-[11px] text-white/70">
                            <span
                              className={`absolute -left-[5px] mt-1 h-2 w-2 rounded-full ${
                                e.tone === 'emerald'
                                  ? 'bg-emerald-400'
                                  : e.tone === 'rose'
                                    ? 'bg-rose-400'
                                    : e.tone === 'amber'
                                      ? 'bg-amber-400'
                                      : e.tone === 'violet'
                                        ? 'bg-violet-400'
                                        : 'bg-cyan-400'
                              }`}
                            />
                            <div className="text-white/85">{e.d}</div>
                            <div className="text-[10px] text-white/40">{e.t} ago</div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="px-5 py-16 text-center text-sm text-white/50">No coupons match this filter.</div>
          )}
        </div>
      </div>

      {/* CREATE MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => !busy && setOpen(false)}>
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleCreate}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-white/10 bg-gradient-to-b from-[hsl(225_45%_12%)] to-[hsl(225_50%_7%)] p-6 text-white shadow-[0_30px_80px_-20px_hsl(190_90%_50%/0.3)]"
          >
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-cyan-200/80">New Campaign</div>
              <h2 className="mt-1 text-lg font-semibold">Launch a coupon</h2>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-white/70">Code *</label>
              <input
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                required
                placeholder="SUMMER25"
                className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 font-mono text-sm uppercase outline-none focus:border-cyan-300/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value as CouponType }))}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-cyan-300/40"
                >
                  {(['Percentage', 'Flat', 'Free Shipping', 'Trial', 'Subscription', 'First Purchase', 'VIP', 'Flash', 'Referral', 'AI Dynamic', 'Hidden'] as CouponType[]).map((t) => (
                    <option key={t} value={t} className="bg-[hsl(225_45%_10%)]">
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">Discount % *</label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={form.percent}
                  onChange={(e) => setForm((f) => ({ ...f, percent: e.target.value }))}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-cyan-300/40"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">Usage limit</label>
                <input
                  value={form.limit}
                  onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
                  placeholder="Unlimited"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-cyan-300/40"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-white/70">Expires</label>
                <input
                  value={form.exp}
                  onChange={(e) => setForm((f) => ({ ...f, exp: e.target.value }))}
                  placeholder="e.g. Dec 31, 2025"
                  className="w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm outline-none focus:border-cyan-300/40"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={busy}
                className="rounded-lg border border-white/10 px-4 py-2 text-sm font-medium text-white/70 hover:bg-white/5 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={busy}
                className="rounded-lg border border-cyan-300/30 bg-gradient-to-r from-cyan-400/30 via-sky-400/30 to-violet-400/30 px-4 py-2 text-sm font-semibold text-white shadow-[0_0_30px_-5px_hsl(190_90%_60%/0.5)] hover:shadow-[0_0_40px_-2px_hsl(190_90%_60%/0.7)] disabled:opacity-50"
              >
                {busy ? 'Launching…' : 'Launch coupon'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
