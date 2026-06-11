import { useMemo, useState, useEffect } from 'react';
import { api } from '@/lib/api';
import {
  Activity,
  ArrowUpRight,
  Brain,
  ChevronDown,
  CreditCard,
  Globe2,
  Receipt,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';

type Order = {
  id: string;
  user: string;
  email: string;
  company: string;
  product: string;
  version: string;
  plan: 'Monthly' | 'Yearly' | 'Lifetime';
  channel: 'Direct' | 'Reseller' | 'Franchise' | 'Influencer' | 'Bulk' | 'Trial → Paid';
  currency: string;
  country: string;
  flag: string;
  gateway: 'Stripe' | 'Paddle' | 'Razorpay' | 'PayPal' | 'Crypto' | 'Bank';
  amount: number;
  tax: number;
  coupon?: string;
  device: string;
  source: string;
  ltv: number;
  fraud: number; // 0-100 risk
  health: number; // 0-100
  renewProb: number; // 0-100
  contribution: number; // % of MRR
  status: 'Paid' | 'Pending' | 'Refunded' | 'Disputed' | 'Trial';
  date: string;
  spark: number[];
};

const seed: Order[] = [
  { id: 'ORD-10241', user: 'Alex Chen', email: 'alex@northwind.io', company: 'Northwind Labs', product: 'EduFlow Pro', version: 'v4.2', plan: 'Yearly', channel: 'Direct', currency: 'USD', country: 'United States', flag: '🇺🇸', gateway: 'Stripe', amount: 290, tax: 26.10, coupon: 'WELCOME10', device: 'macOS · Safari', source: 'Marketplace', ltv: 2840, fraud: 4, health: 96, renewProb: 92, contribution: 4.8, status: 'Paid', date: '2026-05-11', spark: [12,18,16,22,28,26,34,38,44,52,58,64] },
  { id: 'ORD-10242', user: 'Sarah Kapoor', email: 'sarah@lumen.co', company: 'Lumen Studio', product: 'MediCore 360', version: 'v2.1', plan: 'Monthly', channel: 'Direct', currency: 'GBP', country: 'United Kingdom', flag: '🇬🇧', gateway: 'Stripe', amount: 79, tax: 15.80, device: 'Windows · Chrome', source: 'Organic', ltv: 870, fraud: 8, health: 84, renewProb: 76, contribution: 1.2, status: 'Paid', date: '2026-05-10', spark: [8,10,9,12,14,13,16,18,17,20,22,24] },
  { id: 'ORD-10243', user: 'Mike Romero', email: 'mike@helix.dev', company: 'Helix Systems', product: 'HotelNest', version: 'v6.0', plan: 'Lifetime', channel: 'Reseller', currency: 'CAD', country: 'Canada', flag: '🇨🇦', gateway: 'Paddle', amount: 499, tax: 64.87, coupon: 'PARTNER20', device: 'iOS · Mobile', source: 'Reseller link', ltv: 5410, fraud: 6, health: 91, renewProb: 0, contribution: 7.6, status: 'Paid', date: '2026-05-09', spark: [40,38,42,46,50,48,54,58,62,66,72,78] },
  { id: 'ORD-10244', user: 'Priya Patel', email: 'priya@vertex.ai', company: 'Vertex Holdings', product: 'ShopEngine', version: 'v3.7', plan: 'Yearly', channel: 'Franchise', currency: 'EUR', country: 'Germany', flag: '🇩🇪', gateway: 'Paddle', amount: 290, tax: 55.10, device: 'Linux · Firefox', source: 'Franchise portal', ltv: 12480, fraud: 2, health: 98, renewProb: 96, contribution: 9.4, status: 'Paid', date: '2026-05-09', spark: [60,68,72,78,82,88,94,100,108,116,124,132] },
  { id: 'ORD-10245', user: 'James Wallis', email: 'james@orbit.app', company: 'Orbit Co.', product: 'ServiceHub', version: 'v1.4', plan: 'Monthly', channel: 'Trial → Paid', currency: 'AUD', country: 'Australia', flag: '🇦🇺', gateway: 'Stripe', amount: 49, tax: 4.90, device: 'macOS · Chrome', source: 'Email campaign', ltv: 632, fraud: 62, health: 38, renewProb: 22, contribution: 0.7, status: 'Pending', date: '2026-05-08', spark: [22,24,20,18,16,14,12,11,9,8,7,6] },
  { id: 'ORD-10246', user: 'Emily Doan', email: 'emily@silk.studio', company: 'Silk Studio', product: 'FactoryOS', version: 'v5.2', plan: 'Yearly', channel: 'Influencer', currency: 'SGD', country: 'Singapore', flag: '🇸🇬', gateway: 'Razorpay', amount: 590, tax: 53.10, coupon: 'CREATOR15', device: 'Windows · Edge', source: 'YouTube · @silkdev', ltv: 348, fraud: 12, health: 79, renewProb: 68, contribution: 3.1, status: 'Paid', date: '2026-05-07', spark: [10,12,11,13,15,14,16,18,19,21,22,24] },
  { id: 'ORD-10247', user: 'Omar Haddad', email: 'omar@arc.studio', company: 'Arc Studio', product: 'LearnPad', version: 'v2.0', plan: 'Lifetime', channel: 'Bulk', currency: 'AED', country: 'United Arab Emirates', flag: '🇦🇪', gateway: 'Bank', amount: 399, tax: 19.95, device: 'iPad · Safari', source: 'Sales call', ltv: 4470, fraud: 18, health: 88, renewProb: 0, contribution: 2.4, status: 'Refunded', date: '2026-05-06', spark: [28,30,34,38,42,46,50,52,58,62,55,40] },
  { id: 'ORD-10248', user: 'Anya Sokolova', email: 'anya@finch.io', company: 'Finch Group', product: 'ClinicPro', version: 'v3.3', plan: 'Monthly', channel: 'Direct', currency: 'EUR', country: 'Netherlands', flag: '🇳🇱', gateway: 'Stripe', amount: 79, tax: 16.59, device: 'macOS · Arc', source: 'Direct', ltv: 790, fraud: 5, health: 72, renewProb: 81, contribution: 1.0, status: 'Trial', date: '2026-05-05', spark: [4,6,8,10,12,14,16,20,24,28,30,34] },
  { id: 'ORD-10249', user: 'Tom Becker', email: 'tom@ridge.co', company: 'Ridge & Co', product: 'CartMax', version: 'v4.0', plan: 'Yearly', channel: 'Direct', currency: 'USD', country: 'United States', flag: '🇺🇸', gateway: 'PayPal', amount: 290, tax: 23.20, device: 'Windows · Chrome', source: 'Affiliate', ltv: 1450, fraud: 9, health: 86, renewProb: 78, contribution: 3.6, status: 'Paid', date: '2026-05-04', spark: [18,20,22,24,26,28,30,33,36,40,44,48] },
  { id: 'ORD-10250', user: 'Lisa Moreau', email: 'lisa@noble.fr', company: 'Noble Atelier', product: 'BookMyPro', version: 'v1.9', plan: 'Monthly', channel: 'Direct', currency: 'EUR', country: 'France', flag: '🇫🇷', gateway: 'Stripe', amount: 49, tax: 9.80, device: 'macOS · Safari', source: 'Marketplace', ltv: 540, fraud: 78, health: 42, renewProb: 18, contribution: 0.6, status: 'Disputed', date: '2026-05-03', spark: [16,14,12,10,9,8,7,7,6,6,5,4] },
];

const channelTone: Record<Order['channel'], string> = {
  Direct: 'from-sky-300/25 to-sky-200/5 text-sky-200 border-sky-300/30',
  Reseller: 'from-violet-300/25 to-violet-200/5 text-violet-200 border-violet-300/30',
  Franchise: 'from-amber-200/30 to-amber-100/5 text-amber-100 border-amber-200/40',
  Influencer: 'from-pink-300/25 to-pink-200/5 text-pink-200 border-pink-300/30',
  Bulk: 'from-emerald-300/25 to-emerald-200/5 text-emerald-200 border-emerald-300/30',
  'Trial → Paid': 'from-slate-300/20 to-slate-200/5 text-slate-200 border-slate-300/20',
};

const statusTone: Record<Order['status'], string> = {
  Paid: 'bg-emerald-400/10 text-emerald-200 border-emerald-300/20',
  Pending: 'bg-amber-300/10 text-amber-100 border-amber-200/25',
  Refunded: 'bg-white/5 text-white/55 border-white/10',
  Disputed: 'bg-rose-400/10 text-rose-200 border-rose-300/25',
  Trial: 'bg-sky-400/10 text-sky-200 border-sky-300/20',
};

function Sparkline({ data, tone = 'emerald' }: { data: number[]; tone?: 'emerald' | 'rose' | 'sky' }) {
  const w = 96, h = 28;
  const max = Math.max(...data), min = Math.min(...data);
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
  const r = 14, c = 2 * Math.PI * r, off = c - (value / 100) * c;
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

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'All' | Order['status']>('All');
  const [open, setOpen] = useState<string | null>(null);

  // Load orders from real API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<Order[]>('/admin/orders');
        setOrders(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load orders';
        setError(message);
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filtered = useMemo(() => orders.filter(o => {
    const matchQ = !query || (o.user + o.company + o.email + o.id + o.product).toLowerCase().includes(query.toLowerCase());
    const matchF = filter === 'All' || o.status === filter;
    return matchQ && matchF;
  }), [query, filter, orders]);

  const grossRevenue = orders.filter(o => o.status === 'Paid').reduce((a, o) => a + o.amount, 0);
  const refunded = orders.filter(o => o.status === 'Refunded').reduce((a, o) => a + o.amount, 0);
  const paidCount = orders.filter(o => o.status === 'Paid').length;
  const aov = Math.round(grossRevenue / Math.max(1, paidCount));
  const fraudWatch = orders.filter(o => o.fraud > 50).length;

  const kpis = [
    { label: 'Gross Revenue', value: `$${grossRevenue.toLocaleString()}`, sub: '+18.2% week over week', icon: TrendingUp, tone: 'emerald' as const, spark: [10,14,12,18,22,20,26,30,34,38,44,52] },
    { label: 'Avg Order Value', value: `$${aov}`, sub: `${paidCount} orders settled`, icon: Wallet, tone: 'sky' as const, spark: [20,22,28,32,30,36,40,46,52,58,64,72] },
    { label: 'Refunds Issued', value: `$${refunded.toLocaleString()}`, sub: '0.4% of gross', icon: Receipt, tone: 'rose' as const, spark: [4,5,5,4,3,3,2,2,2,1,1,1] },
    { label: 'Fraud Watch', value: `${fraudWatch}`, sub: 'AI holding for review', icon: ShieldCheck, tone: 'sky' as const, spark: [1,1,2,2,2,3,3,2,2,1,1,2] },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-6 backdrop-blur-xl">
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-white/60">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-300" />
              </span>
              Live · Order Command
            </div>
            <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white/95">
              Global Order <span className="bg-gradient-to-r from-emerald-200 via-sky-200 to-violet-200 bg-clip-text text-transparent">Operations</span>
            </h1>
            <p className="mt-1.5 max-w-xl text-sm text-white/50">
              Realtime view of every transaction, channel attribution and AI fraud signal across direct, franchise, reseller and influencer flows.
            </p>
          </div>
          <div className="flex items-center gap-3 text-right">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Net Revenue</p>
              <p className="font-display text-2xl font-semibold text-white/95">${(grossRevenue - refunded).toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-white/10" />
            <div>
              <p className="text-[11px] uppercase tracking-widest text-white/40">Trust Score</p>
              <p className="font-display text-2xl font-semibold text-emerald-200">97<span className="text-sm text-white/40">/100</span></p>
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
      <div className="relative overflow-hidden rounded-2xl border border-emerald-200/15 bg-gradient-to-r from-emerald-300/[0.06] via-sky-300/[0.04] to-violet-300/[0.04] p-5 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
              <Brain className="h-4 w-4 text-emerald-200" />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/45">Atelier AI · Order Intelligence</p>
              <p className="text-sm text-white/85">2 orders flagged for fraud review · 3 upsell opportunities surfacing · 1 chargeback predicted within 48h</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-white/50">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Zap className="h-3 w-3 text-amber-200" /> Self-healing</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Activity className="h-3 w-3 text-emerald-200" /> Realtime</span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1"><Globe2 className="h-3 w-3 text-sky-200" /> 14 markets</span>
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
            placeholder="Search order, customer, product, ID…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm text-white/90 placeholder:text-white/35 backdrop-blur focus:border-white/25 focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1 backdrop-blur">
          {(['All', 'Paid', 'Pending', 'Trial', 'Refunded', 'Disputed'] as const).map(f => (
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

      {/* Order rows */}
      <div className="space-y-2.5">
        {filtered.map(o => {
          const isOpen = open === o.id;
          const fraudTone: 'good' | 'warn' | 'bad' = o.fraud < 20 ? 'good' : o.fraud < 50 ? 'warn' : 'bad';
          const healthTone: 'good' | 'warn' | 'bad' = o.health > 80 ? 'good' : o.health > 50 ? 'warn' : 'bad';
          return (
            <div
              key={o.id}
              className={`group overflow-hidden rounded-2xl border backdrop-blur-xl transition-all ${
                isOpen
                  ? 'border-white/20 bg-gradient-to-br from-white/[0.06] to-white/[0.02] shadow-[0_20px_60px_-30px_rgba(120,200,160,0.35)]'
                  : 'border-white/10 bg-white/[0.025] hover:border-white/15 hover:bg-white/[0.04]'
              }`}
            >
              <button
                onClick={() => setOpen(isOpen ? null : o.id)}
                className="grid w-full grid-cols-[auto_1.6fr_1fr_1fr_1fr_auto] items-center gap-4 px-5 py-4 text-left"
              >
                <Avatar name={o.user} />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-white/95">{o.user}</p>
                    <span className={`inline-flex items-center gap-1 rounded-md border bg-gradient-to-r px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${channelTone[o.channel]}`}>{o.channel}</span>
                    <span className="hidden md:inline-flex rounded-md border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-medium text-white/55 font-mono">{o.id}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-white/45">{o.product} <span className="text-white/30">· {o.version}</span> · <span className="text-white/35">{o.company}</span></p>
                </div>

                <div className="hidden md:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Region</p>
                  <p className="mt-0.5 text-sm text-white/85"><span className="mr-1.5">{o.flag}</span>{o.country}</p>
                </div>

                <div className="hidden lg:block">
                  <p className="text-[11px] uppercase tracking-widest text-white/35">Charge</p>
                  <p className="mt-0.5 text-sm text-white/85">{o.currency} {o.amount} <span className="text-white/40">· {o.plan.toLowerCase()}</span></p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Health</p>
                    <Ring value={o.health} tone={healthTone} />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase tracking-widest text-white/35">Fraud</p>
                    <Ring value={o.fraud} tone={fraudTone} />
                  </div>
                  <Sparkline data={o.spark} tone={o.fraud > 50 ? 'rose' : 'emerald'} />
                </div>

                <div className="flex items-center gap-3">
                  <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${statusTone[o.status]}`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
                    {o.status}
                  </span>
                  <ChevronDown className={`h-4 w-4 text-white/45 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 bg-white/[0.015] px-5 py-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                    {/* Transaction */}
                    <div className="space-y-3 rounded-xl border border-white/10 bg-white/[0.025] p-4">
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Transaction</p>
                      <div className="space-y-2 text-sm">
                        {[
                          ['Order ID', o.id],
                          ['Placed', o.date],
                          ['Gateway', o.gateway],
                          ['Source', o.source],
                          ['Device', o.device],
                          ['Tax', `${o.currency} ${o.tax.toFixed(2)}`],
                          ['Coupon', o.coupon ?? '—'],
                          ['Total', `${o.currency} ${(o.amount + o.tax).toFixed(2)}`],
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
                        { label: 'Order Health', val: o.health, tone: 'emerald' },
                        { label: 'Fraud Risk', val: o.fraud, tone: 'rose' },
                        { label: 'Renewal Probability', val: o.renewProb, tone: 'sky' },
                        { label: 'Revenue Contribution', val: Math.min(100, Math.round(o.contribution * 10)), tone: 'emerald' },
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
                      <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">Order Timeline</p>
                      <ol className="relative space-y-3 border-l border-white/10 pl-4">
                        {[
                          { t: 'Just now', e: 'AI fraud check passed · score recalibrated' },
                          { t: '1h ago', e: 'License issued · activation confirmed' },
                          { t: '1h ago', e: `Invoice generated · ${o.currency} ${(o.amount + o.tax).toFixed(2)}` },
                          { t: '1h ago', e: `Payment captured · ${o.gateway}` },
                          { t: o.date, e: `Order created from ${o.source}` },
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
                      Lifetime contribution <span className="ml-1 font-semibold text-white/95">${o.ltv.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-white/55">
                      <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                      Future buy: {o.plan === 'Monthly' ? 'Yearly upgrade likely' : o.plan === 'Yearly' ? 'Lifetime conversion candidate' : 'Cross-sell premium addons'}
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

export default AdminOrdersPage;
