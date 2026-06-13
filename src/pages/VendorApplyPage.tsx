import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, BarChart3, Globe, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { approvalsStore } from '@/lib/approvalsStore';

const benefits = (t: any) => [
  { icon: Package, title: t('list_products', { defaultValue: 'List Your Products' }), desc: t('list_products_desc', { defaultValue: 'Reach 900K+ users with our marketplace' }) },
  { icon: BarChart3, title: t('commission_40', { defaultValue: '40% Commission' }), desc: t('commission_40_desc', { defaultValue: 'Earn on every sale through our platform' }) },
  { icon: Globe, title: t('global_reach', { defaultValue: 'Global Reach' }), desc: t('global_reach_desc', { defaultValue: 'Sell to customers worldwide' }) },
];

const VendorApplyPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    company: '',
    website: '',
    products: '',
    message: '' 
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.name.trim().length < 2) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) return;
    if (form.message.trim().length < 5) return;
    approvalsStore.add({
      kind: 'vendor',
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim() || undefined,
      company: form.company.trim() || undefined,
      website: form.website.trim() || undefined,
      products: form.products.trim() || undefined,
      message: form.message.trim(),
      rate: 40,
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
          <h1 className="text-4xl font-bold text-foreground mb-3">{t('become_vendor', { defaultValue: 'Become a Vendor' })}</h1>
          <p className="text-lg text-muted-foreground">
            {t('vendor_intro', { defaultValue: 'List your products on our premium marketplace and access 900K+ customers worldwide.' })}
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
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('company_name', { defaultValue: 'Company Name' })}</label>
                <input type="text" placeholder={t('company_placeholder', { defaultValue: 'Your company' })} className={inputClass}
                  value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('website', { defaultValue: 'Website' })}</label>
                <input type="url" placeholder={t('website_placeholder', { defaultValue: 'https://yourcompany.com' })} className={inputClass}
                  value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('products', { defaultValue: 'What products do you sell?' })}</label>
                <textarea placeholder={t('products_placeholder', { defaultValue: 'Describe your products, categories, and services...' })} className={`${inputClass} min-h-20 resize-none`}
                  value={form.products} onChange={e => setForm(f => ({ ...f, products: e.target.value }))} />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">{t('message', { defaultValue: 'Message' })}</label>
                <textarea required placeholder={t('message_placeholder', { defaultValue: 'Tell us why you want to become a vendor...' })} className={`${inputClass} min-h-24 resize-none`}
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

export default VendorApplyPage;
