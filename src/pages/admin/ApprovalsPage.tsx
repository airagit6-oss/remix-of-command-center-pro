import { useEffect, useMemo, useState } from 'react';
import {
  Crown, ShieldCheck, ShieldAlert, Users, BookUser, Search, CheckCircle2,
  XCircle, PauseCircle, Pencil, Trash2, Mail, Globe, Phone, MapPin, Plus,
} from 'lucide-react';
import {
  approvalsStore, approvalStats, type ApprovalKind, type ApprovalRecord,
  type ApprovalStatus,
} from '@/lib/approvalsStore';

const STATUS_STYLES: Record<ApprovalStatus, string> = {
  pending:   'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  approved:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  rejected:  'bg-rose-500/15 text-rose-300 border-rose-500/30',
  suspended: 'bg-orange-500/15 text-orange-300 border-orange-500/30',
};

const KIND_STYLES: Record<ApprovalKind, string> = {
  reseller: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
  author:   'bg-violet-500/15 text-violet-300 border-violet-500/30',
};

function Chip({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${className}`}>
      {children}
    </span>
  );
}

function StatCard({
  label, value, icon: Icon, tone,
}: { label: string; value: number; icon: any; tone: string }) {
  return (
    <div className="rounded-xl border border-border bg-card/60 backdrop-blur p-4 flex items-center gap-3">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${tone}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">{label}</p>
      </div>
    </div>
  );
}

interface EditState {
  open: boolean;
  record?: ApprovalRecord;
  isNew?: boolean;
}

const ApprovalsPage = () => {
  const [, force] = useState(0);
  const [kind, setKind] = useState<'all' | ApprovalKind>('all');
  const [status, setStatus] = useState<'all' | ApprovalStatus>('all');
  const [query, setQuery] = useState('');
  const [edit, setEdit] = useState<EditState>({ open: false });

  useEffect(() => {
    const unsub = approvalsStore.subscribe(() => force(n => n + 1));
    return () => { unsub(); };
  }, []);

  const stats = approvalStats();

  const rows = useMemo(() => {
    let list = approvalsStore.list();
    if (kind !== 'all') list = list.filter(r => r.kind === kind);
    if (status !== 'all') list = list.filter(r => r.status === status);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        (r.territory ?? '').toLowerCase().includes(q),
      );
    }
    return list;
  }, [kind, status, query]);

  const action = (id: string, next: ApprovalStatus) => approvalsStore.setStatus(id, next);

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="rounded-2xl border border-yellow-500/30 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent p-6">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="h-6 w-6 text-yellow-400" />
          <h1 className="text-2xl font-bold text-foreground">Empire Approvals</h1>
          <Chip className="bg-yellow-500/20 text-yellow-300 border-yellow-500/40">Boss-only</Chip>
        </div>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Review Reseller and Author applications, grant access, modify commission rates,
          assign territories, or suspend partners. Every action is audited.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        <StatCard label="Pending"   value={stats.pending}   icon={ShieldAlert} tone="bg-yellow-500/15 text-yellow-300"  />
        <StatCard label="Approved"  value={stats.approved}  icon={ShieldCheck} tone="bg-emerald-500/15 text-emerald-300" />
        <StatCard label="Rejected"  value={stats.rejected}  icon={XCircle}     tone="bg-rose-500/15 text-rose-300"       />
        <StatCard label="Suspended" value={stats.suspended} icon={PauseCircle} tone="bg-orange-500/15 text-orange-300"   />
        <StatCard label="Resellers" value={stats.resellers} icon={Users}       tone="bg-cyan-500/15 text-cyan-300"       />
        <StatCard label="Authors"   value={stats.authors}   icon={BookUser}    tone="bg-violet-500/15 text-violet-300"   />
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search name, email, territory…"
            className="w-full rounded-lg border border-border bg-card pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <select value={kind} onChange={e => setKind(e.target.value as any)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          <option value="all">All roles</option>
          <option value="reseller">Resellers</option>
          <option value="author">Authors</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value as any)} className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="suspended">Suspended</option>
        </select>
        <button
          onClick={() => setEdit({ open: true, isNew: true, record: {
            id: '', kind: 'reseller', name: '', email: '', status: 'pending', rate: 30,
            createdAt: '', updatedAt: '',
          } as ApprovalRecord })}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Grant access
        </button>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left px-4 py-3">Applicant</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Territory</th>
                <th className="text-left px-4 py-3">Rate</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-right px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-muted-foreground">No applications match these filters.</td></tr>
              )}
              {rows.map(r => (
                <tr key={r.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{r.name}</div>
                    <div className="flex flex-wrap items-center gap-3 mt-0.5 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> {r.email}</span>
                      {r.phone && <span className="inline-flex items-center gap-1"><Phone className="h-3 w-3" /> {r.phone}</span>}
                      {r.website && <span className="inline-flex items-center gap-1"><Globe className="h-3 w-3" /> {r.website.replace(/^https?:\/\//, '')}</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3"><Chip className={KIND_STYLES[r.kind]}>{r.kind}</Chip></td>
                  <td className="px-4 py-3">
                    {r.territory
                      ? <span className="inline-flex items-center gap-1 text-foreground/90"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {r.territory}</span>
                      : <span className="text-muted-foreground">—</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-foreground">{r.rate ?? '—'}{r.rate != null && '%'}</td>
                  <td className="px-4 py-3"><Chip className={STATUS_STYLES[r.status]}>{r.status}</Chip></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {r.status !== 'approved' && (
                        <button onClick={() => action(r.id, 'approved')} title="Approve" className="p-1.5 rounded-md hover:bg-emerald-500/10 text-emerald-400">
                          <CheckCircle2 className="h-4 w-4" />
                        </button>
                      )}
                      {r.status !== 'rejected' && (
                        <button onClick={() => action(r.id, 'rejected')} title="Reject" className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-400">
                          <XCircle className="h-4 w-4" />
                        </button>
                      )}
                      {r.status === 'approved' && (
                        <button onClick={() => action(r.id, 'suspended')} title="Suspend" className="p-1.5 rounded-md hover:bg-orange-500/10 text-orange-400">
                          <PauseCircle className="h-4 w-4" />
                        </button>
                      )}
                      <button onClick={() => setEdit({ open: true, record: r })} title="Modify" className="p-1.5 rounded-md hover:bg-primary/10 text-primary">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button onClick={() => { if (confirm('Delete this application?')) approvalsStore.remove(r.id); }} title="Delete" className="p-1.5 rounded-md hover:bg-rose-500/10 text-rose-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {edit.open && edit.record && (
        <EditModal
          state={edit}
          onClose={() => setEdit({ open: false })}
          onSave={(rec) => {
            if (edit.isNew) {
              approvalsStore.add({
                kind: rec.kind, name: rec.name, email: rec.email, phone: rec.phone,
                website: rec.website, message: rec.message, territory: rec.territory,
                rate: rec.rate, notes: rec.notes, status: rec.status,
              });
            } else {
              approvalsStore.update(rec.id, rec);
            }
            setEdit({ open: false });
          }}
        />
      )}
    </div>
  );
};

function EditModal({
  state, onClose, onSave,
}: { state: EditState; onClose: () => void; onSave: (r: ApprovalRecord) => void }) {
  const [draft, setDraft] = useState<ApprovalRecord>(state.record!);
  const input = 'w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary';

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm grid place-items-center p-4" onClick={onClose}>
      <div onClick={e => e.stopPropagation()} className="w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl">
        <h2 className="text-lg font-bold text-foreground mb-4">
          {state.isNew ? 'Grant partner access' : `Modify ${draft.name}`}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="text-xs text-muted-foreground md:col-span-1">Role
            <select value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value as ApprovalKind })} className={input + ' mt-1'}>
              <option value="reseller">Reseller</option>
              <option value="author">Author</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Status
            <select value={draft.status} onChange={e => setDraft({ ...draft, status: e.target.value as ApprovalStatus })} className={input + ' mt-1'}>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </label>
          <label className="text-xs text-muted-foreground">Name
            <input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground">Email
            <input value={draft.email} onChange={e => setDraft({ ...draft, email: e.target.value })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground">Phone
            <input value={draft.phone ?? ''} onChange={e => setDraft({ ...draft, phone: e.target.value })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground">Website
            <input value={draft.website ?? ''} onChange={e => setDraft({ ...draft, website: e.target.value })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground">Territory / Vertical
            <input value={draft.territory ?? ''} onChange={e => setDraft({ ...draft, territory: e.target.value })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground">{draft.kind === 'reseller' ? 'Commission %' : 'Royalty %'}
            <input type="number" min={0} max={100} value={draft.rate ?? 0} onChange={e => setDraft({ ...draft, rate: Number(e.target.value) })} className={input + ' mt-1'} />
          </label>
          <label className="text-xs text-muted-foreground md:col-span-2">Internal notes
            <textarea rows={3} value={draft.notes ?? ''} onChange={e => setDraft({ ...draft, notes: e.target.value })} className={input + ' mt-1'} />
          </label>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground hover:bg-muted">Cancel</button>
          <button
            onClick={() => {
              if (!draft.name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(draft.email)) return;
              onSave(draft);
            }}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {state.isNew ? 'Grant access' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApprovalsPage;