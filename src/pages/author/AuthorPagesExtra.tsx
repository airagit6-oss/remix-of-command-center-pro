import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Package, Upload, Sparkles, Image as ImageIcon, DollarSign, KeyRound,
  Smartphone, Monitor, Tablet, CheckCircle2, ArrowRight, ArrowLeft, Cpu, Globe,
  Search, Eye, ShieldCheck, BadgeCheck, Star, Award, Trophy, Crown, Flame, Zap,
  Heart, Users, MessageSquare, Bell, AlertTriangle, IdCard, Camera,
  Palette, Languages, KeySquare, Activity, ClipboardList, TrendingUp,
  Rocket, Wallet, Gift, Link2, Plus, X, Check, Server, Mail,
  Github, Twitter, Crosshair, Radar, GitBranch, Clock, Building2,
} from 'lucide-react';
import { Kpi, Section } from './AuthorPages';

function Eyebrow({ title, subtitle, action, eyebrow = 'Author Studio' }: {
  title: string; subtitle?: string; action?: React.ReactNode; eyebrow?: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background p-5">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {eyebrow}
            <span className="text-emerald-400 font-medium">· Live</span>
          </div>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground max-w-xl">{subtitle}</p>}
        </div>
        {action}
      </div>
    </div>
  );
}

type ChipTone = 'cyan' | 'fuchsia' | 'emerald' | 'amber' | 'muted';
function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: ChipTone }) {
  const map: Record<ChipTone, string> = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    muted: 'border-border bg-background/60 text-muted-foreground',
  };
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[tone]}`}>{children}</span>;
}

function GradButton({ children, onClick, icon: Icon, variant = 'primary', className = '' }: {
  children: React.ReactNode; onClick?: () => void; icon?: typeof Plus; variant?: 'primary' | 'ghost' | 'outline'; className?: string;
}) {
  const cls = variant === 'primary'
    ? 'bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_24px_-8px_rgba(34,211,238,0.7)] hover:opacity-90'
    : variant === 'outline'
    ? 'border border-cyan-500/30 text-cyan-200 hover:bg-cyan-500/10'
    : 'text-muted-foreground hover:text-foreground hover:bg-accent';
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition ${cls} ${className}`}>
      {Icon && <Icon className="h-3.5 w-3.5" />} {children}
    </button>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</span>
      {children}
    </label>
  );
}

/* ===================== UPLOAD WIZARD ===================== */

const STEPS = [
  { id: 1, label: 'Basics',      icon: Package },
  { id: 2, label: 'Screenshots', icon: ImageIcon },
  { id: 3, label: 'Demo links',  icon: Globe },
  { id: 4, label: 'SEO setup',   icon: Search },
  { id: 5, label: 'Pricing',     icon: DollarSign },
  { id: 6, label: 'License',     icon: KeyRound },
  { id: 7, label: 'AI optimize', icon: Sparkles },
  { id: 8, label: 'Publish',     icon: Rocket },
];

