import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

interface Payout {
  date: string;
  method: string;
  ref: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Failed';
}

const ResellerPayoutsHistoryPage = () => {
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayouts = async () => {
      try {
        setLoading(true);
        const data = await api.get<Payout[]>('/reseller/payouts');
        setPayouts(data || []);
      } catch (error) {
        console.error('Failed to fetch payouts:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayouts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading payouts...</div>;
  }

  return (
  <div>
    <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>Payouts history</h1>
    <p className="text-sm mb-6" style={{ color: '#6d7175' }}>All past payouts to your account.</p>
    <div className="rounded-lg bg-white border overflow-hidden" style={{ borderColor: '#e1e3e5' }}>
      <table className="w-full text-sm">
        <thead style={{ background: '#f6f6f7' }}>
          <tr className="text-left" style={{ color: '#6d7175' }}>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Date</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Method</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Reference</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-right">Amount</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y" style={{ color: '#1a1a1a' }}>
          {payouts.map(p => (
            <tr key={p.ref}>
              <td className="px-5 py-3">{p.date}</td>
              <td className="px-5 py-3">{p.method}</td>
              <td className="px-5 py-3 font-mono text-xs">{p.ref}</td>
              <td className="px-5 py-3 text-right font-semibold">{p.amount}</td>
              <td className="px-5 py-3"><span className="text-xs px-2 py-0.5 rounded" style={{ background: '#e3f5e9', color: '#008060' }}>{p.status}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};
export default ResellerPayoutsHistoryPage;
