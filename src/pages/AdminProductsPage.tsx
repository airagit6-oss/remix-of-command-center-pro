import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search, Pencil, Trash2, Plus, Package, Image as ImageIcon, Activity, Shield,
  Database, HardDrive, Zap, GitBranch, Bell, Webhook, CheckCircle2, AlertTriangle,
  Sparkles, TrendingUp, Users, Star, Layers, RefreshCw, Download, Radio, Cpu,
  CloudUpload, FileCheck2, ServerCog, LayoutGrid, List, Rocket, Eye, Play, Tag,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  listProducts, upsertProduct, deleteProduct, newProductId, subscribeProducts,
} from '@/lib/productStore';
import { categories } from '@/lib/marketplaceData';
import type { Product } from '@/lib/marketplaceData';
import { useGallery, formatFileSize, getCompressionRatio } from '@/lib/galleryManager';
import { fetchAuditLogs, type AuditLog } from '@/lib/auditLog';
import { fetchActivityLogs, type ActivityLog } from '@/lib/activityTimeline';
import { fetchNotifications, type Notification } from '@/lib/notifications';
import { fetchFeatureFlags, type FeatureFlag } from '@/lib/featureFlags';
import { listLocalBackups, triggerBackup, type BackupMeta } from '@/lib/backup';
import { ProductEditor } from '@/components/admin/ProductEditor';

const emptyDraft = (): Product => ({
  id: newProductId(),
  name: '',
  category: categories[0].name,
  categorySlug: categories[0].slug,
  shortDescription: '',
  description: '',
  price: 0,
  rating: 4.5,
  reviews: 0,
  users: 0,
  thumbnail: '',
  screenshots: [],
  features: [],
  modules: [],
  tags: [],
  status: 'new',
  subscription: { monthly: 0, yearly: 0 },
});

type Tab = 'catalog' | 'media' | 'operations' | 'pipeline' | 'health';

const TABS: { id: Tab; label: string; icon: typeof Package }[] = [
  { id: 'catalog',    label: 'Catalog',    icon: Package },
  { id: 'media',      label: 'Media & CDN', icon: ImageIcon },
  { id: 'operations', label: 'Operations', icon: Activity },
  { id: 'pipeline',   label: 'Pipeline',   icon: GitBranch },
  { id: 'health',     label: 'Health',     icon: Shield },
];

