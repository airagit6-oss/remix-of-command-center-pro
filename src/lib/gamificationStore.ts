// Gamification (AMS) — full engine store.
// LocalStorage-backed; mirrors the approvalsStore pattern. The Supabase
// schema (ams_* tables, ams_award_xp RPC) is in place for a server move
// without breaking this UI contract.

export type AchievementCategory =
  | 'revenue' | 'sales' | 'support' | 'development'
  | 'training' | 'customer' | 'renewal' | 'marketplace';

export type Role =
  | 'boss' | 'admin' | 'developer' | 'author' | 'vendor'
  | 'reseller' | 'franchise' | 'affiliate' | 'support'
  | 'marketing' | 'finance' | 'customer';

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  category: AchievementCategory;
  xp: number;
  role: Role | 'all';
  active: boolean;
  createdAt: string;
}

export interface Badge {
  id: string;
  code: string;
  title: string;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
  createdAt: string;
}

export interface Trophy {
  id: string;
  code: string;
  title: string;
  description: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  createdAt: string;
}

export interface Reward {
  id: string;
  code: string;
  title: string;
  description: string;
  type: 'voucher' | 'cash' | 'merch' | 'subscription' | 'points';
  costXP: number;
  value: number;
  stock: number; // -1 = unlimited
  active: boolean;
  createdAt: string;
}

export interface Milestone {
  id: string;
  code: string;
  title: string;
  description: string;
  target: number;
  metric: 'xp' | 'streak' | 'achievements' | 'revenue';
  xpReward: number;
  active: boolean;
}

export interface Claim {
  id: string;
  userId: string;
  userName: string;
  rewardId: string;
  rewardTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  notes?: string;
  createdAt: string;
}

export interface UserBadge   { id: string; userId: string; badgeId: string;  awardedAt: string; }
export interface UserTrophy  { id: string; userId: string; trophyId: string; awardedAt: string; }

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'achievement' | 'badge' | 'trophy' | 'reward' | 'level' | 'rank' | 'streak';
  read: boolean;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actor: string;
  action: string;
  entityType: string;
  entityId?: string;
  meta?: Record<string, unknown>;
  createdAt: string;
}

export interface XPTransaction {
  id: string;
  userId: string;
  userName: string;
  category: AchievementCategory;
  amount: number;
  reason: string;
  achievementId?: string;
  createdAt: string;
}

export interface Level {
  level: number;
  xpRequired: number;
  title: string;
  reward: string;
}

export interface Rank {
  id: string;
  name: string;
  minLevel: number;
  color: string;
  perks: string;
}

export interface UserProgress {
  userId: string;
  userName: string;
  role: Role;
  territory: string;
  totalXP: number;
  level: number;
  rank: string;
  achievementsUnlocked: number;
  currentStreak?: number;
  longestStreak?: number;
  lastActivityAt?: string;
}

const KEY = 'sv_ams_v1';
const EVT = 'sv:ams-update';

interface DB {
  achievements: Achievement[];
  xp: XPTransaction[];
  levels: Level[];
  ranks: Rank[];
  progress: UserProgress[];
  badges: Badge[];
  trophies: Trophy[];
  rewards: Reward[];
  milestones: Milestone[];
  claims: Claim[];
  userBadges: UserBadge[];
  userTrophies: UserTrophy[];
  notifications: Notification[];
  audit: AuditEntry[];
}

