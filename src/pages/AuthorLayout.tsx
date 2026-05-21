import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import {
  Compass, Package, Rocket, BarChart2, DollarSign, KeyRound, HardDrive, Download,
  Search, Star, LifeBuoy, GitBranch, Cpu, Wallet, Settings, LogOut, Sparkles, Radio,
  Upload, Bell, MessageSquare, Users, Megaphone, ShieldCheck, FileText, TrendingUp,
  Receipt, Command as CommandIcon, Plus, Activity, Layers, BadgeCheck, Globe,
  Trophy, Crown, IdCard, Palette, KeySquare, Gift, UserCircle2,
  Eye, Bot, Wand2, Play, Repeat,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
  SidebarHeader, SidebarFooter, useSidebar,
} from '@/components/ui/sidebar';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { LivePulseDock } from '@/pages/author/AuthorPagesPremium';

const groups = [
  {
    label: 'Overview',
    items: [
      { to: '/author/dashboard', label: 'Dashboard', icon: Compass },
      { to: '/author/notifications', label: 'Notifications', icon: Bell },
      { to: '/author/activity', label: 'Activity', icon: Activity },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { to: '/author/products',    label: 'Products',        icon: Package },
      { to: '/author/upload',      label: 'Upload Center',   icon: Upload },
      { to: '/author/upload/new',  label: 'Upload Wizard',   icon: Sparkles },
      { to: '/author/updates',     label: 'Product Updates', icon: GitBranch },
      { to: '/author/releases',    label: 'Releases',        icon: Rocket },
      { to: '/author/deployments', label: 'Deployments',     icon: Activity },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { to: '/author/reviews',   label: 'Reviews & Ratings',    icon: Star },
      { to: '/author/comments',  label: 'Comments & Support',   icon: MessageSquare },
      { to: '/author/chat',      label: 'Chat Center',          icon: MessageSquare },
      { to: '/author/support',   label: 'Support Inbox',        icon: LifeBuoy },
      { to: '/author/followers', label: 'Followers',            icon: Users },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { to: '/author/live',       label: 'Live Visitors',    icon: Eye },
      { to: '/author/sales',      label: 'Sales Analytics',  icon: BarChart2 },
      { to: '/author/insights',   label: 'Revenue Insights', icon: TrendingUp },
      { to: '/author/downloads',  label: 'Downloads',        icon: Download },
      { to: '/author/seo',        label: 'SEO Tools',        icon: Search },
      { to: '/author/ai-seo',     label: 'AI SEO Optimizer', icon: Wand2 },
      { to: '/author/ai-assistant', label: 'AI Assistant',   icon: Bot },
      { to: '/author/ai-insights',label: 'AI Insights',      icon: Sparkles },
      { to: '/author/ai-scans',   label: 'AI Scans',         icon: Cpu },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { to: '/author/revenue',   label: 'Earnings',      icon: DollarSign },
      { to: '/author/payouts',   label: 'Payouts',       icon: Wallet },
      { to: '/author/subscriptions', label: 'Subscriptions', icon: Repeat },
      { to: '/author/tax',       label: 'Tax Invoices',  icon: Receipt },
      { to: '/author/licenses',  label: 'Licenses',      icon: KeyRound },
      { to: '/author/customers', label: 'Customers',     icon: BadgeCheck },
    ],
  },
  {
    label: 'Growth',
    items: [
      { to: '/author/marketing', label: 'Marketing', icon: Megaphone },
      { to: '/author/affiliate', label: 'Affiliate',     icon: Gift },
      { to: '/author/ranking',   label: 'Marketplace rank', icon: Trophy },
      { to: '/author/reputation',label: 'Reputation',    icon: Trophy },
      { to: '/author/achievements', label: 'Achievements', icon: Crown },
    ],
  },
  {
    label: 'System',
    items: [
      { to: '/author/profile',  label: 'Creator Profile', icon: UserCircle2 },
      { to: '/author/verification', label: 'Verification', icon: IdCard },
      { to: '/author/kyc',       label: 'KYC',            icon: ShieldCheck },
      { to: '/author/demos',     label: 'Demos',          icon: Play },
      { to: '/author/changelog', label: 'Changelog',      icon: GitBranch },
      { to: '/author/team',     label: 'Team',          icon: Users },
      { to: '/author/workspace',label: 'Workspace',     icon: Palette },
      { to: '/author/api-keys', label: 'API keys',      icon: KeySquare },
      { to: '/author/security', label: 'Security',     icon: ShieldCheck },
      { to: '/author/storage',  label: 'Storage / CDN', icon: HardDrive },
      { to: '/author/settings', label: 'Settings',     icon: Settings },
    ],
  },
];

