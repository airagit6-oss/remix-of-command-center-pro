import { useMemo, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronDown,
  CreditCard,
  Globe2,
  Heart,
  Search,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';

type Sub = {
  id: string;
  user: string;
  email: string;
  company: string;
  plan: 'Basic' | 'Pro' | 'Unlimited' | 'Enterprise';
  tier: 'Direct' | 'Franchise' | 'Reseller' | 'Team' | 'White-label';
  billing: 'Monthly' | 'Yearly' | 'Lifetime';
  currency: string;
  country: string;
  flag: string;
  gateway: 'Stripe' | 'Paddle' | 'Razorpay' | 'PayPal';
  amount: number;
  ltv: number;
  ageDays: number;
  devices: number;
  seats: number;
  health: number; // 0-100 renewal health
  churn: number; // 0-100 churn risk
  upgrade: number; // 0-100 upgrade probability
  engagement: number;
  lastActivity: string;
  startDate: string;
  renewAt: string;
  status: 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
  spark: number[];
};

const seed: Sub[] = [
  { id: 'SUB-0001', user: 'Alex Chen', email: 'alex@northwind.io', company: 'Northwind Labs', plan: 'Pro', tier: 'Direct', billing: 'Monthly', currency: 'USD', country: 'United States', flag: '🇺🇸', gateway: 'Stripe', amount: 79, ltv: 2840, ageDays: 412, devices: 4, seats: 6, health: 96, churn: 6, upgrade: 71, engagement: 88, lastActivity: '2m ago', startDate: '2025-01-04', renewAt: '2026-06-04', status: 'Active', spark: [12,18,16,22,28,26,34,38,44,52,58,64] },
  { id: 'SUB-0002', user: 'Sarah Kapoor', email: 'sarah@lumen.co', company: 'Lumen Studio', plan: 'Basic', tier: 'Direct', billing: 'Yearly', currency: 'USD', country: 'United Kingdom', flag: '🇬🇧', gateway: 'Stripe', amount: 290, ltv: 870, ageDays: 198, devices: 2, seats: 1, health: 84, churn: 18, upgrade: 42, engagement: 64, lastActivity: '1h ago', startDate: '2025-08-22', renewAt: '2026-08-22', status: 'Active', spark: [8,10,9,12,14,13,16,18,17,20,22,24] },
  { id: 'SUB-0003', user: 'Mike Romero', email: 'mike@helix.dev', company: 'Helix Systems', plan: 'Unlimited', tier: 'Team', billing: 'Monthly', currency: 'USD', country: 'Canada', flag: '🇨🇦', gateway: 'Stripe', amount: 149, ltv: 5410, ageDays: 622, devices: 12, seats: 24, health: 91, churn: 11, upgrade: 38, engagement: 92, lastActivity: '14m ago', startDate: '2024-09-12', renewAt: '2026-06-12', status: 'Active', spark: [40,38,42,46,50,48,54,58,62,66,72,78] },
  { id: 'SUB-0004', user: 'Priya Patel', email: 'priya@vertex.ai', company: 'Vertex Holdings', plan: 'Enterprise', tier: 'Franchise', billing: 'Yearly', currency: 'EUR', country: 'Germany', flag: '🇩🇪', gateway: 'Paddle', amount: 790, ltv: 12480, ageDays: 901, devices: 38, seats: 80, health: 98, churn: 3, upgrade: 22, engagement: 96, lastActivity: 'Just now', startDate: '2024-01-18', renewAt: '2026-09-18', status: 'Active', spark: [60,68,72,78,82,88,94,100,108,116,124,132] },
  { id: 'SUB-0005', user: 'James Wallis', email: 'james@orbit.app', company: 'Orbit Co.', plan: 'Pro', tier: 'Direct', billing: 'Monthly', currency: 'USD', country: 'Australia', flag: '🇦🇺', gateway: 'Stripe', amount: 79, ltv: 632, ageDays: 86, devices: 1, seats: 1, health: 38, churn: 74, upgrade: 8, engagement: 22, lastActivity: '9d ago', startDate: '2026-02-14', renewAt: '2026-06-01', status: 'Past Due', spark: [22,24,20,18,16,14,12,11,9,8,7,6] },
  { id: 'SUB-0006', user: 'Emily Doan', email: 'emily@silk.studio', company: 'Silk Studio', plan: 'Basic', tier: 'Reseller', billing: 'Monthly', currency: 'SGD', country: 'Singapore', flag: '🇸🇬', gateway: 'Razorpay', amount: 29, ltv: 348, ageDays: 312, devices: 2, seats: 2, health: 79, churn: 22, upgrade: 56, engagement: 71, lastActivity: '3h ago', startDate: '2025-06-30', renewAt: '2026-06-30', status: 'Active', spark: [10,12,11,13,15,14,16,18,19,21,22,24] },
  { id: 'SUB-0007', user: 'Omar Haddad', email: 'omar@arc.studio', company: 'Arc Studio', plan: 'Unlimited', tier: 'White-label', billing: 'Yearly', currency: 'AED', country: 'United Arab Emirates', flag: '🇦🇪', gateway: 'Paddle', amount: 1490, ltv: 4470, ageDays: 510, devices: 18, seats: 35, health: 89, churn: 14, upgrade: 49, engagement: 84, lastActivity: '42m ago', startDate: '2024-12-08', renewAt: '2026-12-08', status: 'Active', spark: [28,30,34,38,42,46,50,52,58,62,68,74] },
  { id: 'SUB-0008', user: 'Anya Sokolova', email: 'anya@finch.io', company: 'Finch Group', plan: 'Pro', tier: 'Team', billing: 'Yearly', currency: 'USD', country: 'Netherlands', flag: '🇳🇱', gateway: 'Stripe', amount: 790, ltv: 790, ageDays: 18, devices: 3, seats: 4, health: 72, churn: 28, upgrade: 64, engagement: 58, lastActivity: '5h ago', startDate: '2026-04-24', renewAt: '2026-05-24', status: 'Trial', spark: [4,6,8,10,12,14,16,20,24,28,30,34] },
];

const planTone: Record<Sub['plan'], string> = {
  Basic: 'from-slate-300/20 to-slate-200/5 text-slate-200 border-slate-300/20',
  Pro: 'from-sky-300/25 to-sky-200/5 text-sky-200 border-sky-300/30',
  Unlimited: 'from-violet-300/25 to-violet-200/5 text-violet-200 border-violet-300/30',
  Enterprise: 'from-amber-200/30 to-amber-100/5 text-amber-100 border-amber-200/40',
};

const statusTone: Record<Sub['status'], string> = {
  Active: 'bg-emerald-400/10 text-emerald-200 border-emerald-300/20',
  Trial: 'bg-amber-300/10 text-amber-100 border-amber-200/25',
  'Past Due': 'bg-rose-400/10 text-rose-200 border-rose-300/25',
  Cancelled: 'bg-white/5 text-white/50 border-white/10',
};

function Sparkline({ data, tone = 'emerald' }: { data: number[]; tone?: 'emerald' | 'rose' | 'sky' }) {
  const w = 96;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = Math.max(1, max - min);
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(' ');
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
  const off = c - (value / 100) * c;
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

const Avatar = ({ name }: { name: string }) => {
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('');
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-white/15 to-white/5 text-[11px] font-semibold text-white/90 ring-1 ring-white/10 backdrop-blur">
      {initials}
    </div>
  );
};

const AdminSubscriptionsPage = () => {
  const [subscriptions, setSubscriptions] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Sub['status']>('All');
  const [open, setOpen] = useState<string | null>(null);

  // Load subscriptions from real API
  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<Sub[]>('/admin/subscriptions');
        setSubscriptions(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load subscriptions';
        setError(message);
        console.error('Failed to fetch subscriptions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  const filtered = useMemo(() => {
    return subscriptions.filter(s => {
      const matchQ = !query || (s.user + s.company + s.email + s.id).toLowerCase().includes(query.toLowerCase());
      const matchF = filter === 'All' || s.status === filter;
      return matchQ && matchF;
    });
  }, [query, filter, subscriptions]);

  const mrr = subscriptions.filter(s => s.status === 'Active').reduce((a, s) => a + (s.billing === 'Monthly' ? s.amount : Math.round(s.amount / 12)), 0);
  const arr = mrr * 12;
  const active = subscriptions.filter(s => s.status === 'Active').length;
  const churnRate = ((subscriptions.filter(s => s.status === 'Past Due' || s.status === 'Cancelled').length / Math.max(subscriptions.length, 1)) * 100).toFixed(1);
  const ltv = subscriptions.reduce((a, s) => a + s.ltv, 0);

  const kpis = [
    { label: 'Monthly Recurring', value: `$${mrr.toLocaleString()}`, sub: '+12.4% vs last mo', icon: TrendingUp, tone: 'sky' as const, spark: [10,14,12,18,22,20,26,30,34,38,44,52] },
    { label: 'Annual Run Rate', value: `$${(arr / 1000).toFixed(1)}k`, sub: 'Forecast +18% Q3', icon: Sparkles, tone: 'emerald' as const, spark: [20,22,28,32,30,36,40,46,52,58,64,72] },
    { label: 'Active Subscribers', value: active.toString(), sub: `${subscriptions.length} total accounts`, icon: Users, tone: 'sky' as const, spark: [4,5,5,6,6,7,7,7,8,8,8,8] },
    { label: 'Churn Risk', value: `${churnRate}%`, sub: 'AI watching 2 accounts', icon: Heart, tone: 'rose' as const, spark: [22,20,18,16,14,12,14,16,18,16,14,12] },
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
              Live · Subscription Command
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white/95">
              Global Revenue <span className="bg-gradient-to-r from-sky-200 via-violet-200 to-amber-100 bg-clip-text text-transparent">Operations</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/50">
              Realtime visibility into every subscription, renewal pulse and AI-driven retention signal across direct, franchise and reseller channels.
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Lifetime Value</p>
              <p className="font-display text-2xl font-semibold text-white/95">${ltv.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Health Index</p>
              <p className="font-display text-2xl font-semibold text-emerald-200">94<span className="text-sm text-white/40">/100</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map(k => (
          <div key={k.label} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-xl transition-all hover:border-white/20 hover:bg-white/[0.05]">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/[0.04] blur-2xl transition-opacity group-hover:opacity-100" />
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
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Atelier AI · Subscription Intelligence</p>
              <p className="text-sm text-white/85">2 accounts trending toward churn · 3 ready for upsell · 1 lifetime conversion likely this week</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Zap className="h-3 w-3 text-amber-200" /> Self-healing</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Activity className="h-3 w-3 text-emerald-200" /> Realtime</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Globe2 className="h-3 w-3 text-sky-200" /> 12 markets</span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[260px] max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search subscriber, company, email, ID…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder:text-white/35 backdrop-blur focus:border-white/25 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
          {(['All', 'Active', 'Trial', 'Past Due', 'Cancelled'] as const).map(f => (
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

      {/* Subscription rows */}
      <div className="space-y-2.5">
        {filtered.map(s => {
          const isOpen = open === s.id;
          const churnTone: 'good' | 'warn' | 'bad' = s.churn < 20 ? 'good' : s.churn < 50 ? 'warn' : 'bad';
          const healthTone: 'good' | 'warn' | 'bad' = s.health > 80 ? 'good' : s.health > 50 ? 'warn' : 'bad';
          return (
            <div
              key={s.id}
              className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-all ${
                isOpen
                  ? 'border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-[0_20px_60px_-30px_rgba(120,160,255,0.35)]'
                  : 'border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : s.id)}
                className="grid w-full grid-cols-[auto_1.6fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-4 text-left"
              >
                <Avatar name={s.user} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white/95">{s.user}</p>
                    <span className={`inline-flex items-center gap-1 rounded-md border bg-gradient-to-r px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${planTone[s.plan]}`}>{s.plan}</span>
                    <span className="hidden md:inline-flex rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/55">{s.tier}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/45">{s.company} · <span className="text-white/35">{s.email}</span></p>
                </div>

                <div className="hidden md:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Region</p>
                  <p className="mt-0.5 text-sm text-white/85"><span className="mr-1.5">{s.flag}</span>{s.country}</p>
                </div>

                <div className="hidden lg:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Billing</p>
                  <p className="mt-0.5 text-sm text-white/85">{s.currency} {s.amount} <span className="text-white/40">/ {s.billing.toLowerCase()}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Health</p>
                    <Ring value={s.health} tone={healthTone} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Churn</p>
                    <Ring value={s.churn} tone={churnTone} />
                  </div>
                  <Sparkline data={s.spark} tone={s.churn > 50 ? 'rose' : 'emerald'} />
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone[s.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {s.status}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 bg-white/[0.015] px-5 py-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Account */}
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Account</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Subscription ID', s.id],
                          ['Started', s.startDate],
                          ['Renews', s.renewAt],
                          ['Age', `${s.ageDays} days`],
                          ['Gateway', s.gateway],
                          ['Devices', `${s.devices} active`],
                          ['Seats', `${s.seats} licensed`],
                        ].map(([k, v]) => (
                          <div key={k} className="flex items-center justify-between">
                            <span className="text-white/45">{k}</span>
                            <span className="font-medium text-white/85">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Intelligence */}
                    <div className="space-y-4 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">AI Intelligence</p>
                      {[
                        { label: 'Renewal Health', val: s.health, tone: 'emerald' },
                        { label: 'Churn Probability', val: s.churn, tone: 'rose' },
                        { label: 'Upgrade Likelihood', val: s.upgrade, tone: 'sky' },
                        { label: 'Engagement', val: s.engagement, tone: 'emerald' },
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
                              style={{ width: `${m.val}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Timeline */}
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Recent Timeline</p>
                      <ol className="relative space-y-3 border-l border-white/10 pl-4">
                        {[
                          { t: s.lastActivity, e: 'Session activity from primary device' },
                          { t: '2d ago', e: 'Invoice paid · Stripe webhook verified' },
                          { t: '6d ago', e: 'Engagement score recalculated by AI' },
                          { t: '14d ago', e: 'Plan auto-renewed successfully' },
                          { t: `${s.ageDays}d ago`, e: 'Subscription created' },
                        ].map((ev, i) => (
                          <li key={i} className="relative">
                            <span className="absolute -left-[1.18rem] top-1.5 h-2 w-2 rounded-full bg-white/30 ring-4 ring-background" />
                            <p className="text-xs text-white/50">{ev.t}</p>
                            <p className="text-sm text-white/85">{ev.e}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-gradient-to-r from-white/[0.04] to-transparent px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-white/70">
                      <CreditCard className="h-4 w-4 text-white/50" />
                      Lifetime contribution <span className="ml-1 font-semibold text-white/95">${s.ltv.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/55">
                      <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                      AI suggests {s.churn > 50 ? 'a personalised retention offer' : s.upgrade > 60 ? 'an upsell to the next tier' : 'continued nurture sequence'}.
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

export default AdminSubscriptionsPage;