const RANKS: Rank[] = [
  { id: 'starter',   name: 'Starter',         minLevel: 1,   color: '#94a3b8', perks: 'Welcome onboard' },
  { id: 'bronze',    name: 'Bronze',          minLevel: 5,   color: '#b45309', perks: '5% bonus XP' },
  { id: 'silver',    name: 'Silver',          minLevel: 15,  color: '#94a3b8', perks: '10% bonus XP, priority leads' },
  { id: 'gold',      name: 'Gold',            minLevel: 30,  color: '#eab308', perks: '15% commission boost' },
  { id: 'platinum',  name: 'Platinum',        minLevel: 50,  color: '#06b6d4', perks: 'VIP support, premium frames' },
  { id: 'diamond',   name: 'Diamond',         minLevel: 80,  color: '#3b82f6', perks: 'Quarterly bonus pool' },
  { id: 'titan',     name: 'Titan',           minLevel: 120, color: '#8b5cf6', perks: 'Exclusive trophy room' },
  { id: 'legend',    name: 'Legend',          minLevel: 200, color: '#ec4899', perks: 'Hall of Fame entry' },
  { id: 'champion',  name: 'Champion',        minLevel: 350, color: '#f97316', perks: 'Equity points eligibility' },
  { id: 'global',    name: 'Global Champion', minLevel: 500, color: '#ef4444', perks: 'Annual world summit invite' },
];

const ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', code: 'FIRST_SALE',        title: 'First Sale',         description: 'Close your very first deal', category: 'sales',       xp: 500,  role: 'all',      active: true, createdAt: new Date().toISOString() },
  { id: 'a2', code: 'REVENUE_10K',       title: 'Revenue ₹10K',       description: 'Cross ₹10,000 in revenue',   category: 'revenue',     xp: 1000, role: 'all',      active: true, createdAt: new Date().toISOString() },
  { id: 'a3', code: 'REVENUE_1L',        title: 'Revenue ₹1 Lakh',    description: 'Cross ₹1,00,000 in revenue', category: 'revenue',     xp: 5000, role: 'all',      active: true, createdAt: new Date().toISOString() },
  { id: 'a4', code: 'TOP_DEV_MONTH',     title: 'Top Developer',      description: 'Be the #1 dev this month',   category: 'development', xp: 4000, role: 'developer',active: true, createdAt: new Date().toISOString() },
  { id: 'a5', code: 'RENEWAL_KING',      title: 'Renewal King',       description: '20 renewals in a month',     category: 'renewal',     xp: 3000, role: 'reseller', active: true, createdAt: new Date().toISOString() },
  { id: 'a6', code: 'SUPPORT_HERO',      title: 'Support Hero',       description: '95%+ CSAT for 30 days',      category: 'support',     xp: 2500, role: 'support',  active: true, createdAt: new Date().toISOString() },
  { id: 'a7', code: 'TRAINING_COMPLETE', title: 'Certified Pro',      description: 'Finish training program',    category: 'training',    xp: 1500, role: 'all',      active: true, createdAt: new Date().toISOString() },
  { id: 'a8', code: 'CUSTOMER_LOVE',     title: 'Customer Love',      description: '50 five-star reviews',       category: 'customer',    xp: 2000, role: 'vendor',   active: true, createdAt: new Date().toISOString() },
];

const SEED_PROGRESS: UserProgress[] = [
  { userId: 'u1', userName: 'Arjun Mehta',    role: 'reseller',  territory: 'North',   totalXP: 48200, level: 62,  rank: 'Diamond',  achievementsUnlocked: 24 },
  { userId: 'u2', userName: 'Priya Sharma',   role: 'developer', territory: 'South',   totalXP: 71500, level: 89,  rank: 'Diamond',  achievementsUnlocked: 31 },
  { userId: 'u3', userName: 'Rahul Verma',    role: 'vendor',    territory: 'West',    totalXP: 132400,level: 145, rank: 'Titan',    achievementsUnlocked: 42 },
  { userId: 'u4', userName: 'Sneha Iyer',     role: 'franchise', territory: 'South',   totalXP: 218900,level: 215, rank: 'Legend',   achievementsUnlocked: 58 },
  { userId: 'u5', userName: 'Karan Singh',    role: 'reseller',  territory: 'North',   totalXP: 9800,  level: 14,  rank: 'Bronze',   achievementsUnlocked: 7  },
  { userId: 'u6', userName: 'Ananya Gupta',   role: 'author',    territory: 'East',    totalXP: 365400,level: 358, rank: 'Champion', achievementsUnlocked: 73 },
  { userId: 'u7', userName: 'Vikram Nair',    role: 'support',   territory: 'South',   totalXP: 22100, level: 34,  rank: 'Gold',     achievementsUnlocked: 18 },
  { userId: 'u8', userName: 'Meera Joshi',    role: 'marketing', territory: 'West',    totalXP: 5400,  level: 9,   rank: 'Bronze',   achievementsUnlocked: 4  },
  { userId: 'u9', userName: 'Aditya Rao',     role: 'vendor',    territory: 'North',   totalXP: 512300,level: 510, rank: 'Global Champion', achievementsUnlocked: 96 },
  { userId: 'u10',userName: 'Pooja Bhatt',    role: 'reseller',  territory: 'East',    totalXP: 38900, level: 51,  rank: 'Platinum', achievementsUnlocked: 22 },
];

