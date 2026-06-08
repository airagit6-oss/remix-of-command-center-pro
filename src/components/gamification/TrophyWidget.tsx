import { useSyncExternalStore } from 'react';
import { Trophy, Zap, Crown, Flame, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { gamification, subscribeAMS, getUserSummary, ams } from '@/lib/gamificationStore';

const useAMS = () => useSyncExternalStore((cb) => subscribeAMS(cb), () => gamification.getAll());

interface Props { compact?: boolean }

export function TrophyWidget({ compact = false }: Props) {
  const db = useAMS();
  const { user } = useAuth();

  // Map current logged-in user to a seeded progress record (or use first if none).
  const uid = user?.id ?? 'u1';
  let summary = getUserSummary(uid);
  if (!summary.progress && db.progress.length > 0) {
    summary = getUserSummary(db.progress[0].userId);
  }
  const p = summary.progress;
  if (!p) return null;

  const next = summary.nextLevel;
  const pct = next ? Math.min(100, Math.round((p.totalXP / next.xpRequired) * 100)) : 100;

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-card to-card">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-yellow-500 to-primary" />
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base">
          <Trophy className="h-5 w-5 text-yellow-500" /> Your Gamification
        </CardTitle>
        <Badge className="bg-primary/15 text-primary">Lv {p.level}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border p-3 text-center">
            <Zap className="h-4 w-4 text-primary mx-auto" />
            <p className="mt-1 text-xs text-muted-foreground">XP</p>
            <p className="font-display text-lg font-bold">{p.totalXP.toLocaleString()}</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <Crown className="h-4 w-4 text-yellow-500 mx-auto" />
            <p className="mt-1 text-xs text-muted-foreground">Rank</p>
            <p className="font-display text-sm font-bold truncate">{p.rank}</p>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <Flame className="h-4 w-4 text-orange-500 mx-auto" />
            <p className="mt-1 text-xs text-muted-foreground">Streak</p>
            <p className="font-display text-lg font-bold">{p.currentStreak ?? 0}d</p>
          </div>
        </div>

        {next && (
          <div>
            <div className="mb-1 flex justify-between text-xs text-muted-foreground">
              <span>Progress to Lv {next.level} — {next.title}</span>
              <span>{pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-yellow-500" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}

        {!compact && (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Badges</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.badges.length === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
                {summary.badges.slice(0,6).map(b => (
                  <div key={b.id} className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 ring-1 ring-primary/30" title={b.title}>
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Trophies</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {summary.trophies.length === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
                {summary.trophies.slice(0,6).map(t => (
                  <div key={t.id} className="grid h-8 w-8 place-items-center rounded-full bg-yellow-500/15 ring-1 ring-yellow-500/30" title={t.title}>
                    <Trophy className="h-4 w-4 text-yellow-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/rewards">Browse rewards</Link></Button>
          <Button size="sm" variant="ghost" onClick={() => ams.pingStreak(p.userId)}>Check in</Button>
        </div>
      </CardContent>
    </Card>
  );
}