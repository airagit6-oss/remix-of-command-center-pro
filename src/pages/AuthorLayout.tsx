import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import {
  Compass, Package, Rocket, BarChart2, DollarSign, KeyRound, HardDrive, Download,
  Search, Star, LifeBuoy, GitBranch, Cpu, Wallet, Settings, LogOut, Sparkles, Radio,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';

const groups = [
  {
    label: 'Studio',
    items: [
      { to: '/author/dashboard',  label: 'Dashboard',  icon: Compass },
      { to: '/author/products',   label: 'Products',   icon: Package },
      { to: '/author/releases',   label: 'Releases',   icon: GitBranch },
      { to: '/author/deployments',label: 'Deployments',icon: Rocket },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/author/analytics', label: 'Analytics', icon: BarChart2 },
      { to: '/author/downloads', label: 'Downloads', icon: Download },
      { to: '/author/seo',       label: 'SEO',       icon: Search },
      { to: '/author/ai-scans',  label: 'AI scans',  icon: Cpu },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/author/revenue',  label: 'Revenue',  icon: DollarSign },
      { to: '/author/payouts',  label: 'Payouts',  icon: Wallet },
      { to: '/author/licenses', label: 'Licenses', icon: KeyRound },
    ],
  },
  {
    label: 'Operations',
    items: [
      { to: '/author/storage', label: 'Storage / CDN', icon: HardDrive },
      { to: '/author/reviews', label: 'Reviews',       icon: Star },
      { to: '/author/support', label: 'Support',       icon: LifeBuoy },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/author/settings', label: 'Settings', icon: Settings },
    ],
  },
];

const AuthorSidebar = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-border p-4">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative h-8 w-8 shrink-0 grid place-items-center rounded-lg bg-gradient-to-br from-cyan-500 to-fuchsia-500 shadow-[0_0_18px_-4px_rgba(217,70,239,0.6)]">
            <Sparkles className="h-3.5 w-3.5 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-background animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold bg-gradient-to-r from-cyan-200 via-white to-fuchsia-200 bg-clip-text text-transparent">Author Studio</span>
              <span className="text-[9px] uppercase tracking-[0.18em] text-cyan-300/60">Publishing OS</span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      {!collapsed && (
        <div className="p-3 border-b border-border">
          <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-fuchsia-500/10 border border-cyan-500/20 px-3 py-2">
            <p className="text-[10px] font-semibold text-cyan-300 uppercase tracking-wider mb-0.5 flex items-center gap-1">
              <Radio className="h-3 w-3 animate-pulse" /> Author · Live
            </p>
            <p className="truncate text-sm font-medium text-foreground">{user?.name ?? 'Author'}</p>
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
                        className={({ isActive }) =>
                          `flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                            isActive
                              ? 'bg-gradient-to-r from-cyan-500/20 to-fuchsia-500/10 text-foreground border border-cyan-500/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`
                        }
                      >
                        <item.icon className="h-3.5 w-3.5 shrink-0" />
                        <span>{item.label}</span>
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
              <span>Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

const AuthorLayout = () => (
  <SidebarProvider>
    <div className="min-h-screen flex w-full bg-background">
      <AuthorSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 shrink-0 flex items-center border-b border-border bg-card/60 backdrop-blur px-2 gap-2">
          <SidebarTrigger />
          <span className="text-sm font-medium text-foreground">Author Studio</span>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] text-emerald-300">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            realtime channel
          </span>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  </SidebarProvider>
);

export default AuthorLayout;