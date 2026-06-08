import { useState, useSyncExternalStore } from 'react';
import { Gift, Medal, Trophy, Target, Bell, ScrollText, Sparkles, Crown, Flame, Plus, Trash2, Check, X, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ams, gamification, subscribeAMS } from '@/lib/gamificationStore';
import { toast } from '@/hooks/use-toast';

const useAMS = () => useSyncExternalStore((cb) => subscribeAMS(cb), () => gamification.getAll());

const PageShell = ({ title, subtitle, icon: Icon, children, action }: any) => (
  <div className="space-y-6">
    <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
      <div className="flex items-center gap-4">
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-primary/20 ring-1 ring-primary/40">
          <Icon className="h-7 w-7 text-primary" />
        </div>
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {action}
    </div>
    {children}
  </div>
);

const RARITY_COLOR: Record<string, string> = {
  common: 'bg-slate-500/15 text-slate-300',
  rare: 'bg-blue-500/15 text-blue-400',
  epic: 'bg-purple-500/15 text-purple-400',
  legendary: 'bg-yellow-500/15 text-yellow-500',
};

const TIER_COLOR: Record<string, string> = {
  bronze:   'from-amber-700 to-amber-500',
  silver:   'from-slate-400 to-slate-200',
  gold:     'from-yellow-500 to-amber-300',
  platinum: 'from-cyan-400 to-blue-300',
};

