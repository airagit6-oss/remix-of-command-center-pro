// @ts-nocheck
import { NavLink, Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import {
  LayoutDashboard, Users, UserPlus, Kanban, BookUser, CreditCard,
  Package, TrendingUp, Settings, LogOut, Bell, Search,
  Store, HelpCircle, ExternalLink, Percent, FileBarChart, Megaphone, History, MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ResellerProvider } from '@/contexts/ResellerContext';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/brand/Logo';
import { Breadcrumb } from '@/components/common/Breadcrumb';

const getGroups = (t: any) => [
  {
    label: t('overview', { defaultValue: 'Overview' }),
    items: [
      { to: '/reseller/dashboard', label: t('dashboard', { defaultValue: 'Dashboard' }), icon: LayoutDashboard },
    ],
  },
  {
    label: t('sales', { defaultValue: 'Sales' }),
    items: [
      { to: '/reseller/leads', label: t('leads', { defaultValue: 'Leads' }), icon: UserPlus, badge: '6' },
      { to: '/reseller/referrals', label: t('referrals', { defaultValue: 'Referrals' }), icon: Users },
      { to: '/reseller/pipeline', label: t('pipeline', { defaultValue: 'Pipeline' }), icon: Kanban },
      { to: '/reseller/contacts', label: t('clients', { defaultValue: 'Clients' }), icon: BookUser },
    ],
  },
  {
    label: t('business', { defaultValue: 'Business' }),
    items: [
      { to: '/reseller/users', label: t('managed_stores', { defaultValue: 'Managed Stores' }), icon: Store },
      { to: '/reseller/subscriptions', label: t('subscriptions', { defaultValue: 'Subscriptions' }), icon: CreditCard },
      { to: '/reseller/products', label: t('apps', { defaultValue: 'Apps' }), icon: Package },
    ],
  },
  {
    label: t('earnings', { defaultValue: 'Earnings' }),
    items: [
      { to: '/reseller/earnings', label: t('payouts', { defaultValue: 'Payouts' }), icon: TrendingUp },
      { to: '/reseller/commissions', label: t('commissions', { defaultValue: 'Commissions' }), icon: Percent },
      { to: '/reseller/payouts-history', label: t('payout_history', { defaultValue: 'Payout history' }), icon: History },
    ],
  },
  {
    label: t('resources', { defaultValue: 'Resources' }),
    items: [
      { to: '/reseller/marketing', label: t('marketing_assets', { defaultValue: 'Marketing assets' }), icon: Megaphone },
      { to: '/reseller/reports', label: t('reports', { defaultValue: 'Reports' }), icon: FileBarChart },
    ],
  },
  {
    label: t('account', { defaultValue: 'Account' }),
    items: [
      { to: '/reseller/chat', label: t('chat', { defaultValue: 'Chat' }), icon: MessageSquare },
      { to: '/reseller/settings', label: t('settings', { defaultValue: 'Settings' }), icon: Settings },
    ],
  },
];

const ResellerSidebar = () => {
  const { t } = useTranslation('common');
  const groups = getGroups(t);
  const allItems = groups.flatMap(g => g.items);

  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className="border-r-0">
      <div className="flex flex-col h-full" style={{ background: '#1a1a1a' }}>
        <SidebarHeader className="px-4 py-4">
          <NavLink to="/" className="flex items-center gap-2.5 group">
            {collapsed ? (
              <Logo variant="round" height={32} />
            ) : (
              <div className="flex items-center gap-2.5">
                <Logo variant="round" height={32} />
                <div>
                  <span className="text-[13px] font-semibold text-white block leading-tight">Software Vala</span>
                  <span className="text-[10px] text-white/60 leading-tight tracking-wider uppercase">The Name of Trust</span>
                </div>
              </div>
            )}
          </NavLink>
        </SidebarHeader>

        {!collapsed && (
          <div className="mx-3 mb-2 rounded-lg px-3 py-2.5" style={{ background: '#2a2a2a' }}>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: '#008060' }}>
                {(user?.name ?? t('defaultPartner', { defaultValue: 'Partner' }))[0].toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-medium text-white truncate">{user?.name ?? t('defaultPartner', { defaultValue: 'Partner' })}</p>
                <p className="text-[10px] text-white/40 truncate">{user?.email ?? t('defaultEmail', { defaultValue: 'user@example.com' })}</p>
              </div>
            </div>
          </div>
        )}

        <SidebarContent className="px-2">
          {groups.map(group => (
            <SidebarGroup key={group.label}>
              {!collapsed && (
                <SidebarGroupLabel className="text-white/40 text-[10px] uppercase tracking-wider px-3 mb-1">
                  {group.label}
                </SidebarGroupLabel>
              )}
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map(item => (
                    <SidebarMenuItem key={item.to}>
                      <SidebarMenuButton asChild tooltip={item.label}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium transition-all ${
                              isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                            }`
                          }
                          style={({ isActive }) => isActive ? { background: '#333333' } : {}}
                        >
                          {({ isActive }: { isActive: boolean }) => (
                            <>
                              <item.icon className="h-[16px] w-[16px] shrink-0" style={isActive ? { color: '#008060' } : {}} />
                              <span>{item.label}</span>
                              {'badge' in item && item.badge && !collapsed && (
                                <span className="ml-auto text-[10px] font-semibold rounded-full px-1.5 py-0.5" style={{ background: '#008060', color: 'white' }}>
                                  {item.badge}
                                </span>
                              )}
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter className="border-t p-2 space-y-0.5" style={{ borderColor: '#333' }}>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
          >
            <ExternalLink className="h-[16px] w-[16px] shrink-0" />
            {!collapsed && <span>{t('visit_marketplace', { defaultValue: 'Visit Marketplace' })}</span>}
          </NavLink>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-[7px] text-[13px] font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-all"
          >
            <LogOut className="h-[16px] w-[16px] shrink-0" />
            {!collapsed && <span>{t('log_out', { defaultValue: 'Log out' })}</span>}
          </button>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
};

const ResellerLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { t } = useTranslation('common');
  const groups = getGroups(t);
  const allItems = groups.flatMap(g => g.items);
  const currentPage = allItems.find(n => location.pathname.startsWith(n.to));
  const pageTitle = currentPage?.label ?? t('partner_dashboard', { defaultValue: 'Partner Dashboard' });
  const matches = searchQuery.trim()
    ? allItems.filter(item => item.label.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    : [];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full" style={{ background: '#f6f6f7' }}>
        <ResellerSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 shrink-0 flex items-center justify-between px-4 bg-white border-b" style={{ borderColor: '#e1e3e5' }}>
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <h1 className="text-[15px] font-semibold" style={{ color: '#1a1a1a' }}>{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              {searchOpen && (
                <div className="relative">
                  <input
                    autoFocus
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && matches[0]) navigate(matches[0].to); }}
                    placeholder={t('search_pages_placeholder', { defaultValue: 'Search pages...' })}
                    className="h-8 w-48 rounded-lg border px-3 text-[13px] outline-none"
                    style={{ borderColor: '#e1e3e5', color: '#1a1a1a' }}
                  />
                  {matches.length > 0 && (
                    <div className="absolute right-0 top-9 z-50 w-48 rounded-lg border bg-white py-1 shadow-lg" style={{ borderColor: '#e1e3e5' }}>
                      {matches.map(item => (
                        <Link key={item.to} to={item.to} onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="block px-3 py-2 text-[13px] hover:bg-gray-100" style={{ color: '#1a1a1a' }}>
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <button onClick={() => setSearchOpen(!searchOpen)} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label={t('search', { defaultValue: 'Search' })}>
                <Search className="h-4 w-4" style={{ color: '#6d7175' }} />
              </button>
              <button onClick={() => navigate('/dashboard/notifications')} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors relative" aria-label={t('notifications', { defaultValue: 'Notifications' })}>
                <Bell className="h-4 w-4" style={{ color: '#6d7175' }} />
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: '#e51c00' }} />
              </button>
              <button onClick={() => window.open('https://softwarevala.net/support', '_blank', 'noopener')} className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors" aria-label={t('help', { defaultValue: 'Help' })}>
                <HelpCircle className="h-4 w-4" style={{ color: '#6d7175' }} />
              </button>
            </div>
          </header>
          <ResellerProvider>
            <main className="flex-1 overflow-auto p-6">
              <div className="mb-4">
                <Breadcrumb />
              </div>
              <Outlet />
            </main>
          </ResellerProvider>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ResellerLayout;