const SEED_XP: XPTransaction[] = [
  { id: 'x1', userId: 'u1', userName: 'Arjun Mehta',   category: 'sales',   amount: 500,  reason: 'First Sale',         achievementId: 'a1', createdAt: new Date(Date.now()-3600e3).toISOString() },
  { id: 'x2', userId: 'u3', userName: 'Rahul Verma',   category: 'revenue', amount: 5000, reason: 'Revenue ₹1 Lakh',     achievementId: 'a3', createdAt: new Date(Date.now()-7200e3).toISOString() },
  { id: 'x3', userId: 'u9', userName: 'Aditya Rao',    category: 'revenue', amount: 5000, reason: 'Revenue milestone',                       createdAt: new Date(Date.now()-1.4e7).toISOString() },
  { id: 'x4', userId: 'u4', userName: 'Sneha Iyer',    category: 'renewal', amount: 3000, reason: 'Renewal King',        achievementId: 'a5', createdAt: new Date(Date.now()-2e7).toISOString() },
  { id: 'x5', userId: 'u2', userName: 'Priya Sharma',  category: 'development', amount: 4000, reason: 'Top Developer',   achievementId: 'a4', createdAt: new Date(Date.now()-3e7).toISOString() },
];

const SEED_BADGES: Badge[] = [
  { id: 'b1', code: 'STARTER',    title: 'Starter',    description: 'Joined the platform', rarity: 'common',    icon: 'Sparkles', createdAt: new Date().toISOString() },
  { id: 'b2', code: 'CLOSER',     title: 'Closer',     description: '10 deals closed',     rarity: 'rare',      icon: 'Target',   createdAt: new Date().toISOString() },
  { id: 'b3', code: 'MARATHONER', title: 'Marathoner', description: '30-day streak',       rarity: 'epic',      icon: 'Flame',    createdAt: new Date().toISOString() },
  { id: 'b4', code: 'LEGEND',     title: 'Legend',     description: 'Reached Legend rank', rarity: 'legendary', icon: 'Crown',    createdAt: new Date().toISOString() },
];

const SEED_TROPHIES: Trophy[] = [
  { id: 't1', code: 'TROPHY_BRONZE',   title: 'Bronze Trophy',   description: 'Tier 1 achievement', tier: 'bronze',   createdAt: new Date().toISOString() },
  { id: 't2', code: 'TROPHY_SILVER',   title: 'Silver Trophy',   description: 'Tier 2 achievement', tier: 'silver',   createdAt: new Date().toISOString() },
  { id: 't3', code: 'TROPHY_GOLD',     title: 'Gold Trophy',     description: 'Tier 3 achievement', tier: 'gold',     createdAt: new Date().toISOString() },
  { id: 't4', code: 'TROPHY_PLATINUM', title: 'Platinum Trophy', description: 'Tier 4 achievement', tier: 'platinum', createdAt: new Date().toISOString() },
];

