import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Eye, Users, Globe, Radio, Sparkles, MessageSquare, Send, Smile, Paperclip,
  Search, Bot, Wand2, FileText, CheckCircle2, AlertTriangle, Languages,
  Play, ExternalLink, Monitor, Tablet, Smartphone, GitBranch, Tag, Clock,
  IdCard, Camera, ShieldCheck, Upload, BadgeCheck, Crown, Star, Trophy,
  TrendingUp, Activity, DollarSign, Repeat, Calendar, Plus, ArrowUpRight,
  Layers, Cpu, Zap, Heart, Filter, Image as ImageIcon,
} from 'lucide-react';
import { Kpi, Section } from './AuthorPages';

/* ---------- Local shell primitives ---------- */
function Hero({ eyebrow, title, subtitle, action }: {
  eyebrow: string; title: string; subtitle?: string; action?: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-card to-background p-5">
      <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl pointer-events-none" />
      <div className="relative flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />{eyebrow}
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

function Chip({ children, tone = 'cyan' }: { children: React.ReactNode; tone?: 'cyan'|'fuchsia'|'emerald'|'amber'|'muted'|'red' }) {
  const map = {
    cyan: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300',
    fuchsia: 'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300',
    emerald: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    amber: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    red: 'border-red-500/30 bg-red-500/10 text-red-300',
    muted: 'border-border bg-background/60 text-muted-foreground',
  } as const;
  return <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium ${map[tone]}`}>{children}</span>;
}

function useTicker(ms = 2400) {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT(x => x + 1), ms); return () => clearInterval(id); }, [ms]);
  return t;
}

/* ============================================================
   LIVE VISITORS
   ============================================================ */
export function AuthorLiveVisitorsPage() {
  const t = useTicker(1800);
  const visitors = 312 + (t * 7) % 41;
  const pages = [
    { path: '/product/hospital-erp',    live: 48 + (t*3)%9,  trend: +12 },
    { path: '/product/edge-analytics',  live: 31 + (t*2)%7,  trend: +6 },
    { path: '/product/ai-helpdesk',     live: 22 + (t)%5,    trend: -3 },
    { path: '/product/fleet-os',        live: 17 + (t*2)%4,  trend: +8 },
    { path: '/product/retail-pulse',    live: 11 + (t)%3,    trend: +2 },
  ];
  const countries = [
    ['United States', 38], ['India', 22], ['Germany', 11], ['Brazil', 9],
    ['United Kingdom', 7], ['Japan', 6], ['Other', 7],
  ] as const;
  const devices = [['Desktop', 62], ['Mobile', 31], ['Tablet', 7]] as const;
  const stream = useMemo(() => Array.from({ length: 24 }).map((_, i) => ({
    id: i, country: ['US','IN','DE','BR','JP','GB','FR','CA'][i % 8],
    page: ['/product/hospital-erp','/product/edge-analytics','/product/ai-helpdesk','/product/fleet-os'][i % 4],
    ago: `${(i % 60) + 1}s`,
  })), [t]);

  return (
    <div className="space-y-5">
      <Hero eyebrow="Realtime visitors" title="Live audience pulse"
        subtitle="See exactly who is exploring your catalog right now, by page, geography and device."
        action={<Chip tone="emerald"><Activity className="h-3 w-3 animate-pulse"/> {visitors} on site</Chip>} />

      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={Users} label="Live visitors" value={visitors} accent="emerald" sub="updated every 2s" />
        <Kpi icon={Eye} label="Page views / min" value={148} accent="cyan" trend={12} />
        <Kpi icon={Globe} label="Active countries" value={37} accent="fuchsia" />
        <Kpi icon={Zap} label="Avg session" value="3m 42s" accent="amber" trend={6} />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Section title="Top pages — live" icon={Eye} className="lg:col-span-2">
          <ul className="divide-y divide-border">
            {pages.map(p => (
              <li key={p.path} className="flex items-center gap-3 py-2 text-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-foreground truncate flex-1">{p.path}</span>
                <span className="tabular-nums text-cyan-300">{p.live}</span>
                <span className={`tabular-nums ${p.trend>=0?'text-emerald-300':'text-red-300'}`}>{p.trend>=0?'+':''}{p.trend}%</span>
                <div className="w-32 h-1.5 rounded-full bg-background/60 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" style={{width: `${Math.min(100, p.live*1.6)}%`}} />
                </div>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Live stream" icon={Radio}>
          <ul className="space-y-1.5 max-h-72 overflow-auto pr-1">
            {stream.map(s => (
              <li key={s.id} className="text-[11px] flex items-center gap-2 text-muted-foreground">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                <span className="font-mono text-foreground">{s.country}</span>
                <span className="truncate flex-1">→ {s.page}</span>
                <span>{s.ago}</span>
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Section title="Top countries" icon={Globe}>
          <ul className="space-y-2">
            {countries.map(([c, pct]) => (
              <li key={c} className="text-xs">
                <div className="flex justify-between mb-0.5"><span className="text-foreground">{c}</span><span className="text-muted-foreground tabular-nums">{pct}%</span></div>
                <div className="h-1.5 rounded-full bg-background/60 overflow-hidden"><div className="h-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" style={{width:`${pct as number*2}%`}}/></div>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Devices" icon={Smartphone}>
          <div className="flex items-center justify-around py-4">
            {devices.map(([d, pct]) => (
              <div key={d} className="text-center">
                <div className="relative h-20 w-20 mx-auto">
                  <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                    <circle cx="18" cy="18" r="15" className="stroke-border" strokeWidth="3" fill="none"/>
                    <circle cx="18" cy="18" r="15" className="stroke-cyan-400" strokeWidth="3" fill="none"
                      strokeDasharray={`${(pct as number)*0.94} 100`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 grid place-items-center text-sm font-semibold text-foreground tabular-nums">{pct}%</div>
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground">{d}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   CHAT CENTER
   ============================================================ */
type ChatMsg = { from: 'me'|'them'; text: string; time: string; reactions?: string[] };
const THREADS = [
  { id: 't1', name: 'Maya Sato',    company: 'Northwind Health', last: 'Can you share the SAML setup doc?', unread: 2, online: true,  flag: '🇯🇵' },
  { id: 't2', name: 'Ravi Mehta',   company: 'Atlas Logistics',  last: 'Renewing 14 seats today 🎉',         unread: 0, online: true,  flag: '🇮🇳' },
  { id: 't3', name: 'Lena Becker',  company: 'Lufthansa Cargo',  last: 'Webhook returning 502 intermittent', unread: 3, online: false, flag: '🇩🇪' },
  { id: 't4', name: 'Carlos Vidal', company: 'Mercado Pulse',    last: '¿Tienen versión en español?',         unread: 1, online: true,  flag: '🇪🇸' },
  { id: 't5', name: 'Aiko Tanaka',  company: 'Kyoto Edge',       last: 'Translated reply ready',              unread: 0, online: false, flag: '🇯🇵' },
];
const SEED: Record<string, ChatMsg[]> = {
  t1: [
    { from: 'them', text: 'Hi! Considering Hospital ERP for a 220-bed facility.', time: '09:42', reactions: ['👍'] },
    { from: 'me',   text: 'Welcome aboard, Maya — happy to walk through it.',     time: '09:43' },
    { from: 'them', text: 'Can you share the SAML setup doc?',                    time: '09:44' },
  ],
};

export function AuthorChatCenterPage() {
  const [active, setActive] = useState('t1');
  const [msgs, setMsgs] = useState<ChatMsg[]>(SEED.t1);
  const [draft, setDraft] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const t = useTicker(4000);

  useEffect(() => { setMsgs(SEED[active] ?? [{ from: 'them', text: 'Hey there 👋', time: 'now' }]); }, [active]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs.length]);
  useEffect(() => { setTyping(t % 3 === 0); }, [t]);

  const suggestions = [
    'Sure — sending the SAML guide now.',
    'Let’s hop on a 15-min call this week.',
    'I’ll loop in support for that 502.',
  ];

  const send = (text: string) => {
    if (!text.trim()) return;
    setMsgs(m => [...m, { from: 'me', text, time: 'now' }]);
    setDraft('');
  };

  return (
    <div className="space-y-5">
      <Hero eyebrow="Chat center" title="Conversations with your customers"
        subtitle="Discord-style realtime chat with AI replies and live translation."
        action={<Chip tone="emerald"><Activity className="h-3 w-3 animate-pulse"/> 5 open</Chip>} />

      <div className="grid gap-4 md:grid-cols-[280px_1fr_280px] min-h-[560px]">
        {/* Threads */}
        <div className="rounded-xl border border-border bg-card/60 overflow-hidden flex flex-col">
          <div className="px-3 py-2 border-b border-border flex items-center gap-2">
            <Search className="h-3.5 w-3.5 text-cyan-300" />
            <input placeholder="Search…" className="bg-transparent text-xs outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <ul className="overflow-auto divide-y divide-border">
            {THREADS.map(t => (
              <li key={t.id}>
                <button onClick={() => setActive(t.id)}
                  className={`w-full text-left px-3 py-2.5 flex items-start gap-2 transition ${active===t.id?'bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/5 border-l-2 border-cyan-400':'hover:bg-accent/30 border-l-2 border-transparent'}`}>
                  <span className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 grid place-items-center text-[11px] font-semibold text-white">
                    {t.name.split(' ').map(s=>s[0]).join('')}
                    <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background ${t.online?'bg-emerald-400':'bg-muted-foreground/50'}`}/>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1 text-xs text-foreground"><span className="truncate">{t.name}</span><span>{t.flag}</span></div>
                    <div className="text-[10px] text-muted-foreground truncate">{t.company}</div>
                    <div className="text-[11px] text-muted-foreground truncate mt-0.5">{t.last}</div>
                  </div>
                  {t.unread>0 && <span className="text-[9px] h-4 min-w-4 px-1 rounded-full bg-fuchsia-500 text-white grid place-items-center">{t.unread}</span>}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Conversation */}
        <div className="rounded-xl border border-border bg-card/60 overflow-hidden flex flex-col">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-7 w-7 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 grid place-items-center text-[10px] font-semibold text-white">MS</span>
              <div>
                <div className="text-xs text-foreground">Maya Sato <Chip tone="emerald">online</Chip></div>
                <div className="text-[10px] text-muted-foreground">Northwind Health · Hospital ERP</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Chip tone="cyan"><Languages className="h-3 w-3"/> auto-translate</Chip>
              <Chip tone="fuchsia"><Bot className="h-3 w-3"/> AI assist</Chip>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4 space-y-3 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.05),transparent_60%)]">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.from==='me'?'justify-end':'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-3 py-2 text-xs ${m.from==='me'
                  ? 'bg-gradient-to-br from-cyan-500/80 to-fuchsia-500/70 text-white rounded-br-sm'
                  : 'bg-background/70 border border-border text-foreground rounded-bl-sm'}`}>
                  <div>{m.text}</div>
                  <div className="mt-1 text-[9px] opacity-70 flex items-center gap-1">
                    {m.time}{m.reactions?.map((r,j)=><span key={j}>{r}</span>)}
                  </div>
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="flex gap-0.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:'0ms'}}/>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:'120ms'}}/>
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-bounce" style={{animationDelay:'240ms'}}/>
                </span>
                Maya is typing…
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="border-t border-border p-2">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {suggestions.map(s => (
                <button key={s} onClick={()=>send(s)} className="text-[10px] rounded-full border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-200 px-2 py-0.5 hover:bg-fuchsia-500/20 transition inline-flex items-center gap-1">
                  <Sparkles className="h-2.5 w-2.5"/>{s}
                </button>
              ))}
            </div>
            <form onSubmit={e => { e.preventDefault(); send(draft); }} className="flex items-center gap-1.5 rounded-lg border border-border bg-background/60 px-2 py-1.5">
              <button type="button" className="text-muted-foreground hover:text-foreground"><Paperclip className="h-4 w-4"/></button>
              <button type="button" className="text-muted-foreground hover:text-foreground"><Smile className="h-4 w-4"/></button>
              <input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a reply… (⌘+Enter to send)"
                className="flex-1 bg-transparent outline-none text-xs text-foreground placeholder:text-muted-foreground" />
              <button type="submit" className="rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-2.5 py-1 text-[11px] text-white inline-flex items-center gap-1">
                <Send className="h-3 w-3"/> Send
              </button>
            </form>
          </div>
        </div>

        {/* Context panel */}
        <div className="space-y-3">
          <Section title="Customer" icon={Users}>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Plan</span><Chip tone="cyan">Pro · annual</Chip></div>
              <div className="flex justify-between"><span className="text-muted-foreground">LTV</span><span className="text-foreground">$4,820</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Tickets</span><span className="text-foreground">12 · 4.8★</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Language</span><span className="text-foreground">日本語</span></div>
            </div>
          </Section>
          <Section title="AI summary" icon={Bot}>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Maya is evaluating SAML SSO for a 220-bed hospital. High intent — recommend sharing the IdP guide and offering a 15-min call.
            </p>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SUBSCRIPTIONS (author-side)
   ============================================================ */
export function AuthorSubscriptionsPage() {
  const rows = [
    { plan: 'Hospital ERP · Pro',   mrr: 12480, subs: 312, churn: 1.2, status: 'healthy' },
    { plan: 'Edge Analytics · Team',mrr:  8230, subs: 184, churn: 2.4, status: 'healthy' },
    { plan: 'AI Helpdesk · Starter',mrr:  3120, subs: 421, churn: 4.8, status: 'watch' },
    { plan: 'Fleet OS · Enterprise',mrr:  9810, subs:  21, churn: 0.0, status: 'healthy' },
  ];
  return (
    <div className="space-y-5">
      <Hero eyebrow="Subscriptions" title="Recurring revenue control room"
        subtitle="Monitor MRR, churn, plan health and lifecycle across every author plan."
        action={<Chip tone="emerald"><TrendingUp className="h-3 w-3"/> MRR +12.4%</Chip>} />
      <div className="grid gap-4 md:grid-cols-4">
        <Kpi icon={Repeat} label="MRR" value="$33.6k" accent="emerald" trend={12} />
        <Kpi icon={Users} label="Active subs" value="938" accent="cyan" trend={5} />
        <Kpi icon={DollarSign} label="ARPU" value="$35.80" accent="fuchsia" trend={3} />
        <Kpi icon={Activity} label="Churn (30d)" value="2.3%" accent="amber" trend={-0.4} />
      </div>
      <Section title="Plans" icon={Layers}>
        <table className="w-full text-xs">
          <thead className="text-[10px] uppercase text-muted-foreground tracking-wider">
            <tr className="border-b border-border"><th className="text-left py-2">Plan</th><th className="text-right">MRR</th><th className="text-right">Subs</th><th className="text-right">Churn</th><th className="text-right">Health</th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map(r => (
              <tr key={r.plan} className="hover:bg-accent/30">
                <td className="py-2 text-foreground">{r.plan}</td>
                <td className="text-right tabular-nums">${r.mrr.toLocaleString()}</td>
                <td className="text-right tabular-nums">{r.subs}</td>
                <td className="text-right tabular-nums">{r.churn}%</td>
                <td className="text-right"><Chip tone={r.status==='healthy'?'emerald':'amber'}>{r.status}</Chip></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>
    </div>
  );
}

/* ============================================================
   AI SEO OPTIMIZER
   ============================================================ */
export function AuthorAiSeoPage() {
  const [title, setTitle] = useState('Hospital ERP — Modular EMR & Billing Suite');
  const [desc, setDesc] = useState('Run patient records, OPD, IPD billing and pharmacy stock from one realtime hospital cloud.');
  const score = Math.min(100, 40 + Math.min(60, title.length) + Math.floor(desc.length / 4));
  const audits = [
    { ok: title.length <= 60,  label: `Title length ${title.length}/60` },
    { ok: desc.length >= 120 && desc.length <= 160, label: `Meta length ${desc.length}/120–160` },
    { ok: /erp|emr|hospital/i.test(title), label: 'Primary keyword in title' },
    { ok: /realtime|cloud|billing/i.test(desc), label: 'Secondary keywords in meta' },
    { ok: true, label: 'Open Graph image 1200×630 detected' },
  ];
  const suggestions = [
    'Add “2026” to title for freshness signal (+4 CTR).',
    'Mention “HIPAA” to win compliance queries.',
    'Add FAQ schema for /pricing — eligible for People Also Ask.',
  ];

  return (
    <div className="space-y-5">
      <Hero eyebrow="AI SEO" title="AI SEO Optimizer"
        subtitle="Real-time scoring with intent-aware keyword and schema recommendations."
        action={<Chip tone="fuchsia"><Sparkles className="h-3 w-3"/> GPT-grade rewriter</Chip>} />

      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Section title="Page metadata" icon={FileText}>
          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Title</span>
              <input value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 w-full rounded-md bg-background/60 border border-border px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-cyan-500/50"/>
            </label>
            <label className="block">
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Meta description</span>
              <textarea value={desc} onChange={e=>setDesc(e.target.value)} rows={3} className="mt-1 w-full rounded-md bg-background/60 border border-border px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-cyan-500/50"/>
            </label>
            <div className="rounded-lg border border-border bg-background/60 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Google preview</div>
              <div className="text-cyan-300 text-sm truncate">{title}</div>
              <div className="text-emerald-400/80 text-[11px]">https://saashub.io/product/hospital-erp</div>
              <div className="text-muted-foreground text-xs mt-0.5 line-clamp-2">{desc}</div>
            </div>
          </div>
        </Section>

        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 p-4 text-center">
            <div className="relative h-28 w-28 mx-auto">
              <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
                <circle cx="18" cy="18" r="15" className="stroke-border" strokeWidth="3" fill="none"/>
                <circle cx="18" cy="18" r="15" className="stroke-emerald-400" strokeWidth="3" fill="none"
                  strokeDasharray={`${score*0.94} 100`} strokeLinecap="round"/>
              </svg>
              <div className="absolute inset-0 grid place-items-center text-2xl font-bold text-foreground tabular-nums">{score}</div>
            </div>
            <div className="mt-2 text-[11px] text-emerald-300">SEO score</div>
          </div>
          <Section title="Audits" icon={CheckCircle2}>
            <ul className="space-y-1.5">
              {audits.map(a => (
                <li key={a.label} className="text-[11px] flex items-center gap-2">
                  {a.ok ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/> : <AlertTriangle className="h-3.5 w-3.5 text-amber-400"/>}
                  <span className={a.ok?'text-foreground':'text-muted-foreground'}>{a.label}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      </div>

      <Section title="AI suggestions" icon={Wand2}>
        <ul className="space-y-2">
          {suggestions.map(s => (
            <li key={s} className="flex items-start gap-2 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-fuchsia-300 mt-0.5"/>
              <span className="text-foreground flex-1">{s}</span>
              <button className="text-[10px] rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-2 py-0.5 hover:bg-cyan-500/20">Apply</button>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}

/* ============================================================
   AI CONTENT ASSISTANT
   ============================================================ */
export function AuthorAiAssistantPage() {
  const [prompt, setPrompt] = useState('Write a launch announcement for Hospital ERP v1.5');
  const presets = [
    { icon: FileText, label: 'Product description' },
    { icon: Tag,      label: 'Tagline generator' },
    { icon: Search,   label: 'Keyword research' },
    { icon: Languages,label: 'Translate copy' },
    { icon: Bot,      label: 'Changelog draft' },
    { icon: Wand2,    label: 'Rewrite for tone' },
  ];
  const output = `🚀 Introducing Hospital ERP v1.5

