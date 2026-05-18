import { useEffect, useMemo, useState } from 'react';
import {
  X, Save, Package, FileText, Cpu, GitBranch, Image as ImageIcon, DollarSign,
  Search, Globe, KeyRound, Link as LinkIcon, ShieldCheck, Sparkles, Plus, Trash2,
  CheckCircle2, AlertTriangle, Radio, Layers, Tag as TagIcon, Rocket,
} from 'lucide-react';
import { categories } from '@/lib/marketplaceData';
import type { Product } from '@/lib/marketplaceData';

type SectionId =
  | 'overview' | 'description' | 'tech' | 'releases' | 'media'
  | 'pricing' | 'seo' | 'distribution' | 'relations' | 'license';

const SECTIONS: { id: SectionId; label: string; icon: typeof Package; hint: string }[] = [
  { id: 'overview',     label: 'Overview',        icon: Package,     hint: 'Identity, category, status' },
  { id: 'description',  label: 'Description',     icon: FileText,    hint: 'Long copy & content blocks' },
  { id: 'tech',         label: 'Tech specs',      icon: Cpu,         hint: 'Framework, deps, compatibility' },
  { id: 'releases',     label: 'Releases',        icon: GitBranch,   hint: 'Versions, channels, changelog' },
  { id: 'media',        label: 'Media & gallery', icon: ImageIcon,   hint: 'Thumbnail, screenshots, video' },
  { id: 'pricing',      label: 'Pricing & plans', icon: DollarSign,  hint: 'Price, subscription, coupons' },
  { id: 'seo',          label: 'SEO & metadata',  icon: Search,      hint: 'Title, description, schema' },
  { id: 'distribution', label: 'Distribution',    icon: Globe,       hint: 'APK / source / demo links' },
  { id: 'relations',    label: 'Relations',       icon: LinkIcon,    hint: 'Related products & bundles' },
  { id: 'license',      label: 'License',         icon: KeyRound,    hint: 'Licensing model & terms' },
];

interface Props {
  product: Product;
  isNew: boolean;
  onClose: () => void;
  onSave: (p: Product) => void;
}

