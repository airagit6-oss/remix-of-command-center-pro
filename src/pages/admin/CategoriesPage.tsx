import { FolderTree, Plus, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { api } from '@/lib/api';

interface Category { name: string; subs: string[]; count: number; }

const CategoriesPage = () => {
  const { t } = useTranslation('common');
  const [cats, setCats] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [subs, setSubs] = useState('');
  const [busy, setBusy] = useState(false);

  // Load categories from real API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<Category[]>('/admin/categories');
        setCats(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load categories';
        setError(message);
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) { toast.error(t('category_name_required', { defaultValue: 'Category name is required' })); return; }
    if (cats.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error(t('category_exists', { defaultValue: 'A category with that name already exists' }));
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setCats(prev => [
        ...prev,
        { name: trimmed, subs: subs.split(',').map(s => s.trim()).filter(Boolean), count: 0 },
      ]);
      toast.success(t('category_created', { defaultValue: `Category "${trimmed}" created` }));
      setName(''); setSubs(''); setOpen(false); setBusy(false);
    }, 250);
  };

  const handleDelete = (n: string) => {
    if (!window.confirm(t('confirm_delete_category', { defaultValue: `Delete category "${n}"?` }))) return;
    setCats(prev => prev.filter(c => c.name !== n));
    toast.success(t('category_deleted', { defaultValue: `Category "${n}" deleted` }));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-1">{t('categories', { defaultValue: 'Categories' })}</h1>
          <p className="text-sm text-muted-foreground">{t('categories_subtitle', { defaultValue: 'Organize the marketplace taxonomy.' })}</p>
        </div>
        <button onClick={() => setOpen(true)} className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" /> {t('new_category', { defaultValue: 'New category' })}
        </button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {cats.map(c => (
          <div key={c.name} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex gap-3">
                <FolderTree className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.count} products</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(c.name)}
                aria-label={`Delete ${c.name}`}
                className="text-muted-foreground hover:text-destructive transition-colors p-1 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.subs.length === 0
                ? <span className="text-xs text-muted-foreground italic">No subcategories</span>
                : c.subs.map(s => (
                    <span key={s} className="text-xs px-2 py-1 rounded bg-secondary text-muted-foreground">{s}</span>
                  ))}
            </div>
          </div>
        ))}
        {cats.length === 0 && (
          <div className="col-span-2 rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            No categories yet. Click <strong>New category</strong> to add one.
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => !busy && setOpen(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleCreate} className="w-full max-w-md rounded-xl border border-border bg-card p-6 space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">New category</h2>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Name *</label>
              <input value={name} onChange={e => setName(e.target.value)} required maxLength={60}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subcategories (comma-separated)</label>
              <input value={subs} onChange={e => setSubs(e.target.value)} placeholder="e.g. Marketplace, POS, Headless"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setOpen(false)} disabled={busy}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-accent disabled:opacity-50">
                Cancel
              </button>
              <button type="submit" disabled={busy}
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
                {busy ? 'Creating…' : 'Create'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
export default CategoriesPage;