Realtime patient flow, AI triage suggestions and HIPAA-grade audit trails — now in one upgraded suite.

• Smart OPD queue rebalancer
• AI billing anomaly detection
• Native FHIR R5 export
• 3x faster pharmacy reconciliation

Available today for Pro and Enterprise plans.`;
  return (
    <div className="space-y-5">
      <Hero eyebrow="AI Studio" title="AI Content Assistant"
        subtitle="Generate launch copy, taglines, changelogs and translations in your brand voice."
        action={<Chip tone="fuchsia"><Bot className="h-3 w-3"/> GPT-5 Turbo</Chip>} />

      <div className="grid gap-4 md:grid-cols-[260px_1fr]">
        <Section title="Presets" icon={Layers}>
          <ul className="space-y-1">
            {presets.map(p => (
              <li key={p.label}>
                <button className="w-full text-left text-xs px-2 py-1.5 rounded-md hover:bg-accent/40 flex items-center gap-2 text-foreground">
                  <p.icon className="h-3.5 w-3.5 text-cyan-300"/>{p.label}
                </button>
              </li>
            ))}
          </ul>
        </Section>
        <div className="space-y-3">
          <div className="rounded-xl border border-border bg-card/60 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Prompt</div>
            <textarea value={prompt} onChange={e=>setPrompt(e.target.value)} rows={3}
              className="w-full rounded-md bg-background/60 border border-border px-2.5 py-1.5 text-sm text-foreground outline-none focus:border-fuchsia-500/50"/>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <Chip tone="cyan">Tone: Confident</Chip><Chip tone="emerald">Length: Medium</Chip><Chip tone="muted">EN-US</Chip>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs text-white">
                <Sparkles className="h-3.5 w-3.5"/>Generate
              </button>
            </div>
          </div>
          <Section title="Output" icon={FileText} action={<Chip tone="emerald">streaming</Chip>}>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed text-foreground font-sans">{output}</pre>
            <div className="mt-3 flex items-center gap-2">
              <button className="text-[11px] rounded-md border border-border px-2 py-1 hover:bg-accent">Copy</button>
              <button className="text-[11px] rounded-md border border-border px-2 py-1 hover:bg-accent">Regenerate</button>
              <button className="text-[11px] rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 px-2 py-1">Save to product</button>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   DEMO MANAGEMENT
   ============================================================ */
export function AuthorDemosPage() {
  const demos = [
    { name: 'Hospital ERP — Admin demo', url: 'https://demo.saashub.io/hospital-erp', status: 'live', uptime: 99.98, hits: 1248 },
    { name: 'Hospital ERP — Doctor view', url: 'https://demo.saashub.io/hospital-erp/doctor', status: 'live', uptime: 99.99, hits: 832 },
    { name: 'Edge Analytics — Sandbox',  url: 'https://demo.saashub.io/edge-analytics', status: 'degraded', uptime: 97.20, hits: 410 },
    { name: 'AI Helpdesk — Bot preview', url: 'https://demo.saashub.io/helpdesk',       status: 'live', uptime: 99.94, hits: 612 },
  ];
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop');
  const size = device==='desktop' ? 'aspect-[16/9]' : device==='tablet' ? 'aspect-[4/5] max-w-sm' : 'aspect-[9/16] max-w-[260px]';
  return (
    <div className="space-y-5">
      <Hero eyebrow="Demo management" title="Live demos & sandboxes"
        subtitle="Manage previewable demos with health, traffic and credential gates."
        action={<button className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs text-white"><Plus className="h-3.5 w-3.5"/>New demo</button>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <Section title="Active demos" icon={Globe}>
          <ul className="divide-y divide-border">
            {demos.map(d => (
              <li key={d.url} className="py-2.5 flex items-center gap-3 text-xs">
                <span className={`h-2 w-2 rounded-full ${d.status==='live'?'bg-emerald-400 animate-pulse':'bg-amber-400'}`}/>
                <div className="min-w-0 flex-1">
                  <div className="text-foreground truncate">{d.name}</div>
                  <a href={d.url} target="_blank" rel="noreferrer" className="text-[10px] text-cyan-300 inline-flex items-center gap-1 hover:underline">
                    {d.url}<ExternalLink className="h-2.5 w-2.5"/>
                  </a>
                </div>
                <Chip tone={d.status==='live'?'emerald':'amber'}>{d.status}</Chip>
                <span className="tabular-nums text-muted-foreground w-14 text-right">{d.uptime}%</span>
                <span className="tabular-nums text-foreground w-16 text-right">{d.hits} hits</span>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Live preview" icon={Play} action={
          <div className="flex items-center gap-1">
            {[['desktop',Monitor],['tablet',Tablet],['mobile',Smartphone]].map(([k, Icon]: any) => (
              <button key={k} onClick={()=>setDevice(k)} className={`h-6 w-6 grid place-items-center rounded ${device===k?'bg-cyan-500/20 text-cyan-300':'text-muted-foreground hover:text-foreground'}`}>
                <Icon className="h-3.5 w-3.5"/>
              </button>
            ))}
          </div>
        }>
          <div className="grid place-items-center">
            <div className={`w-full ${size} rounded-lg border border-border bg-gradient-to-br from-cyan-500/5 via-background to-fuchsia-500/5 grid place-items-center`}>
              <div className="text-center">
                <Play className="h-8 w-8 mx-auto text-cyan-300"/>
                <div className="mt-2 text-xs text-foreground">Hospital ERP — Admin demo</div>
                <div className="text-[10px] text-muted-foreground">click to launch sandbox</div>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   CHANGELOG
   ============================================================ */
export function AuthorChangelogPage() {
  const entries = [
    { v: '1.5.0', date: '2026-05-18', tag: 'Major', notes: ['Realtime triage AI', 'Native FHIR R5 export', '3× faster pharmacy reconciliation'] },
    { v: '1.4.2', date: '2026-05-02', tag: 'Patch', notes: ['Fixes SAML signature edge case', 'Improves OPD search latency'] },
    { v: '1.4.0', date: '2026-04-14', tag: 'Minor', notes: ['Pharmacy stock dashboard', 'Bulk discharge workflow'] },
    { v: '1.3.8', date: '2026-03-30', tag: 'Patch', notes: ['Locale: 日本語 added', 'Reduce p95 by 18%'] },
  ];
  return (
    <div className="space-y-5">
      <Hero eyebrow="Changelog" title="Release notes timeline"
        subtitle="Publishable, AI-summarized changelogs with semantic version tags."
        action={<button className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs text-white"><Plus className="h-3.5 w-3.5"/>New entry</button>} />
      <Section title="History" icon={GitBranch}>
        <ol className="relative border-l border-border ml-3 space-y-5">
          {entries.map((e, i) => (
            <li key={e.v} className="ml-4">
              <span className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-400 ring-4 ring-background" />
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-foreground tabular-nums">v{e.v}</span>
                <Chip tone={e.tag==='Major'?'fuchsia':e.tag==='Minor'?'cyan':'emerald'}>{e.tag}</Chip>
                <span className="text-[10px] text-muted-foreground inline-flex items-center gap-1"><Clock className="h-3 w-3"/>{e.date}</span>
                {i===0 && <Chip tone="amber">latest</Chip>}
              </div>
              <ul className="mt-1.5 space-y-1 text-xs text-muted-foreground">
                {e.notes.map(n => <li key={n} className="flex gap-2"><span className="text-cyan-300">›</span>{n}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </Section>
    </div>
  );
}

/* ============================================================
   KYC
   ============================================================ */
export function AuthorKycPage() {
  const steps = [
    { icon: IdCard, label: 'Government ID', status: 'done' },
    { icon: Camera, label: 'Selfie liveness check', status: 'done' },
    { icon: FileText, label: 'Proof of address', status: 'review' },
    { icon: ShieldCheck, label: 'Tax & business info', status: 'todo' },
    { icon: BadgeCheck, label: 'Bank verification (micro-deposit)', status: 'todo' },
  ] as const;
  const tone = (s: string) => s==='done'?'emerald':s==='review'?'amber':'muted';
  const progress = Math.round((steps.filter(s=>s.status==='done').length/steps.length)*100);
  return (
    <div className="space-y-5">
      <Hero eyebrow="Verification" title="KYC & business compliance"
        subtitle="Complete KYC to unlock instant payouts, enterprise contracts and global tax handling."
        action={<Chip tone="amber">{progress}% complete</Chip>} />
      <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
        <Section title="Verification steps" icon={ShieldCheck}>
          <ul className="space-y-3">
            {steps.map(s => (
              <li key={s.label} className="flex items-center gap-3 rounded-lg border border-border bg-background/40 p-3">
                <span className="h-9 w-9 grid place-items-center rounded-md border border-cyan-500/20 bg-cyan-500/10 text-cyan-300"><s.icon className="h-4 w-4"/></span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-foreground">{s.label}</div>
                  <div className="text-[10px] text-muted-foreground">Encrypted · processed in 24h</div>
                </div>
                <Chip tone={tone(s.status)}>{s.status}</Chip>
                <button className="text-[11px] rounded-md border border-border px-2 py-1 hover:bg-accent inline-flex items-center gap-1">
                  <Upload className="h-3 w-3"/>{s.status==='done'?'Replace':'Upload'}
                </button>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Benefits unlocked" icon={Sparkles}>
          <ul className="space-y-2 text-xs">
            {['Instant payouts (< 4h)','Enterprise procurement','Tax automation (EU/US/IN)','Trust & safety badge','Featured eligibility'].map(b => (
              <li key={b} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-400"/><span className="text-foreground">{b}</span></li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}

/* ============================================================
   REPUTATION
   ============================================================ */
export function AuthorReputationPage() {
  const score = 942;
  const factors = [
    { label: 'Product quality',  v: 96, tone: 'emerald' as const },
    { label: 'Support speed',    v: 89, tone: 'cyan' as const },
    { label: 'Customer reviews', v: 93, tone: 'fuchsia' as const },
    { label: 'Security & trust', v: 99, tone: 'emerald' as const },
    { label: 'Update cadence',   v: 84, tone: 'amber' as const },
  ];
  return (
    <div className="space-y-5">
      <Hero eyebrow="Reputation" title="Creator reputation score"
        subtitle="Composite score from quality, support, reviews, security and consistency."
        action={<Chip tone="emerald"><Trophy className="h-3 w-3"/> Top 1% globally</Chip>} />
      <div className="grid gap-4 md:grid-cols-[320px_1fr]">
        <div className="rounded-xl border border-border bg-card/60 p-6 text-center">
          <div className="relative h-40 w-40 mx-auto">
            <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
              <defs>
                <linearGradient id="rep" x1="0" x2="1">
                  <stop offset="0%" stopColor="hsl(190 100% 50%)"/>
                  <stop offset="100%" stopColor="hsl(290 100% 60%)"/>
                </linearGradient>
              </defs>
              <circle cx="18" cy="18" r="15" className="stroke-border" strokeWidth="2.5" fill="none"/>
              <circle cx="18" cy="18" r="15" stroke="url(#rep)" strokeWidth="2.5" fill="none"
                strokeDasharray={`${(score/1000)*94} 100`} strokeLinecap="round"/>
            </svg>
            <div className="absolute inset-0 grid place-items-center flex-col">
              <div className="text-4xl font-bold text-foreground tabular-nums">{score}</div>
              <div className="text-[10px] text-muted-foreground">/ 1000</div>
            </div>
          </div>
          <div className="mt-3 inline-flex items-center gap-1 text-[11px] text-fuchsia-300">
            <Crown className="h-3.5 w-3.5"/> Elite Author
          </div>
        </div>
        <Section title="Score breakdown" icon={Activity}>
          <ul className="space-y-3">
            {factors.map(f => (
              <li key={f.label} className="text-xs">
                <div className="flex justify-between mb-1"><span className="text-foreground">{f.label}</span><span className="tabular-nums text-muted-foreground">{f.v}</span></div>
                <div className="h-2 rounded-full bg-background/60 overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${f.tone==='emerald'?'from-emerald-400 to-cyan-400':f.tone==='cyan'?'from-cyan-400 to-fuchsia-400':f.tone==='fuchsia'?'from-fuchsia-400 to-cyan-400':'from-amber-400 to-fuchsia-400'}`} style={{width:`${f.v}%`}}/>
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
   LIVE PULSE DOCK — global floating cinematic widget
   ============================================================ */