const SEED_REWARDS: Reward[] = [
  { id: 'r1', code: 'AMAZON_500',    title: 'Amazon Voucher ₹500', description: 'Redeem via wallet XP', type: 'voucher',      costXP: 5000,  value: 500,  stock: 100, active: true, createdAt: new Date().toISOString() },
  { id: 'r2', code: 'CASH_1000',     title: 'Cash Reward ₹1000',   description: 'Direct payout',        type: 'cash',         costXP: 10000, value: 1000, stock: 50,  active: true, createdAt: new Date().toISOString() },
  { id: 'r3', code: 'SWAG_TSHIRT',   title: 'Branded T-Shirt',     description: 'Premium merch',        type: 'merch',        costXP: 3000,  value: 0,    stock: 200, active: true, createdAt: new Date().toISOString() },
  { id: 'r4', code: 'PREMIUM_MONTH', title: 'Premium Month',       description: '1 month upgrade',      type: 'subscription', costXP: 2000,  value: 0,    stock: -1,  active: true, createdAt: new Date().toISOString() },
];

const SEED_MILESTONES: Milestone[] = [
  { id: 'm1', code: 'XP_10K',     title: 'XP 10,000',       description: 'Earn 10K XP',                  target: 10000, metric: 'xp',           xpReward: 1000, active: true },
  { id: 'm2', code: 'XP_50K',     title: 'XP 50,000',       description: 'Earn 50K XP',                  target: 50000, metric: 'xp',           xpReward: 5000, active: true },
  { id: 'm3', code: 'STREAK_30',  title: '30-Day Streak',   description: 'Stay active 30 days in a row', target: 30,    metric: 'streak',       xpReward: 3000, active: true },
  { id: 'm4', code: 'ACHIEVE_25', title: '25 Achievements', description: 'Unlock 25 achievements',       target: 25,    metric: 'achievements', xpReward: 2500, active: true },
];

function buildLevels(): Level[] {
  // Geometric-ish curve; titles every 50 levels.
  const out: Level[] = [];
  for (let i = 1; i <= 100; i++) {
    const xp = Math.round(500 * Math.pow(i, 1.45));
    const title = i < 5 ? 'Recruit' : i < 15 ? 'Builder' : i < 30 ? 'Operator' : i < 50 ? 'Strategist' : i < 80 ? 'Commander' : 'Sovereign';
    const reward = i % 10 === 0 ? `+${i * 100} pts wallet credit` : i % 5 === 0 ? 'Badge unlock' : '—';
    out.push({ level: i, xpRequired: xp, title, reward });
  }
  return out;
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const seeded: DB = {
    achievements: ACHIEVEMENTS,
    xp: SEED_XP,
    levels: buildLevels(),
    ranks: RANKS,
    progress: SEED_PROGRESS,
    badges: SEED_BADGES,
    trophies: SEED_TROPHIES,
    rewards: SEED_REWARDS,
    milestones: SEED_MILESTONES,
    claims: [],
    userBadges: [
      { id: 'ub1', userId: 'u1', badgeId: 'b1', awardedAt: new Date().toISOString() },
      { id: 'ub2', userId: 'u1', badgeId: 'b2', awardedAt: new Date().toISOString() },
      { id: 'ub3', userId: 'u4', badgeId: 'b4', awardedAt: new Date().toISOString() },
    ],
    userTrophies: [
      { id: 'ut1', userId: 'u3', trophyId: 't2', awardedAt: new Date().toISOString() },
      { id: 'ut2', userId: 'u9', trophyId: 't4', awardedAt: new Date().toISOString() },
    ],
    notifications: [],
    audit: [
      { id: 'al1', actor: 'system', action: 'seed', entityType: 'ams', createdAt: new Date().toISOString() },
    ],
  };
  save(seeded);
  return seeded;
}

function save(db: DB) {
  try {
    localStorage.setItem(KEY, JSON.stringify(db));
    window.dispatchEvent(new CustomEvent(EVT));
  } catch {}
}

