import { ImageIcon, Link2, Mail, Copy, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { api } from '@/lib/api';

interface Asset { icon: typeof ImageIcon; name: string; desc: string; ext: string; }

const ResellerMarketingPage = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [referral, setReferral] = useState('https://saashub.app/?ref=partner-2847');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [assetsData, referralData] = await Promise.all([
          api.get<Asset[]>('/reseller/marketing-assets'),
          api.get<{ url: string }>('/reseller/referral-link')
        ]);
        if (assetsData) setAssets(assetsData);
        if (referralData?.url) setReferral(referralData.url);
      } catch (error) {
        console.error('Failed to fetch marketing data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading marketing assets...</div>;
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(referral);
      setCopied(true);
      toast.success('Referral link copied');
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error('Could not copy. Copy manually.');
    }
  };

  const download = (a: Asset) => {
    const content = `${a.name}\n${a.desc}\nDownloaded ${new Date().toISOString()}\n`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const safe = a.name.replace(/[^\w\d-]+/g, '_');
    const link = document.createElement('a');
    link.href = url; link.download = `${safe}.${a.ext}`;
    document.body.appendChild(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success(`${a.name} downloaded`);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1" style={{ color: '#1a1a1a' }}>Marketing assets</h1>
      <p className="text-sm mb-6" style={{ color: '#6d7175' }}>Banners, email templates, and your referral link.</p>
      <div className="rounded-lg bg-white border p-5 mb-4" style={{ borderColor: '#e1e3e5' }}>
        <div className="flex items-center gap-2 mb-2">
          <Link2 className="h-4 w-4" style={{ color: '#008060' }} />
          <h2 className="text-sm font-semibold" style={{ color: '#1a1a1a' }}>Your referral link</h2>
        </div>
        <div className="flex gap-2">
          <input
            readOnly
            value={referral}
            onFocus={e => e.currentTarget.select()}
            className="flex-1 px-3 py-2 text-sm rounded border bg-gray-50"
            style={{ borderColor: '#e1e3e5', color: '#1a1a1a' }}
          />
          <button
            onClick={copy}
            className="px-3 py-2 rounded text-sm font-medium text-white flex items-center gap-1.5 transition-colors"
            style={{ background: copied ? '#006e52' : '#008060' }}
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {assets.map(a => (
          <div key={a.name} className="rounded-lg bg-white border p-4 flex items-start justify-between" style={{ borderColor: '#e1e3e5' }}>
            <div className="flex gap-3">
              <a.icon className="h-8 w-8" style={{ color: '#008060' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{a.name}</p>
                <p className="text-xs" style={{ color: '#6d7175' }}>{a.desc}</p>
              </div>
            </div>
            <button onClick={() => download(a)} className="text-xs font-medium hover:underline" style={{ color: '#008060' }}>Download</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ResellerMarketingPage;
