import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  LayoutDashboard, ShoppingBag, CreditCard, Heart, Clock, LogOut,
  User, Bell, Shield, Settings as SettingsIcon, Package,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/brand/Logo';
import { Breadcrumb } from '@/components/common/Breadcrumb';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    ],
  },
  {
    label: 'Apps & Orders',
    items: [
      { to: '/dashboard/apps', label: 'My Apps', icon: Package },
      { to: '/dashboard/orders', label: 'Orders', icon: ShoppingBag },
      { to: '/dashboard/favorites', label: 'Favorites', icon: Heart },
      { to: '/dashboard/recent', label: 'Recent', icon: Clock },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/dashboard/profile', label: 'Profile', icon: User },
      { to: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
      { to: '/dashboard/billing', label: 'Billing', icon: CreditCard },
      { to: '/dashboard/licenses', label: 'Licenses', icon: Package },
      { to: '/dashboard/invoices', label: 'Invoices', icon: ShoppingBag },
      { to: '/dashboard/subscriptions', label: 'My Subscriptions', icon: CreditCard },
      { to: '/dashboard/refunds', label: 'Refunds', icon: Heart },
      { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
      { to: '/dashboard/security', label: 'Security', icon: Shield },
    ],
  },
];

const UserSidebar = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <NavLink to="/" className="flex items-center gap-2">
          <Logo variant="round" height={32} />
          {!collapsed && <span className="font-display text-base font-bold text-foreground">{t('app_name', { defaultValue: 'Software Vala' })}</span>}
        </NavLink>
      </SidebarHeader>

      {!collapsed && (
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground uppercase">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user?.name ?? 'User'}</p>
              <p className="truncate text-xs text-muted-foreground">{user?.email ?? ''}</p>
            </div>
          </div>
        </div>
      )}

      <SidebarContent>
        {groups.map(group => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map(item => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton asChild tooltip={item.label}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                      >
                        {({ isActive }: { isActive: boolean }) => (
                          <>
                            <item.icon className="h-4 w-4 shrink-0" />
                            <span>{item.label}</span>
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

      <SidebarFooter className="border-t border-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => { logout(); navigate('/'); }} tooltip="Logout">
              <LogOut className="h-4 w-4 shrink-0" />
              <span>{t('logout', { defaultValue: 'Logout' })}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const DashboardLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <UserSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 flex items-center border-b border-border bg-card px-2">
          <SidebarTrigger />
          <span className="ml-2 text-sm font-medium text-foreground">My Account</span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-4">
            <Breadcrumb />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default DashboardLayout;
