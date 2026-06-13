import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Star, Share2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { approvalsStore } from '@/lib/approvalsStore';

const benefits = (t: any) => [
  { icon: Users, title: t('large_audience', { defaultValue: 'Large Audience' }), desc: t('large_audience_desc', { defaultValue: 'Monetize your followers and influence' }) },
  { icon: TrendingUp, title: t('commission_35', { defaultValue: '35% Commission' }), desc: t('commission_35_desc', { defaultValue: 'Earn on every sale from your referrals' }) },
  { icon: Share2, title: t('easy_sharing', { defaultValue: 'Easy Sharing' }), desc: t('easy_sharing_desc', { defaultValue: 'Get trackable links and analytics' }) },
];

const InfluencerApplyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    platform: '',
    followers: '',
    niches: '',
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return;
    if (form.message.trim().length < 5) return;
    approvalsStore.add({
      kind: 'influencer',
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      platform: form.platform.trim() || undefined,
      followers: form.followers.trim() || undefined,
      niches: form.niches.trim() || undefined,
      message: form.message.trim(),
      rate: 35,
    });
    setSubmitted(true);
    setTimeout(() => navigate('/'), 3000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-4 text-5xl">🎉</div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('application_submitted', { defaultValue: 'Application Submitted!' })}</h1>
          <p className="text-muted-foreground mb-6">
            {t('application_review', { defaultValue: "We'll review your application and get back to you within 24–48 hours." })}
          </p>
          <Link to="/" className="rounded-lg bg-primary px-6 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
            {t('back_to_home', { defaultValue: 'Back to Home' })}
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = 'w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary transition-colors';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold text-foreground">Software Vala</Link>
        <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
          {t('sign_in', { defaultValue: 'Sign in' })}
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">{t('become_influencer', { defaultValue: 'Become an Influencer Partner' })}</h1>
          <p className="text-lg text-muted-foreground">
            {t('influencer_intro', { defaultValue: 'Turn your audience into revenue by promoting Software Vala to your followers.' })}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {benefits(t).map(b => (
            <div key={b.title} className="rounded-xl border border-border bg-card p-5 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>

        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-border bg-card p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">{t('apply_now', { defaultValue: 'Apply Now' })}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('full_name', { defaultValue: 'Full Name' })}</label>
                <input type="text" required placeholder={t('your_name_placeholder', { defaultValue: 'Your name' })} className={inputClass}
                  value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('email', { defaultValue: 'Email' })}</label>
                <input type="email" required placeholder={t('email_placeholder', { defaultValue: 'email@domain.com' })} className={inputClass}
                  value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('phone', { defaultValue: 'Phone' })}</label>
                <input type="tel" placeholder={t('phone_placeholder', { defaultValue: '+1 (555) 000-0000' })} className={inputClass}
                  value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('platform', { defaultValue: 'Primary Platform' })}</label>
                <input type="text" placeholder={t('platform_placeholder', { defaultValue: 'e.g., YouTube, TikTok, Instagram' })} className={inputClass}
                  value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('followers', { defaultValue: 'Follower Count' })}</label>
                <input type="text" placeholder={t('followers_placeholder', { defaultValue: 'e.g., 100K, 1M, 5M+' })} className={inputClass}
                  value={form.followers} onChange={e => setForm(f => ({ ...f, followers: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('niches', { defaultValue: 'Your Niches' })}</label>
                <textarea placeholder={t('niches_placeholder', { defaultValue: 'Tech, Business, Lifestyle, etc...' })} className={`${inputClass} min-h-20 resize-none`}
                  value={form.niches} onChange={e => setForm(f => ({ ...f, niches: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('message', { defaultValue: 'Message' })}</label>
                <textarea required placeholder={t('message_placeholder', { defaultValue: 'Tell us about your audience and why you want to collaborate...' })} className={`${inputClass} min-h-24 resize-none`}
                  value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <button type="submit" className="w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
                {t('submit_application', { defaultValue: 'Submit Application' })}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfluencerApplyPage;
