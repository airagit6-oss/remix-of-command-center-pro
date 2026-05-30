import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronDown,
  Globe2,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Store,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';

type Vendor = {
  id: string;
  name: string;
  owner: string;
  email: string;
  country: string;
  flag: string;
  tier: 'Direct' | 'Franchise' | 'Reseller' | 'White-label' | 'Featured';
  plan: 'Starter' | 'Growth' | 'Scale' | 'Enterprise';
  products: number;
  approvedRate: number;
  revenue: number;
  contribution: number;
  refundRate: number;
  rating: number;
  reviews: number;
  trust: number;
  fraud: number;
  health: number;
  growth: number;
  influence: number;
  payoutHold: number;
  payoutStatus: 'Cleared' | 'Scheduled' | 'On Hold' | 'Frozen';
  kyc: 'Verified' | 'Pending' | 'Re-check' | 'Failed';
  tax: 'Verified' | 'Pending';
  lastActivity: string;
  joinedDays: number;
  team: number;
  status: 'Active' | 'Pending' | 'Probation' | 'Suspended';
  spark: number[];
  flags: string[];
};

const seed: Vendor[] = [
  { id: 'VND-1042', name: 'CodeForge Studios', owner: 'Alex Mercer', email: 'alex@codeforge.io', country: 'United States', flag: '🇺🇸', tier: 'Featured', plan: 'Enterprise', products: 42, approvedRate: 98, revenue: 482000, contribution: 24.6, refundRate: 1.2, rating: 4.9, reviews: 1842, trust: 96, fraud: 4, health: 94, growth: 28, influence: 88, payoutHold: 0, payoutStatus: 'Cleared', kyc: 'Verified', tax: 'Verified', lastActivity: '2m ago', joinedDays: 812, team: 18, status: 'Active', spark: [22,28,32,38,44,50,58,64,72,80,88,96], flags: [] },
  { id: 'VND-1039', name: 'PixelLab', owner: 'Sarah Kapoor', email: 'sarah@pixellab.co', country: 'United Kingdom', flag: '🇬🇧', tier: 'Direct', plan: 'Scale', products: 24, approvedRate: 92, revenue: 228000, contribution: 11.4, refundRate: 2.4, rating: 4.7, reviews: 612, trust: 89, fraud: 8, health: 88, growth: 18, influence: 64, payoutHold: 0, payoutStatus: 'Scheduled', kyc: 'Verified', tax: 'Verified', lastActivity: '14m ago', joinedDays: 412, team: 8, status: 'Active', spark: [14,16,18,22,24,28,30,34,38,42,46,52], flags: [] },
  { id: 'VND-1054', name: 'NextWave Apps', owner: 'Priya Sundar', email: 'priya@nextwave.dev', country: 'India', flag: '🇮🇳', tier: 'Direct', plan: 'Growth', products: 9, approvedRate: 71, revenue: 94000, contribution: 4.6, refundRate: 5.1, rating: 4.2, reviews: 142, trust: 72, fraud: 22, health: 64, growth: 46, influence: 38, payoutHold: 4200, payoutStatus: 'On Hold', kyc: 'Pending', tax: 'Pending', lastActivity: '1h ago', joinedDays: 64, team: 3, status: 'Pending', spark: [4,6,8,10,12,14,18,22,28,32,36,42], flags: ['Awaiting KYC docs'] },
  { id: 'VND-1071', name: 'Aurora Components', owner: 'Léa Bernard', email: 'lea@aurora.fr', country: 'France', flag: '🇫🇷', tier: 'Franchise', plan: 'Scale', products: 31, approvedRate: 96, revenue: 312000, contribution: 15.6, refundRate: 1.8, rating: 4.8, reviews: 904, trust: 92, fraud: 6, health: 91, growth: 22, influence: 74, payoutHold: 0, payoutStatus: 'Cleared', kyc: 'Verified', tax: 'Verified', lastActivity: '7m ago', joinedDays: 612, team: 12, status: 'Active', spark: [18,22,24,28,32,38,44,48,54,60,66,72], flags: [] },
  { id: 'VND-1108', name: 'Helios Systems', owner: 'Mike Romero', email: 'mike@helios.dev', country: 'Canada', flag: '🇨🇦', tier: 'White-label', plan: 'Enterprise', products: 58, approvedRate: 99, revenue: 612000, contribution: 30.6, refundRate: 0.9, rating: 4.95, reviews: 2410, trust: 98, fraud: 2, health: 97, growth: 34, influence: 94, payoutHold: 0, payoutStatus: 'Cleared', kyc: 'Verified', tax: 'Verified', lastActivity: 'Just now', joinedDays: 1024, team: 28, status: 'Active', spark: [40,46,52,58,64,72,80,88,96,104,112,124], flags: [] },
  { id: 'VND-1122', name: 'Driftwood Co', owner: 'Emily Doan', email: 'emily@driftwood.studio', country: 'Singapore', flag: '🇸🇬', tier: 'Reseller', plan: 'Growth', products: 14, approvedRate: 84, revenue: 86000, contribution: 4.2, refundRate: 3.4, rating: 4.5, reviews: 218, trust: 81, fraud: 14, health: 78, growth: 24, influence: 48, payoutHold: 0, payoutStatus: 'Scheduled', kyc: 'Verified', tax: 'Verified', lastActivity: '3h ago', joinedDays: 248, team: 4, status: 'Active', spark: [10,12,14,16,18,20,22,24,28,32,34,38], flags: [] },
  { id: 'VND-1140', name: 'Vortex Forge', owner: 'James Wallis', email: 'james@vortex.app', country: 'Australia', flag: '🇦🇺', tier: 'Direct', plan: 'Starter', products: 6, approvedRate: 52, revenue: 18400, contribution: 0.9, refundRate: 11.2, rating: 3.6, reviews: 38, trust: 42, fraud: 71, health: 36, growth: -12, influence: 12, payoutHold: 9800, payoutStatus: 'Frozen', kyc: 'Re-check', tax: 'Pending', lastActivity: '11d ago', joinedDays: 92, team: 1, status: 'Probation', spark: [22,20,18,16,14,12,10,9,8,7,6,5], flags: ['Refund abuse pattern', 'Geo mismatch detected'] },
  { id: 'VND-1156', name: 'Lumen Atelier', owner: 'Anya Sokolova', email: 'anya@lumen.io', country: 'Netherlands', flag: '🇳🇱', tier: 'Franchise', plan: 'Scale', products: 22, approvedRate: 94, revenue: 198000, contribution: 9.9, refundRate: 2.1, rating: 4.7, reviews: 482, trust: 90, fraud: 7, health: 89, growth: 19, influence: 58, payoutHold: 0, payoutStatus: 'Cleared', kyc: 'Verified', tax: 'Verified', lastActivity: '42m ago', joinedDays: 388, team: 9, status: 'Active', spark: [14,18,20,22,26,28,32,36,40,44,48,54], flags: [] },
];