export function LivePulseDock() {
  const [open, setOpen] = useState(true);
  const t = useTicker(2200);
  const items = useMemo(() => {
    const samples = [
      { type: 'sale',   icon: DollarSign, tone: 'emerald' as const, text: 'Hospital ERP · Pro',     meta: '+$129' },
      { type: 'review', icon: Star,       tone: 'amber' as const,   text: '5★ from Aiko T.',         meta: 'AI Helpdesk' },
      { type: 'visit',  icon: Eye,        tone: 'cyan' as const,    text: 'New visitor · Berlin',    meta: 'Edge Analytics' },
      { type: 'fan',    icon: Heart,      tone: 'fuchsia' as const, text: '+1 follower',             meta: '@maya' },
      { type: 'pay',    icon: ArrowUpRight,tone: 'emerald' as const,text: 'Payout settled',          meta: '$12,840' },
    ];
    return Array.from({ length: 5 }).map((_, i) => samples[(t + i) % samples.length]);
  }, [t]);

  if (!open) {
    return (
      <button onClick={()=>setOpen(true)}
        className="fixed bottom-4 right-4 z-40 h-10 w-10 grid place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_24px_-4px_rgba(34,211,238,0.7)]">
        <Radio className="h-4 w-4 animate-pulse"/>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-40 w-72 rounded-xl border border-cyan-500/20 bg-card/80 backdrop-blur-2xl shadow-[0_8px_40px_-8px_rgba(34,211,238,0.35)] overflow-hidden hidden md:block">
      <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-gradient-to-r from-cyan-500/10 to-fuchsia-500/10">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"/>
          Live pulse
        </div>
        <button onClick={()=>setOpen(false)} className="text-[10px] text-muted-foreground hover:text-foreground">hide</button>
      </div>
      <ul className="divide-y divide-border max-h-72 overflow-hidden">
        {items.map((it, i) => (
          <li key={i} className="px-3 py-2 flex items-center gap-2 animate-fade-in">
            <span className={`h-7 w-7 grid place-items-center rounded-md border ${
              it.tone==='emerald'?'border-emerald-500/30 bg-emerald-500/10 text-emerald-300':
              it.tone==='amber'?'border-amber-500/30 bg-amber-500/10 text-amber-300':
              it.tone==='cyan'?'border-cyan-500/30 bg-cyan-500/10 text-cyan-300':
              'border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300'}`}>
              <it.icon className="h-3.5 w-3.5"/>
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-foreground truncate">{it.text}</div>
              <div className="text-[10px] text-muted-foreground">{it.meta}</div>
            </div>
            <span className="text-[10px] text-muted-foreground">now</span>
          </li>
        ))}
      </ul>
      <div className="px-3 py-1.5 text-[10px] text-muted-foreground border-t border-border flex items-center justify-between">
        <span className="inline-flex items-center gap-1"><Cpu className="h-3 w-3 text-fuchsia-300"/> AI curated</span>
        <span className="inline-flex items-center gap-1"><Filter className="h-3 w-3"/> all events</span>
      </div>
    </div>
  );
}