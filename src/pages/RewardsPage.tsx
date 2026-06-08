import { useState, useSyncExternalStore } from 'react';
import { Gift, Sparkles, Zap, Trophy, Crown, Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Navbar } from '@/components/marketplace/Navbar';
import { TrophyWidget } from '@/components/gamification/TrophyWidget';
import { useAuth } from '@/contexts/AuthContext';
import { gamification, subscribeAMS, ams, getUserSummary } from '@/lib/gamificationStore';
import { toast } from '@/hooks/use-toast';

const useAMS = () => useSyncExternalStore((cb) => subscribeAMS(cb), () => gamification.getAll());

export default function RewardsPage() {
  const db = useAMS();
  const { user } = useAuth();
  const uid = user?.id ?? db.progress[0]?.userId ?? 'u1';
  const summary = getUserSummary(uid);
  const me = summary.progress;

  const claim = (rewardId: string) => {
    if (!me) return toast({ title: 'Sign in to claim', variant: 'destructive' });
    try {
      ams.submitClaim(me.userId, me.userName, rewardId);
      toast({ title: 'Claim submitted', description: 'Awaiting admin approval.' });
    } catch (e: any) {
      toast({ title: e.message ?? 'Could not claim', variant: 'destructive' });
    }
  };

  const myClaims = db.claims.filter(c => c.userId === uid);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <div>
              <h1 className="font-display text-2xl font-bold">Rewards Centre</h1>
              <p className="text-sm text-muted-foreground">Spend your XP on perks, vouchers and merch.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <Tabs defaultValue="catalog">
            <TabsList>
              <TabsTrigger value="catalog">Catalog</TabsTrigger>
              <TabsTrigger value="badges">My Badges</TabsTrigger>
              <TabsTrigger value="trophies">My Trophies</TabsTrigger>
              <TabsTrigger value="claims">My Claims ({myClaims.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="catalog">
              <div className="grid gap-4 md:grid-cols-2">
                {db.rewards.filter(r => r.active).map(r => {
                  const canAfford = (me?.totalXP ?? 0) >= r.costXP;
                  return (
                    <Card key={r.id} className="overflow-hidden">
                      <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{r.title}</CardTitle>
                          <p className="text-xs text-muted-foreground capitalize mt-1">{r.type}</p>
                        </div>
                        <Badge className="bg-primary/15 text-primary">{r.costXP.toLocaleString()} XP</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground">{r.description}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{r.stock === -1 ? 'Unlimited' : `${r.stock} in stock`}</span>
                          <Button size="sm" disabled={!canAfford || r.stock === 0} onClick={() => claim(r.id)}>
                            <Gift className="h-4 w-4 mr-1" /> {canAfford ? 'Claim' : 'Need more XP'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
            <TabsContent value="badges">
              <Card><CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {summary.badges.length === 0 && <p className="col-span-4 py-6 text-center text-muted-foreground text-sm">No badges yet — earn XP to unlock.</p>}
                  {summary.badges.map(b => (
                    <div key={b.id} className="rounded-xl border border-border p-4 text-center">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30"><Sparkles className="h-7 w-7 text-primary" /></div>
                      <p className="mt-2 font-semibold text-sm">{b.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{b.rarity}</p>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="trophies">
              <Card><CardContent className="p-5">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {summary.trophies.length === 0 && <p className="col-span-4 py-6 text-center text-muted-foreground text-sm">No trophies yet — keep climbing.</p>}
                  {summary.trophies.map(t => (
                    <div key={t.id} className="rounded-xl border border-border p-4 text-center">
                      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-yellow-500/15 ring-1 ring-yellow-500/30"><Trophy className="h-7 w-7 text-yellow-500" /></div>
                      <p className="mt-2 font-semibold text-sm">{t.title}</p>
                      <p className="text-xs text-muted-foreground capitalize">{t.tier}</p>
                    </div>
                  ))}
                </div>
              </CardContent></Card>
            </TabsContent>
            <TabsContent value="claims">
              <Card><CardContent className="p-0">
                {myClaims.length === 0 ? (
                  <p className="py-10 text-center text-sm text-muted-foreground">You haven't claimed anything yet.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {myClaims.map(c => (
                      <li key={c.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">{c.rewardTitle}</p>
                          <p className="text-xs text-muted-foreground">{new Date(c.createdAt).toLocaleString()}</p>
                        </div>
                        <Badge className={
                          c.status === 'fulfilled' ? 'bg-emerald-500/15 text-emerald-500' :
                          c.status === 'approved'  ? 'bg-blue-500/15 text-blue-400' :
                          c.status === 'rejected'  ? 'bg-destructive/15 text-destructive' :
                                                     'bg-yellow-500/15 text-yellow-500'
                        }>{c.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent></Card>
            </TabsContent>
          </Tabs>

          <div className="space-y-4">
            <TrophyWidget />
            <Card>
              <CardHeader><CardTitle className="text-base flex items-center gap-2"><Crown className="h-4 w-4 text-yellow-500"/> Notifications</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {summary.notifications.length === 0 && <p className="text-xs text-muted-foreground">No notifications yet.</p>}
                {summary.notifications.slice(0,6).map(n => (
                  <div key={n.id} className={`rounded-lg border p-2 ${n.read ? 'border-border bg-card/30' : 'border-primary/30 bg-primary/5'}`}>
                    <p className="text-xs font-semibold">{n.title}</p>
                    <p className="text-[11px] text-muted-foreground">{n.body}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}