const tierTone: Record<Vendor['tier'], string> = {
  Direct: 'from-sky-300/25 to-sky-200/5 text-sky-200 border-sky-300/30',
  Franchise: 'from-violet-300/25 to-violet-200/5 text-violet-200 border-violet-300/30',
  Reseller: 'from-emerald-300/25 to-emerald-200/5 text-emerald-200 border-emerald-300/30',
  'White-label': 'from-amber-200/30 to-amber-100/5 text-amber-100 border-amber-200/40',
  Featured: 'from-rose-300/25 to-rose-200/5 text-rose-200 border-rose-300/30',
};

const statusTone: Record<Vendor['status'], string> = {
  Active: 'bg-emerald-400/10 text-emerald-200 border-emerald-300/20',
  Pending: 'bg-amber-300/10 text-amber-100 border-amber-200/25',
  Probation: 'bg-rose-400/10 text-rose-200 border-rose-300/25',
  Suspended: 'bg-white/5 text-white/50 border-white/10',
};

const payoutTone: Record<Vendor['payoutStatus'], string> = {
  Cleared: 'text-emerald-200',
  Scheduled: 'text-sky-200',
  'On Hold': 'text-amber-200',
  Frozen: 'text-rose-200',
};

const kycTone: Record<Vendor['kyc'], string> = {
  Verified: 'text-emerald-200',
  Pending: 'text-amber-200',
  'Re-check': 'text-rose-200',
  Failed: 'text-rose-300',
};

