import { useState, useEffect } from 'react';
import { Plus, Power, PowerOff } from 'lucide-react';
import { audit } from '@/lib/auditLog';
import { useAuth } from '@/contexts/AuthContext';

type SubStatus = 'Active' | 'Expired' | 'Disabled';

interface Subscription {
  id: string;
  userName: string;
  userEmail: string;
  plan: string;
  productName: string;
  status: SubStatus;
  startDate: string;
  expiryDate: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
}

interface Product {
  id: string;
  name: string;
}

const statusStyles: Record<SubStatus, { bg: string; text: string }> = {
  Active: { bg: '#e4f3e8', text: '#008060' },
  Expired: { bg: '#fce4ec', text: '#d32f2f' },
  Disabled: { bg: '#f6f6f7', text: '#6d7175' },
};

const plans = ['Basic', 'Pro', 'Unlimited'];

const ResellerSubscriptionsPage = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const resellerId = user?.id ?? 'anonymous';
  const userId = user?.id ?? 'anonymous';
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    userName: '', userEmail: '', plan: 'Basic', productName: '',
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
  });

  useEffect(() => {
    // Fetch subscriptions from API
    const fetchSubscriptions = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/reseller/subscriptions', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setSubs(data.subscriptions || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch clients from API
    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/reseller/clients', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setClients(data.clients || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch clients:', error);
      }
    };

    // Fetch products from API
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/reseller/products', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setProducts(data.products || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchSubscriptions();
    fetchClients();
    fetchProducts();
  }, []);

  const toggleStatus = (id: string) => {
    setSubs(prev => prev.map(s => {
      if (s.id !== id) return s;
      const updated = { ...s, status: s.status === 'Active' ? 'Disabled' : 'Active' } as Subscription;
      audit.updateSubscription(resellerId, userId, id, { status: updated.status });
      return updated;
    }));
  };

  const addSubscription = () => {
    if (!form.userName || !form.userEmail) return;
    const newSub: Subscription = { ...form, id: `s${Date.now()}`, status: 'Active' };
    setSubs(prev => [newSub, ...prev]);
    audit.updateSubscription(resellerId, userId, newSub.id, { action: 'create', product: newSub.productName, plan: newSub.plan });
    setForm({
      userName: '', userEmail: '', plan: 'Basic', productName: products[0]?.name || '',
      startDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0],
    });
    setShowModal(false);
  };

  const active = subs.filter(s => s.status === 'Active').length;
  const expired = subs.filter(s => s.status === 'Expired').length;

  return (
    <div className="space-y-5 max-w-[1200px]">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>{t('subscriptions', { defaultValue: 'Subscriptions' })}</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>{t('subscriptions_subtitle', { defaultValue: 'Manage client subscriptions and access control' })}</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
          <Plus className="h-4 w-4" />
          {t('create_subscription', { defaultValue: 'Create subscription' })}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: t('total', { defaultValue: 'Total' }), value: subs.length },
          { label: t('active', { defaultValue: 'Active' }), value: active, color: '#008060' },
          { label: t('expired', { defaultValue: 'Expired' }), value: expired, color: '#d32f2f' },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-xl border p-4" style={{ borderColor: '#e1e3e5' }}>
            <p className="text-xs font-medium" style={{ color: '#6d7175' }}>{k.label}</p>
            <p className="text-2xl font-bold mt-1" style={{ color: k.color ?? '#1a1a1a' }}>{k.value}</p>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#fafbfb', borderBottom: '1px solid #e1e3e5' }}>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('client', { defaultValue: 'Client' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('app', { defaultValue: 'App' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('plan', { defaultValue: 'Plan' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('status', { defaultValue: 'Status' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('start', { defaultValue: 'Start' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('expiry', { defaultValue: 'Expiry' })}</th>
              <th className="px-5 py-2.5 text-left text-xs font-medium" style={{ color: '#6d7175' }}>{t('action', { defaultValue: 'Action' })}</th>
            </tr>
          </thead>
          <tbody>
            {subs.map(s => {
              const st = statusStyles[s.status];
              return (
                <tr key={s.id} className="border-b last:border-0 hover:bg-gray-50/50 transition-colors" style={{ borderColor: '#f1f1f1' }}>
                  <td className="px-5 py-3">
                    <p className="font-medium text-[13px]" style={{ color: '#1a1a1a' }}>{s.userName}</p>
                    <p className="text-[11px]" style={{ color: '#6d7175' }}>{s.userEmail}</p>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#1a1a1a' }}>{s.productName}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ background: '#f6f6f7', color: '#6d7175' }}>{s.plan}</span>
                  </td>
                  <td className="px-5 py-3">
                    <span className="rounded-full px-2.5 py-1 text-xs font-medium" style={{ background: st.bg, color: st.text }}>{s.status}</span>
                  </td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{s.startDate}</td>
                  <td className="px-5 py-3 text-[13px]" style={{ color: '#6d7175' }}>{s.expiryDate}</td>
                  <td className="px-5 py-3">
                    {s.status !== 'Expired' && (
                      <button onClick={() => toggleStatus(s.id)} className="rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors" style={{
                        background: s.status === 'Active' ? '#fce4ec' : '#e4f3e8',
                        color: s.status === 'Active' ? '#d32f2f' : '#008060',
                      }}>
                        {s.status === 'Active' ? t('disable', { defaultValue: 'Disable' }) : t('enable', { defaultValue: 'Enable' })}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-lg font-semibold mb-4" style={{ color: '#1a1a1a' }}>{t('create_subscription_modal', { defaultValue: 'Create Subscription' })}</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('client_name', { defaultValue: 'Client Name' })}</label>
                <input type="text" placeholder={t('client_name_placeholder', { defaultValue: 'Client name' })} list="user-list" value={form.userName}
                  onChange={e => setForm(prev => ({ ...prev, userName: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
                <datalist id="user-list">{clients.map(c => <option key={c.id} value={c.name} />)}</datalist>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('email', { defaultValue: 'Email' })}</label>
                <input type="email" placeholder={t('email_placeholder', { defaultValue: 'client@example.com' })} value={form.userEmail}
                  onChange={e => setForm(prev => ({ ...prev, userEmail: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('app', { defaultValue: 'App' })}</label>
                <select value={form.productName} onChange={e => setForm(prev => ({ ...prev, productName: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('plan', { defaultValue: 'Plan' })}</label>
                <select value={form.plan} onChange={e => setForm(prev => ({ ...prev, plan: e.target.value }))} className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}>
                  {plans.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('start', { defaultValue: 'Start' })}</label>
                  <input type="date" value={form.startDate} onChange={e => setForm(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('expiry', { defaultValue: 'Expiry' })}</label>
                  <input type="date" value={form.expiryDate} onChange={e => setForm(prev => ({ ...prev, expiryDate: e.target.value }))}
                    className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={addSubscription} className="flex-1 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>{t('create', { defaultValue: 'Create' })}</button>
              <button onClick={() => { setShowModal(false); setForm({ userName: '', userEmail: '', plan: 'Basic', productName: products[0]?.name || '', startDate: new Date().toISOString().split('T')[0], expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split('T')[0] }); }} className="flex-1 rounded-lg border px-4 py-2 text-sm font-medium" style={{ borderColor: '#c9cccf', color: '#6d7175' }}>{t('cancel', { defaultValue: 'Cancel' })}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerSubscriptionsPage;
