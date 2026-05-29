import { useState } from 'react';
import { UserPlus, Power, PowerOff, Package, Store, MoreHorizontal } from 'lucide-react';
import { useReseller, ManagedUser } from '@/contexts/ResellerContext';
import { useTranslation } from 'react-i18next';

const PRODUCTS = ['EduFlow Pro', 'MediCore 360', 'ShopEngine', 'HotelNest', 'AnalyticsHub'];
const PLANS = ['Basic', 'Pro', 'Unlimited'];

const emptyForm = () => ({ name: '', email: '', phone: '', plan: 'Basic', assignedProduct: PRODUCTS[0] });

const ResellerUsersPage = () => {
  const { t } = useTranslation('common');
  const { managedUsers, createUser, toggleUserStatus, assignProduct } = useReseller();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const [assignModal, setAssignModal] = useState<ManagedUser | null>(null);
  const [assignForm, setAssignForm] = useState({ product: PRODUCTS[0], plan: 'Basic' });

  const activeCount = managedUsers.filter(u => u.status === 'Active').length;

  const handleCreate = () => {
    if (!form.name || !form.email) return;
    createUser(form);
    setForm(emptyForm());
    setShowModal(false);
  };

  const handleAssign = () => {
    if (!assignModal) return;
    assignProduct(assignModal.id, assignForm.product, assignForm.plan);
    setAssignModal(null);
  };

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>{t('managed_stores', { defaultValue: 'Managed Stores' })}</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>{t('managed_stores_subtitle', { defaultValue: 'Create and manage client stores, assign apps and plans' })}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors"
          style={{ background: '#008060' }}
        >
          <UserPlus className="h-4 w-4" />
          {t('add_store', { defaultValue: 'Add store' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('total_stores', { defaultValue: 'Total Stores' }), value: managedUsers.length, color: '#1a1a1a' },
          { label: t('active', { defaultValue: 'Active' }), value: activeCount, color: '#008060' },
          { label: t('inactive', { defaultValue: 'Inactive' }), value: managedUsers.length - activeCount, color: '#6d7175' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('store', { defaultValue: 'Store' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('phone', { defaultValue: 'Phone' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('app', { defaultValue: 'App' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('plan', { defaultValue: 'Plan' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('status', { defaultValue: 'Status' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('created', { defaultValue: 'Created' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('actions', { defaultValue: 'Actions' })}</th>
            </tr>
          </thead>
          <tbody>
            {managedUsers.map(u => (
              <tr key={u.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{u.name}</p>
                      <p className="text-[11px]" style={{ color: '#6d7175' }}>{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{u.phone || '—'}</td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#1a1a1a' }}>{u.assignedProduct}</td>
                <td className="px-5 py-3">
                  <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f6f6f7', color: '#6d7175' }}>{u.plan}</span>
                </td>
                <td className="px-5 py-3">
                  <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{
                    background: u.status === 'Active' ? '#e4f3e8' : '#f6f6f7',
                    color: u.status === 'Active' ? '#008060' : '#6d7175',
                  }}>
                    {u.status}
                  </span>
                </td>
                <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{u.createdAt}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => { setAssignModal(u); setAssignForm({ product: u.assignedProduct, plan: u.plan }); }}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium border hover:bg-gray-50 transition-colors"
                      style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                    >
                      Assign
                    </button>
                    <button
                      onClick={() => toggleUserStatus(u.id)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors"
                      style={{
                        background: u.status === 'Active' ? '#fce4ec' : '#e4f3e8',
                        color: u.status === 'Active' ? '#d32f2f' : '#008060',
                      }}
                    >
                      {u.status === 'Active' ? t('deactivate', { defaultValue: 'Deactivate' }) : t('activate', { defaultValue: 'Activate' })}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {managedUsers.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-8 text-center text-sm" style={{ color: '#6d7175' }}>{t('no_stores_message', { defaultValue: 'No stores yet. Add your first store.' })}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Create Store Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>{t('add_new_store', { defaultValue: 'Add New Store' })}</h2>
            <div className="space-y-3">
              {([
                { label: t('store_name', { defaultValue: 'Store Name' }), key: 'name', type: 'text', placeholder: 'My Store' },
                { label: t('email', { defaultValue: 'Email' }), key: 'email', type: 'email', placeholder: 'store@example.com' },
                { label: t('phone', { defaultValue: 'Phone' }), key: 'phone', type: 'text', placeholder: '+1-555-0000' },
              ] as const).map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={form[f.key]}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
              ))}
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('assign_app', { defaultValue: 'Assign App' })}</label>
                <select value={form.assignedProduct} onChange={e => setForm(prev => ({ ...prev, assignedProduct: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>Plan</label>
                <select value={form.plan} onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleCreate} disabled={!form.name || !form.email} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50" style={{ background: '#008060' }}>{t('add_store', { defaultValue: 'Add Store' })}</button>
              <button onClick={() => { setShowModal(false); setForm(emptyForm()); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>{t('cancel', { defaultValue: 'Cancel' })}</button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Modal */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-1" style={{ color: '#1a1a1a' }}>{t('assign_app_title', { defaultValue: 'Assign App' })}</h2>
            <p className="text-sm mb-4" style={{ color: '#6d7175' }}>{t('for')} <span className="font-medium" style={{ color: '#1a1a1a' }}>{assignModal.name}</span></p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('app', { defaultValue: 'App' })}</label>
                <select value={assignForm.product} onChange={e => setAssignForm(prev => ({ ...prev, product: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('plan', { defaultValue: 'Plan' })}</label>
                <select value={assignForm.plan} onChange={e => setAssignForm(prev => ({ ...prev, plan: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {PLANS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={handleAssign} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>{t('save', { defaultValue: 'Save' })}</button>
              <button onClick={() => setAssignModal(null)} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>{t('cancel', { defaultValue: 'Cancel' })}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerUsersPage;