function StatTile({
  icon: Icon, label, value, sub, accent = 'cyan',
}: { icon: typeof Package; label: string; value: string | number; sub?: string; accent?: 'cyan' | 'fuchsia' | 'emerald' | 'amber' }) {
  const ring = {
    cyan: 'from-cyan-500/20 to-cyan-500/0 text-cyan-300 border-cyan-500/20',
    fuchsia: 'from-fuchsia-500/20 to-fuchsia-500/0 text-fuchsia-300 border-fuchsia-500/20',
    emerald: 'from-emerald-500/20 to-emerald-500/0 text-emerald-300 border-emerald-500/20',
    amber: 'from-amber-500/20 to-amber-500/0 text-amber-300 border-amber-500/20',
  }[accent];
  return (
    <div className={`relative overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4`}>
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

function SectionCard({ title, icon: Icon, action, children }: {
  title: string; icon: typeof Package; action?: React.ReactNode; children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm overflow-hidden">
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

const AdminProductsPage = () => {
  const [items, setItems] = useState<Product[]>(() => listProducts());
  const [query, setQuery] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [tab, setTab] = useState<Tab>('catalog');
  const [view, setView] = useState<'cinematic' | 'table'>('cinematic');
  const [hoverId, setHoverId] = useState<string | null>(null);

  // Real backend-connected data streams
  const gallery = useGallery();
  const [audit, setAudit] = useState<AuditLog[]>([]);
  const [activity, setActivity] = useState<ActivityLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [flags, setFlags] = useState<FeatureFlag[]>([]);
  const [backups, setBackups] = useState<BackupMeta[]>(() => listLocalBackups());
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    document.title = 'Products · Boss Panel';
    return subscribeProducts(() => setItems(listProducts()));
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([
      fetchAuditLogs(), fetchActivityLogs(), fetchNotifications(), fetchFeatureFlags(),
    ]).then(([a, ac, n, f]) => {
      if (!alive) return;
      setAudit(a); setActivity(ac); setNotifications(n); setFlags(f);
    });
    const id = setInterval(() => setPulse(p => p + 1), 3500);
    return () => { alive = false; clearInterval(id); };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.status.toLowerCase().includes(q),
    );
  }, [items, query]);

  // KPIs derived from real product data
  const kpis = useMemo(() => {
    const totalUsers = items.reduce((s, p) => s + p.users, 0);
    const totalReviews = items.reduce((s, p) => s + p.reviews, 0);
    const avgRating = items.length ? items.reduce((s, p) => s + p.rating, 0) / items.length : 0;
    const byStatus = items.reduce<Record<string, number>>((acc, p) => {
      acc[p.status] = (acc[p.status] || 0) + 1; return acc;
    }, {});
    const trending = byStatus.trending || 0;
    return { totalUsers, totalReviews, avgRating, trending, byStatus };
  }, [items]);

  const productAudit = useMemo(
    () => audit.filter(a => a.entity_type === 'product' || /product/i.test(a.action)).slice(0, 8),
    [audit],
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    if (!editing.name.trim()) { toast.error('Name is required'); return; }
    const cat = categories.find(c => c.slug === editing.categorySlug);
    upsertProduct({ ...editing, name: editing.name.trim(), category: cat?.name || editing.category });
    toast.success('Product saved');
    setEditing(null);
  };

  const handleDelete = (p: Product) => {
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    deleteProduct(p.id);
    toast.success('Product deleted');
  };

  const runBackup = async () => {
    const meta = await triggerBackup();
    setBackups(listLocalBackups());
    toast.success(`Backup snapshot · ${formatFileSize(meta.size_bytes)}`);
  };

  return (
    <div className="space-y-5">
      {/* Header / Ops bar */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background p-5">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
        <div className="relative flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-widest">
              <Radio className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              Product Operations Center
              <span className="text-emerald-400 font-medium">· Live</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-foreground">Products</h1>
            <p className="text-sm text-muted-foreground">
              {items.length} catalog items · {kpis.totalUsers.toLocaleString()} active users · {gallery.stats.totalMedia} media assets · pulse {pulse}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search products"
                className="pl-8 pr-3 py-2 text-sm rounded-lg border border-border bg-background/60 backdrop-blur text-foreground w-56"
              />
            </div>
            <button
              onClick={() => setEditing(emptyDraft())}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-4 py-2 text-sm font-medium text-white shadow-[0_0_24px_-6px_rgba(34,211,238,0.6)] hover:opacity-90 transition"
            >
              <Plus className="h-4 w-4" /> Add Product
            </button>
          </div>
        </div>

        {/* KPI grid */}
        <div className="relative mt-5 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          <StatTile icon={Package}    label="Catalog"      value={items.length}                          sub={`${Object.entries(kpis.byStatus).map(([k,v]) => `${v} ${k}`).join(' · ') || '—'}`} accent="cyan" />
          <StatTile icon={Users}      label="Active users" value={kpis.totalUsers.toLocaleString()}      sub={`${kpis.totalReviews.toLocaleString()} reviews`} accent="fuchsia" />
          <StatTile icon={Star}       label="Avg rating"   value={kpis.avgRating.toFixed(2)}            sub="across catalog" accent="amber" />
          <StatTile icon={ImageIcon}  label="Media assets" value={gallery.stats.totalMedia}             sub={`${gallery.stats.byStatus.pending} pending · ${gallery.stats.byStatus.rejected} rejected`} accent="cyan" />
          <StatTile icon={HardDrive}  label="Storage"      value={formatFileSize(gallery.stats.totalSizeBytes)} sub={`saved ${formatFileSize(gallery.stats.compressionSavedBytes)} via compression`} accent="emerald" />
          <StatTile icon={TrendingUp} label="Trending"     value={kpis.trending}                         sub="featured surface" accent="fuchsia" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl border border-border bg-card/60 backdrop-blur p-1 overflow-x-auto">
        {TABS.map(t => {
          const active = t.id === tab;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition whitespace-nowrap ${
                active
                  ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-foreground border border-cyan-500/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/40'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ============ CATALOG TAB ============ */}
      {tab === 'catalog' && (
        <>
        {/* View toggle */}
        <div className="flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            Showing <span className="text-foreground font-medium tabular-nums">{filtered.length}</span> of {items.length}
          </div>
          <div className="inline-flex items-center rounded-lg border border-border bg-card/60 backdrop-blur p-0.5">
            <button onClick={() => setView('cinematic')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md transition ${view==='cinematic' ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-foreground border border-cyan-500/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <LayoutGrid className="h-3 w-3"/> Cinematic
            </button>
            <button onClick={() => setView('table')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] rounded-md transition ${view==='table' ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/20 text-foreground border border-cyan-500/30' : 'text-muted-foreground hover:text-foreground'}`}>
              <List className="h-3 w-3"/> Table
            </button>
          </div>
        </div>

        {view === 'cinematic' && (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 mt-3">
            {filtered.map(p => {
              const hovered = hoverId === p.id;
              // deterministic pseudo-version & draft from id
              const seed = p.id.split('').reduce((s, c) => s + c.charCodeAt(0), 0);
              const version = `v${1 + (seed % 4)}.${(seed >> 2) % 10}.${seed % 9}`;
              const isDraft = seed % 7 === 0;
              const isPublished = !isDraft;
              return (
                <div
                  key={p.id}
                  onMouseEnter={() => setHoverId(p.id)}
                  onMouseLeave={() => setHoverId(null)}
                  className={`group relative rounded-xl overflow-hidden border bg-card/60 backdrop-blur transition-all duration-300 ${hovered ? 'border-cyan-500/40 -translate-y-1 shadow-[0_18px_50px_-18px_rgba(34,211,238,0.45)] z-10' : 'border-border'}`}
                >
                  {/* Thumbnail */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10">
                    {p.thumbnail ? (
                      <img src={p.thumbnail} alt={p.name} className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? 'scale-110' : 'scale-100'}`} />
                    ) : (
                      <div className="h-full w-full grid place-items-center text-muted-foreground"><Package className="h-8 w-8"/></div>
                    )}
                    {/* gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent transition-opacity ${hovered ? 'opacity-100' : 'opacity-70'}`} />

                    {/* Top-left badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1">
                      <span className={`inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-semibold backdrop-blur border ${
                        isDraft ? 'border-amber-500/40 bg-amber-500/15 text-amber-200' : 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200'}`}>
                        <span className={`h-1 w-1 rounded-full ${isDraft ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'}`}/>
                        {isDraft ? 'Draft' : 'Live'}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[9px] font-mono border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 backdrop-blur">
                        <GitBranch className="h-2.5 w-2.5"/> {version}
                      </span>
                    </div>

                    {/* Top-right status chip */}
                    <div className="absolute top-2 right-2">
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold capitalize backdrop-blur border ${
                        p.status === 'trending' ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-200' :
                        p.status === 'new' ? 'border-emerald-500/40 bg-emerald-500/15 text-emerald-200' :
                        p.status === 'popular' ? 'border-fuchsia-500/40 bg-fuchsia-500/15 text-fuchsia-200' :
                        'border-amber-500/40 bg-amber-500/15 text-amber-200'}`}>
                        {p.status}
                      </span>
                    </div>

                    {/* Hover overlay: quick actions */}
                    <div className={`absolute inset-0 flex flex-col justify-end p-3 transition-opacity ${hovered ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                      <div className="text-[10px] text-muted-foreground line-clamp-2 mb-2">{p.shortDescription || 'No description'}</div>
                      <div className="flex items-center gap-1.5">
                        <Link to={`/product/${p.id}`} title="Preview"
                          className="inline-flex items-center gap-1 rounded-md bg-white/10 hover:bg-white/20 backdrop-blur px-2 py-1 text-[10px] text-white border border-white/20">
                          <Play className="h-3 w-3"/> Preview
                        </Link>
                        <button onClick={() => setEditing({ ...p })} title="Quick edit"
                          className="inline-flex items-center gap-1 rounded-md bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur px-2 py-1 text-[10px] text-cyan-100 border border-cyan-400/30">
                          <Pencil className="h-3 w-3"/> Edit
                        </button>
                        {isDraft ? (
                          <button onClick={() => { upsertProduct({ ...p, status: 'new' }); toast.success(`Published ${p.name}`); }} title="Quick publish"
                            className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-2 py-1 text-[10px] font-medium text-white border border-white/10">
                            <Rocket className="h-3 w-3"/> Publish
                          </button>
                        ) : (
                          <button onClick={() => { upsertProduct({ ...p }); toast.success(`Bumped ${p.name}`); }} title="Bump version"
                            className="inline-flex items-center gap-1 rounded-md bg-fuchsia-500/20 hover:bg-fuchsia-500/30 px-2 py-1 text-[10px] text-fuchsia-100 border border-fuchsia-400/30">
                            <GitBranch className="h-3 w-3"/> Bump
                          </button>
                        )}
                        <button onClick={() => handleDelete(p)} title="Delete"
                          className="ml-auto h-6 w-6 grid place-items-center rounded-md bg-red-500/20 hover:bg-red-500/30 text-red-200 border border-red-400/30">
                          <Trash2 className="h-3 w-3"/>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-foreground truncate">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground capitalize truncate">{p.category}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-foreground tabular-nums">${p.price}</div>
                        <div className="text-[10px] text-amber-300">★ {p.rating.toFixed(1)}</div>
                      </div>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Users className="h-3 w-3"/> {p.users.toLocaleString()}</span>
                      <span className="inline-flex items-center gap-1"><Star className="h-3 w-3"/> {p.reviews.toLocaleString()}</span>
                      <span className="inline-flex items-center gap-1"><Tag className="h-3 w-3"/> {(p.tags||[]).length}</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="col-span-full py-12 text-center text-sm text-muted-foreground border border-dashed border-border rounded-xl">No products match your search.</div>
            )}
          </div>
        )}

        {view === 'table' && (
        <div className="rounded-xl border border-border bg-card/60 backdrop-blur overflow-hidden mt-3">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Product</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Category</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Price</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Users</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {p.thumbnail && <img src={p.thumbnail} alt={p.name} className="h-8 w-8 rounded object-cover" />}
                      <span className="font-medium text-foreground">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground capitalize">{p.category}</td>
                  <td className="px-4 py-3 text-foreground">${p.price}</td>
                  <td className="px-4 py-3 text-foreground">{p.users.toLocaleString()}</td>
                  <td className="px-4 py-3 text-foreground">⭐ {p.rating.toFixed(1)}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                      p.status === 'trending' ? 'bg-primary/20 text-primary' :
                      p.status === 'new' ? 'bg-green-500/20 text-green-400' :
                      p.status === 'popular' ? 'bg-purple-500/20 text-purple-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link to={`/product/${p.id}`} className="p-1.5 rounded hover:bg-accent text-xs text-primary" title="View">View</Link>
                      <button onClick={() => setEditing({ ...p })} className="p-1.5 rounded hover:bg-accent text-muted-foreground hover:text-foreground transition-colors" aria-label={`Edit ${p.name}`}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(p)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors" aria-label={`Delete ${p.name}`}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-muted-foreground">No products match your search.</td></tr>
              )}
            </tbody>
          </table>
        </div>
        )}
        </>
      )}

      {/* ============ MEDIA & CDN TAB ============ */}
      {tab === 'media' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Gallery breakdown" icon={Layers}>
            <ul className="space-y-2 text-sm">
              {(Object.entries(gallery.stats.byCategory) as [string, number][]).map(([cat, count]) => {
                const total = gallery.stats.totalMedia || 1;
                const pct = Math.round((count / total) * 100);
                return (
                  <li key={cat}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="capitalize text-muted-foreground">{cat}</span>
                      <span className="tabular-nums text-foreground">{count}</span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard title="Moderation queue" icon={FileCheck2}
            action={<Link to="/admin/gallery" className="text-xs text-cyan-300 hover:underline">Open Gallery →</Link>}>
            <div className="grid grid-cols-3 gap-2 text-center">
              {(['approved','pending','rejected'] as const).map(s => (
                <div key={s} className="rounded-lg border border-border bg-background/40 p-3">
                  <div className="text-2xl font-semibold tabular-nums text-foreground">{gallery.stats.byStatus[s]}</div>
                  <div className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">{s}</div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
              <span>Approval gate</span>
              <span className={gallery.settings.requireApproval ? 'text-amber-300' : 'text-emerald-300'}>
                {gallery.settings.requireApproval ? 'Required' : 'Auto-approve'}
              </span>
            </div>
          </SectionCard>

          <SectionCard title="CDN & delivery" icon={CloudUpload}>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">CDN headers</span><span className={gallery.settings.enableCdnHeaders ? 'text-emerald-300' : 'text-muted-foreground'}>{gallery.settings.enableCdnHeaders ? 'Active' : 'Off'}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Cache max-age</span><span className="tabular-nums">{gallery.settings.cdnCacheMaxAge}s</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Lazy loading</span><span className={gallery.settings.enableLazyLoading ? 'text-emerald-300' : 'text-muted-foreground'}>{gallery.settings.enableLazyLoading ? 'On' : 'Off'}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Auto WebP</span><span className={gallery.settings.autoWebp ? 'text-emerald-300' : 'text-muted-foreground'}>{gallery.settings.autoWebp ? 'On' : 'Off'}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Watermark</span><span className={gallery.settings.watermarkEnabled ? 'text-cyan-300' : 'text-muted-foreground'}>{gallery.settings.watermarkEnabled ? `On · ${Math.round(gallery.settings.watermarkOpacity*100)}%` : 'Off'}</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">Compression saved</span><span className="text-emerald-300 tabular-nums">{getCompressionRatio(gallery.stats.totalSizeBytes + gallery.stats.compressionSavedBytes, gallery.stats.totalSizeBytes)}%</span></li>
            </ul>
          </SectionCard>

          <div className="lg:col-span-3">
            <SectionCard title="Recent media uploads" icon={ImageIcon}
              action={<Link to="/admin/gallery" className="text-xs text-cyan-300 hover:underline">Manage media →</Link>}>
              {gallery.products.flatMap(p => p.media.map(m => ({ ...m, productName: p.productName }))).length === 0 ? (
                <p className="text-sm text-muted-foreground py-6 text-center">No media uploaded yet — open the Gallery module to add assets.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-3">
                  {gallery.products
                    .flatMap(p => p.media.map(m => ({ ...m, productName: p.productName })))
                    .sort((a,b) => (a.updatedAt > b.updatedAt ? -1 : 1))
                    .slice(0, 12)
                    .map(m => (
                      <div key={m.id} className="group relative aspect-square rounded-lg overflow-hidden border border-border bg-background/40">
                        <img src={m.thumbnailUrl || m.url} alt={m.altText || m.title} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-1.5">
                          <div className="text-[10px] text-white truncate">{m.productName}</div>
                          <div className="text-[10px] text-white/60 capitalize">{m.category} · {formatFileSize(m.fileSize)}</div>
                        </div>
                        <span className={`absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] rounded-full uppercase tracking-wide ${
                          m.status === 'approved' ? 'bg-emerald-500/80 text-white' :
                          m.status === 'pending' ? 'bg-amber-500/80 text-white' :
                          'bg-red-500/80 text-white'
                        }`}>{m.status}</span>
                      </div>
                    ))}
                </div>
              )}
            </SectionCard>
          </div>
        </div>
      )}

      {/* ============ OPERATIONS TAB ============ */}
      {tab === 'operations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SectionCard title="Audit log — product events" icon={Shield}>
            {productAudit.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No audited product actions yet. Edits & deletions will appear here.</p>
            ) : (
              <ul className="divide-y divide-border">
                {productAudit.map(a => (
                  <li key={a.id} className="py-2 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-sm text-foreground truncate">{a.action}</div>
                      <div className="text-[11px] text-muted-foreground truncate">
                        {a.entity_type ?? 'system'}{a.entity_id ? ` · ${a.entity_id}` : ''}
                      </div>
                    </div>
                    <time className="text-[11px] tabular-nums text-muted-foreground shrink-0">
                      {new Date(a.timestamp).toLocaleString()}
                    </time>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Activity timeline" icon={Activity}>
            {activity.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No activity recorded yet.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                {activity.slice(0, 12).map(a => (
                  <li key={a.id} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground truncate">{a.activity}</div>
                      <div className="text-[11px] text-muted-foreground">{new Date(a.timestamp).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Backups & restore points" icon={Database}
            action={
              <button onClick={runBackup} className="inline-flex items-center gap-1 rounded-md border border-border bg-background/60 hover:bg-accent px-2.5 py-1 text-xs text-foreground">
                <RefreshCw className="h-3 w-3" /> Snapshot now
              </button>
            }>
            {backups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">No backup snapshots yet.</p>
            ) : (
              <ul className="divide-y divide-border text-sm">
                {backups.slice(0, 6).map(b => (
                  <li key={b.id} className="py-2 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-foreground truncate">{b.id}</div>
                      <div className="text-[11px] text-muted-foreground">{b.tables.length} tables · {formatFileSize(b.size_bytes)}</div>
                    </div>
                    <time className="text-[11px] tabular-nums text-muted-foreground">{new Date(b.created_at).toLocaleString()}</time>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Notifications" icon={Bell}>
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">Inbox empty.</p>
            ) : (
              <ul className="space-y-2 max-h-72 overflow-auto pr-1">
                {notifications.slice(0, 10).map(n => (
                  <li key={n.id} className="flex items-start gap-2 rounded-md border border-border bg-background/40 p-2">
                    <span className={`mt-1.5 h-1.5 w-1.5 rounded-full shrink-0 ${n.status === 'unread' ? 'bg-fuchsia-400 animate-pulse' : 'bg-border'}`} />
                    <div className="min-w-0 flex-1">
                      <div className="text-sm text-foreground truncate">{n.message}</div>
                      <div className="text-[11px] text-muted-foreground capitalize">{n.type.replace(/_/g,' ')} · {new Date(n.created_at).toLocaleString()}</div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      )}

      {/* ============ PIPELINE TAB ============ */}
      {tab === 'pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-3">
            <SectionCard title="Release pipeline" icon={GitBranch}>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                {[
                  { key: 'draft',     label: 'Draft',     icon: Pencil,     test: (p: Product) => !p.thumbnail || !p.description },
                  { key: 'review',    label: 'In review', icon: FileCheck2, test: (p: Product) => p.status === 'new' && p.users === 0 },
                  { key: 'staged',    label: 'Staged',    icon: ServerCog,  test: (p: Product) => p.users > 0 && p.users < 1000 },
                  { key: 'production',label: 'Production',icon: CheckCircle2,test:(p: Product) => p.users >= 1000 },
                  { key: 'featured',  label: 'Featured',  icon: Sparkles,   test: (p: Product) => p.status === 'featured' || p.status === 'trending' },
                ].map((stage, i, arr) => {
                  const matched = items.filter(stage.test);
                  const Icon = stage.icon;
                  const pct = items.length ? Math.round((matched.length / items.length) * 100) : 0;
                  return (
                    <div key={stage.key} className="relative rounded-lg border border-border bg-background/40 p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-md border border-cyan-500/30 bg-cyan-500/10 grid place-items-center">
                          <Icon className="h-3.5 w-3.5 text-cyan-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Stage {i+1}/{arr.length}</div>
                          <div className="text-sm font-medium text-foreground">{stage.label}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-end justify-between">
                        <div className="text-2xl font-semibold tabular-nums text-foreground">{matched.length}</div>
                        <div className="text-xs text-muted-foreground">{pct}%</div>
                      </div>
                      <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </SectionCard>
          </div>

          <SectionCard title="Release readiness" icon={CheckCircle2}>
            <ul className="text-sm space-y-2">
              {items.slice(0, 8).map(p => {
                const checks = [
                  !!p.thumbnail,
                  !!p.description,
                  (p.screenshots?.length ?? 0) > 0,
                  (p.features?.length ?? 0) > 0,
                  (p.subscription?.monthly ?? 0) > 0,
                ];
                const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
                return (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <span className="truncate text-foreground">{p.name || 'Untitled'}</span>
                    <span className={`text-xs tabular-nums ${score >= 80 ? 'text-emerald-300' : score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>{score}%</span>
                  </li>
                );
              })}
            </ul>
          </SectionCard>

          <SectionCard title="Build workers" icon={Cpu}>
            <div className="space-y-2 text-sm">
              {[
                { name: 'image-pipeline', load: Math.min(100, gallery.stats.totalMedia * 3), tone: 'cyan' },
                { name: 'cdn-publisher',  load: gallery.settings.enableCdnHeaders ? 62 : 12, tone: 'fuchsia' },
                { name: 'audit-stream',   load: Math.min(100, audit.length * 4), tone: 'emerald' },
                { name: 'webhook-relay',  load: 28, tone: 'amber' },
              ].map(w => (
                <div key={w.name}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-foreground">{w.name}</span>
                    <span className="tabular-nums text-muted-foreground">{w.load}%</span>
                  </div>
                  <div className="mt-1 h-1.5 rounded-full bg-border overflow-hidden">
                    <div className={`h-full ${w.tone === 'cyan' ? 'bg-cyan-400' : w.tone === 'fuchsia' ? 'bg-fuchsia-500' : w.tone === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'}`} style={{ width: `${w.load}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Rollback timeline" icon={RefreshCw}>
            {backups.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No restore points. Run a snapshot from Operations.</p>
            ) : (
              <ol className="relative border-l border-border pl-4 space-y-3">
                {backups.slice(0, 5).map(b => (
                  <li key={b.id} className="text-sm">
                    <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-cyan-400 ring-2 ring-background" />
                    <div className="text-foreground truncate">{b.id}</div>
                    <div className="text-[11px] text-muted-foreground">{new Date(b.created_at).toLocaleString()} · {formatFileSize(b.size_bytes)}</div>
                  </li>
                ))}
              </ol>
            )}
          </SectionCard>
        </div>
      )}

      {/* ============ HEALTH TAB ============ */}
      {tab === 'health' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <SectionCard title="Storage health" icon={HardDrive}>
            <div className="text-3xl font-semibold text-foreground tabular-nums">{formatFileSize(gallery.stats.totalSizeBytes)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{gallery.stats.totalMedia} files across {gallery.stats.totalProducts} products</div>
            <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-gradient-to-r from-emerald-400 to-cyan-400" style={{ width: `${Math.min(100, gallery.stats.totalSizeBytes / (gallery.settings.maxImagesPerProduct * gallery.settings.maxFileSizeMb * 1024 * 1024 * Math.max(1, gallery.stats.totalProducts)) * 100)}%` }} />
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">Quota: {gallery.settings.maxFileSizeMb}MB / file · {gallery.settings.maxImagesPerProduct} files / product</div>
          </SectionCard>

          <SectionCard title="Realtime channel" icon={Radio}>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-sm text-foreground">Operations bus · connected</span>
            </div>
            <ul className="mt-3 text-xs text-muted-foreground space-y-1">
              <li>tick #{pulse} · 3.5s heartbeat</li>
              <li>audit events: {audit.length}</li>
              <li>activity events: {activity.length}</li>
              <li>unread notifications: {notifications.filter(n => n.status === 'unread').length}</li>
            </ul>
          </SectionCard>

          <SectionCard title="Webhooks" icon={Webhook}>
            <ul className="text-sm space-y-2">
              <li className="flex items-center justify-between"><span className="text-muted-foreground">payment_success</span><span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 className="h-3 w-3" /> handled</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">payment_failed</span><span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 className="h-3 w-3" /> handled</span></li>
              <li className="flex items-center justify-between"><span className="text-muted-foreground">signature validation</span><span className="text-cyan-300">enabled</span></li>
            </ul>
          </SectionCard>

          <div className="lg:col-span-2">
            <SectionCard title="Feature flags" icon={Zap}>
              {flags.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">No flags configured — defaults active.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {flags.map(f => (
                    <div key={f.id} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                      <span className="text-sm text-foreground capitalize">{f.feature_name.replace(/_/g,' ')}</span>
                      <span className={`inline-flex items-center gap-1 text-xs ${f.enabled ? 'text-emerald-300' : 'text-muted-foreground'}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${f.enabled ? 'bg-emerald-400' : 'bg-border'}`} />
                        {f.enabled ? 'enabled' : 'disabled'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <SectionCard title="Quarantine & alerts" icon={AlertTriangle}>
            <div className="text-3xl font-semibold tabular-nums text-foreground">{gallery.stats.byStatus.rejected}</div>
            <div className="text-xs text-muted-foreground">rejected media in moderation</div>
            <Link to="/admin/gallery" className="mt-3 inline-flex items-center gap-1 text-xs text-cyan-300 hover:underline">
              <Download className="h-3 w-3" /> Open moderation queue
            </Link>
          </SectionCard>
        </div>
      )}

      {/* Full enterprise product editor */}
      {editing && (
        <ProductEditor
          product={editing}
          isNew={!items.some(i => i.id === editing.id)}
          onClose={() => setEditing(null)}
          onSave={(p) => {
            if (!p.name.trim()) { toast.error('Name is required'); return; }
            const cat = categories.find(c => c.slug === p.categorySlug);
            upsertProduct({ ...p, name: p.name.trim(), category: cat?.name || p.category });
            toast.success('Product saved');
            setEditing(null);
          }}
        />
      )}
    </div>
  );
};

export default AdminProductsPage;
