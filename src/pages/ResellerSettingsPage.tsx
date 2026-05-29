import { useState } from 'react';
import { Save, Copy, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

const ResellerSettingsPage = () => {
  const { t } = useTranslation('common');
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name ?? 'Partner',
    email: user?.email ?? '',
    website: '',
    phone: '',
    bio: '',
  });

  const [notifications, setNotifications] = useState({
    newLead: true,
    conversion: true,
    paymentReceived: true,
    weeklyReport: false,
  });

  const referralCode = 'MYCODE123';
  const referralLink = `https://saashub.io/ref/${referralCode}`;

  const saveProfile = () => { setSaved(true); toast.success(t('saved', { defaultValue: 'Saved' })); setTimeout(() => setSaved(false), 2000); };
  const copyLink = () => { navigator.clipboard.writeText(referralLink).catch(() => {}); setCopied(true); toast.success(t('copied', { defaultValue: 'Copied' })); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-semibold" style={{ color: '#1a1a1a' }}>{t('settings', { defaultValue: 'Settings' })}</h2>
        <p className="text-sm mt-0.5" style={{ color: '#6d7175' }}>{t('settings_subtitle', { defaultValue: 'Manage your partner account and preferences' })}</p>
      </div>

      {/* Profile */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e1e3e5' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>{t('partner_profile', { defaultValue: 'Partner Profile' })}</h3>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: t('full_name', { defaultValue: 'Full Name' }), key: 'name', type: 'text' },
              { label: t('email', { defaultValue: 'Email' }), key: 'email', type: 'email' },
              { label: t('phone', { defaultValue: 'Phone' }), key: 'phone', type: 'text', placeholder: '+1-555-0000' },
              { label: t('website', { defaultValue: 'Website' }), key: 'website', type: 'text', placeholder: 'https://yoursite.com' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{f.label}</label>
                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  value={profile[f.key as keyof typeof profile]}
                  onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
                  className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
                />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('bio', { defaultValue: 'Bio' })}</label>
            <textarea
              placeholder={t('bio_placeholder', { defaultValue: 'Tell us about your business...' })},
              value={profile.bio}
              onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: '#c9cccf', color: '#1a1a1a' }}
            />
          </div>
        </div>
        <button onClick={saveProfile} className="mt-4 flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? t('saved_exclamation', { defaultValue: 'Saved!' }) : t('save_changes', { defaultValue: 'Save Changes' })}
        </button>
      </div>

      {/* Referral */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e1e3e5' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>{t('referral_program', { defaultValue: 'Referral Program' })}</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('your_referral_code', { defaultValue: 'Your Referral Code' })}</label>
            <code className="block rounded-lg px-3 py-2 text-sm font-mono" style={{ background: '#f6f6f7', color: '#1a1a1a' }}>{referralCode}</code>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#6d7175' }}>{t('referral_link', { defaultValue: 'Referral Link' })}</label>
            <div className="flex items-center gap-2">
              <code className="flex-1 rounded-lg px-3 py-2 text-sm font-mono truncate" style={{ background: '#f6f6f7', color: '#6d7175' }}>{referralLink}</code>
              <button onClick={copyLink} className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-white" style={{ background: '#008060' }}>
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? t('copied_exclamation', { defaultValue: 'Copied!' }) : t('copy', { defaultValue: 'Copy' })}
              </button>
            </div>
          </div>
          <div className="rounded-lg p-3" style={{ background: '#e4f3e8', border: '1px solid #b8dfc8' }}>
            <p className="text-xs font-medium" style={{ color: '#008060' }}>Commission Rate: 30% per sale</p>
            <p className="text-xs mt-0.5" style={{ color: '#6d7175' }}>Earn 30% commission on every subscription sold through your referral link.</p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#e1e3e5' }}>
        <h3 className="text-sm font-semibold mb-4" style={{ color: '#1a1a1a' }}>{t('notifications', { defaultValue: 'Notifications' })}</h3>
        <div className="space-y-3">
          {[
            { key: 'newLead', label: t('notification_new_referral', { defaultValue: 'New Referral' }), desc: t('notification_new_referral_desc', { defaultValue: 'Get notified when a new merchant signs up' }) },
            { key: 'conversion', label: t('notification_conversion', { defaultValue: 'Conversion' }), desc: t('notification_conversion_desc', { defaultValue: 'Get notified when a referral converts to paid' }) },
            { key: 'paymentReceived', label: t('notification_payment_received', { defaultValue: 'Payment Received' }), desc: t('notification_payment_received_desc', { defaultValue: 'Get notified when commission is credited' }) },
            { key: 'weeklyReport', label: t('notification_weekly_report', { defaultValue: 'Weekly Report' }), desc: t('notification_weekly_report_desc', { defaultValue: 'Receive a weekly summary of your performance' }) },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between py-2.5 border-b last:border-0" style={{ borderColor: '#f1f1f1' }}>
              <div>
                <p className="text-sm font-medium" style={{ color: '#1a1a1a' }}>{n.label}</p>
                <p className="text-xs" style={{ color: '#6d7175' }}>{n.desc}</p>
              </div>
              <button
                onClick={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key as keyof typeof prev] }))}
                className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors"
                style={{ background: notifications[n.key as keyof typeof notifications] ? '#008060' : '#c9cccf' }}
              >
                <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform"
                  style={{ transform: notifications[n.key as keyof typeof notifications] ? 'translateX(16px)' : 'translateX(4px)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResellerSettingsPage;