export function ProductEditor({ product, isNew, onClose, onSave }: Props) {
  const [draft, setDraft] = useState<Product>(product);
  const [section, setSection] = useState<SectionId>('overview');

  // local-only enterprise UI state (not persisted in Product type)
  const [installGuide, setInstallGuide] = useState('# Installation\n\n1. Download archive\n2. Unzip & upload\n3. Run installer\n');
  const [releaseNotes, setReleaseNotes] = useState('v1.4.2 — performance + a11y fixes');
  const [framework, setFramework] = useState('React 18 · Vite 5 · Tailwind 3');
  const [supportedVersions, setSupportedVersions] = useState('Node 18+, PHP 8.2+, MySQL 8');
  const [dependencies, setDependencies] = useState('react, vite, tailwindcss, framer-motion');
  const [demoUrl, setDemoUrl] = useState('https://demo.example.com');
  const [videoUrl, setVideoUrl] = useState('https://youtube.com/preview');
  const [apkUrl, setApkUrl] = useState('');
  const [sourceVault, setSourceVault] = useState('vault://source/' + draft.id);
  const [seoTitle, setSeoTitle] = useState(draft.name);
  const [seoDesc, setSeoDesc] = useState(draft.shortDescription);
  const [licenseModel, setLicenseModel] = useState<'regular' | 'extended' | 'enterprise'>('regular');

  useEffect(() => { setDraft(product); setSeoTitle(product.name); setSeoDesc(product.shortDescription); }, [product]);

  const completeness = useMemo(() => {
    const checks = [
      !!draft.name,
      !!draft.shortDescription,
      !!draft.description,
      !!draft.thumbnail,
      (draft.screenshots?.length ?? 0) > 0,
      (draft.features?.length ?? 0) > 0,
      (draft.modules?.length ?? 0) > 0,
      (draft.subscription?.monthly ?? 0) > 0,
      !!seoTitle, !!seoDesc,
    ];
    const score = Math.round((checks.filter(Boolean).length / checks.length) * 100);
    return { score, missing: checks.filter(c => !c).length };
  }, [draft, seoTitle, seoDesc]);

  const update = <K extends keyof Product>(k: K, v: Product[K]) => setDraft(d => ({ ...d, [k]: v }));
  const setSub = (k: 'monthly' | 'yearly', v: number) =>
    setDraft(d => ({ ...d, subscription: { ...d.subscription, [k]: v } }));

  const arrField = (key: 'features' | 'modules' | 'tags' | 'screenshots', label: string) => (
    <ArrayEditor
      label={label}
      value={(draft[key] ?? []) as string[]}
      onChange={v => update(key, v as Product[typeof key])}
    />
  );

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = categories.find(c => c.slug === draft.categorySlug);
    onSave({ ...draft, name: draft.name.trim(), category: cat?.name || draft.category });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex" onClick={onClose}>
      <form
        onClick={e => e.stopPropagation()}
        onSubmit={submit}
        className="ml-auto h-full w-full max-w-6xl bg-gradient-to-br from-card via-background to-card border-l border-cyan-500/20 shadow-[0_0_60px_-12px_rgba(34,211,238,0.4)] flex flex-col"
      >
        {/* Header */}
        <div className="relative shrink-0 px-5 py-3 border-b border-border flex items-center gap-3">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
          <div className="h-9 w-9 rounded-lg border border-cyan-500/30 bg-cyan-500/10 grid place-items-center">
            <Rocket className="h-4 w-4 text-cyan-300" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-cyan-300/70">
              <Radio className="h-3 w-3 animate-pulse" /> Release editor · live
            </div>
            <h2 className="text-sm font-semibold text-foreground truncate">
              {isNew ? 'New product' : draft.name || 'Untitled product'}
              <span className="ml-2 text-[11px] font-normal text-muted-foreground">{draft.id}</span>
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-md border border-border bg-background/60">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Release confidence</span>
            <span className={`text-sm font-semibold tabular-nums ${
              completeness.score >= 80 ? 'text-emerald-300' : completeness.score >= 50 ? 'text-amber-300' : 'text-red-300'
            }`}>{completeness.score}%</span>
            <div className="w-24 h-1.5 rounded-full bg-border overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: `${completeness.score}%` }} />
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 min-h-0 grid grid-cols-[220px_1fr]">
          {/* Left rail */}
          <aside className="border-r border-border bg-background/40 overflow-y-auto py-3">
            {SECTIONS.map(s => {
              const active = s.id === section;
              const Icon = s.icon;
              return (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSection(s.id)}
                  className={`group w-full text-left px-3 py-2 flex items-start gap-2.5 border-l-2 transition ${
                    active
                      ? 'border-cyan-400 bg-gradient-to-r from-cyan-500/10 to-transparent text-foreground'
                      : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03]'
                  }`}
                >
                  <Icon className={`h-4 w-4 mt-0.5 ${active ? 'text-cyan-300' : 'group-hover:text-cyan-300/70'}`} />
                  <div className="min-w-0">
                    <div className="text-xs font-medium">{s.label}</div>
                    <div className="text-[10px] text-muted-foreground truncate">{s.hint}</div>
                  </div>
                </button>
              );
            })}
          </aside>

          {/* Section content */}
          <div className="overflow-y-auto p-5 space-y-5">
            {section === 'overview' && (
              <Block title="Product identity" icon={Package}>
                <Grid>
                  <Field label="Name" required>
                    <input required value={draft.name} onChange={e => update('name', e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Status">
                    <select value={draft.status} onChange={e => update('status', e.target.value as Product['status'])} className={inputCls}>
                      <option value="new">new</option>
                      <option value="trending">trending</option>
                      <option value="popular">popular</option>
                      <option value="featured">featured</option>
                    </select>
                  </Field>
                  <Field label="Category">
                    <select value={draft.categorySlug} onChange={e => update('categorySlug', e.target.value)} className={inputCls}>
                      {categories.map(c => (<option key={c.slug} value={c.slug}>{c.name}</option>))}
                    </select>
                  </Field>
                  <Field label="Thumbnail URL">
                    <input value={draft.thumbnail} onChange={e => update('thumbnail', e.target.value)} className={inputCls} placeholder="https://..." />
                  </Field>
                </Grid>
                <Field label="Short description">
                  <input value={draft.shortDescription} onChange={e => update('shortDescription', e.target.value)} className={inputCls} />
                </Field>
                <Grid cols={3}>
                  <Field label="Users"><input type="number" min={0} value={draft.users} onChange={e => update('users', Number(e.target.value))} className={inputCls} /></Field>
                  <Field label="Reviews"><input type="number" min={0} value={draft.reviews} onChange={e => update('reviews', Number(e.target.value))} className={inputCls} /></Field>
                  <Field label="Rating"><input type="number" min={0} max={5} step={0.1} value={draft.rating} onChange={e => update('rating', Number(e.target.value))} className={inputCls} /></Field>
                </Grid>
              </Block>
            )}

            {section === 'description' && (
              <>
                <Block title="Long description" icon={FileText}>
                  <textarea value={draft.description} onChange={e => update('description', e.target.value)} rows={8} className={inputCls + ' font-mono text-xs'} />
                  <p className="mt-2 text-[11px] text-muted-foreground">Markdown / rich blocks supported. Used on the product detail page hero.</p>
                </Block>
                <Block title="Installation guide" icon={Cpu}>
                  <textarea value={installGuide} onChange={e => setInstallGuide(e.target.value)} rows={6} className={inputCls + ' font-mono text-xs'} />
                </Block>
              </>
            )}

            {section === 'tech' && (
              <>
                <Block title="Framework & runtime" icon={Cpu}>
                  <Grid>
                    <Field label="Framework stack"><input value={framework} onChange={e => setFramework(e.target.value)} className={inputCls} /></Field>
                    <Field label="Supported runtimes"><input value={supportedVersions} onChange={e => setSupportedVersions(e.target.value)} className={inputCls} /></Field>
                  </Grid>
                  <Field label="Dependencies"><input value={dependencies} onChange={e => setDependencies(e.target.value)} className={inputCls} placeholder="comma separated" /></Field>
                </Block>
                <Block title="Compatibility matrix" icon={Layers}>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                    {['Web','Mobile','Desktop','API'].map(p => (
                      <div key={p} className="rounded-md border border-border bg-background/40 px-3 py-2 flex items-center justify-between">
                        <span className="text-muted-foreground">{p}</span>
                        <span className="inline-flex items-center gap-1 text-emerald-300"><CheckCircle2 className="h-3 w-3" /> ok</span>
                      </div>
                    ))}
                  </div>
                </Block>
                <Block title="Modules" icon={Layers}>{arrField('modules','Modules')}</Block>
                <Block title="Features" icon={Sparkles}>{arrField('features','Features')}</Block>
              </>
            )}

            {section === 'releases' && (
              <>
                <Block title="Release channels" icon={GitBranch}>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {(['alpha','beta','stable'] as const).map(ch => (
                      <div key={ch} className="rounded-md border border-border bg-background/40 p-3">
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{ch}</div>
                        <div className="mt-1 text-sm text-foreground">v1.{ch === 'stable' ? '4.2' : ch === 'beta' ? '5.0-b1' : '6.0-a3'}</div>
                        <div className="mt-2 h-1 rounded-full bg-border overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500" style={{ width: ch === 'stable' ? '100%' : ch === 'beta' ? '64%' : '22%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </Block>
                <Block title="Release notes / changelog" icon={FileText}>
                  <textarea value={releaseNotes} onChange={e => setReleaseNotes(e.target.value)} rows={6} className={inputCls + ' font-mono text-xs'} />
                </Block>
                <Block title="Approval flow" icon={ShieldCheck}>
                  <ol className="space-y-2 text-xs">
                    {[
                      { step: 'Author submitted',    ok: true },
                      { step: 'AI scan passed',      ok: true },
                      { step: 'Compliance review',   ok: completeness.score >= 70 },
                      { step: 'Production deploy',   ok: false },
                    ].map((s, i) => (
                      <li key={i} className="flex items-center gap-2">
                        {s.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> : <AlertTriangle className="h-3.5 w-3.5 text-amber-300" />}
                        <span className={s.ok ? 'text-foreground' : 'text-muted-foreground'}>{s.step}</span>
                      </li>
                    ))}
                  </ol>
                </Block>
              </>
            )}

            {section === 'media' && (
              <>
                <Block title="Hero thumbnail" icon={ImageIcon}>
                  <div className="flex gap-3 items-start">
                    {draft.thumbnail && <img src={draft.thumbnail} alt="thumb" className="h-24 w-24 rounded-md object-cover border border-border" />}
                    <input value={draft.thumbnail} onChange={e => update('thumbnail', e.target.value)} className={inputCls} placeholder="https://..." />
                  </div>
                </Block>
                <Block title="Screenshots" icon={ImageIcon}>{arrField('screenshots','Screenshot URL')}</Block>
                <Block title="Video preview" icon={Globe}>
                  <Field label="Video URL"><input value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className={inputCls} /></Field>
                </Block>
              </>
            )}

            {section === 'pricing' && (
              <>
                <Block title="Base pricing" icon={DollarSign}>
                  <Grid cols={3}>
                    <Field label="One-time ($)"><input type="number" min={0} value={draft.price} onChange={e => update('price', Number(e.target.value))} className={inputCls} /></Field>
                    <Field label="Subscription / mo"><input type="number" min={0} value={draft.subscription.monthly} onChange={e => setSub('monthly', Number(e.target.value))} className={inputCls} /></Field>
                    <Field label="Subscription / yr"><input type="number" min={0} value={draft.subscription.yearly} onChange={e => setSub('yearly', Number(e.target.value))} className={inputCls} /></Field>
                  </Grid>
                </Block>
                <Block title="Coupon hooks" icon={TagIcon}>
                  <p className="text-xs text-muted-foreground">Active coupons are managed in <span className="text-cyan-300">/admin/coupons</span>. This product inherits all eligible discounts automatically.</p>
                </Block>
              </>
            )}

            {section === 'seo' && (
              <Block title="SEO & metadata" icon={Search}>
                <Field label="SEO title"><input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className={inputCls} /></Field>
                <Field label="SEO description"><input value={seoDesc} onChange={e => setSeoDesc(e.target.value)} className={inputCls} /></Field>
                <Block title="Tags" icon={TagIcon} inner>{arrField('tags','Tag')}</Block>
              </Block>
            )}

            {section === 'distribution' && (
              <>
                <Block title="Demo & previews" icon={Globe}>
                  <Field label="Live demo URL"><input value={demoUrl} onChange={e => setDemoUrl(e.target.value)} className={inputCls} /></Field>
                </Block>
                <Block title="Build artifacts" icon={Rocket}>
                  <Grid>
                    <Field label="APK / AAB URL"><input value={apkUrl} onChange={e => setApkUrl(e.target.value)} className={inputCls} placeholder="https://cdn.example.com/build.apk" /></Field>
                    <Field label="Source vault"><input value={sourceVault} onChange={e => setSourceVault(e.target.value)} className={inputCls} /></Field>
                  </Grid>
                </Block>
              </>
            )}

            {section === 'relations' && (
              <Block title="Related products & bundles" icon={LinkIcon}>
                <p className="text-xs text-muted-foreground mb-2">Auto-suggested by category — adjust per release.</p>
                <ul className="text-xs space-y-1">
                  {categories.map(c => (
                    <li key={c.slug} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                      <span className="text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">{c.count} products</span>
                    </li>
                  ))}
                </ul>
              </Block>
            )}

            {section === 'license' && (
              <Block title="License model" icon={KeyRound}>
                <div className="grid grid-cols-3 gap-2">
                  {(['regular','extended','enterprise'] as const).map(m => (
                    <button
                      type="button"
                      key={m}
                      onClick={() => setLicenseModel(m)}
                      className={`rounded-md border px-3 py-3 text-left transition ${
                        licenseModel === m
                          ? 'border-cyan-400 bg-cyan-500/10 text-foreground'
                          : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <div className="text-xs font-medium capitalize">{m}</div>
                      <div className="text-[10px] mt-1">
                        {m === 'regular' && 'Single end-product, no resale'}
                        {m === 'extended' && 'Single end-product, may resell'}
                        {m === 'enterprise' && 'Unlimited deployments + SLA'}
                      </div>
                    </button>
                  ))}
                </div>
              </Block>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border px-5 py-3 flex items-center justify-between gap-3 bg-background/60 backdrop-blur">
          <div className="text-[11px] text-muted-foreground flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><ShieldCheck className="h-3 w-3 text-emerald-300" /> Audit-logged</span>
            <span>· {completeness.missing} fields remaining</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm rounded-lg border border-border text-foreground hover:bg-accent transition-colors">Cancel</button>
            <button type="submit" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_22px_-6px_rgba(34,211,238,0.7)] hover:opacity-90 transition">
              <Save className="h-4 w-4" /> {isNew ? 'Create product' : 'Save changes'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* ---------- helpers ---------- */

const inputCls = 'mt-1 w-full px-3 py-2 text-sm rounded-lg border border-border bg-background/60 backdrop-blur text-foreground focus:outline-none focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/30 transition';

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}{required && <span className="text-fuchsia-400"> *</span>}
      </span>
      {children}
    </label>
  );
}

function Grid({ cols = 2, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return <div className={`grid gap-3 ${cols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>{children}</div>;
}

function Block({ title, icon: Icon, children, inner }: { title: string; icon: typeof Package; children: React.ReactNode; inner?: boolean }) {
  return (
    <section className={inner ? 'mt-4' : 'rounded-xl border border-border bg-card/60 backdrop-blur-sm p-4 space-y-3'}>
      <header className="flex items-center gap-2">
        <div className="h-6 w-6 rounded-md border border-border bg-background/40 grid place-items-center">
          <Icon className="h-3 w-3 text-cyan-300" />
        </div>
        <h3 className="text-xs font-semibold text-foreground uppercase tracking-wider">{title}</h3>
      </header>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function ArrayEditor({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
  const [input, setInput] = useState('');
  const add = () => { const v = input.trim(); if (!v) return; onChange([...value, v]); setInput(''); };
  return (
    <div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
          placeholder={`Add ${label.toLowerCase()}…`}
          className={inputCls + ' mt-0'}
        />
        <button type="button" onClick={add} className="px-3 py-2 text-xs rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20 transition shrink-0 inline-flex items-center gap-1">
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {value.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {value.map((v, i) => (
            <li key={i} className="group inline-flex items-center gap-1 rounded-md border border-border bg-background/40 px-2 py-1 text-xs text-foreground">
              <span className="max-w-[180px] truncate">{v}</span>
              <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}