export function AuthorUploadWizardPage() {
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [title, setTitle] = useState('Quantum Dashboard Pro');
  const [summary, setSummary] = useState('Realtime analytics dashboard with AI insights, multi-tenant ready.');
  const [tags, setTags] = useState<string[]>(['react', 'dashboard', 'ai', 'analytics']);
  const [tagInput, setTagInput] = useState('');
  const [price, setPrice] = useState(89);
  const [files, setFiles] = useState<{ name: string; size: number; progress: number }[]>([]);
  const [drag, setDrag] = useState(false);

  const seoScore = Math.min(100, 30 + title.length * 0.4 + summary.length * 0.3 + tags.length * 6);
  const aiScore  = Math.min(100, 55 + tags.length * 4 + (files.length ? 10 : 0));

  useEffect(() => {
    const id = setInterval(() => {
      setFiles(fs => fs.map(f => f.progress < 100 ? { ...f, progress: Math.min(100, f.progress + 7 + Math.random() * 10) } : f));
    }, 300);
    return () => clearInterval(id);
  }, []);

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    const next = Array.from(list).slice(0, 8).map(f => ({ name: f.name, size: f.size, progress: 5 }));
    setFiles(prev => [...prev, ...next].slice(0, 10));
  };
  const addMock = () => {
    const names = ['hero-overview.png', 'analytics-grid.png', 'mobile-flow.png', 'pricing-table.png'];
    setFiles(prev => [...prev, { name: names[prev.length % 4], size: 120000 + Math.random() * 800000, progress: 5 }]);
  };
  const addTag = () => {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags([...tags, t]);
    setTagInput('');
  };

  return (
    <div className="space-y-6">
      <Eyebrow
        eyebrow="Upload wizard"
        title="Ship a new product"
        subtitle="Cinematic 8-step flow — drag, drop, optimize with AI, and publish to the marketplace."
        action={
          <div className="flex items-center gap-2">
            <Chip tone="emerald"><Sparkles className="h-3 w-3" /> AI co-pilot</Chip>
            <Chip tone="cyan"><Cpu className="h-3 w-3" /> Auto-scan</Chip>
          </div>
        }
      />

      <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-3 overflow-x-auto">
        <ol className="flex items-center gap-2 min-w-max">
          {STEPS.map((s, i) => {
            const done = step > s.id, active = step === s.id;
            return (
              <li key={s.id} className="flex items-center gap-2">
                <button
                  onClick={() => setStep(s.id)}
                  className={`group flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition ${
                    active ? 'border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-fuchsia-500/10 text-foreground'
                    : done ? 'border-emerald-500/30 bg-emerald-500/5 text-emerald-200'
                    : 'border-border bg-background/40 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span className={`h-5 w-5 grid place-items-center rounded-full text-[10px] ${
                    active ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white'
                    : done ? 'bg-emerald-500/30 text-emerald-200' : 'bg-background border border-border'
                  }`}>
                    {done ? <Check className="h-3 w-3" /> : s.id}
                  </span>
                  <span className="font-medium">{s.label}</span>
                </button>
                {i < STEPS.length - 1 && <span className="h-px w-6 bg-border" />}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 space-y-4">
          {step === 1 && (
            <Section title="Product basics" icon={Package}>
              <div className="grid md:grid-cols-2 gap-3">
                <Field label="Product name"><input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm" /></Field>
                <Field label="Category"><select className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"><option>Analytics & Dashboards</option><option>AI / ML</option><option>CRM</option><option>Developer tools</option></select></Field>
                <Field label="Short summary" className="md:col-span-2"><textarea value={summary} onChange={e => setSummary(e.target.value)} rows={3} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" /></Field>
                <Field label="Stack"><div className="flex flex-wrap gap-1.5">{['React','TypeScript','Postgres','Redis'].map(s => <Chip key={s}>{s}</Chip>)}</div></Field>
                <Field label="License type"><select className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"><option>Regular</option><option>Extended</option><option>Enterprise</option></select></Field>
              </div>
            </Section>
          )}

          {step === 2 && (
            <Section title="Screenshots & gallery" icon={ImageIcon} action={<GradButton icon={Plus} onClick={addMock} variant="outline">Add demo asset</GradButton>}>
              <div
                onDragOver={e => { e.preventDefault(); setDrag(true); }}
                onDragLeave={() => setDrag(false)}
                onDrop={e => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files); }}
                className={`relative rounded-xl border-2 border-dashed p-8 text-center transition ${drag ? 'border-cyan-400 bg-cyan-500/5' : 'border-border bg-background/40'}`}
              >
                <div className="mx-auto h-12 w-12 grid place-items-center rounded-full bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/20 border border-cyan-500/30">
                  <Upload className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-3 text-sm text-foreground">Drag & drop screenshots or <label className="text-cyan-300 cursor-pointer hover:underline">browse files<input type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} /></label></div>
                <div className="text-[11px] text-muted-foreground mt-1">PNG, JPG, WebP · up to 8 MB · 16:9 recommended</div>
              </div>
              {files.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {files.map((f, i) => (
                    <li key={i} className="rounded-md border border-border bg-background/40 p-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground truncate flex items-center gap-2"><ImageIcon className="h-3.5 w-3.5 text-cyan-300" />{f.name}</span>
                        <span className="text-muted-foreground tabular-nums">{(f.size/1024).toFixed(0)} KB · {Math.round(f.progress)}%</span>
                      </div>
                      <div className="mt-1 h-1 rounded-full bg-border overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-[width]" style={{ width: `${f.progress}%` }} />
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Section>
          )}

          {step === 3 && (
            <Section title="Demo links" icon={Globe}>
              <div className="space-y-3">
                <Field label="Live preview URL"><input defaultValue="https://demo.quantum.app" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm" /></Field>
                <Field label="Video walkthrough"><input defaultValue="https://youtu.be/abc123" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm" /></Field>
                <Field label="Documentation"><input defaultValue="https://docs.quantum.app" className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm" /></Field>
                <div className="rounded-md border border-emerald-500/30 bg-emerald-500/5 p-3 text-xs text-emerald-200 flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Demo URL reachable · TLS verified · 142ms TTFB
                </div>
              </div>
            </Section>
          )}

          {step === 4 && (
            <Section title="SEO setup" icon={Search} action={<Chip tone="fuchsia"><Sparkles className="h-3 w-3" /> AI suggest</Chip>}>
              <div className="space-y-3">
                <Field label="Meta title"><input defaultValue={`${title} — AI Analytics Dashboard`} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm" /></Field>
                <Field label="Meta description"><textarea rows={2} defaultValue={summary} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm" /></Field>
                <Field label="Tags">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-200 text-[11px] px-2 py-0.5">
                        #{t}<button onClick={() => setTags(tags.filter(x => x !== t))}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                    <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} placeholder="add tag…" className="bg-background border border-border rounded-md px-2 py-0.5 text-xs w-28" />
                  </div>
                </Field>
                <div className="rounded-md border border-fuchsia-500/30 bg-gradient-to-r from-fuchsia-500/10 to-cyan-500/10 p-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-fuchsia-200 mb-1.5">
                    <Sparkles className="h-3 w-3"/> AI suggested tags · click to add
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['saas','typescript','enterprise','realtime','multi-tenant','tailwind','supabase','b2b','admin','starter'].filter(s => !tags.includes(s)).slice(0,8).map(s => (
                      <button key={s} onClick={() => setTags([...tags, s])}
                        className="inline-flex items-center gap-1 rounded-full border border-fuchsia-500/30 bg-background/60 hover:bg-fuchsia-500/15 text-fuchsia-200 text-[11px] px-2 py-0.5 transition">
                        <Plus className="h-2.5 w-2.5"/>{s}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {[{ k: 'SEO score', v: Math.round(seoScore), tone: 'cyan' as const }, { k: 'Readability', v: 87, tone: 'emerald' as const }, { k: 'Keyword density', v: 64, tone: 'fuchsia' as const }].map(s => (
                    <div key={s.k} className="rounded-md border border-border bg-background/40 p-2">
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{s.k}</div>
                      <div className="text-lg font-semibold text-foreground tabular-nums">{s.v}</div>
                      <div className="mt-1 h-1 rounded-full bg-border overflow-hidden"><div className={`h-full bg-gradient-to-r ${s.tone === 'cyan' ? 'from-cyan-400 to-fuchsia-500' : s.tone === 'emerald' ? 'from-emerald-400 to-cyan-400' : 'from-fuchsia-400 to-pink-500'}`} style={{ width: `${s.v}%` }} /></div>
                    </div>
                  ))}
                </div>
              </div>
            </Section>
          )}

          {step === 5 && (
            <Section title="Pricing tiers" icon={DollarSign}>
              <div className="grid md:grid-cols-3 gap-3">
                {[
                  { name: 'Single site', price, badge: 'Regular' },
                  { name: 'Multi-site',  price: price * 4, badge: 'Studio' },
                  { name: 'Enterprise',  price: price * 12, badge: 'Unlimited' },
                ].map((t, i) => (
                  <div key={t.name} className={`rounded-xl border p-4 ${i === 1 ? 'border-cyan-500/40 bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10' : 'border-border bg-background/40'}`}>
                    <div className="flex items-center justify-between"><div className="text-sm font-semibold text-foreground">{t.name}</div><Chip tone={i === 1 ? 'cyan' : 'muted'}>{t.badge}</Chip></div>
                    <div className="mt-2 text-2xl font-bold text-foreground tabular-nums">${t.price}</div>
                    <div className="mt-2 text-[11px] text-muted-foreground">12 months updates · 6 months support</div>
                  </div>
                ))}
              </div>
              <div className="mt-3"><Field label="Base price (USD)"><input type="number" value={price} onChange={e => setPrice(Number(e.target.value))} className="w-32 bg-background border border-border rounded-md px-3 py-1.5 text-sm tabular-nums" /></Field></div>
            </Section>
          )}

          {step === 6 && (
            <Section title="License setup" icon={KeyRound}>
              <div className="space-y-2 text-sm">
                {[
                  'Regular License — 1 end product, free distribution to clients',
                  'Extended License — 1 end product, may be sold/charged for use',
                  'Reseller addon — split revenue with affiliate network',
                  'Source-available — paying users access full repo',
                ].map((l, i) => (
                  <label key={l} className="flex items-start gap-2 rounded-md border border-border bg-background/40 p-3 hover:border-cyan-500/30 cursor-pointer">
                    <input type="checkbox" defaultChecked={i < 2} className="mt-1 h-4 w-4 rounded border-border accent-cyan-400" />
                    <span className="text-foreground">{l}</span>
                  </label>
                ))}
              </div>
            </Section>
          )}

          {step === 7 && (
            <Section title="AI optimization" icon={Sparkles} action={<Chip tone="fuchsia">GPT-tier</Chip>}>
              <div className="space-y-3">
                {[
                  { t: 'Rewrite hero copy', s: 'Higher conversion variant generated' },
                  { t: 'Suggest 4 missing screenshots', s: 'API · Pricing · Mobile · Dark mode' },
                  { t: 'Add 6 long-tail keywords', s: '"react ai dashboard saas template" +5' },
                  { t: 'Compress assets to WebP', s: 'Save ~62% bandwidth' },
                ].map((s) => (
                  <div key={s.t} className="flex items-start gap-3 rounded-md border border-border bg-background/40 p-3">
                    <div className="h-7 w-7 grid place-items-center rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300"><Sparkles className="h-3.5 w-3.5" /></div>
                    <div className="flex-1 min-w-0"><div className="text-sm text-foreground">{s.t}</div><div className="text-[11px] text-muted-foreground">{s.s}</div></div>
                    <GradButton variant="outline">Apply</GradButton>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {step === 8 && (
            <Section title="Publish preview" icon={Rocket}>
              <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 p-4 flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-300" />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-foreground">All checks passed</div>
                  <div className="text-[11px] text-muted-foreground">Malware scan · License compliance · SEO {Math.round(seoScore)}/100 · AI quality {Math.round(aiScore)}/100</div>
                </div>
                <GradButton icon={Rocket}>Publish now</GradButton>
              </div>
              <div className="mt-4 grid md:grid-cols-2 gap-3 text-xs">
                <div className="rounded-md border border-border bg-background/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Schedule</div>
                  <div className="flex items-center gap-2 text-foreground"><Clock className="h-3.5 w-3.5 text-cyan-300" /> Publish now</div>
                  <div className="mt-2 text-[11px] text-muted-foreground">Or schedule: <button className="text-cyan-300 hover:underline">Fri 09:00 UTC</button></div>
                </div>
                <div className="rounded-md border border-border bg-background/40 p-3">
                  <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Distribution channels</div>
                  <div className="flex flex-wrap gap-1.5">{['Marketplace', 'Featured', 'Email digest', 'Affiliates'].map(c => <Chip key={c} tone="cyan">{c}</Chip>)}</div>
                </div>
              </div>
            </Section>
          )}

          <div className="flex items-center justify-between">
            <GradButton variant="ghost" icon={ArrowLeft} onClick={() => setStep(Math.max(1, step - 1))}>Back</GradButton>
            <div className="text-[11px] text-muted-foreground">Step {step} of {STEPS.length} · autosaved</div>
            <GradButton icon={ArrowRight} onClick={() => setStep(Math.min(STEPS.length, step + 1))}>{step === STEPS.length ? 'Publish' : 'Continue'}</GradButton>
          </div>
        </div>

        <div className="space-y-4">
          <Section title="Live preview" icon={Eye} action={
            <div className="flex items-center gap-1 text-muted-foreground">
              {([['desktop', Monitor], ['tablet', Tablet], ['mobile', Smartphone]] as const).map(([k, Ic]) => (
                <button key={k} onClick={() => setDevice(k)} className={`h-7 w-7 grid place-items-center rounded-md border ${device === k ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300' : 'border-border hover:text-foreground'}`}><Ic className="h-3.5 w-3.5" /></button>
              ))}
            </div>
          }>
            <div className={`mx-auto rounded-xl border border-border bg-gradient-to-br from-background to-card overflow-hidden transition-all ${device === 'desktop' ? 'w-full aspect-[16/10]' : device === 'tablet' ? 'w-3/4 aspect-[4/3]' : 'w-44 aspect-[9/16]'}`}>
              <div className="h-full p-3 space-y-2">
                <div className="h-3 w-2/3 rounded bg-gradient-to-r from-cyan-400/40 to-fuchsia-500/40" />
                <div className="text-[10px] text-foreground font-semibold truncate">{title}</div>
                <div className="text-[9px] text-muted-foreground line-clamp-2">{summary}</div>
                <div className="grid grid-cols-2 gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="aspect-video rounded bg-gradient-to-br from-cyan-500/20 to-fuchsia-500/10 border border-border" />
                  ))}
                </div>
                <div className="flex flex-wrap gap-1">{tags.slice(0, 6).map(t => <span key={t} className="text-[8px] rounded border border-border bg-background/60 px-1">#{t}</span>)}</div>
                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-border">
                  <span className="text-foreground font-semibold">${price}</span>
                  <span className="text-emerald-300">★ 4.9</span>
                </div>
              </div>
            </div>
          </Section>

          <Section title="Quality scores" icon={Cpu}>
            {[
              { label: 'SEO score', value: Math.round(seoScore), cls: 'from-cyan-400 to-fuchsia-500' },
              { label: 'AI quality', value: Math.round(aiScore), cls: 'from-fuchsia-400 to-pink-500' },
              { label: 'Asset health', value: files.length ? 92 : 60, cls: 'from-emerald-400 to-cyan-400' },
            ].map(s => (
              <div key={s.label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">{s.label}</span><span className="text-foreground tabular-nums">{s.value}/100</span></div>
                <div className="mt-1 h-1.5 rounded-full bg-border overflow-hidden"><div className={`h-full bg-gradient-to-r ${s.cls}`} style={{ width: `${s.value}%` }} /></div>
              </div>
            ))}
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ===================== CREATOR PROFILE ===================== */

export function AuthorProfilePage() {
  const badges = [
    { name: 'Power Elite',     icon: Crown,       tone: 'amber'   as ChipTone, desc: 'Top 1% revenue' },
    { name: 'Verified',        icon: BadgeCheck,  tone: 'cyan'    as ChipTone, desc: 'ID + payout verified' },
    { name: 'Trending Author', icon: Flame,       tone: 'fuchsia' as ChipTone, desc: '7-day surge' },
    { name: 'Quality Pro',     icon: ShieldCheck, tone: 'emerald' as ChipTone, desc: 'AI score ≥ 95' },
    { name: '5★ Hero',         icon: Star,        tone: 'amber'   as ChipTone, desc: '500+ five-star reviews' },
    { name: 'Early Adopter',   icon: Zap,         tone: 'cyan'    as ChipTone, desc: 'Joined < 2024' },
  ];
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl border border-border">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.25),transparent_55%),radial-gradient(circle_at_80%_60%,rgba(217,70,239,0.25),transparent_55%)]" />
        <div className="relative p-6 md:p-8 flex items-end gap-5 flex-wrap">
          <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-cyan-500 to-fuchsia-500 grid place-items-center text-white text-3xl font-bold shadow-[0_0_32px_-8px_rgba(217,70,239,0.6)]">
            QS<span className="absolute -bottom-1 -right-1 h-6 w-6 grid place-items-center rounded-full bg-emerald-500 border-2 border-background"><BadgeCheck className="h-3.5 w-3.5 text-white" /></span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.25em] text-cyan-300/80">Creator profile</div>
            <h1 className="mt-1 text-3xl font-bold text-foreground flex items-center gap-2">Quantum Studio <Chip tone="amber"><Crown className="h-3 w-3" /> Power Elite</Chip></h1>
            <p className="text-sm text-muted-foreground max-w-xl">Building futuristic dashboards, AI ops tools and developer experiences for global teams.</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Chip tone="cyan"><Globe className="h-3 w-3" /> 142 countries</Chip>
              <Chip tone="emerald"><Users className="h-3 w-3" /> 18.4k followers</Chip>
              <Chip tone="fuchsia"><Package className="h-3 w-3" /> 42 products</Chip>
              <Chip tone="muted"><Heart className="h-3 w-3" /> Joined 2022</Chip>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <GradButton variant="outline" icon={MessageSquare}>Message</GradButton>
            <GradButton icon={Plus}>Follow</GradButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={TrendingUp} label="Reputation" value="9,842" sub="rank #14 globally" accent="cyan" trend={6} />
        <Kpi icon={Star} label="Avg rating" value="4.93" sub="3,841 reviews" accent="amber" trend={2} />
        <Kpi icon={ShieldCheck} label="AI quality" value="96/100" sub="all products" accent="emerald" trend={4} />
        <Kpi icon={Trophy} label="Achievements" value="24" sub="6 rare" accent="fuchsia" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Achievements & badges" icon={Award} className="lg:col-span-2">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {badges.map(b => (
              <div key={b.name} className="group relative overflow-hidden rounded-lg border border-border bg-background/40 p-3 hover:border-cyan-500/30 transition">
                <div className="relative flex items-start gap-3">
                  <div className={`h-10 w-10 grid place-items-center rounded-lg border ${b.tone === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : b.tone === 'fuchsia' ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300' : b.tone === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}>
                    <b.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{b.name}</div>
                    <div className="text-[11px] text-muted-foreground">{b.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Trust signals" icon={ShieldCheck}>
          <ul className="space-y-2 text-sm">
            {[
              { k: 'Identity verified', v: 'Yes', tone: 'emerald' as ChipTone },
              { k: 'Payout verified', v: 'Stripe · acct_8z', tone: 'emerald' as ChipTone },
              { k: 'Refund rate', v: '0.4%', tone: 'cyan' as ChipTone },
              { k: 'Response time', v: '< 2h', tone: 'cyan' as ChipTone },
              { k: 'Dispute ratio', v: '0.02%', tone: 'emerald' as ChipTone },
            ].map(r => (
              <li key={r.k} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <span className="text-muted-foreground text-xs">{r.k}</span>
                <Chip tone={r.tone}>{r.v}</Chip>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section title="Featured products" icon={Package} action={<Link to="/author/products" className="text-[11px] text-cyan-300 hover:underline">All products →</Link>}>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-background/40 overflow-hidden hover:border-cyan-500/30 transition">
              <div className="aspect-video bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-emerald-500/10 relative">
                <div className="absolute top-2 left-2"><Chip tone="emerald"><Sparkles className="h-3 w-3" /> AI optimized</Chip></div>
              </div>
              <div className="p-2.5">
                <div className="text-xs font-semibold text-foreground truncate">Quantum Product {i + 1}</div>
                <div className="text-[10px] text-muted-foreground">★ 4.9 · 1.2k sales</div>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ===================== NOTIFICATIONS CENTER ===================== */

export function AuthorNotificationsPage() {
  const [filter, setFilter] = useState<'all' | 'sales' | 'reviews' | 'payouts' | 'ai' | 'system'>('all');
  const all = [
    { t: 'sales',   icon: DollarSign, title: 'New sale · Quantum Dashboard Pro', meta: '$89 · USA', tone: 'emerald' as ChipTone, time: 'just now' },
    { t: 'reviews', icon: Star,       title: '5-star review by Maya L.',         meta: '"Game-changer for our team"', tone: 'amber' as ChipTone, time: '3m ago' },
    { t: 'ai',      icon: Sparkles,   title: 'AI insight: convert 12% more',     meta: 'Add 2 mobile screenshots', tone: 'fuchsia' as ChipTone, time: '12m ago' },
    { t: 'payouts', icon: Wallet,     title: 'Payout queued · $12,840',          meta: 'arrives Fri 09:00 UTC', tone: 'cyan' as ChipTone, time: '1h ago' },
    { t: 'system',  icon: ShieldCheck,title: 'Security scan passed',             meta: 'no issues found', tone: 'emerald' as ChipTone, time: '2h ago' },
    { t: 'reviews', icon: MessageSquare, title: 'New comment on changelog v1.4', meta: '"Can you support SSO?"', tone: 'cyan' as ChipTone, time: '4h ago' },
    { t: 'ai',      icon: TrendingUp, title: 'Ranking up · #14 global',          meta: '+3 spots this week', tone: 'fuchsia' as ChipTone, time: 'today' },
    { t: 'system',  icon: AlertTriangle, title: 'Webhook latency 612ms',         meta: 'auto-retry succeeded', tone: 'amber' as ChipTone, time: 'today' },
  ];
  const list = filter === 'all' ? all : all.filter(n => n.t === filter);
  return (
    <div className="space-y-6">
      <Eyebrow title="Notifications center" subtitle="Realtime activity from your portfolio — sales, reviews, payouts and AI insights." eyebrow="Inbox" />
      <div className="flex items-center gap-2 flex-wrap">
        {(['all','sales','reviews','payouts','ai','system'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`text-xs px-3 py-1.5 rounded-full border capitalize transition ${filter === f ? 'border-cyan-500/40 bg-gradient-to-r from-cyan-500/15 to-fuchsia-500/10 text-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}>{f}</button>
        ))}
        <div className="ml-auto"><GradButton variant="outline" icon={CheckCircle2}>Mark all read</GradButton></div>
      </div>
      <Section title="Activity stream" icon={Bell}>
        <ul className="divide-y divide-border">
          {list.map((n, i) => (
            <li key={i} className="flex items-start gap-3 py-3 first:pt-0 last:pb-0 group">
              <div className={`h-9 w-9 grid place-items-center rounded-lg border ${n.tone === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : n.tone === 'fuchsia' ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300' : n.tone === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}><n.icon className="h-4 w-4" /></div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">{n.title}</div>
                <div className="text-[11px] text-muted-foreground">{n.meta}</div>
              </div>
              <div className="text-[10px] text-muted-foreground shrink-0">{n.time}</div>
              <button className="opacity-0 group-hover:opacity-100 text-[10px] text-cyan-300 hover:underline">view</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ===================== KYC / VERIFICATION ===================== */

export function AuthorVerificationPage() {
  const steps = [
    { label: 'Email verified',     done: true,  active: false },
    { label: 'Phone verified',     done: true,  active: false },
    { label: 'Identity (ID)',      done: true,  active: false },
    { label: 'Selfie liveness',    done: false, active: true },
    { label: 'Tax form (W-8/W-9)', done: false, active: false },
    { label: 'Payout account',     done: false, active: false },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="Verification center" subtitle="Complete KYC to unlock global payouts, premium badge, and featured placement." eyebrow="Trust & safety" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={ShieldCheck} label="Trust level" value="Tier 2" sub="Verified author" accent="cyan" />
        <Kpi icon={BadgeCheck}  label="KYC progress" value="3/6" sub="50% complete" accent="fuchsia" />
        <Kpi icon={Building2}   label="Region" value="EU · DE" accent="emerald" />
        <Kpi icon={Wallet}      label="Payout cap" value="$10k/mo" sub="raises after KYC" accent="amber" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Verification steps" icon={IdCard} className="lg:col-span-2">
          <ol className="space-y-2">
            {steps.map((s, i) => (
              <li key={s.label} className={`flex items-center gap-3 rounded-md border p-3 ${s.done ? 'border-emerald-500/30 bg-emerald-500/5' : s.active ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-border bg-background/40'}`}>
                <div className={`h-7 w-7 grid place-items-center rounded-full text-[10px] font-semibold ${s.done ? 'bg-emerald-500/30 text-emerald-200' : s.active ? 'bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-white' : 'bg-background border border-border text-muted-foreground'}`}>{s.done ? <Check className="h-3 w-3" /> : i + 1}</div>
                <div className="flex-1 text-sm text-foreground">{s.label}</div>
                {s.done ? <Chip tone="emerald">Verified</Chip> : s.active ? <GradButton icon={Camera}>Start liveness</GradButton> : <Chip tone="muted">Pending</Chip>}
              </li>
            ))}
          </ol>
        </Section>
        <Section title="What you unlock" icon={Trophy}>
          <ul className="space-y-2 text-sm text-foreground">
            {['Verified badge on profile','Up to $250k/mo payouts','Featured in marketplace','Reduced platform fee (12% → 8%)','Priority support SLA'].map(x => (
              <li key={x} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-300" /> {x}</li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

/* ===================== TEAM COLLABORATION ===================== */

export function AuthorTeamPage() {
  const members = [
    { name: 'Alex Carter',  role: 'Owner',  status: 'online',  avatar: 'AC' },
    { name: 'Maya Singh',   role: 'Admin',  status: 'online',  avatar: 'MS' },
    { name: 'Liu Wei',      role: 'Editor', status: 'idle',    avatar: 'LW' },
    { name: 'Sofia Romano', role: 'Support',status: 'offline', avatar: 'SR' },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="Team collaboration" subtitle="Invite editors, admins and support agents — fine-grained roles and realtime presence." eyebrow="Workspace · Quantum Studio"
        action={<GradButton icon={Plus}>Invite member</GradButton>} />
      <Section title="Members" icon={Users}>
        <ul className="divide-y divide-border">
          {members.map(m => (
            <li key={m.name} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="relative h-9 w-9 grid place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-white text-xs font-semibold">{m.avatar}
                <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-background ${m.status === 'online' ? 'bg-emerald-400' : m.status === 'idle' ? 'bg-amber-400' : 'bg-muted-foreground'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground">{m.name}</div>
                <div className="text-[11px] text-muted-foreground capitalize">{m.status} · last active 2m ago</div>
              </div>
              <Chip tone="cyan">{m.role}</Chip>
              <GradButton variant="ghost">Manage</GradButton>
            </li>
          ))}
        </ul>
      </Section>
      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Pending invites" icon={Mail}>
          <ul className="space-y-2 text-sm">
            {[{ e: 'dev@studio.io', r: 'Editor', d: '2d ago' },{ e: 'qa@studio.io', r: 'Support', d: '5h ago' }].map(i => (
              <li key={i.e} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
                <span className="text-foreground truncate">{i.e}</span>
                <Chip>{i.r}</Chip>
                <span className="text-[10px] text-muted-foreground">{i.d}</span>
                <button className="text-[10px] text-cyan-300 hover:underline">Resend</button>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Role matrix" icon={ClipboardList}>
          <div className="text-xs">
            <div className="grid grid-cols-5 gap-2 text-[10px] uppercase tracking-wider text-muted-foreground pb-2 border-b border-border">
              <span>Capability</span><span>Owner</span><span>Admin</span><span>Editor</span><span>Support</span>
            </div>
            {[
              ['Publish products','✓','✓','✓','—'],
              ['Payouts','✓','—','—','—'],
              ['Refunds','✓','✓','—','✓'],
              ['Settings','✓','✓','—','—'],
              ['Reply support','✓','✓','✓','✓'],
            ].map(r => (
              <div key={r[0]} className="grid grid-cols-5 gap-2 py-1.5 border-b border-border/60 last:border-0 text-foreground">
                {r.map((c, i) => <span key={i} className={i === 0 ? '' : c === '✓' ? 'text-emerald-300' : 'text-muted-foreground'}>{c}</span>)}
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ===================== WORKSPACE / APPEARANCE ===================== */

export function AuthorWorkspacePage() {
  const [theme, setTheme] = useState<'midnight' | 'aurora' | 'neon' | 'paper'>('aurora');
  const [accent, setAccent] = useState<'cyan' | 'fuchsia' | 'emerald' | 'amber'>('cyan');
  const [density, setDensity] = useState<'comfortable' | 'compact'>('comfortable');
  const [lang, setLang] = useState('en');
  const themes = [
    { id: 'midnight' as const, name: 'Midnight', swatch: 'from-slate-900 to-slate-700' },
    { id: 'aurora'   as const, name: 'Aurora',   swatch: 'from-cyan-500 via-fuchsia-500 to-amber-500' },
    { id: 'neon'     as const, name: 'Neon',     swatch: 'from-emerald-400 to-cyan-500' },
    { id: 'paper'    as const, name: 'Paper',    swatch: 'from-stone-200 to-stone-400' },
  ];
  const accents = ['cyan','fuchsia','emerald','amber'] as const;
  return (
    <div className="space-y-6">
      <Eyebrow title="Workspace settings" subtitle="Make the studio yours — appearance, language, density and shortcuts." eyebrow="Workspace" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Section title="Appearance" icon={Palette} className="lg:col-span-2">
          <div>
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Theme</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {themes.map(t => (
                <button key={t.id} onClick={() => setTheme(t.id)} className={`group rounded-lg border p-2 text-left transition ${theme === t.id ? 'border-cyan-500/40 ring-2 ring-cyan-500/30' : 'border-border hover:border-cyan-500/30'}`}>
                  <div className={`aspect-video rounded-md bg-gradient-to-br ${t.swatch}`} />
                  <div className="mt-2 flex items-center justify-between"><span className="text-xs text-foreground">{t.name}</span>{theme === t.id && <Check className="h-3.5 w-3.5 text-cyan-300" />}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Accent</div>
            <div className="flex items-center gap-2">
              {accents.map(a => (
                <button key={a} onClick={() => setAccent(a)} title={a} className={`h-7 w-7 rounded-full border-2 ${accent === a ? 'border-foreground' : 'border-transparent'} ${a === 'cyan' ? 'bg-cyan-400' : a === 'fuchsia' ? 'bg-fuchsia-400' : a === 'emerald' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              ))}
            </div>
          </div>
          <div className="mt-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Density</div>
            <div className="inline-flex rounded-md border border-border overflow-hidden text-xs">
              {(['comfortable','compact'] as const).map(d => (
                <button key={d} onClick={() => setDensity(d)} className={`px-3 py-1.5 capitalize ${density === d ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>{d}</button>
              ))}
            </div>
          </div>
        </Section>
        <Section title="Language & locale" icon={Languages}>
          <Field label="Interface language">
            <select value={lang} onChange={e => setLang(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm">
              {['English','Español','Français','Deutsch','日本語','العربية','हिन्दी','简体中文','Português','Türkçe'].map((n, i) => <option key={n} value={['en','es','fr','de','ja','ar','hi','zh','pt','tr'][i]}>{n}</option>)}
            </select>
          </Field>
          <div className="mt-3"><Field label="Region"><select className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"><option>EU · Germany</option><option>US · East</option><option>APAC · Singapore</option></select></Field></div>
          <div className="mt-3"><Field label="Currency"><select className="w-full bg-background border border-border rounded-md px-3 py-1.5 text-sm"><option>USD</option><option>EUR</option><option>GBP</option><option>JPY</option></select></Field></div>
        </Section>
      </div>
      <Section title="Keyboard shortcuts" icon={KeySquare}>
        <div className="grid md:grid-cols-3 gap-2 text-xs">
          {[
            ['⌘ + K', 'Command palette'],
            ['G then D', 'Go to dashboard'],
            ['G then U', 'Open upload wizard'],
            ['N', 'New product'],
            ['?', 'Show all shortcuts'],
            ['⌘ + /', 'Toggle AI assistant'],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
              <span className="text-muted-foreground">{v}</span>
              <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-foreground bg-background">{k}</kbd>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

/* ===================== API KEYS ===================== */

export function AuthorApiKeysPage() {
  const keys = [
    { name: 'Production · Webhook', token: 'sk_live_8f••••••2c4a', scope: 'webhooks', created: '2025-03-14', last: '4m ago' },
    { name: 'CI · Release bot',     token: 'sk_live_2a••••••91bc', scope: 'releases', created: '2024-11-02', last: '2h ago' },
    { name: 'Analytics export',     token: 'sk_live_77••••••40e1', scope: 'read-only', created: '2024-08-21', last: '3d ago' },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="API keys" subtitle="Programmatic access to the Author API — rotate often, scope tight." eyebrow="Developer"
        action={<GradButton icon={Plus}>Generate key</GradButton>} />
      <Section title="Active keys" icon={KeySquare}>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase tracking-wider text-muted-foreground">
            <tr><th className="text-left py-2">Name</th><th className="text-left">Token</th><th className="text-left">Scope</th><th className="text-left">Created</th><th className="text-left">Last used</th><th /></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keys.map(k => (
              <tr key={k.token} className="hover:bg-accent/30">
                <td className="py-2 text-foreground">{k.name}</td>
                <td><code className="text-cyan-200 font-mono">{k.token}</code></td>
                <td><Chip tone={k.scope === 'read-only' ? 'muted' : 'cyan'}>{k.scope}</Chip></td>
                <td className="text-muted-foreground">{k.created}</td>
                <td className="text-muted-foreground">{k.last}</td>
                <td className="text-right"><button className="text-[10px] text-amber-300 hover:underline">Rotate</button> · <button className="text-[10px] text-red-300 hover:underline">Revoke</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
      <Section title="Webhook endpoints" icon={Server}>
        <ul className="space-y-2 text-sm">
          {[
            { url: 'https://hooks.studio.io/sales', events: 'sale.created · refund', status: 200 },
            { url: 'https://hooks.studio.io/reviews', events: 'review.created', status: 200 },
          ].map(w => (
            <li key={w.url} className="flex items-center justify-between rounded-md border border-border bg-background/40 px-3 py-2">
              <div className="min-w-0">
                <div className="text-foreground font-mono text-xs truncate">{w.url}</div>
                <div className="text-[10px] text-muted-foreground">{w.events}</div>
              </div>
              <Chip tone="emerald">{w.status} OK</Chip>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ===================== ACTIVITY TIMELINE ===================== */

export function AuthorActivityPage() {
  const items = [
    { t: 'Published Quantum Dashboard Pro v1.4.2', who: 'You', when: '4m ago', icon: Rocket, tone: 'cyan' as ChipTone },
    { t: 'AI optimization applied to 3 listings',  who: 'AI co-pilot', when: '22m ago', icon: Sparkles, tone: 'fuchsia' as ChipTone },
    { t: 'Approved review by Maya L. (5★)',        who: 'Auto-moderation', when: '1h ago', icon: Star, tone: 'amber' as ChipTone },
    { t: 'Payout request created · $12,840',       who: 'You', when: '3h ago', icon: Wallet, tone: 'emerald' as ChipTone },
    { t: 'New customer signup · Acme Corp',        who: 'System', when: 'today', icon: Users, tone: 'cyan' as ChipTone },
    { t: 'Webhook delivered to hooks.studio.io',   who: 'System', when: 'today', icon: Server, tone: 'emerald' as ChipTone },
    { t: 'Changelog drafted with AI assist',       who: 'AI co-pilot', when: 'yesterday', icon: GitBranch, tone: 'fuchsia' as ChipTone },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="Activity timeline" subtitle="Everything that happened across your studio — actor, action, target, time." eyebrow="Audit" />
      <Section title="Recent activity" icon={Activity}>
        <ol className="relative pl-5">
          <span className="absolute left-2 top-2 bottom-2 w-px bg-gradient-to-b from-cyan-500/40 via-border to-fuchsia-500/40" />
          {items.map((it, i) => (
            <li key={i} className="relative py-3 first:pt-0">
              <span className="absolute -left-[7px] top-4 h-3 w-3 rounded-full bg-background border-2 border-cyan-400" />
              <div className="flex items-start gap-3">
                <div className={`h-8 w-8 grid place-items-center rounded-md border ${it.tone === 'cyan' ? 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300' : it.tone === 'fuchsia' ? 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300' : it.tone === 'emerald' ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300' : 'border-amber-500/30 bg-amber-500/10 text-amber-300'}`}><it.icon className="h-3.5 w-3.5" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{it.t}</div>
                  <div className="text-[11px] text-muted-foreground">{it.who} · {it.when}</div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* ===================== MARKETPLACE RANKING ===================== */

export function AuthorRankingPage() {
  const top = [
    { rank: 1,  name: 'Nova Labs',      score: 12480, change: 0,  you: false },
    { rank: 2,  name: 'Pixel Forge',    score: 11240, change: 1,  you: false },
    { rank: 3,  name: 'Helios Studio',  score: 10820, change: -1, you: false },
    { rank: 4,  name: 'Atomic Bytes',   score: 10410, change: 2,  you: false },
    { rank: 14, name: 'Quantum Studio', score: 9842,  change: 3,  you: true },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="Marketplace ranking" subtitle="Where you stand vs every author on the platform — updated hourly." eyebrow="Leaderboard" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Trophy} label="Global rank" value="#14" sub="+3 this week" accent="amber" trend={21} />
        <Kpi icon={Crosshair} label="Category" value="#3 Analytics" accent="cyan" trend={1} />
        <Kpi icon={Radar} label="Momentum" value="9.2x" sub="vs 30d avg" accent="fuchsia" trend={42} />
        <Kpi icon={Flame} label="Trending" value="Top 1%" accent="emerald" />
      </div>
      <Section title="Global leaderboard" icon={Crown}>
        <ul className="divide-y divide-border">
          {top.map(r => (
            <li key={r.name} className={`flex items-center gap-3 py-3 first:pt-0 last:pb-0 ${r.you ? 'bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10 -mx-4 px-4 rounded' : ''}`}>
              <div className={`h-8 w-8 grid place-items-center rounded-md text-xs font-semibold ${r.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : r.rank <= 3 ? 'bg-cyan-500/10 text-cyan-300 border border-cyan-500/30' : 'bg-background border border-border text-muted-foreground'}`}>#{r.rank}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-foreground flex items-center gap-2">{r.name}{r.you && <Chip tone="cyan">You</Chip>}</div>
                <div className="text-[11px] text-muted-foreground tabular-nums">score {r.score.toLocaleString()}</div>
              </div>
              <div className={`text-[11px] ${r.change > 0 ? 'text-emerald-300' : r.change < 0 ? 'text-red-300' : 'text-muted-foreground'}`}>{r.change > 0 ? `▲ ${r.change}` : r.change < 0 ? `▼ ${Math.abs(r.change)}` : '—'}</div>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ===================== AFFILIATE / REFERRAL ===================== */

export function AuthorAffiliatePage() {
  return (
    <div className="space-y-6">
      <Eyebrow title="Affiliate & referral" subtitle="Earn 20% on every referral — partners earn from promoting your products." eyebrow="Growth" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi icon={Gift} label="Referral earnings" value="$3,240" sub="this month" accent="emerald" trend={18} />
        <Kpi icon={Users} label="Active partners" value="86" accent="cyan" trend={9} />
        <Kpi icon={Link2} label="Clicks" value="12,402" accent="fuchsia" />
        <Kpi icon={TrendingUp} label="Conversion" value="4.8%" accent="amber" trend={3} />
      </div>
      <Section title="Your referral link" icon={Link2}>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs font-mono text-cyan-200 bg-background border border-border rounded-md px-3 py-2 truncate">https://saashub.io/?ref=quantum-studio</code>
          <GradButton variant="outline">Copy</GradButton>
          <GradButton>Share</GradButton>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {[Github, Twitter, Mail].map((Ic, i) => <button key={i} className="h-8 w-8 grid place-items-center rounded-md border border-border bg-background/40 hover:border-cyan-500/30 text-muted-foreground hover:text-foreground"><Ic className="h-3.5 w-3.5" /></button>)}
        </div>
      </Section>
    </div>
  );
}

/* ===================== ACHIEVEMENTS ===================== */

export function AuthorAchievementsPage() {
  const tiers = [
    { name: 'Bronze',   pct: 100, color: 'from-amber-700 to-amber-500' },
    { name: 'Silver',   pct: 100, color: 'from-slate-400 to-slate-200' },
    { name: 'Gold',     pct: 70,  color: 'from-amber-400 to-yellow-300' },
    { name: 'Platinum', pct: 35,  color: 'from-cyan-300 to-fuchsia-300' },
    { name: 'Diamond',  pct: 12,  color: 'from-cyan-400 to-emerald-300' },
    { name: 'Elite',    pct: 4,   color: 'from-fuchsia-500 to-amber-400' },
  ];
  return (
    <div className="space-y-6">
      <Eyebrow title="Achievements" subtitle="Climb the ranks — unlock perks, badges and revenue share boosts." eyebrow="Gamification" />
      <Section title="Reputation tiers" icon={Trophy}>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {tiers.map(t => (
            <div key={t.name} className="rounded-lg border border-border bg-background/40 p-3">
              <div className="flex items-center justify-between"><span className="text-sm font-semibold text-foreground">{t.name}</span><Chip tone={t.pct === 100 ? 'emerald' : 'cyan'}>{t.pct}%</Chip></div>
              <div className="mt-2 h-2 rounded-full bg-border overflow-hidden"><div className={`h-full bg-gradient-to-r ${t.color}`} style={{ width: `${t.pct}%` }} /></div>
              <div className="mt-2 text-[10px] text-muted-foreground">{t.pct === 100 ? 'Unlocked' : `${100 - t.pct}% to unlock`}</div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