export const gamification = {
  getAll: () => load(),

  // Achievements
  createAchievement: (a: Omit<Achievement, 'id' | 'createdAt'>) => {
    const db = load();
    const item: Achievement = { ...a, id: `a_${Date.now()}`, createdAt: new Date().toISOString() };
    db.achievements.unshift(item);
    save(db);
    return item;
  },
  updateAchievement: (id: string, patch: Partial<Achievement>) => {
    const db = load();
    db.achievements = db.achievements.map(a => a.id === id ? { ...a, ...patch } : a);
    save(db);
  },
  deleteAchievement: (id: string) => {
    const db = load();
    db.achievements = db.achievements.filter(a => a.id !== id);
    save(db);
  },

  // XP
  awardXP: (tx: Omit<XPTransaction, 'id' | 'createdAt'>) => {
    const db = load();
    const item: XPTransaction = { ...tx, id: `x_${Date.now()}`, createdAt: new Date().toISOString() };
    db.xp.unshift(item);
    const p = db.progress.find(p => p.userId === tx.userId);
    if (p) {
      p.totalXP += tx.amount;
      // Recalc level
      const lv = [...db.levels].reverse().find(l => p.totalXP >= l.xpRequired);
      if (lv) p.level = lv.level;
      const rk = [...db.ranks].reverse().find(r => p.level >= r.minLevel);
      if (rk) p.rank = rk.name;
    }
    save(db);
    return item;
  },

  reset: () => { localStorage.removeItem(KEY); window.dispatchEvent(new CustomEvent(EVT)); },
};

