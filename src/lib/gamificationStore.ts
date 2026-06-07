// Gamification (AMS) — Phase 1 core store.
// LocalStorage-backed; mirrors the approvalsStore pattern so UI ships
// immediately without a DB round trip. Swap to Supabase later w/o UI churn.

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
}

const KEY = 'sv_ams_v1';
const EVT = 'sv:ams-update';

interface DB {
  achievements: Achievement[];
  xp: XPTransaction[];
  levels: Level[];
  ranks: Rank[];
  progress: UserProgress[];
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