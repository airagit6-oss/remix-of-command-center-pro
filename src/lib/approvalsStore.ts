// ============================================================
// Frontend approvals store (localStorage).
// Tracks Reseller / Author applications + role grants made by
// the Boss panel. Replace with a Lovable Cloud table when the
// backend is wired up — public API stays the same.
// ============================================================

export type ApprovalKind = 'reseller' | 'author';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface ApprovalRecord {
  id: string;
  kind: ApprovalKind;
  name: string;
  email: string;
  phone?: string;
  website?: string;
  message?: string;
  status: ApprovalStatus;
  /** Commission % for resellers, royalty % for authors. */
  rate?: number;
  /** Territory or vertical the partner owns. */
  territory?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const KEY = 'sv_approvals_v1';
const LISTENERS = new Set<() => void>();

function load(): ApprovalRecord[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as ApprovalRecord[];
    return Array.isArray(parsed) ? parsed : seed();
  } catch {
    return [];
  }
}

function save(rows: ApprovalRecord[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(rows));
    LISTENERS.forEach(fn => fn());
  } catch {
    /* noop */
  }
}

function seed(): ApprovalRecord[] {
  const now = new Date().toISOString();
  const rows: ApprovalRecord[] = [
    {
      id: 'apr_seed_1', kind: 'reseller', name: 'Rohan Mehta', email: 'rohan@northstar.in',
      phone: '+91 98765 43210', website: 'https://northstar.in', territory: 'Mumbai · West Zone',
      message: 'Running a 12-person SaaS reselling firm — ready to push enterprise plans.',
      rate: 30, status: 'pending', createdAt: now, updatedAt: now,
    },
    {
      id: 'apr_seed_2', kind: 'reseller', name: 'Aisha Khan', email: 'aisha@cloudpilot.ae',
      phone: '+971 50 123 4567', website: 'https://cloudpilot.ae', territory: 'UAE · GCC',
      message: 'GCC distribution network with 40+ B2B accounts.',
      rate: 35, status: 'approved', createdAt: now, updatedAt: now,
    },
    {
      id: 'apr_seed_3', kind: 'author', name: 'Karan Singh', email: 'karan@studiokernel.dev',
      website: 'https://studiokernel.dev', territory: 'Developer Tools',
      message: 'Have 4 production SaaS templates ready to publish on the marketplace.',
      rate: 70, status: 'pending', createdAt: now, updatedAt: now,
    },
    {
      id: 'apr_seed_4', kind: 'author', name: 'Priya Nair', email: 'priya@inkstack.io',
      website: 'https://inkstack.io', territory: 'Marketing · Content AI',
      message: 'Published 2 content-AI tools on competing markets — switching to Software Vala.',
      rate: 70, status: 'approved', createdAt: now, updatedAt: now,
    },
  ];
  try { localStorage.setItem(KEY, JSON.stringify(rows)); } catch { /* noop */ }
  return rows;
}

export const approvalsStore = {
  list(): ApprovalRecord[] {
    return load().sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
  byKind(kind: ApprovalKind) {
    return this.list().filter(r => r.kind === kind);
  },
  byStatus(status: ApprovalStatus) {
    return this.list().filter(r => r.status === status);
  },
  add(input: Omit<ApprovalRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'> & { status?: ApprovalStatus }): ApprovalRecord {
    const now = new Date().toISOString();
    const rec: ApprovalRecord = {
      id: 'apr_' + crypto.randomUUID().replace(/-/g, '').slice(0, 10),
      status: input.status ?? 'pending',
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    const rows = load();
    rows.unshift(rec);
    save(rows);
    return rec;
  },
  update(id: string, patch: Partial<ApprovalRecord>): ApprovalRecord | null {
    const rows = load();
    const idx = rows.findIndex(r => r.id === id);
    if (idx < 0) return null;
    rows[idx] = { ...rows[idx], ...patch, updatedAt: new Date().toISOString() };
    save(rows);
    return rows[idx];
  },
  setStatus(id: string, status: ApprovalStatus) {
    return this.update(id, { status });
  },
  remove(id: string) {
    save(load().filter(r => r.id !== id));
  },
  subscribe(fn: () => void) {
    LISTENERS.add(fn);
    return () => LISTENERS.delete(fn);
  },
};

export function approvalStats() {
  const all = approvalsStore.list();
  return {
    total: all.length,
    pending: all.filter(r => r.status === 'pending').length,
    approved: all.filter(r => r.status === 'approved').length,
    rejected: all.filter(r => r.status === 'rejected').length,
    suspended: all.filter(r => r.status === 'suspended').length,
    resellers: all.filter(r => r.kind === 'reseller').length,
    authors: all.filter(r => r.kind === 'author').length,
  };
}