import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Briefcase,
  Video,
  DollarSign,
  Wallet,
  Trophy,
  BookOpen,
  MessageSquare,
  Bell,
  Settings,
  Search,
  Plus,
  Calendar,
  FileText,
  Phone,
  TrendingUp,
  Target,
  Award,
  Zap,
  BarChart3,
  CreditCard,
  Headphones,
  User,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Star,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Download,
  Share2,
  Send,
  Edit2,
  Trash2,
  MapPin,
  Badge,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Badge as BadgeComponent } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// NEXUS Color System
const NEXUS = {
  primary: '#0EA5E9',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#06B6D4',
  dark: '#1F2937',
  mute: '#6B7280',
  light: '#F3F4F6',
  cyan: '#06B6D4',
  emerald: '#10B981',
  violet: '#A855F7',
  amber: '#F59E0B',
  rose: '#F43F5E',
  indigo: '#6366F1',
};

export default function ResellerDashboardPage() {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeChat, setActiveChat] = useState(false);

  // Real Navigation Handlers
  const handleCreateLead = () => {
    toast.success('Opening Lead Form...');
    navigate('/reseller/leads');
  };
  const handleScheduleDemo = () => {
    toast.success('Opening Demo Scheduler...');
    navigate('/reseller/pipeline');
  };
  const handleCreateQuote = () => {
    toast.success('Opening Quote Creator...');
    navigate('/reseller/subscriptions');
  };
  const handleRequestPayout = () => {
    toast.success('Opening Payout Request...');
    navigate('/reseller/earnings');
  };
  
  const handleCallLead = (leadName) => {
    toast.success(`Calling ${leadName}... 📞`);
    // In a real app, this would integrate with a calling API
  };
  
  const handleScheduleLead = (leadName) => {
    toast.success(`Scheduling demo with ${leadName}... 📅`);
    navigate('/reseller/pipeline');
  };
  
  const handleJoinDemo = (demoName) => {
    toast.success(`Joining demo for ${demoName}... 🎥`);
    // In a real app, this would open a video conference
  };
  
  const handleEditDemo = (demoName) => {
    toast.success(`Editing demo: ${demoName} ✏️`);
    navigate('/reseller/pipeline');
  };
  
  const handleViewProduct = (productName) => {
    toast.success(`Viewing product: ${productName} 👀`);
    navigate('/reseller/products');
  };
  
  const handleDownloadProduct = (productName) => {
    toast.success(`Downloading ${productName}... ⬇️`);
  };
  
  const handleAddLead = () => {
    toast.info('Opening Lead Creation Form...');
    navigate('/reseller/leads');
  };
  const handleCreateLead2 = () => {
    toast.info('Opening Quote Form...');
    navigate('/reseller/subscriptions');
  };
  const handleScheduleDemo2 = () => {
    toast.info('Opening Demo Calendar...');
    navigate('/reseller/pipeline');
  };
  const handleAddCustomer = () => {
    toast.info('Opening Customer Form...');
    navigate('/reseller/contacts');
  };
  const handleRequestPayout2 = () => {
    toast.info('Opening Payout Request...');
    navigate('/reseller/earnings');
  };
  const handleMarketingAssets = () => {
    toast.info('Opening Marketing Assets...');
    // Navigate to marketing page if it exists, or show assets
  };
  const handleAIAssistant = () => {
    toast.info('Activating AI Assistant ✨');
    // Open AI chat interface
  };
  const handleUniversalChat = () => {
    toast.info('Opening Universal Chat 💬');
    // Open chat interface
  };
  const handleProfileClick = () => {
    toast.info('Opening profile settings...');
    navigate('/reseller/settings');
  };
  const handleSettingsClick = () => {
    toast.info('Opening settings...');
    navigate('/reseller/settings');
  };
  const handleAIButtonClick = () => {
    toast.info('AI Assistant activated ✨');
  };

  // Mock Data - Real API would be integrated here
  const resellerProfile = {
    name: 'Rajesh Kumar',
    id: 'RES-2024-001',
    photo: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh',
    rank: 'Diamond',
    level: 12,
    territory: 'North India',
    verification: 'Verified',
    monthlyRevenue: 125000,
    monthlyCommission: 18750,
  };

  const stats = {
    todaysLeads: 23,
    pendingFollowups: 8,
    upcomingDemos: 5,
    pendingQuotes: 12,
    newCustomers: 3,
    todaysSales: 4,
    monthlyRevenue: 125000,
    commissionEarned: 18750,
    walletBalance: 45000,
    pendingPayout: 8500,
    targetProgress: 78,
    amsProgress: 65,
  };

  const hotLeads = [
    {
      id: 1,
      name: 'Acme Corp',
      company: 'Acme Corporation',
      score: 95,
      status: 'Hot',
      revenue: 50000,
      contact: 'John Doe',
    },
    {
      id: 2,
      name: 'Tech Innovations',
      company: 'Tech Innovations Ltd',
      score: 88,
      status: 'Hot',
      revenue: 35000,
      contact: 'Sarah Smith',
    },
    {
      id: 3,
      name: 'Digital Ventures',
      company: 'Digital Ventures Inc',
      score: 82,
      status: 'Warm',
      revenue: 28000,
      contact: 'Mike Johnson',
    },
  ];

  const upcomingDemos = [
    {
      id: 1,
      customer: 'Acme Corp',
      product: 'Enterprise CRM System',
      date: '2024-06-15',
      time: '14:00',
      status: 'Scheduled',
    },
    {
      id: 2,
      customer: 'Tech Solutions',
      product: 'Project Management Tool',
      date: '2024-06-16',
      time: '10:00',
      status: 'Scheduled',
    },
    {
      id: 3,
      customer: 'Business Dynamics',
      product: 'Analytics Dashboard',
      date: '2024-06-17',
      time: '15:30',
      status: 'Pending',
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: 'Enterprise CRM',
      commission: '30%',
      sales: 45,
      revenue: 89250,
    },
    {
      id: 2,
      name: 'Project Manager',
      commission: '25%',
      sales: 32,
      revenue: 59840,
    },
    {
      id: 3,
      name: 'Analytics Suite',
      commission: '35%',
      sales: 18,
      revenue: 44800,
    },
  ];

  const pipelineStages = [
    { name: 'Lead', count: 23, amount: 120000 },
    { name: 'Contacted', count: 18, amount: 95000 },
    { name: 'Discussion', count: 14, amount: 78000 },
    { name: 'Demo', count: 9, amount: 52000 },
    { name: 'Proposal', count: 7, amount: 38000 },
    { name: 'Negotiation', count: 4, amount: 22000 },
    { name: 'Won', count: 2, amount: 12500 },
  ];

  const notifications = [
    { id: 1, type: 'lead', message: 'New lead: Acme Corp qualified', time: '5m ago' },
    { id: 2, type: 'demo', message: 'Demo completed: Tech Solutions', time: '2h ago' },
    { id: 3, type: 'commission', message: 'Commission approved: $2,500', time: '4h ago' },
    { id: 4, type: 'sale', message: 'Sale closed: Enterprise CRM', time: '1d ago' },
  ];

  const achievementCard = {
    currentRank: 'Diamond',
    level: 12,
    xpProgress: 65,
    latestBadge: 'Sales Master',
    latestTrophy: 'Million Dollar Club',
    nextAchievement: 'Platinum Status',
    hallOfFame: true,
  };

  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '#' },
    { icon: Users, label: 'Leads', href: '#' },
    { icon: ShoppingCart, label: 'Customers', href: '#' },
    { icon: Video, label: 'Demos', href: '#' },
    { icon: FileText, label: 'Quotes', href: '#' },
    { icon: Briefcase, label: 'Products', href: '#' },
    { icon: TrendingUp, label: 'Sales', href: '#' },
    { icon: Wallet, label: 'Wallet', href: '#' },
    { icon: Trophy, label: 'AMS', href: '#' },
    { icon: BookOpen, label: 'Training', href: '#' },
    { icon: Headphones, label: 'Support', href: '#' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Lead', color: 'bg-cyan-500' },
    { icon: Calendar, label: 'Schedule Demo', color: 'bg-emerald-500' },
    { icon: FileText, label: 'Create Quote', color: 'bg-amber-500' },
    { icon: Users, label: 'Add Customer', color: 'bg-violet-500' },
    { icon: CreditCard, label: 'Request Payout', color: 'bg-rose-500' },
    { icon: Download, label: 'Marketing Assets', color: 'bg-indigo-500' },
    { icon: Sparkles, label: 'AI Assistant', color: 'bg-pink-500' },
    { icon: MessageSquare, label: 'Universal Chat', color: 'bg-blue-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-950 border-r border-slate-700 transition-all duration-300 z-40 overflow-y-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Profile Section */}
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center gap-3 mb-4">
            <Avatar className="h-12 w-12 border-2 border-cyan-500">
              <AvatarImage src={resellerProfile.photo} />
              <AvatarFallback>{resellerProfile.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm truncate">{resellerProfile.name}</p>
              <p className="text-xs text-slate-400">{resellerProfile.id}</p>
            </div>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Rank:</span>
              <BadgeComponent variant="default" className="bg-amber-600">{resellerProfile.rank}</BadgeComponent>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Level:</span>
              <span className="text-cyan-400 font-bold">{resellerProfile.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Territory:</span>
              <span className="text-white flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {resellerProfile.territory}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status:</span>
              <BadgeComponent variant="default" className="bg-emerald-600">{resellerProfile.verification}</BadgeComponent>
            </div>
          </div>
        </div>

        {/* Revenue Display */}
        <div className="p-4 bg-gradient-to-b from-cyan-950 to-transparent">
          <div className="mb-3">
            <p className="text-xs text-slate-400 mb-1">Monthly Revenue</p>
            <p className="text-2xl font-bold text-cyan-400">₹{(resellerProfile.monthlyRevenue / 100000).toFixed(1)}L</p>
          </div>
          <div>
            <p className="text-xs text-slate-400 mb-1">Monthly Commission</p>
            <p className="text-xl font-bold text-emerald-400">₹{(resellerProfile.monthlyCommission / 1000).toFixed(0)}K</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.href)}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-cyan-400 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Quick Actions Grid */}
        <div className="p-4 space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase">Quick Actions</p>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === 'Add Lead') handleAddLead();
                  else if (action.label === 'Schedule Demo') handleScheduleDemo2();
                  else if (action.label === 'Create Quote') handleCreateLead2();
                  else if (action.label === 'Add Customer') handleAddCustomer();
                  else if (action.label === 'Request Payout') handleRequestPayout2();
                  else if (action.label === 'Marketing Assets') handleMarketingAssets();
                  else if (action.label === 'AI Assistant') handleAIAssistant();
                  else if (action.label === 'Universal Chat') handleUniversalChat();
                }}
                className={`${action.color} hover:opacity-90 text-white rounded-lg p-3 flex flex-col items-center justify-center gap-2 transition-opacity`}
              >
                <action.icon className="h-5 w-5" />
                <span className="text-xs font-bold text-center">{action.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* AMS Achievement Card */}
        <div className="p-4">
          <Card className="bg-gradient-to-br from-violet-900 to-indigo-900 border-violet-700">
            <CardContent className="p-4">
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Trophy className="h-4 w-4 text-amber-400" />
                AMS Status
              </h4>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs text-slate-200">{achievementCard.currentRank}</span>
                    <span className="text-xs font-bold text-cyan-300">L{achievementCard.level}</span>
                  </div>
                  <Progress value={achievementCard.xpProgress} className="h-2" />
                </div>
                <div className="pt-2 border-t border-violet-700">
                  <p className="text-xs text-slate-300 mb-1">Latest: <span className="text-amber-300">{achievementCard.latestBadge}</span></p>
                  <p className="text-xs text-slate-300">Next: <span className="text-cyan-300">{achievementCard.nextAchievement}</span></p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
        {/* TOP BAR */}
        <header className="sticky top-0 z-30 border-b border-slate-700 bg-slate-950/95 backdrop-blur-sm">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="Global search..."
                  className="pl-10 h-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="font-bold text-white">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div key={notif.id} className="p-3 border-b border-slate-700 last:border-0 hover:bg-slate-700 transition-colors">
                          <p className="text-sm text-white">{notif.message}</p>
                          <p className="text-xs text-slate-400">{notif.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Chat */}
              <button
                onClick={() => setActiveChat(!activeChat)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <MessageSquare className="h-5 w-5" />
              </button>

              {/* AI Assistant */}
              <button onClick={handleAIButtonClick} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                <Sparkles className="h-5 w-5 text-pink-500" />
              </button>

              {/* Profile */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                <Avatar className="h-8 w-8 border border-cyan-500">
                  <AvatarImage src={resellerProfile.photo} />
                  <AvatarFallback>{resellerProfile.name[0]}</AvatarFallback>
                </Avatar>
                <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                  <Settings className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <main className="p-6 space-y-6">
          {/* HERO BANNER */}
          <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 rounded-xl p-8 text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -mr-48 -mt-48"></div>
            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Monthly Business Command Center</h1>
              <p className="text-blue-100 mb-6">Track leads, close deals, earn commissions, and grow your business</p>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Monthly Revenue</p>
                  <p className="text-2xl font-bold">₹{(stats.monthlyRevenue / 100000).toFixed(1)}L</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Sales</p>
                  <p className="text-2xl font-bold">{stats.todaysSales}</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Commission</p>
                  <p className="text-2xl font-bold">₹{(stats.commissionEarned / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Pending</p>
                  <p className="text-2xl font-bold">₹{(stats.pendingPayout / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Wallet</p>
                  <p className="text-2xl font-bold">₹{(stats.walletBalance / 1000).toFixed(0)}K</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Target Progress</p>
                  <p className="text-2xl font-bold">{stats.targetProgress}%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">AMS Progress</p>
                  <p className="text-2xl font-bold">{stats.amsProgress}%</p>
                </div>
                <div>
                  <p className="text-blue-100 text-sm mb-1">Rank</p>
                  <p className="text-2xl font-bold">{resellerProfile.rank}</p>
                </div>
              </div>

              <div className="flex gap-3 flex-wrap">
                <Button onClick={handleCreateLead} className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="h-4 w-4 mr-2" /> Create Lead
                </Button>
                <Button onClick={handleCreateQuote} className="bg-white/20 hover:bg-white/30 border border-white/30">
                  <FileText className="h-4 w-4 mr-2" /> Create Quote
                </Button>
                <Button onClick={handleScheduleDemo} className="bg-white/20 hover:bg-white/30 border border-white/30">
                  <Calendar className="h-4 w-4 mr-2" /> Schedule Demo
                </Button>
                <Button onClick={handleRequestPayout} className="bg-white/20 hover:bg-white/30 border border-white/30">
                  <CreditCard className="h-4 w-4 mr-2" /> Request Payout
                </Button>
              </div>
            </div>
          </div>

          {/* SECTION 01: HOT LEADS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="h-6 w-6 text-amber-500" />
                Hot Leads
              </h2>
              <Button variant="outline" size="sm">
                View All <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <ScrollArea className="w-full rounded-lg">
              <div className="flex gap-4 pb-4">
                {hotLeads.map((lead) => (
                  <Card key={lead.id} className="flex-shrink-0 w-80 bg-slate-800 border-slate-700 hover:border-cyan-500 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-white">{lead.name}</h4>
                          <p className="text-sm text-slate-400">{lead.company}</p>
                        </div>
                        <BadgeComponent variant="default" className={lead.status === 'Hot' ? 'bg-red-600' : 'bg-orange-600'}>
                          {lead.score} Score
                        </BadgeComponent>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Expected Revenue</span>
                          <span className="text-emerald-400 font-bold">₹{(lead.revenue / 1000).toFixed(0)}K</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Contact</span>
                          <span className="text-white">{lead.contact}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleCallLead(lead.name)} size="sm" variant="default" className="flex-1 bg-cyan-600 hover:bg-cyan-700">
                          <Phone className="h-3 w-3 mr-1" /> Call
                        </Button>
                        <Button onClick={() => handleScheduleLead(lead.name)} size="sm" variant="outline">
                          <Calendar className="h-3 w-3 mr-1" /> Demo
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* SECTION 02: UPCOMING DEMOS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Video className="h-6 w-6 text-emerald-500" />
                Upcoming Demos
              </h2>
              <Button variant="outline" size="sm">
                Calendar <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <ScrollArea className="w-full rounded-lg">
              <div className="flex gap-4 pb-4">
                {upcomingDemos.map((demo) => (
                  <Card key={demo.id} className="flex-shrink-0 w-80 bg-slate-800 border-slate-700 hover:border-emerald-500 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-bold text-white">{demo.customer}</h4>
                          <p className="text-sm text-slate-400">{demo.product}</p>
                        </div>
                        <BadgeComponent variant="default" className="bg-emerald-600">
                          {demo.status}
                        </BadgeComponent>
                      </div>
                      <div className="space-y-2 mb-4 text-sm">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Calendar className="h-4 w-4" />
                          {demo.date} at {demo.time}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleJoinDemo(demo.customer)} size="sm" variant="default" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                          <Eye className="h-3 w-3 mr-1" /> Join Demo
                        </Button>
                        <Button onClick={() => handleEditDemo(demo.customer)} size="sm" variant="outline">
                          <Edit2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* SECTION 03: TOP SELLING PRODUCTS */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="h-6 w-6 text-violet-500" />
                Top Selling Products
              </h2>
              <Button variant="outline" size="sm">
                All Products <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <ScrollArea className="w-full rounded-lg">
              <div className="flex gap-4 pb-4">
                {topProducts.map((product) => (
                  <Card key={product.id} className="flex-shrink-0 w-80 bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border-violet-700 hover:border-violet-500 transition-colors">
                    <CardContent className="p-4">
                      <div className="mb-4">
                        <h4 className="font-bold text-white mb-2">{product.name}</h4>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Commission Rate</span>
                            <span className="text-amber-400 font-bold">{product.commission}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Sales</span>
                            <span className="text-cyan-400 font-bold">{product.sales}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-300">Revenue Generated</span>
                            <span className="text-emerald-400 font-bold">₹{(product.revenue / 1000).toFixed(0)}K</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => handleViewProduct(product.name)} size="sm" variant="default" className="flex-1 bg-violet-600 hover:bg-violet-700">
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button onClick={() => handleDownloadProduct(product.name)} size="sm" variant="outline">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* SECTION 04: CUSTOMER PIPELINE (KANBAN) */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-indigo-500" />
                Customer Pipeline
              </h2>
              <Button variant="outline" size="sm">
                View Details <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {pipelineStages.map((stage, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 hover:border-slate-500 transition-colors">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-3">{stage.name}</h4>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-cyan-400">{stage.count}</div>
                      <div className="text-sm text-slate-400">₹{(stage.amount / 100000).toFixed(1)}L</div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* TABS FOR OTHER SECTIONS */}
          <Tabs defaultValue="sales" className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-slate-800 border border-slate-700">
              <TabsTrigger value="sales">Sales Performance</TabsTrigger>
              <TabsTrigger value="commission">Commission</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
              <TabsTrigger value="targets">Targets</TabsTrigger>
              <TabsTrigger value="ams">AMS</TabsTrigger>
              <TabsTrigger value="training">Training</TabsTrigger>
            </TabsList>

            {/* SALES PERFORMANCE */}
            <TabsContent value="sales" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Today's Sales</p>
                    <p className="text-3xl font-bold text-cyan-400">{stats.todaysSales}</p>
                    <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +2 vs yesterday
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Weekly Sales</p>
                    <p className="text-3xl font-bold text-emerald-400">18</p>
                    <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
                      <ArrowUpRight className="h-3 w-3" /> +15% growth
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Conversion Rate</p>
                    <p className="text-3xl font-bold text-amber-400">32%</p>
                    <div className="text-xs text-slate-400 mt-2">Industry: 28%</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Top Product</p>
                    <p className="text-lg font-bold text-white">Enterprise CRM</p>
                    <div className="text-xs text-slate-400 mt-2">45 sales</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Revenue Growth</p>
                    <p className="text-3xl font-bold text-green-400">+32%</p>
                    <div className="text-xs text-emerald-400 mt-2">vs last month</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* COMMISSION CENTER */}
            <TabsContent value="commission" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-gradient-to-br from-amber-900/50 to-orange-900/50 border-amber-700">
                  <CardContent className="p-4">
                    <p className="text-slate-300 text-sm mb-2">Total Commission</p>
                    <p className="text-3xl font-bold text-amber-400">₹{(stats.commissionEarned / 1000).toFixed(0)}K</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 border-yellow-700">
                  <CardContent className="p-4">
                    <p className="text-slate-300 text-sm mb-2">Pending Commission</p>
                    <p className="text-3xl font-bold text-yellow-400">₹5,200</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-700">
                  <CardContent className="p-4">
                    <p className="text-slate-300 text-sm mb-2">Approved Commission</p>
                    <p className="text-3xl font-bold text-emerald-400">₹12,500</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-900/50 to-blue-900/50 border-cyan-700">
                  <CardContent className="p-4">
                    <p className="text-slate-300 text-sm mb-2">Paid Commission</p>
                    <p className="text-3xl font-bold text-cyan-400">₹7,800</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-pink-900/50 to-rose-900/50 border-pink-700">
                  <CardContent className="p-4">
                    <p className="text-slate-300 text-sm mb-2">Bonus Commission</p>
                    <p className="text-3xl font-bold text-rose-400">₹2,250</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* WALLET CENTER */}
            <TabsContent value="wallet" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Current Balance</p>
                    <p className="text-3xl font-bold text-cyan-400">₹{(stats.walletBalance / 1000).toFixed(0)}K</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Pending Balance</p>
                    <p className="text-3xl font-bold text-amber-400">₹{(stats.pendingPayout / 1000).toFixed(0)}K</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Bonus Balance</p>
                    <p className="text-3xl font-bold text-emerald-400">₹3,500</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-2">Reward Balance</p>
                    <p className="text-3xl font-bold text-violet-400">₹1,200</p>
                  </CardContent>
                </Card>
                <Button onClick={handleRequestPayout2} className="bg-emerald-600 hover:bg-emerald-700 h-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </div>
            </TabsContent>

            {/* TARGET CENTER */}
            <TabsContent value="targets" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-3">Daily Target</p>
                    <Progress value={85} className="mb-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">₹8,500</span>
                      <span className="text-emerald-400">₹10,000</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-3">Weekly Target</p>
                    <Progress value={72} className="mb-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">₹72,000</span>
                      <span className="text-amber-400">₹100,000</span>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <p className="text-slate-400 text-sm mb-3">Monthly Target</p>
                    <Progress value={stats.targetProgress} className="mb-2" />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">₹97,500</span>
                      <span className="text-cyan-400">₹125,000</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* AMS CENTER */}
            <TabsContent value="ams" className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-amber-900 to-orange-900 border-amber-700">
                  <CardContent className="p-4">
                    <Badge className="bg-amber-700 mb-3">Current Rank</Badge>
                    <p className="text-3xl font-bold text-amber-400">Diamond</p>
                    <p className="text-sm text-amber-200 mt-2">Hall of Fame Eligible ⭐</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-cyan-900 to-blue-900 border-cyan-700">
                  <CardContent className="p-4">
                    <Badge className="bg-cyan-700 mb-3">Level Progress</Badge>
                    <p className="text-3xl font-bold text-cyan-400">L12</p>
                    <Progress value={stats.amsProgress} className="mt-3" />
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-violet-900 to-purple-900 border-violet-700">
                  <CardContent className="p-4">
                    <Badge className="bg-violet-700 mb-3">Latest Badge</Badge>
                    <p className="text-lg font-bold text-violet-300">Sales Master</p>
                    <p className="text-sm text-violet-200 mt-2">🏅 Earned last month</p>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-rose-900 to-pink-900 border-rose-700">
                  <CardContent className="p-4">
                    <Badge className="bg-rose-700 mb-3">Achievements</Badge>
                    <p className="text-3xl font-bold text-rose-400">23</p>
                    <p className="text-sm text-rose-200 mt-2">+5 this quarter</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* TRAINING CENTER */}
            <TabsContent value="training" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-cyan-500" />
                      Active Courses
                    </h4>
                    <p className="text-3xl font-bold text-cyan-400">5</p>
                    <p className="text-sm text-slate-400 mt-2">3 completed • 2 in progress</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Award className="h-5 w-5 text-emerald-500" />
                      Certifications
                    </h4>
                    <p className="text-3xl font-bold text-emerald-400">12</p>
                    <p className="text-sm text-slate-400 mt-2">Latest: Advanced Sales</p>
                  </CardContent>
                </Card>
                <Card className="bg-slate-800 border-slate-700">
                  <CardContent className="p-4">
                    <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-500" />
                      Leaderboard Rank
                    </h4>
                    <p className="text-3xl font-bold text-amber-400">#8</p>
                    <p className="text-sm text-slate-400 mt-2">Top 1% nationwide</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* SECTION 12: MARKETING CENTER */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <Share2 className="h-6 w-6 text-pink-500" />
                Marketing Center
              </h2>
              <Button variant="outline" size="sm">
                All Assets <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                  <Download className="h-8 w-8 text-pink-500 mb-2" />
                  <p className="font-bold text-white text-center text-sm">Banner Library</p>
                  <p className="text-xs text-slate-400 mt-1">45 assets</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                  <Download className="h-8 w-8 text-pink-500 mb-2" />
                  <p className="font-bold text-white text-center text-sm">Video Library</p>
                  <p className="text-xs text-slate-400 mt-1">32 videos</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                  <Download className="h-8 w-8 text-pink-500 mb-2" />
                  <p className="font-bold text-white text-center text-sm">Social Media</p>
                  <p className="text-xs text-slate-400 mt-1">156 creatives</p>
                </CardContent>
              </Card>
              <Card className="bg-slate-800 border-slate-700 hover:border-pink-500 transition-colors cursor-pointer">
                <CardContent className="p-6 flex flex-col items-center justify-center h-32">
                  <Download className="h-8 w-8 text-pink-500 mb-2" />
                  <p className="font-bold text-white text-center text-sm">Sales Scripts</p>
                  <p className="text-xs text-slate-400 mt-1">24 templates</p>
                </CardContent>
              </Card>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
