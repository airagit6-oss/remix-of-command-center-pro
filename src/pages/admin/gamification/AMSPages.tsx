import { useMemo, useState, useSyncExternalStore } from 'react';
import { Trophy, Zap, TrendingUp, Award, Crown, Users, Plus, Trash2, Star, Flame, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { gamification, subscribeAMS, AchievementCategory, Role } from '@/lib/gamificationStore';
import { toast } from '@/hooks/use-toast';

const useAMS = () =>
  useSyncExternalStore(
    (cb) => subscribeAMS(cb),
    () => gamification.getAll(),
  );

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

const Stat = ({ label, value, icon: Icon, tone = 'primary' }: any) => (
  <Card className="overflow-hidden">
    <CardContent className="flex items-center justify-between p-5">
      <div>
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-1 font-display text-2xl font-bold">{value}</p>
      </div>
      <div className={`grid h-10 w-10 place-items-center rounded-lg bg-${tone}/15 ring-1 ring-${tone}/30`}>
        <Icon className={`h-5 w-5 text-${tone}`} />
      </div>
    </CardContent>
  </Card>
);

/* ========== 01. COMMAND CENTER ========== */
export const AMSCommandCenterPage = () => {
  const db = useAMS();
  const totalXP = db.progress.reduce((s, p) => s + p.totalXP, 0);
  const top = [...db.progress].sort((a, b) => b.totalXP - a.totalXP).slice(0, 5);
  const recent = db.xp.slice(0, 6);

  return (
    <PageShell
      title="Achievement Command Center"
      subtitle="Single source of truth for every reward, rank and trophy across Software Vala Nexus."
      icon={Trophy}
    >
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <Stat label="Total Achievements" value={db.achievements.length} icon={Award} tone="primary" />
        <Stat label="Unlocked Today"     value={db.xp.filter(x => Date.now() - +new Date(x.createdAt) < 864e5).length} icon={Flame} tone="primary" />
        <Stat label="Active Players"     value={db.progress.length} icon={Users} tone="primary" />
        <Stat label="Total XP Awarded"   value={totalXP.toLocaleString()} icon={Zap} tone="primary" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Crown className="h-5 w-5 text-yellow-500" /> Top 5 Champions</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {top.map((p, i) => (
              <div key={p.userId} className="flex items-center justify-between rounded-lg border border-border bg-card/50 p-3">
                <div className="flex items-center gap-3">
                  <div className={`grid h-9 w-9 place-items-center rounded-full font-bold ${i===0?'bg-yellow-500/20 text-yellow-500':i===1?'bg-slate-400/20 text-slate-300':i===2?'bg-orange-500/20 text-orange-400':'bg-muted text-muted-foreground'}`}>#{i+1}</div>
                  <div>
                    <p className="text-sm font-semibold">{p.userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{p.role} · {p.territory}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold">{p.totalXP.toLocaleString()} XP</p>
                  <Badge variant="secondary" className="text-xs">{p.rank}</Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> Recent Activity</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recent.map(x => (
              <div key={x.id} className="flex items-center justify-between rounded-lg border border-border p-3 text-sm">
                <div>
                  <p className="font-medium">{x.userName} <span className="text-muted-foreground">earned</span> {x.reason}</p>
                  <p className="text-xs text-muted-foreground capitalize">{x.category} · {new Date(x.createdAt).toLocaleString()}</p>
                </div>
                <Badge className="bg-primary/15 text-primary">+{x.amount} XP</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </PageShell>
  );
};

/* ========== 02. ACHIEVEMENT LIBRARY ========== */
const CATS: AchievementCategory[] = ['revenue','sales','support','development','training','customer','renewal','marketplace'];
const ROLES: (Role|'all')[] = ['all','boss','admin','developer','author','vendor','reseller','franchise','affiliate','support','marketing','finance','customer'];

export const AMSLibraryPage = () => {
  const db = useAMS();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: '', title: '', description: '', category: 'sales' as AchievementCategory, xp: 500, role: 'all' as Role|'all' });
  const [filter, setFilter] = useState<string>('');

  const list = useMemo(
    () => db.achievements.filter(a => !filter || a.title.toLowerCase().includes(filter.toLowerCase()) || a.code.toLowerCase().includes(filter.toLowerCase())),
    [db.achievements, filter],
  );

  const submit = () => {
    if (!form.code || !form.title) { toast({ title: 'Code and title are required', variant: 'destructive' }); return; }
    gamification.createAchievement({ ...form, active: true });
    toast({ title: 'Achievement created' });
    setOpen(false);
    setForm({ code: '', title: '', description: '', category: 'sales', xp: 500, role: 'all' });
  };

  return (
    <PageShell
      title="Achievement Library"
      subtitle="Create, edit and manage every achievement that drives engagement across the nexus."
      icon={Award}
      action={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" /> New Achievement</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Achievement</DialogTitle></DialogHeader>
            <div className="grid gap-3">
              <Input placeholder="CODE (e.g. FIRST_SALE)" value={form.code} onChange={e => setForm(f => ({...f, code: e.target.value.toUpperCase()}))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({...f, title: e.target.value}))} />
              <Textarea placeholder="Description" value={form.description} onChange={e => setForm(f => ({...f, description: e.target.value}))} />
              <div className="grid grid-cols-3 gap-2">
                <Select value={form.category} onValueChange={v => setForm(f => ({...f, category: v as AchievementCategory}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CATS.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={form.role} onValueChange={v => setForm(f => ({...f, role: v as Role|'all'}))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{ROLES.map(r => <SelectItem key={r} value={r} className="capitalize">{r}</SelectItem>)}</SelectContent>
                </Select>
                <Input type="number" value={form.xp} onChange={e => setForm(f => ({...f, xp: +e.target.value || 0}))} placeholder="XP" />
              </div>
            </div>
            <DialogFooter><Button onClick={submit}>Create</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>{list.length} Achievements</CardTitle>
          <Input className="max-w-xs" placeholder="Search code or title…" value={filter} onChange={e => setFilter(e.target.value)} />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Code</TableHead><TableHead>Title</TableHead><TableHead>Category</TableHead>
              <TableHead>Role</TableHead><TableHead className="text-right">XP</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {list.map(a => (
                <TableRow key={a.id}>
                  <TableCell className="font-mono text-xs">{a.code}</TableCell>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{a.category}</Badge></TableCell>
                  <TableCell className="capitalize text-muted-foreground">{a.role}</TableCell>
                  <TableCell className="text-right font-bold text-primary">{a.xp}</TableCell>
                  <TableCell>
                    <Badge className={a.active ? 'bg-emerald-500/15 text-emerald-500' : 'bg-muted'}>{a.active ? 'Active' : 'Archived'}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => gamification.updateAchievement(a.id, { active: !a.active })}>{a.active ? 'Archive' : 'Activate'}</Button>
                      <Button size="sm" variant="ghost" onClick={() => { gamification.deleteAchievement(a.id); toast({ title: 'Deleted' }); }}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
};

/* ========== 03. XP MANAGEMENT ========== */
export const AMSXPPage = () => {
  const db = useAMS();
  const byCat = useMemo(() => {
    const m: Record<string, number> = {};
    db.xp.forEach(x => { m[x.category] = (m[x.category] || 0) + x.amount; });
    return m;
  }, [db.xp]);

  return (
    <PageShell title="XP Management" subtitle="Track and distribute experience points across every activity stream." icon={Zap}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {CATS.map(c => (
          <Card key={c} className="overflow-hidden">
            <CardContent className="p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">{c} XP</p>
              <p className="mt-2 font-display text-xl font-bold text-primary">{(byCat[c] || 0).toLocaleString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Recent XP Transactions</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>User</TableHead><TableHead>Category</TableHead><TableHead>Reason</TableHead><TableHead>When</TableHead><TableHead className="text-right">XP</TableHead></TableRow></TableHeader>
            <TableBody>
              {db.xp.map(x => (
                <TableRow key={x.id}>
                  <TableCell className="font-medium">{x.userName}</TableCell>
                  <TableCell><Badge variant="outline" className="capitalize">{x.category}</Badge></TableCell>
                  <TableCell className="text-muted-foreground">{x.reason}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="text-right font-bold text-primary">+{x.amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
};

/* ========== 04. LEVELS ========== */
export const AMSLevelsPage = () => {
  const db = useAMS();
  return (
    <PageShell title="Level Management" subtitle="100 progression tiers. Earn XP, climb levels, unlock rewards." icon={TrendingUp}>
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader><TableRow><TableHead>Level</TableHead><TableHead>Title</TableHead><TableHead className="text-right">XP Required</TableHead><TableHead>Reward</TableHead></TableRow></TableHeader>
            <TableBody>
              {db.levels.map(l => (
                <TableRow key={l.level}>
                  <TableCell><Badge className="bg-primary/15 text-primary">Lv {l.level}</Badge></TableCell>
                  <TableCell className="font-medium">{l.title}</TableCell>
                  <TableCell className="text-right font-mono">{l.xpRequired.toLocaleString()}</TableCell>
                  <TableCell className="text-muted-foreground">{l.reward}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageShell>
  );
};

/* ========== 05. RANKS ========== */
export const AMSRanksPage = () => {
  const db = useAMS();
  return (
    <PageShell title="Rank Management" subtitle="Starter to Global Champion — ten elite tiers powering the leaderboard." icon={Crown}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {db.ranks.map(r => (
          <Card key={r.id} className="relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: r.color }} />
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="grid h-12 w-12 place-items-center rounded-xl ring-2" style={{ background: r.color + '22', borderColor: r.color, color: r.color }}>
                  <Star className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-display text-lg font-bold" style={{ color: r.color }}>{r.name}</p>
                  <p className="text-xs text-muted-foreground">Unlocks at Level {r.minLevel}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{r.perks}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageShell>
  );
};

/* ========== 06. LEADERBOARD ========== */
export const AMSLeaderboardPage = () => {
  const db = useAMS();
  const sorted = [...db.progress].sort((a, b) => b.totalXP - a.totalXP);

  const byScope = (key: 'role' | 'territory') => {
    const groups: Record<string, typeof sorted> = {};
    sorted.forEach(p => { (groups[p[key]] ||= []).push(p); });
    return groups;
  };

  const Row = ({ p, i }: any) => (
    <TableRow>
      <TableCell><Badge className={i<3?'bg-yellow-500/20 text-yellow-500':'bg-muted'}>#{i+1}</Badge></TableCell>
      <TableCell className="font-medium">{p.userName}</TableCell>
      <TableCell className="capitalize text-muted-foreground">{p.role}</TableCell>
      <TableCell className="text-muted-foreground">{p.territory}</TableCell>
      <TableCell><Badge variant="secondary">Lv {p.level}</Badge></TableCell>
      <TableCell><Badge variant="outline">{p.rank}</Badge></TableCell>
      <TableCell className="text-right font-bold text-primary">{p.totalXP.toLocaleString()}</TableCell>
    </TableRow>
  );

  return (
    <PageShell title="Leaderboard Center" subtitle="Global, role-based and territory leaderboards — updated in real-time." icon={Globe}>
      <Tabs defaultValue="global">
        <TabsList>
          <TabsTrigger value="global">Global</TabsTrigger>
          <TabsTrigger value="role">By Role</TabsTrigger>
          <TabsTrigger value="territory">By Territory</TabsTrigger>
        </TabsList>

        <TabsContent value="global">
          <Card><CardContent className="p-0">
            <Table>
              <TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>User</TableHead><TableHead>Role</TableHead><TableHead>Territory</TableHead><TableHead>Level</TableHead><TableHead>Tier</TableHead><TableHead className="text-right">Total XP</TableHead></TableRow></TableHeader>
              <TableBody>{sorted.map((p,i) => <Row key={p.userId} p={p} i={i} />)}</TableBody>
            </Table>
          </CardContent></Card>
        </TabsContent>

        {(['role','territory'] as const).map(scope => (
          <TabsContent key={scope} value={scope}>
            <div className="grid gap-4 md:grid-cols-2">
              {Object.entries(byScope(scope)).map(([k, list]) => (
                <Card key={k}>
                  <CardHeader><CardTitle className="capitalize">{k}</CardTitle></CardHeader>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader><TableRow><TableHead>#</TableHead><TableHead>User</TableHead><TableHead>Tier</TableHead><TableHead className="text-right">XP</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {list.map((p, i) => (
                          <TableRow key={p.userId}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell className="font-medium">{p.userName}</TableCell>
                            <TableCell><Badge variant="outline">{p.rank}</Badge></TableCell>
                            <TableCell className="text-right font-bold text-primary">{p.totalXP.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </PageShell>
  );
};