const allNavItems = groups.flatMap(g => g.items);

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
            <p className="text-[10px] text-muted-foreground truncate">{user?.email ?? 'author@studio'}</p>
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

/* ---------- Command bar (⌘K) ---------- */
function AuthorCommandBar({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const filtered = useMemo(
    () => allNavItems.filter(i => i.label.toLowerCase().includes(q.toLowerCase())),
    [q],
  );
  useEffect(() => { if (open) setQ(''); }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 overflow-hidden bg-card/95 backdrop-blur-2xl border-cyan-500/20">
        <DialogHeader className="sr-only">
          <DialogTitle>Author command bar</DialogTitle>
          <DialogDescription>Jump to any page in Author Studio</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b border-border px-3 py-2.5">
          <Search className="h-4 w-4 text-cyan-300" />
          <input
            autoFocus
            placeholder="Jump to product, page, action…"
            value={q}
            onChange={e => setQ(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
          />
          <kbd className="text-[10px] px-1.5 py-0.5 rounded border border-border text-muted-foreground">esc</kbd>
        </div>
        <ul className="max-h-72 overflow-auto py-1">
          {filtered.map(item => (
            <li key={item.to}>
              <button
                onClick={() => { onOpenChange(false); navigate(item.to); }}
                className="w-full text-left px-3 py-2 text-sm flex items-center gap-2 text-foreground hover:bg-gradient-to-r hover:from-cyan-500/10 hover:to-fuchsia-500/10"
              >
                <item.icon className="h-3.5 w-3.5 text-cyan-300" />
                <span>{item.label}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{item.to}</span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-6 text-center text-xs text-muted-foreground">No matches.</li>
          )}
        </ul>
        <div className="border-t border-border px-3 py-2 text-[10px] text-muted-foreground flex items-center justify-between">
          <span>Author Studio · Quick navigate</span>
          <span className="inline-flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-fuchsia-300" /> AI command palette
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ---------- Header ---------- */
function AuthorHeader({ onOpenCommand }: { onOpenCommand: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);
  useEffect(() => { const id = setInterval(() => setTick(t => t + 1), 3500); return () => clearInterval(id); }, []);
  const todaySales = 482 + (tick % 9) * 3;
  const todayEarn  = 1240 + (tick % 5) * 7;

  const notifications = [
    { icon: Star,        title: '3 new 5-star reviews', meta: 'last 1h' },
    { icon: DollarSign,  title: 'Payout queued · $12,840', meta: 'Fri 09:00 UTC' },
    { icon: ShieldCheck, title: 'AI scan passed — Hospital ERP v1.4.2', meta: '4m ago' },
    { icon: LifeBuoy,    title: '2 support tickets awaiting reply', meta: 'priority high' },
  ];

  return (
    <header className="h-14 shrink-0 flex items-center border-b border-border bg-card/70 backdrop-blur-xl px-3 gap-2 sticky top-0 z-30">
      <SidebarTrigger />

      {/* Search / command */}
      <button
        onClick={onOpenCommand}
        className="hidden md:flex items-center gap-2 flex-1 max-w-md rounded-lg border border-border bg-background/60 hover:border-cyan-500/30 hover:bg-background/80 px-3 py-1.5 text-xs text-muted-foreground transition"
      >
        <Search className="h-3.5 w-3.5 text-cyan-300" />
        <span>Search products, pages, AI actions…</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <CommandIcon className="h-3 w-3" /> <kbd className="text-[10px]">K</kbd>
        </span>
      </button>

      <div className="flex-1 md:flex-none" />

      {/* Earnings quick stats */}
      <div className="hidden lg:flex items-center gap-2 mr-1">
        <div className="rounded-md border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 text-[11px] text-emerald-300 inline-flex items-center gap-1.5">
          <DollarSign className="h-3 w-3" />
          <span className="tabular-nums">${todayEarn.toLocaleString()}</span>
          <span className="text-emerald-300/60">today</span>
        </div>
        <div className="rounded-md border border-cyan-500/20 bg-cyan-500/5 px-2.5 py-1 text-[11px] text-cyan-300 inline-flex items-center gap-1.5">
          <Activity className="h-3 w-3 animate-pulse" />
          <span className="tabular-nums">{todaySales}</span>
          <span className="text-cyan-300/60">sales</span>
        </div>
      </div>

      {/* Upload quick action */}
      <Link
        to="/author/upload/new"
        className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-cyan-500 to-fuchsia-500 px-3 py-1.5 text-xs font-medium text-white shadow-[0_0_18px_-6px_rgba(34,211,238,0.6)] hover:opacity-90 transition"
      >
        <Plus className="h-3.5 w-3.5" /> Upload
      </Link>

      {/* AI assistant */}
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('saashub:open-chat'))}
        title="AI assistant"
        className="h-8 w-8 grid place-items-center rounded-md border border-fuchsia-500/30 bg-fuchsia-500/10 text-fuchsia-300 hover:bg-fuchsia-500/20"
      >
        <Sparkles className="h-3.5 w-3.5" />
      </button>

      {/* Notifications */}
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative h-8 w-8 grid place-items-center rounded-md border border-border bg-background/60 text-muted-foreground hover:text-foreground hover:border-cyan-500/30">
            <Bell className="h-3.5 w-3.5" />
            <span className="absolute -top-1 -right-1 h-3.5 min-w-3.5 px-1 rounded-full bg-fuchsia-500 text-[9px] text-white grid place-items-center">{notifications.length}</span>
          </button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80 p-0 bg-card/95 backdrop-blur-2xl border-cyan-500/20">
          <div className="px-3 py-2 border-b border-border flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground">Notifications</span>
            <span className="text-[10px] text-emerald-300 inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> live
            </span>
          </div>
          <ul className="max-h-80 overflow-auto divide-y divide-border">
            {notifications.map((n, i) => (
              <li key={i} className="px-3 py-2 hover:bg-accent/40 transition flex items-start gap-2">
                <span className="h-7 w-7 shrink-0 grid place-items-center rounded-md border border-cyan-500/20 bg-cyan-500/10 text-cyan-300">
                  <n.icon className="h-3.5 w-3.5" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs text-foreground truncate">{n.title}</div>
                  <div className="text-[10px] text-muted-foreground">{n.meta}</div>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-border px-3 py-2 text-center">
            <Link to="/author/dashboard" className="text-[11px] text-cyan-300 hover:underline">View activity stream →</Link>
          </div>
        </PopoverContent>
      </Popover>

      {/* Realtime status */}
      <div className="hidden sm:inline-flex items-center gap-1.5 text-[10px] text-emerald-300 px-2 py-1 rounded-md border border-emerald-500/20 bg-emerald-500/5">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        realtime
      </div>

      {/* Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="h-8 px-2 inline-flex items-center gap-2 rounded-md border border-border bg-background/60 hover:border-cyan-500/30">
            <span className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-500 to-fuchsia-500 grid place-items-center text-[10px] font-semibold text-white">
              {(user?.name ?? 'A').slice(0, 1).toUpperCase()}
            </span>
            <span className="hidden sm:inline text-xs text-foreground max-w-[80px] truncate">{user?.name ?? 'Author'}</span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-card/95 backdrop-blur-2xl border-cyan-500/20">
          <DropdownMenuLabel className="flex flex-col">
            <span className="text-xs">{user?.name ?? 'Author'}</span>
            <span className="text-[10px] text-muted-foreground truncate">{user?.email ?? '—'}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/author/settings')}>
            <Settings className="mr-2 h-3.5 w-3.5" /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/author/payouts')}>
            <Wallet className="mr-2 h-3.5 w-3.5" /> Payouts
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/author/security')}>
            <ShieldCheck className="mr-2 h-3.5 w-3.5" /> Security
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/')}>
            <Globe className="mr-2 h-3.5 w-3.5" /> Marketplace
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
            <LogOut className="mr-2 h-3.5 w-3.5" /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}

const AuthorLayout = () => {
  const [cmdOpen, setCmdOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen(o => !o);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AuthorSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AuthorHeader onOpenCommand={() => setCmdOpen(true)} />
          <main className="flex-1 overflow-auto p-4 md:p-6">
            <Outlet />
          </main>
        </div>
        <AuthorCommandBar open={cmdOpen} onOpenChange={setCmdOpen} />
        <LivePulseDock />
      </div>
    </SidebarProvider>
  );
};

export default AuthorLayout;