function Sparkline({ data, tone = 'emerald' }: { data: number[]; tone?: 'emerald' | 'rose' | 'sky' }) {
  const w = 96;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  const stroke = tone === 'rose' ? 'hsl(350 80% 70%)' : tone === 'sky' ? 'hsl(210 80% 70%)' : 'hsl(150 60% 65%)';
  const fill = tone === 'rose' ? 'hsl(350 80% 70% / 0.15)' : tone === 'sky' ? 'hsl(210 80% 70% / 0.15)' : 'hsl(150 60% 65% / 0.18)';
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={fill} />
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Ring({ value, tone }: { value: number; tone: 'good' | 'warn' | 'bad' }) {
  const r = 14;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  const stroke = tone === 'good' ? 'hsl(150 60% 65%)' : tone === 'warn' ? 'hsl(38 90% 70%)' : 'hsl(350 80% 72%)';
  return (
    <div className="relative h-9 w-9">
      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
        <circle cx="18" cy="18" r={r} stroke="hsl(0 0% 100% / 0.08)" strokeWidth="3" fill="none" />
        <circle cx="18" cy="18" r={r} stroke={stroke} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-semibold text-white/85">{value}</span>
    </div>
  );
}

const Logo = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('');
  return (
    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white/15 to-white/5 text-[12px] font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur">
      {initials}
    </div>
  );
};

