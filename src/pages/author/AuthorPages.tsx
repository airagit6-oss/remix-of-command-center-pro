import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Rocket, BarChart2, DollarSign, KeyRound, HardDrive, Download,
  Search, Star, LifeBuoy, GitBranch, Cpu, Wallet, Settings, Radio, Sparkles,
  CheckCircle2, AlertTriangle, TrendingUp, Users, Activity, Globe, ShieldCheck,
  Clock, FileText, Layers, RefreshCw, Upload, Plus,
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

export function Kpi({ icon: Icon, label, value, sub, accent = 'cyan' }: {
  icon: typeof Package; label: string; value: string | number; sub?: string; accent?: Accent;
}) {
  const ring = accentRing[accent];
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4">
      <div className={`absolute inset-0 bg-gradient-to-br ${ring.split(' ').slice(0,2).join(' ')} pointer-events-none`} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
          <div className="mt-1 text-2xl font-semibold text-foreground tabular-nums">{value}</div>
          {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
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

/* ============================================================
   #/author/dashboard
   ============================================================ */

export function AuthorDashboardPage() {
  const { user } = useAuth();
  const { products, activity, gallery, pulse } = useAuthorContext();

  const totals = useMemo(() => {
    const users = products.reduce((s, p) => s + p.users, 0);
    const revenue = products.reduce((s, p) => s + p.users * (p.subscription.monthly || 5), 0);
    const avgRating = products.length ? products.reduce((s, p) => s + p.rating, 0) / products.length : 0;
    return { users, revenue, avgRating };
  }, [products]);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Author command"
        title={`Welcome back, ${user?.name ?? 'author'}`}
        subtitle={`${products.length} products · pulse #${pulse} · realtime sync engaged`}
        action={
          <Link to="/author/products" className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)] hover:opacity-90 transition">
            <Plus className="h-4 w-4" /> Publish new product
          </Link>
        }
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Package}     label="Portfolio"    value={products.length} sub="all channels" accent="cyan" />
        <Kpi icon={Users}       label="Active users" value={totals.users.toLocaleString()} sub="across products" accent="fuchsia" />
        <Kpi icon={DollarSign}  label="MRR estimate" value={`$${totals.revenue.toLocaleString()}`} sub="rolling 30d" accent="emerald" />
        <Kpi icon={Star}        label="Avg rating"   value={totals.avgRating.toFixed(2)} sub="catalog-wide" accent="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Top performers" icon={TrendingUp} className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {products.slice().sort((a, b) => b.users - a.users).slice(0, 6).map(p => (
              <li key={p.id} className="py-2 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-8 w-8 rounded object-cover" />}
                  <div className="min-w-0">
                    <div className="text-sm text-foreground truncate">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.category} · ⭐ {p.rating.toFixed(1)}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm tabular-nums text-foreground">{p.users.toLocaleString()}</div>
                  <div className="text-[11px] text-emerald-300">+{Math.floor(p.users * 0.04)} / wk</div>
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Activity stream" icon={Activity}>
          <ul className="space-y-2 max-h-72 overflow-auto pr-1">
            {activity.slice(0, 10).map(a => (
              <li key={a.id} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                <div className="min-w-0">
                  <div className="text-sm text-foreground truncate">{a.activity}</div>
                  <div className="text-[11px] text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
                </div>
              </li>
            ))}
            {activity.length === 0 && <p className="text-xs text-muted-foreground">No recent activity.</p>}
          </ul>
        </Section>
      </div>
      <Section title="Storage footprint" icon={HardDrive}>
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-muted-foreground">{gallery.stats.totalMedia} assets · {formatFileSize(gallery.stats.totalSizeBytes)}</span>
          <span className="text-emerald-300">saved {formatFileSize(gallery.stats.compressionSavedBytes)} via compression</span>
        </div>
        <ProgressBar tone="emerald" value={Math.min(100, gallery.stats.totalMedia)} />
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/products
   ============================================================ */

export function AuthorProductsPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Portfolio" title="Your products" subtitle={`${products.length} published assets across the catalog`}
        action={<Link to="/admin/products" className="text-xs text-cyan-300 hover:underline">Open Operations Center →</Link>} />
      <Section title="Catalog" icon={Package}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {products.map(p => (
            <div key={p.id} className="group rounded-lg border border-border bg-background/40 overflow-hidden hover:border-cyan-500/40 transition">
              {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-28 w-full object-cover" />}
              <div className="p-3">
                <div className="text-sm font-medium text-foreground truncate">{p.name}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground capitalize">{p.category}</div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-foreground">⭐ {p.rating.toFixed(1)} · {p.users.toLocaleString()} users</span>
                  <span className="text-cyan-300 capitalize">{p.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/releases
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
      <PageHeader eyebrow="Release management" title="Releases" subtitle="Version, stage, and ship your products" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {channels.map(c => (
          <Kpi key={c.name} icon={GitBranch} label={`${c.name} channel`} value={c.count} sub="rollout window 24h" accent={c.tone} />
        ))}
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
   #/author/analytics
   ============================================================ */

export function AuthorAnalyticsPage() {
  const { products } = useAuthorContext();
  const totals = useMemo(() => ({
    downloads: products.reduce((s, p) => s + p.users * 2, 0),
    installs:  products.reduce((s, p) => s + p.users, 0),
    crashes:   Math.round(products.reduce((s, p) => s + p.users * 0.003, 0)),
    conversion: 4.2,
  }), [products]);
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Product analytics" title="Analytics" subtitle="Downloads, installs, crashes, conversion" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Download}   label="Downloads"  value={totals.downloads.toLocaleString()} sub="30d" accent="cyan" />
        <Kpi icon={Activity}   label="Installs"   value={totals.installs.toLocaleString()}  sub="active devices" accent="fuchsia" />
        <Kpi icon={AlertTriangle} label="Crashes" value={totals.crashes} sub="0.3% rate" accent="amber" />
        <Kpi icon={TrendingUp} label="Conversion" value={`${totals.conversion}%`} sub="visit → install" accent="emerald" />
      </div>
      <Section title="Per-product performance" icon={BarChart2}>
        <ul className="space-y-2 text-sm">
          {products.slice(0, 10).map(p => {
            const pct = Math.min(100, Math.round((p.users / 10000) * 100));
            return (
              <li key={p.id}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-foreground truncate">{p.name}</span>
                  <span className="text-muted-foreground tabular-nums">{p.users.toLocaleString()}</span>
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

/* ============================================================
   #/author/revenue
   ============================================================ */

export function AuthorRevenuePage() {
  const { products } = useAuthorContext();
  const subRev = products.reduce((s, p) => s + p.subscription.monthly * Math.max(1, Math.round(p.users * 0.08)), 0);
  const resRev = Math.round(subRev * 0.18);
  const refunds = Math.round(subRev * 0.02);
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Revenue" title="Earnings" subtitle="Subscription, reseller, and refund analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={DollarSign} label="Subscription MRR" value={`$${subRev.toLocaleString()}`} sub="monthly" accent="emerald" />
        <Kpi icon={Users}      label="Reseller share"   value={`$${resRev.toLocaleString()}`} sub="18% of MRR" accent="fuchsia" />
        <Kpi icon={Wallet}     label="Pending payout"   value={`$${Math.round(subRev * 0.4).toLocaleString()}`} sub="next cycle" accent="cyan" />
        <Kpi icon={AlertTriangle} label="Refunds"       value={`$${refunds.toLocaleString()}`} sub="2% of MRR" accent="amber" />
      </div>
      <Section title="Revenue by product" icon={BarChart2}>
        <ul className="divide-y divide-border text-sm">
          {products.slice().sort((a, b) => b.users - a.users).slice(0, 8).map(p => (
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
   #/author/licenses
   ============================================================ */

export function AuthorLicensesPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Licensing" title="Licenses" subtitle="License keys issued across your portfolio" />
      <div className="grid grid-cols-3 gap-3">
        <Kpi icon={KeyRound} label="Regular" value={Math.round(products.reduce((s,p)=>s+p.users*0.7,0)).toLocaleString()} sub="end-user" accent="cyan" />
        <Kpi icon={KeyRound} label="Extended" value={Math.round(products.reduce((s,p)=>s+p.users*0.25,0)).toLocaleString()} sub="resellable" accent="fuchsia" />
        <Kpi icon={ShieldCheck} label="Enterprise" value={Math.round(products.reduce((s,p)=>s+p.users*0.05,0)).toLocaleString()} sub="SLA backed" accent="emerald" />
      </div>
      <Section title="License operations" icon={KeyRound}>
        <ul className="text-sm space-y-2">
          {products.slice(0, 6).map(p => (
            <li key={p.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
              <span className="text-foreground truncate">{p.name}</span>
              <span className="text-[11px] text-muted-foreground">{p.users.toLocaleString()} keys · 0 revoked</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/storage
   ============================================================ */

export function AuthorStoragePage() {
  const { gallery } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Storage & CDN" title="Storage operations" subtitle="Media, source vault and delivery analytics" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={HardDrive} label="Media" value={formatFileSize(gallery.stats.totalSizeBytes)} sub={`${gallery.stats.totalMedia} files`} accent="cyan" />
        <Kpi icon={Layers}    label="Compression saved" value={formatFileSize(gallery.stats.compressionSavedBytes)} sub="auto-WebP" accent="emerald" />
        <Kpi icon={Globe}     label="CDN regions" value="14" sub="edge POPs" accent="fuchsia" />
        <Kpi icon={Activity}  label="Bandwidth / 24h" value="2.4 TB" sub="cached 92%" accent="amber" />
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

/* ============================================================
   #/author/downloads
   ============================================================ */

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

/* ============================================================
   #/author/seo
   ============================================================ */

export function AuthorSeoPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Discovery" title="SEO performance" subtitle="Indexing, impressions, click-through" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Search}     label="Indexed pages" value={products.length * 4} sub="all crawled" accent="cyan" />
        <Kpi icon={Activity}   label="Impressions /7d" value={(products.length * 9200).toLocaleString()} sub="rolling" accent="fuchsia" />
        <Kpi icon={TrendingUp} label="CTR" value="6.4%" sub="vs 4.1% median" accent="emerald" />
        <Kpi icon={AlertTriangle} label="SEO issues" value={Math.max(0, products.length - 18)} sub="missing alt-text" accent="amber" />
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

/* ============================================================
   #/author/reviews
   ============================================================ */

export function AuthorReviewsPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Reputation" title="Reviews" subtitle="Manage incoming feedback and disputes" />
      <Section title="Latest reviews" icon={Star}>
        <ul className="divide-y divide-border text-sm">
          {products.slice(0, 8).map(p => (
            <li key={p.id} className="py-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-foreground truncate">{p.name}</div>
                <div className="text-[11px] text-muted-foreground">{p.reviews} reviews · avg ⭐ {p.rating.toFixed(1)}</div>
              </div>
              <button className="text-xs px-2.5 py-1 rounded-md border border-border hover:bg-accent text-muted-foreground hover:text-foreground">Respond</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/support
   ============================================================ */

export function AuthorSupportPage() {
  const { notifications } = useAuthorContext();
  const open = notifications.slice(0, 6);
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Customer success" title="Support" subtitle="Tickets, AI-assisted replies, refund requests" />
      <div className="grid grid-cols-3 gap-3">
        <Kpi icon={LifeBuoy} label="Open tickets" value={open.length} sub="awaiting reply" accent="amber" />
        <Kpi icon={Sparkles} label="AI drafts ready" value={Math.floor(open.length * 0.8)} sub="approve & send" accent="fuchsia" />
        <Kpi icon={CheckCircle2} label="Resolved /7d" value="48" sub="92% CSAT" accent="emerald" />
      </div>
      <Section title="Inbox" icon={FileText}>
        {open.length === 0
          ? <p className="text-sm text-muted-foreground py-4 text-center">No open tickets — beautiful.</p>
          : (
            <ul className="divide-y divide-border text-sm">
              {open.map(n => (
                <li key={n.id} className="py-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-foreground truncate">{n.message}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(n.created_at).toLocaleString()}</div>
                  </div>
                  <button className="text-xs px-2.5 py-1 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 inline-flex items-center gap-1">
                    <Sparkles className="h-3 w-3" /> AI reply
                  </button>
                </li>
              ))}
            </ul>
          )}
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/deployments
   ============================================================ */

export function AuthorDeploymentsPage() {
  const { products, pulse } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Deployments" title="Deployment center" subtitle={`Build, ship & verify · heartbeat #${pulse}`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Rocket}   label="Live deployments" value={products.length} sub="all healthy" accent="emerald" />
        <Kpi icon={Clock}    label="Avg build time"   value="2m 14s" sub="-12% wk/wk" accent="cyan" />
        <Kpi icon={Activity} label="Queue depth"      value={Math.max(0, 4 - (pulse % 5))} sub="workers idle" accent="fuchsia" />
        <Kpi icon={ShieldCheck} label="Verification"  value="100%" sub="post-deploy checks" accent="amber" />
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

/* ============================================================
   #/author/ai-scans
   ============================================================ */

export function AuthorAiScansPage() {
  const { products } = useAuthorContext();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="AI operations" title="AI product scans" subtitle="Malware, dependency, memory and install testing" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Cpu}            label="Scans /24h"   value={products.length * 3} sub="auto-triggered" accent="cyan" />
        <Kpi icon={ShieldCheck}    label="Malware clean" value={`${products.length}/${products.length}`} sub="0 flagged" accent="emerald" />
        <Kpi icon={AlertTriangle}  label="Issues found"  value={Math.max(0, products.length - 20)} sub="medium severity" accent="amber" />
        <Kpi icon={Sparkles}       label="AI tips"      value={products.length * 2} sub="optimization hints" accent="fuchsia" />
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
   #/author/payouts
   ============================================================ */

export function AuthorPayoutsPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Finance" title="Payouts" subtitle="Pending, history and tax summaries" />
      <div className="grid grid-cols-3 gap-3">
        <Kpi icon={Wallet}     label="Pending"  value="$12,840" sub="next cycle Fri" accent="cyan" />
        <Kpi icon={CheckCircle2} label="Paid /YTD" value="$184,200" sub="22 transfers" accent="emerald" />
        <Kpi icon={FileText}   label="Tax docs" value="W-9, 1099" sub="2025 filed" accent="fuchsia" />
      </div>
      <Section title="Payout history" icon={Wallet}>
        <ul className="divide-y divide-border text-sm">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="py-2 flex items-center justify-between">
              <div>
                <div className="text-foreground">Bank transfer · ACH-{(82940 + i)}</div>
                <div className="text-[11px] text-muted-foreground">{new Date(Date.now() - i * 14 * 86400000).toLocaleDateString()}</div>
              </div>
              <span className="text-emerald-300 tabular-nums">${(8200 + i * 740).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   #/author/settings
   ============================================================ */

export function AuthorSettingsPage() {
  const { user } = useAuth();
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="Configuration" title="Author settings" subtitle="Profile, payout method, notifications" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Section title="Profile" icon={Settings}>
          <div className="space-y-2 text-sm">
            <Row k="Display name" v={user?.name ?? '—'} />
            <Row k="Email" v={user?.email ?? '—'} />
            <Row k="Role" v="Author" />
            <Row k="Member since" v="2024" />
          </div>
        </Section>
        <Section title="Payout method" icon={Wallet}>
          <div className="space-y-2 text-sm">
            <Row k="Method" v="Bank ACH" />
            <Row k="Bank" v="•••• 4421" />
            <Row k="Cycle" v="Weekly · Friday" />
            <Row k="Minimum" v="$50" />
          </div>
        </Section>
        <Section title="Notifications" icon={Radio}>
          {['New review', 'Refund request', 'AI scan failure', 'Payout processed'].map(n => (
            <label key={n} className="flex items-center justify-between py-1.5 text-sm">
              <span className="text-foreground">{n}</span>
              <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-border bg-background accent-cyan-400" />
            </label>
          ))}
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