/* ============ BADGES ============ */
export const AMSBadgesPage = () => {
  const db = useAMS();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', title: '', description: '', rarity: 'common' as any, icon: 'Medal' });

  const submit = () => {
    if (!form.code || !form.title) return toast({ title: 'Code and title required', variant: 'destructive' });
    ams.createBadge(form);
    toast({ title: 'Badge created' });
    setOpen(false);
    setForm({ code: '', title: '', description: '', rarity: 'common', icon: 'Medal' });
  };

  return (
    <PageShell title="Badge Engine" subtitle="Visual collectibles awarded for skill and consistency." icon={Medal}
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Badge</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Badge</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="CODE" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              <Select value={form.rarity} onValueChange={(v: any) => setForm(f => ({...f, rarity: v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['common','rare','epic','legendary'].map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter><Button onClick={submit}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {db.badges.map(b => {
          const earned = db.userBadges.filter(u => u.badgeId === b.id).length;
          return (
            <Card key={b.id} className="overflow-hidden">
              <div className={`h-1 ${b.rarity === 'legendary' ? 'bg-yellow-500' : b.rarity === 'epic' ? 'bg-purple-500' : b.rarity === 'rare' ? 'bg-blue-500' : 'bg-slate-500'}`} />
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <Badge className={RARITY_COLOR[b.rarity]}>{b.rarity}</Badge>
                </div>
                <h3 className="mt-3 font-display text-lg font-bold">{b.title}</h3>
                <p className="text-xs font-mono text-muted-foreground">{b.code}</p>
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.description}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{earned} holders</span>
                  <Button size="sm" variant="ghost" onClick={() => { ams.deleteBadge(b.id); toast({ title: 'Deleted' }); }}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageShell>
  );
};

/* ============ TROPHIES ============ */
export const AMSTrophiesPage = () => {
  const db = useAMS();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', title: '', description: '', tier: 'bronze' as any });

  return (
    <PageShell title="Trophy Engine" subtitle="Tiered showcase trophies that earn permanent display in the hall of fame." icon={Trophy}
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Trophy</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Trophy</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="CODE" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              <Select value={form.tier} onValueChange={(v: any) => setForm(f => ({...f, tier: v}))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{['bronze','silver','gold','platinum'].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <DialogFooter><Button onClick={() => { if(!form.code||!form.title) return toast({title:'Required',variant:'destructive'}); ams.createTrophy(form); toast({title:'Trophy created'}); setOpen(false); setForm({code:'',title:'',description:'',tier:'bronze'}); }}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {db.trophies.map(t => (
          <Card key={t.id} className="relative overflow-hidden">
            <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${TIER_COLOR[t.tier]}`} />
            <CardContent className="p-5 text-center">
              <div className={`mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br ${TIER_COLOR[t.tier]}`}>
                <Trophy className="h-10 w-10 text-background" />
              </div>
              <h3 className="mt-3 font-display text-lg font-bold capitalize">{t.title}</h3>
              <p className="text-xs font-mono text-muted-foreground">{t.code}</p>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{t.description}</p>
              <Button size="sm" variant="ghost" className="mt-2" onClick={() => { ams.deleteTrophy(t.id); toast({ title: 'Deleted' }); }}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
};

/* ============ REWARDS ============ */
export const AMSRewardsPage = () => {
  const db = useAMS();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code:'', title:'', description:'', type:'voucher' as any, costXP: 1000, value: 0, stock: 100, active: true });

  return (
    <PageShell title="Reward Catalog" subtitle="Catalog of redeemable rewards funded by XP." icon={Gift}
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Reward</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Reward</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="CODE" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              <div className="grid grid-cols-2 gap-2">
                <Select value={form.type} onValueChange={(v:any) => setForm(f => ({...f, type: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['voucher','cash','merch','subscription','points'].map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" placeholder="Cost XP" value={form.costXP} onChange={e => setForm(f => ({...f, costXP: +e.target.value || 0}))} />
                <Input type="number" placeholder="Value" value={form.value} onChange={e => setForm(f => ({...f, value: +e.target.value || 0}))} />
                <Input type="number" placeholder="Stock (-1 unlimited)" value={form.stock} onChange={e => setForm(f => ({...f, stock: +e.target.value || 0}))} />
              </div>
            </div>
            <DialogFooter><Button onClick={() => { if(!form.code||!form.title) return toast({title:'Required',variant:'destructive'}); ams.createReward(form); toast({title:'Reward created'}); setOpen(false); setForm({code:'',title:'',description:'',type:'voucher',costXP:1000,value:0,stock:100,active:true}); }}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>Code</TableHead><TableHead>Title</TableHead><TableHead>Type</TableHead><TableHead className="text-right">Cost</TableHead><TableHead className="text-right">Stock</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
          <TableBody>
            {db.rewards.map(r => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-xs">{r.code}</TableCell>
                <TableCell className="font-medium">{r.title}</TableCell>
                <TableCell><Badge variant="outline" className="capitalize">{r.type}</Badge></TableCell>
                <TableCell className="text-right font-bold text-primary">{r.costXP.toLocaleString()} XP</TableCell>
                <TableCell className="text-right">{r.stock === -1 ? '∞' : r.stock}</TableCell>
                <TableCell><Badge className={r.active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted'}>{r.active ? 'Active' : 'Paused'}</Badge></TableCell>
                <TableCell className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => ams.updateReward(r.id, { active: !r.active })}>{r.active ? 'Pause' : 'Activate'}</Button>
                  <Button size="sm" variant="ghost" onClick={() => { ams.deleteReward(r.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </PageShell>
  );
};

/* ============ CLAIMS ============ */
export const AMSClaimsPage = () => {
  const db = useAMS();
  const [tab, setTab] = useState<'pending' | 'all'>('pending');
  const list = tab === 'pending' ? db.claims.filter(c => c.status === 'pending') : db.claims;

  return (
    <PageShell title="Claim Center" subtitle="Approve, reject and fulfil reward redemption requests." icon={Package}
      action={<div className="flex gap-1 rounded-lg bg-muted p-1">
        {(['pending','all'] as const).map(t => (
          <Button key={t} size="sm" variant={tab===t?'default':'ghost'} onClick={() => setTab(t)} className="capitalize">{t}</Button>
        ))}
      </div>}>
      <Card><CardContent className="p-0">
        {list.length === 0 ? (
          <div className="p-10 text-center text-muted-foreground">No claims in this view.</div>
        ) : (
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Reward</TableHead><TableHead>When</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
            <TableBody>
              {list.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.userName}</TableCell>
                  <TableCell>{c.rewardTitle}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={
                      c.status === 'fulfilled' ? 'bg-emerald-500/15 text-emerald-500' :
                      c.status === 'approved'  ? 'bg-blue-500/15 text-blue-400' :
                      c.status === 'rejected'  ? 'bg-destructive/15 text-destructive' :
                                                 'bg-yellow-500/15 text-yellow-500'
                    }>{c.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {c.status === 'pending' && (
                      <div className="inline-flex gap-1">
                        <Button size="sm" onClick={() => { ams.decideClaim(c.id, 'approved'); toast({ title: 'Approved' }); }}><Check className="h-4 w-4" /></Button>
                        <Button size="sm" variant="destructive" onClick={() => { ams.decideClaim(c.id, 'rejected'); toast({ title: 'Rejected' }); }}><X className="h-4 w-4" /></Button>
                      </div>
                    )}
                    {c.status === 'approved' && (
                      <Button size="sm" variant="outline" onClick={() => { ams.decideClaim(c.id, 'fulfilled'); toast({ title: 'Fulfilled' }); }}>Mark fulfilled</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </PageShell>
  );
};

/* ============ MILESTONES ============ */
export const AMSMilestonesPage = () => {
  const db = useAMS();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code:'', title:'', description:'', target: 1000, metric:'xp' as any, xpReward: 500, active: true });

  return (
    <PageShell title="Milestone Engine" subtitle="Long-horizon goals that unlock bonus XP and rewards." icon={Target}
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />New Milestone</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Milestone</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="CODE" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              <div className="grid grid-cols-3 gap-2">
                <Select value={form.metric} onValueChange={(v:any) => setForm(f => ({...f, metric: v}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{['xp','streak','achievements','revenue'].map(m => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" placeholder="Target" value={form.target} onChange={e => setForm(f => ({...f, target: +e.target.value || 0}))} />
                <Input type="number" placeholder="XP Reward" value={form.xpReward} onChange={e => setForm(f => ({...f, xpReward: +e.target.value || 0}))} />
              </div>
            </div>
            <DialogFooter><Button onClick={() => { if(!form.code||!form.title) return toast({title:'Required',variant:'destructive'}); ams.createMilestone(form); toast({title:'Milestone created'}); setOpen(false); setForm({code:'',title:'',description:'',target:1000,metric:'xp',xpReward:500,active:true}); }}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {db.milestones.map(m => (
          <Card key={m.id}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 ring-1 ring-primary/30">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <Badge variant="outline" className="capitalize">{m.metric}</Badge>
              </div>
              <h3 className="mt-3 font-display text-lg font-bold">{m.title}</h3>
              <p className="text-xs font-mono text-muted-foreground">{m.code}</p>
              <p className="mt-2 text-sm text-muted-foreground">{m.description}</p>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span>Target: <strong>{m.target.toLocaleString()}</strong></span>
                <span className="text-primary font-bold">+{m.xpReward} XP</span>
              </div>
              <Button size="sm" variant="ghost" className="mt-2 w-full" onClick={() => { ams.deleteMilestone(m.id); toast({title:'Deleted'}); }}>
                <Trash2 className="h-4 w-4 text-destructive mr-2" /> Delete
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
};

/* ============ NOTIFICATIONS ============ */
export const AMSNotificationsPage = () => {
  const db = useAMS();
  return (
    <PageShell title="Notification Stream" subtitle="Live feed of gamification events broadcast to users." icon={Bell}>
      <Card>
        <CardHeader><CardTitle>{db.notifications.length} notifications · {db.notifications.filter(n=>!n.read).length} unread</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {db.notifications.length === 0 && <p className="text-sm text-muted-foreground py-6 text-center">No notifications yet — they appear as users earn XP, badges and trophies.</p>}
          {db.notifications.map(n => (
            <div key={n.id} className={`flex items-start justify-between gap-3 rounded-lg border p-3 ${n.read ? 'border-border bg-card/30' : 'border-primary/30 bg-primary/5'}`}>
              <div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">{n.type}</Badge>
                  <p className="text-sm font-semibold">{n.title}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{n.body}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()} · for {n.userId}</p>
              </div>
              {!n.read && <Button size="sm" variant="ghost" onClick={() => ams.markRead(n.id)}>Mark read</Button>}
            </div>
          ))}
        </CardContent>
      </Card>
    </PageShell>
  );
};

/* ============ AUDIT LOGS ============ */
export const AMSAuditPage = () => {
  const db = useAMS();
  return (
    <PageShell title="Audit Logs" subtitle="Append-only ledger of every administrative AMS action." icon={ScrollText}>
      <Card><CardContent className="p-0">
        <Table>
          <TableHeader><TableRow><TableHead>When</TableHead><TableHead>Actor</TableHead><TableHead>Action</TableHead><TableHead>Entity</TableHead><TableHead>Meta</TableHead></TableRow></TableHeader>
          <TableBody>
            {db.audit.map(a => (
              <TableRow key={a.id}>
                <TableCell className="text-xs text-muted-foreground">{new Date(a.createdAt).toLocaleString()}</TableCell>
                <TableCell className="font-medium">{a.actor}</TableCell>
                <TableCell><Badge variant="outline">{a.action}</Badge></TableCell>
                <TableCell className="capitalize text-muted-foreground">{a.entityType}{a.entityId ? ` · ${a.entityId}` : ''}</TableCell>
                <TableCell className="text-xs font-mono text-muted-foreground">{a.meta ? JSON.stringify(a.meta) : '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent></Card>
    </PageShell>
  );
};

/* ============ ANALYTICS ============ */
export const AMSAnalyticsPage = () => {
  const db = useAMS();
  const totalXP = db.progress.reduce((s,p)=>s+p.totalXP,0);
  const avgLevel = db.progress.length ? (db.progress.reduce((s,p)=>s+p.level,0)/db.progress.length).toFixed(1) : '0';
  const claimsPending = db.claims.filter(c => c.status === 'pending').length;
  const claimsFulfilled = db.claims.filter(c => c.status === 'fulfilled').length;
  const top = [...db.progress].sort((a,b)=>b.totalXP-a.totalXP).slice(0,10);

  return (
    <PageShell title="AMS Analytics" subtitle="Engagement, distribution and economy health metrics." icon={Flame}>
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ['Total XP', totalXP.toLocaleString(), Sparkles],
          ['Avg Level', avgLevel, Crown],
          ['Claims Pending', claimsPending, Package],
          ['Claims Fulfilled', claimsFulfilled, Check],
        ].map(([l,v,Icon]: any) => (
          <Card key={l}><CardContent className="p-5 flex items-center justify-between">
            <div><p className="text-xs uppercase tracking-wider text-muted-foreground">{l}</p><p className="mt-1 font-display text-2xl font-bold">{v}</p></div>
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/15 ring-1 ring-primary/30"><Icon className="h-5 w-5 text-primary" /></div>
          </CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle>Top 10 by XP</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {top.map((p,i) => {
            const pct = Math.min(100, (p.totalXP / Math.max(1, top[0].totalXP)) * 100);
            return (
              <div key={p.userId} className="flex items-center gap-3 py-1">
                <span className="w-6 text-xs text-muted-foreground">#{i+1}</span>
                <span className="w-40 text-sm font-medium truncate">{p.userName}</span>
                <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-gradient-to-r from-primary to-primary/60" style={{width:`${pct}%`}} /></div>
                <span className="w-24 text-right text-sm font-bold text-primary">{p.totalXP.toLocaleString()}</span>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </PageShell>
  );
};