function addAudit(db: DB, actor: string, action: string, entityType: string, entityId?: string, meta?: Record<string, unknown>) {
  db.audit.unshift({ id: `al_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, actor, action, entityType, entityId, meta, createdAt: new Date().toISOString() });
  if (db.audit.length > 500) db.audit.length = 500;
}

function notify(db: DB, userId: string, title: string, body: string, type: Notification['type']) {
  db.notifications.unshift({ id: `n_${Date.now()}_${Math.random().toString(36).slice(2,7)}`, userId, title, body, type, read: false, createdAt: new Date().toISOString() });
  if (db.notifications.length > 500) db.notifications.length = 500;
}

/* ============== EXTENDED ENGINE API ============== */
export const ams = {
  /* BADGE ENGINE */
  createBadge: (b: Omit<Badge,'id'|'createdAt'>) => {
    const db = load();
    const item: Badge = { ...b, id: `b_${Date.now()}`, createdAt: new Date().toISOString() };
    db.badges.unshift(item); addAudit(db, 'admin', 'create', 'badge', item.id, { code: b.code });
    save(db); return item;
  },
  updateBadge: (id: string, patch: Partial<Badge>) => {
    const db = load(); db.badges = db.badges.map(b => b.id === id ? { ...b, ...patch } : b);
    addAudit(db, 'admin', 'update', 'badge', id, patch as any); save(db);
  },
  deleteBadge: (id: string) => {
    const db = load(); db.badges = db.badges.filter(b => b.id !== id);
    db.userBadges = db.userBadges.filter(u => u.badgeId !== id);
    addAudit(db, 'admin', 'delete', 'badge', id); save(db);
  },
  awardBadge: (userId: string, badgeId: string) => {
    const db = load();
    if (db.userBadges.some(u => u.userId === userId && u.badgeId === badgeId)) return;
    db.userBadges.unshift({ id: `ub_${Date.now()}`, userId, badgeId, awardedAt: new Date().toISOString() });
    const b = db.badges.find(x => x.id === badgeId);
    if (b) notify(db, userId, `Badge unlocked: ${b.title}`, b.description, 'badge');
    addAudit(db, 'system', 'award', 'badge', badgeId, { userId });
    save(db);
  },

  /* TROPHY ENGINE */
  createTrophy: (t: Omit<Trophy,'id'|'createdAt'>) => {
    const db = load();
    const item: Trophy = { ...t, id: `t_${Date.now()}`, createdAt: new Date().toISOString() };
    db.trophies.unshift(item); addAudit(db, 'admin', 'create', 'trophy', item.id); save(db); return item;
  },
  deleteTrophy: (id: string) => {
    const db = load(); db.trophies = db.trophies.filter(t => t.id !== id);
    db.userTrophies = db.userTrophies.filter(u => u.trophyId !== id);
    addAudit(db, 'admin', 'delete', 'trophy', id); save(db);
  },
  awardTrophy: (userId: string, trophyId: string) => {
    const db = load();
    if (db.userTrophies.some(u => u.userId === userId && u.trophyId === trophyId)) return;
    db.userTrophies.unshift({ id: `ut_${Date.now()}`, userId, trophyId, awardedAt: new Date().toISOString() });
    const t = db.trophies.find(x => x.id === trophyId);
    if (t) notify(db, userId, `Trophy earned: ${t.title}`, t.description, 'trophy');
    addAudit(db, 'system', 'award', 'trophy', trophyId, { userId });
    save(db);
  },

  /* REWARD ENGINE */
  createReward: (r: Omit<Reward,'id'|'createdAt'>) => {
    const db = load();
    const item: Reward = { ...r, id: `r_${Date.now()}`, createdAt: new Date().toISOString() };
    db.rewards.unshift(item); addAudit(db, 'admin', 'create', 'reward', item.id); save(db); return item;
  },
  updateReward: (id: string, patch: Partial<Reward>) => {
    const db = load(); db.rewards = db.rewards.map(r => r.id === id ? { ...r, ...patch } : r);
    addAudit(db, 'admin', 'update', 'reward', id, patch as any); save(db);
  },
  deleteReward: (id: string) => {
    const db = load(); db.rewards = db.rewards.filter(r => r.id !== id);
    addAudit(db, 'admin', 'delete', 'reward', id); save(db);
  },

  /* CLAIM ENGINE */
  submitClaim: (userId: string, userName: string, rewardId: string, notes?: string) => {
    const db = load();
    const reward = db.rewards.find(r => r.id === rewardId);
    if (!reward || !reward.active) throw new Error('Reward not available');
    if (reward.stock === 0) throw new Error('Out of stock');
    const progress = db.progress.find(p => p.userId === userId);
    if (progress && progress.totalXP < reward.costXP) throw new Error('Insufficient XP');
    const item: Claim = {
      id: `cl_${Date.now()}`, userId, userName, rewardId, rewardTitle: reward.title,
      status: 'pending', notes, createdAt: new Date().toISOString(),
    };
    db.claims.unshift(item);
    notify(db, userId, `Reward claim submitted`, `${reward.title} — pending approval`, 'reward');
    addAudit(db, userId, 'submit', 'claim', item.id, { rewardId });
    save(db);
    return item;
  },
  decideClaim: (id: string, status: 'approved' | 'rejected' | 'fulfilled') => {
    const db = load();
    db.claims = db.claims.map(c => {
      if (c.id !== id) return c;
      const updated = { ...c, status };
      // Deduct XP + stock when fulfilled
      if (status === 'fulfilled' && c.status !== 'fulfilled') {
        const reward = db.rewards.find(r => r.id === c.rewardId);
        const p = db.progress.find(pp => pp.userId === c.userId);
        if (reward) {
          if (reward.stock > 0) reward.stock -= 1;
          if (p) p.totalXP = Math.max(0, p.totalXP - reward.costXP);
        }
        notify(db, c.userId, `Reward delivered: ${c.rewardTitle}`, `Status: fulfilled`, 'reward');
      } else if (status === 'rejected') {
        notify(db, c.userId, `Claim rejected: ${c.rewardTitle}`, `Reach out to support`, 'reward');
      } else if (status === 'approved') {
        notify(db, c.userId, `Claim approved: ${c.rewardTitle}`, `Fulfilment in progress`, 'reward');
      }
      return updated;
    });
    addAudit(db, 'admin', `claim:${status}`, 'claim', id);
    save(db);
  },

  /* MILESTONE ENGINE */
  createMilestone: (m: Omit<Milestone,'id'>) => {
    const db = load();
    const item: Milestone = { ...m, id: `m_${Date.now()}` };
    db.milestones.unshift(item); addAudit(db, 'admin', 'create', 'milestone', item.id); save(db); return item;
  },
  deleteMilestone: (id: string) => {
    const db = load(); db.milestones = db.milestones.filter(m => m.id !== id);
    addAudit(db, 'admin', 'delete', 'milestone', id); save(db);
  },

  /* STREAK ENGINE */
  pingStreak: (userId: string) => {
    const db = load();
    const p = db.progress.find(p => p.userId === userId); if (!p) return;
    const today = new Date().toISOString().slice(0,10);
    const last  = p.lastActivityAt ? p.lastActivityAt.slice(0,10) : '';
    if (last === today) return;
    const yesterday = new Date(Date.now()-864e5).toISOString().slice(0,10);
    p.currentStreak = last === yesterday ? (p.currentStreak ?? 0) + 1 : 1;
    p.longestStreak = Math.max(p.longestStreak ?? 0, p.currentStreak);
    p.lastActivityAt = new Date().toISOString();
    if (p.currentStreak === 7 || p.currentStreak === 30 || p.currentStreak === 100) {
      notify(db, userId, `🔥 ${p.currentStreak}-day streak!`, 'Keep the fire alive', 'streak');
    }
    save(db);
  },

  /* NOTIFICATIONS */
  markRead: (id: string) => {
    const db = load();
    db.notifications = db.notifications.map(n => n.id === id ? { ...n, read: true } : n);
    save(db);
  },
  markAllRead: (userId: string) => {
    const db = load();
    db.notifications = db.notifications.map(n => n.userId === userId ? { ...n, read: true } : n);
    save(db);
  },

  /* QUICK ADMIN AWARD */
  adminAwardXP: (userId: string, amount: number, reason: string, category: AchievementCategory = 'sales') => {
    const db = load();
    const p = db.progress.find(pp => pp.userId === userId);
    if (!p) return;
    gamification.awardXP({ userId, userName: p.userName, amount, reason, category });
    const db2 = load();
    notify(db2, userId, `+${amount} XP awarded`, reason, 'achievement');
    addAudit(db2, 'admin', 'award_xp', 'xp', undefined, { userId, amount, reason });
    save(db2);
  },
};

export function getUserProgress(userId: string): UserProgress | undefined {
  return load().progress.find(p => p.userId === userId);
}

export function getUserSummary(userId: string) {
  const db = load();
  const p = db.progress.find(pp => pp.userId === userId);
  const badges    = db.userBadges.filter(b => b.userId === userId).map(b => db.badges.find(x => x.id === b.badgeId)!).filter(Boolean);
  const trophies  = db.userTrophies.filter(t => t.userId === userId).map(t => db.trophies.find(x => x.id === t.trophyId)!).filter(Boolean);
  const notifs    = db.notifications.filter(n => n.userId === userId);
  const nextLevel = p ? db.levels.find(l => l.level === p.level + 1) : undefined;
  return { progress: p, badges, trophies, notifications: notifs, nextLevel };
}

export function subscribeAMS(cb: () => void) {
  const h = () => cb();
  window.addEventListener(EVT, h);
  window.addEventListener('storage', h);
  return () => {
    window.removeEventListener(EVT, h);
    window.removeEventListener('storage', h);
  };
}

export function useAMS<T>(selector: (db: DB) => T): T {
  // Lightweight reactive read (no React import to keep this util pure):
  // callers wrap with useSyncExternalStore in components.
  return selector(load());
}