const VendorsPage = () => {
  const { t } = useTranslation('common');
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Vendor['status']>('All');
  const [open, setOpen] = useState<string | null>('VND-1108');

  const filtered = useMemo(() => {
    return seed.filter(v => {
      const matchQ = !query || (v.name + v.owner + v.email + v.id + v.country).toLowerCase().includes(query.toLowerCase());
      const matchF = filter === 'All' || v.status === filter;
      return matchQ && matchF;
    });
  }, [query, filter]);

  const totalRevenue = seed.reduce((a, v) => a + v.revenue, 0);
  const activeCount = seed.filter(v => v.status === 'Active').length;
  const pendingCount = seed.filter(v => v.status === 'Pending').length;
  const flaggedCount = seed.filter(v => v.fraud > 40 || v.payoutStatus === 'Frozen' || v.payoutStatus === 'On Hold').length;

  const kpis = [
    { label: t('marketplace_gmv', { defaultValue: 'Marketplace GMV' }), value: `$${(totalRevenue / 1000).toFixed(0)}k`, sub: '+18.2% vs last mo', icon: TrendingUp, tone: 'sky' as const, spark: [20,26,30,38,46,52,60,68,76,84,92,104] },
    { label: t('active_vendors', { defaultValue: 'Active Vendors' }), value: activeCount.toString(), sub: `${seed.length} total accounts`, icon: Store, tone: 'emerald' as const, spark: [4,4,5,5,6,6,6,7,7,7,8,8] },
    { label: t('approval_queue', { defaultValue: 'Approval Queue' }), value: pendingCount.toString(), sub: 'AI scoring 1 high-trust', icon: ShieldCheck, tone: 'sky' as const, spark: [2,3,2,3,4,3,2,3,4,3,2,1] },
    { label: t('risk_radar', { defaultValue: 'Risk Radar' }), value: flaggedCount.toString(), sub: 'Auto-holds engaged', icon: Activity, tone: 'rose' as const, spark: [4,5,6,4,5,6,7,6,5,6,7,8] },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero header */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-violet-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              {t('live_vendor_command', { defaultValue: 'Live · Vendor Command' })}
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white/95">
              {t('global_vendor', { defaultValue: 'Global Vendor' })} <span className="bg-gradient-to-r from-sky-200 via-violet-200 to-amber-100 bg-clip-text text-transparent">{t('operations', { defaultValue: 'Operations' })}</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/50">
              Realtime intelligence over every seller, KYC pulse, payout cycle and AI fraud signal across the marketplace.
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Marketplace GMV</p>
              <p className="font-display text-2xl font-semibold text-white/95">${totalRevenue.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Trust Index</p>
              <p className="font-display text-2xl font-semibold text-emerald-200">92<span className="text-sm text-white/40">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl" />
            <div className="relative flex items-start justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04]">
                <k.icon className="h-4 w-4 text-white/80" />
              </div>
              <Sparkline data={k.spark} tone={k.tone} />
            </div>
            <div className="relative mt-4">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">{k.label}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-white/95">{k.value}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/50">
                <ArrowUpRight className="h-3 w-3" /> {k.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* AI strip */}
      <div className="relative overflow-hidden rounded-2xl border border-violet-200/15 bg-gradient-to-r from-violet-300/[0.06] via-sky-300/[0.04] to-emerald-300/[0.04] p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <Brain className="h-4 w-4 text-violet-200" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Atelier AI · Vendor Intelligence</p>
              <p className="text-sm text-white/85">1 vendor flagged for refund abuse · 2 trending toward featured status · 1 KYC re-check auto-scheduled</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Zap className="h-3 w-3 text-amber-200" /> Self-healing</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Activity className="h-3 w-3 text-emerald-200" /> Realtime</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Globe2 className="h-3 w-3 text-sky-200" /> 24 markets</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-[260px] max-w-md flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={t('search_vendor_placeholder', { defaultValue: 'Search vendor, owner, country, ID…' })}
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder:text-white/35 backdrop-blur focus:border-white/25 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
          {(['All', 'Active', 'Pending', 'Probation', 'Suspended'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                filter === f ? 'bg-white/10 text-white' : 'text-white/55 hover:text-white/85'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Vendor rows */}
      <div className="space-y-2.5">
        {filtered.map(v => {
          const isOpen = open === v.id;
          const trustTone: 'good' | 'warn' | 'bad' = v.trust > 80 ? 'good' : v.trust > 55 ? 'warn' : 'bad';
          const fraudTone: 'good' | 'warn' | 'bad' = v.fraud < 15 ? 'good' : v.fraud < 40 ? 'warn' : 'bad';
          return (
            <div
              key={v.id}
              className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-all ${
                isOpen
                  ? 'border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-[0_20px_60px_-30px_rgba(120,160,255,0.35)]'
                  : 'border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : v.id)}
                className="grid w-full grid-cols-[auto_1.6fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-4 text-left"
              >
                <Logo name={v.name} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white/95">{v.name}</p>
                    <span className={`inline-flex items-center gap-1 rounded-md border bg-gradient-to-r px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${tierTone[v.tier]}`}>{v.tier}</span>
                    <span className="hidden md:inline-flex rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/55">{v.plan}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/45">{v.owner} · <span className="text-white/35">{v.email}</span></p>
                </div>

                <div className="hidden md:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Region</p>
                  <p className="mt-0.5 text-sm text-white/85"><span className="mr-1.5">{v.flag}</span>{v.country}</p>
                </div>

                <div className="hidden lg:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Catalog · Revenue</p>
                  <p className="mt-0.5 text-sm text-white/85">{v.products} products <span className="text-white/40">· ${(v.revenue / 1000).toFixed(0)}k</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Trust</p>
                    <Ring value={v.trust} tone={trustTone} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Fraud</p>
                    <Ring value={v.fraud} tone={fraudTone} />
                  </div>
                  <Sparkline data={v.spark} tone={v.growth < 0 ? 'rose' : 'emerald'} />
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone[v.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {v.status}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 bg-white/[0.015] px-5 py-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Account */}
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Vendor Profile</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Vendor ID', v.id],
                          ['Onboarded', `${v.joinedDays} days ago`],
                          ['Team size', `${v.team} members`],
                          ['Plan', v.plan],
                          ['KYC', <span key="k" className={kycTone[v.kyc]}>{v.kyc}</span>],
                          ['Tax', v.tax],
                          ['Payouts', <span key="p" className={payoutTone[v.payoutStatus]}>{v.payoutStatus}{v.payoutHold ? ` · $${v.payoutHold.toLocaleString()} held` : ''}</span>],
                        ].map(([k, val], i) => (
                          <div key={i} className="flex items-center justify-between">
                            <span className="text-white/45">{k as string}</span>
                            <span className="font-medium text-white/85">{val as React.ReactNode}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Intelligence */}
                    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">AI Intelligence</p>
                      {[
                        { label: 'Trust Score', val: v.trust, tone: 'emerald' },
                        { label: 'Fraud Probability', val: v.fraud, tone: 'rose' },
                        { label: 'Marketplace Influence', val: v.influence, tone: 'sky' },
                        { label: 'Catalog Health', val: v.health, tone: 'emerald' },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-white/55">{m.label}</span>
                            <span className="font-semibold text-white/90">{m.val}%</span>
                          </div>
                          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/[0.05]">
                            <div
                              className={`h-full rounded-full ${
                                m.tone === 'rose' ? 'bg-gradient-to-r from-rose-300/80 to-rose-200/40' :
                                m.tone === 'sky' ? 'bg-gradient-to-r from-sky-300/80 to-sky-200/40' :
                                'bg-gradient-to-r from-emerald-300/80 to-emerald-200/40'
                              }`}
                              style={{ width: `${Math.max(0, Math.min(100, m.val))}%` }}
                            />
                          </div>
                        </div>
                      ))}
                      {v.flags.length > 0 && (
                        <div className="mt-2 space-y-1.5">
                          {v.flags.map(f => (
                            <p key={f} className="rounded-md border border-rose-300/20 bg-rose-400/[0.06] px-2 py-1 text-[11px] text-rose-200">⚠ {f}</p>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Performance */}
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Performance Signals</p>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {[
                          ['Rating', `★ ${v.rating}`],
                          ['Reviews', v.reviews.toLocaleString()],
                          ['Approval', `${v.approvedRate}%`],
                          ['Refunds', `${v.refundRate}%`],
                          ['Growth', `${v.growth > 0 ? '+' : ''}${v.growth}%`],
                          ['Share', `${v.contribution}%`],
                        ].map(([k, val]) => (
                          <div key={k} className="rounded-lg border border-white/10 bg-white/[0.025] p-2.5">
                            <p className="text-[10px] uppercase tracking-widest text-white/40">{k}</p>
                            <p className="mt-0.5 font-semibold text-white/90">{val}</p>
                          </div>
                        ))}
                      </div>
                      <div className="pt-1 text-[11px] text-white/45">Last activity · {v.lastActivity}</div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent px-4 py-3">
                    <div className="flex items-center gap-4 text-sm text-white/70">
                      <span className="inline-flex items-center gap-2"><Wallet className="h-4 w-4 text-white/50" /> Lifetime revenue <span className="font-semibold text-white/95">${v.revenue.toLocaleString()}</span></span>
                      <span className="hidden md:inline-flex items-center gap-2"><Package className="h-4 w-4 text-white/50" /> {v.products} live products</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/55">
                      <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                      AI forecast · {v.growth > 0 ? `+${v.growth}% next quarter` : `${v.growth}% contraction risk`}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default VendorsPage;
