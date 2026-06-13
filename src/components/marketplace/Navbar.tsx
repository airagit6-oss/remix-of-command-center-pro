// @ts-nocheck
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search, ShoppingCart, User, X, LogIn, LogOut, Users, Menu, Crown,
  LayoutDashboard, Globe, DollarSign, MessageCircle, Heart, Bell, Check, Sparkles,
} from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Logo } from '@/components/brand/Logo';

type Lang = { code: string; label: string; nativeName?: string };

// 125 supported languages - LOAD FROM SUPPORTED_LANGUAGES ARRAY
const LANGS: Lang[] = [
  { code: 'en', label: 'English', nativeName: 'English' },
  { code: 'es', label: 'Spanish', nativeName: 'Español' },
  { code: 'fr', label: 'French', nativeName: 'Français' },
  { code: 'de', label: 'German', nativeName: 'Deutsch' },
  { code: 'it', label: 'Italian', nativeName: 'Italiano' },
  { code: 'pt', label: 'Portuguese', nativeName: 'Português' },
  { code: 'ru', label: 'Russian', nativeName: 'Русский' },
  { code: 'ja', label: 'Japanese', nativeName: '日本語' },
  { code: 'zh', label: 'Chinese', nativeName: '中文' },
  { code: 'ko', label: 'Korean', nativeName: '한국어' },
  { code: 'ar', label: 'Arabic', nativeName: 'العربية' },
  { code: 'hi', label: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'vi', label: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'id', label: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', label: 'Thai', nativeName: 'ไทย' },
  { code: 'tr', label: 'Turkish', nativeName: 'Türkçe' },
  { code: 'pl', label: 'Polish', nativeName: 'Polski' },
  { code: 'nl', label: 'Dutch', nativeName: 'Nederlands' },
  { code: 'sv', label: 'Swedish', nativeName: 'Svenska' },
  { code: 'no', label: 'Norwegian', nativeName: 'Norsk' },
  { code: 'da', label: 'Danish', nativeName: 'Dansk' },
  { code: 'fi', label: 'Finnish', nativeName: 'Suomi' },
  { code: 'el', label: 'Greek', nativeName: 'Ελληνικά' },
  { code: 'ro', label: 'Romanian', nativeName: 'Română' },
  { code: 'cs', label: 'Czech', nativeName: 'Čeština' },
  { code: 'hu', label: 'Hungarian', nativeName: 'Magyar' },
  { code: 'sk', label: 'Slovak', nativeName: 'Slovenčina' },
  { code: 'uk', label: 'Ukrainian', nativeName: 'Українська' },
  { code: 'be', label: 'Belarusian', nativeName: 'Беларусская' },
  { code: 'he', label: 'Hebrew', nativeName: 'עברית' },
  { code: 'fa', label: 'Persian', nativeName: 'فارسی' },
  { code: 'ur', label: 'Urdu', nativeName: 'اردو' },
  { code: 'pa', label: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' },
  { code: 'bn', label: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', label: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', label: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'kn', label: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', label: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'my', label: 'Burmese', nativeName: 'မြန်မာ' },
  { code: 'km', label: 'Khmer', nativeName: 'ខ្មែរ' },
  { code: 'lo', label: 'Lao', nativeName: 'ລາວ' },
  { code: 'am', label: 'Amharic', nativeName: 'አማርኛ' },
  { code: 'af', label: 'Afrikaans', nativeName: 'Afrikaans' },
  { code: 'sq', label: 'Albanian', nativeName: 'Shqip' },
  { code: 'hy', label: 'Armenian', nativeName: 'Հայերեն' },
  { code: 'az', label: 'Azerbaijani', nativeName: 'Azərbaycanca' },
  { code: 'eu', label: 'Basque', nativeName: 'Euskera' },
  { code: 'bg', label: 'Bulgarian', nativeName: 'Български' },
  { code: 'ca', label: 'Catalan', nativeName: 'Català' },
  { code: 'ceb', label: 'Cebuano', nativeName: 'Cebuano' },
  { code: 'ny', label: 'Chichewa', nativeName: 'Chichewa' },
  { code: 'zh-CN', label: 'Chinese (Simplified)', nativeName: '简体中文' },
  { code: 'zh-TW', label: 'Chinese (Traditional)', nativeName: '繁體中文' },
  { code: 'co', label: 'Corsican', nativeName: 'Corsu' },
  { code: 'hr', label: 'Croatian', nativeName: 'Hrvatski' },
  { code: 'eo', label: 'Esperanto', nativeName: 'Esperanto' },
  { code: 'et', label: 'Estonian', nativeName: 'Eesti' },
  { code: 'tl', label: 'Filipino', nativeName: 'Tagalog' },
  { code: 'fy', label: 'Frisian', nativeName: 'Frysk' },
  { code: 'gl', label: 'Galician', nativeName: 'Galego' },
  { code: 'ka', label: 'Georgian', nativeName: 'ქართული' },
  { code: 'gu', label: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'ht', label: 'Haitian Creole', nativeName: 'Kreyòl Ayisyen' },
  { code: 'ha', label: 'Hausa', nativeName: 'Hausa' },
  { code: 'haw', label: 'Hawaiian', nativeName: 'Ōlelo Hawaiʻi' },
  { code: 'hmn', label: 'Hmong', nativeName: 'Hmoob' },
  { code: 'is', label: 'Icelandic', nativeName: 'Íslenska' },
  { code: 'ig', label: 'Igbo', nativeName: 'Igbo' },
  { code: 'ga', label: 'Irish', nativeName: 'Gaeilge' },
  { code: 'jw', label: 'Javanese', nativeName: 'Jawa' },
  { code: 'kk', label: 'Kazakh', nativeName: 'Қазақша' },
  { code: 'rw', label: 'Kinyarwanda', nativeName: 'Ikinyarwanda' },
  { code: 'ku', label: 'Kurdish', nativeName: 'Kurdî' },
  { code: 'ckb', label: 'Kurdish (Sorani)', nativeName: 'سۆرانی' },
  { code: 'ky', label: 'Kyrgyz', nativeName: 'Кыргызча' },
  { code: 'lv', label: 'Latvian', nativeName: 'Latviešu' },
  { code: 'lt', label: 'Lithuanian', nativeName: 'Lietuvių' },
  { code: 'lb', label: 'Luxembourgish', nativeName: 'Lëtzebuergesch' },
  { code: 'mk', label: 'Macedonian', nativeName: 'Македонски' },
  { code: 'mg', label: 'Malagasy', nativeName: 'Malagasy' },
  { code: 'ms', label: 'Malay', nativeName: 'Melayu' },
  { code: 'mt', label: 'Maltese', nativeName: 'Malti' },
  { code: 'mi', label: 'Maori', nativeName: 'Te Reo Māori' },
  { code: 'mr', label: 'Marathi', nativeName: 'मराठी' },
  { code: 'mn', label: 'Mongolian', nativeName: 'Монгол' },
  { code: 'ne', label: 'Nepali', nativeName: 'नेपाली' },
  { code: 'ps', label: 'Pashto', nativeName: 'پښتو' },
  { code: 'so', label: 'Somali', nativeName: 'Soomaali' },
  { code: 'st', label: 'Southern Sotho', nativeName: 'Sesotho' },
  { code: 'su', label: 'Sundanese', nativeName: 'Basa Sunda' },
  { code: 'sw', label: 'Swahili', nativeName: 'Kiswahili' },
  { code: 'tg', label: 'Tajik', nativeName: 'Тоҷикӣ' },
  { code: 'tt', label: 'Tatar', nativeName: 'Татарча' },
  { code: 'yo', label: 'Yoruba', nativeName: 'Yorùbá' },
  { code: 'zu', label: 'Zulu', nativeName: 'isiZulu' },
];

type Cur = { code: string; symbol: string; label: string };
const CURRENCIES: Cur[] = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'AED', symbol: 'د.إ', label: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', label: 'Saudi Riyal' },
  { code: 'PKR', symbol: '₨', label: 'Pakistani Rupee' },
  { code: 'BDT', symbol: '৳', label: 'Bangladeshi Taka' },
  { code: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', label: 'Kenyan Shilling' },
  { code: 'ZAR', symbol: 'R', label: 'South African Rand' },
];

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export const Navbar = ({ onToggleSidebar }: NavbarProps) => {
  const { totalItems, items, showMiniCart, setShowMiniCart, removeFromCart, totalPrice } = useCart();
  const { isLoggedIn, isAdmin, isReseller, logout } = useAuth();
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openMenu, setOpenMenu] = useState<null | 'lang' | 'cur' | 'chat' | 'notif' | 'profile'>(null);
  const [lang, setLang] = useState<string>(() => localStorage.getItem('saashub_lang') || 'en');
  const [currency, setCurrency] = useState<string>(() => localStorage.getItem('saashub_currency') || 'USD');
  const [langQuery, setLangQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Initialize i18n with saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('saashub_lang') || 'en';
    if (i18n.language !== savedLang) {
      i18n.changeLanguage(savedLang);
      setLang(savedLang);
    }
    
    // Set document direction for RTL languages
    const rtlLanguages = ['ar', 'ar-EG', 'ar-MA', 'ar-TN', 'ar-DZ', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-SA', 'fa', 'ur', 'ps', 'he', 'ku', 'ckb'];
    const isRTL = rtlLanguages.some(rtlLang => savedLang.startsWith(rtlLang));
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLang;
  }, [i18n]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!wrapRef.current) return;
      if (!wrapRef.current.contains(e.target as Node)) setOpenMenu(null);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const pickLang = (code: string) => {
    setLang(code);
    localStorage.setItem('saashub_lang', code);
    i18n.changeLanguage(code);
    
    // Set document direction for RTL languages
    const rtlLanguages = ['ar', 'ar-EG', 'ar-MA', 'ar-TN', 'ar-DZ', 'ar-JO', 'ar-LB', 'ar-SY', 'ar-SA', 'fa', 'ur', 'ps', 'he', 'ku', 'ckb'];
    const isRTL = rtlLanguages.some(rtlLang => code.startsWith(rtlLang));
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = code;
    
    window.dispatchEvent(new CustomEvent('saashub:language', { detail: code }));
    setOpenMenu(null);
  };
  const pickCurrency = (code: string) => {
    setCurrency(code);
    localStorage.setItem('saashub_currency', code);
    window.dispatchEvent(new CustomEvent('saashub:currency', { detail: code }));
    setOpenMenu(null);
  };

  const activeLang = LANGS.find(l => l.code === lang) || LANGS[0];
  const activeCur = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  const filteredLangs = LANGS.filter(l =>
    l.label.toLowerCase().includes(langQuery.toLowerCase()) || l.code.includes(langQuery.toLowerCase()),
  );

  // Fetch real data from API
  const [wishlistCount, setWishlistCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [unreadChat, setUnreadChat] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    // Fetch wishlist count from API
    const fetchWishlistCount = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/wishlist/count', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setWishlistCount(data.count || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch wishlist count:', error);
      }
    };

    // Fetch notification count from API
    const fetchNotifCount = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/notifications/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setNotifCount(data.count || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notification count:', error);
      }
    };

    // Fetch notifications from API
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/notifications?limit=5', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setNotifications(data.notifications || []);
          }
        }
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    // Fetch unread chat count from API
    const fetchUnreadChat = async () => {
      try {
        const token = localStorage.getItem('saashub_token');
        if (token) {
          const response = await fetch('/api/v1/chat/unread-count', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.ok) {
            const data = await response.json();
            setUnreadChat(data.count || 0);
          }
        }
      } catch (error) {
        console.error('Failed to fetch chat count:', error);
      }
    };

    if (isLoggedIn) {
      fetchWishlistCount();
      fetchNotifCount();
      fetchNotifications();
      fetchUnreadChat();
    }
  }, [isLoggedIn]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  const iconBtn = "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.55)]";
  const badge = "absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 px-1 text-[9px] font-bold text-background shadow-[0_0_10px_rgba(34,211,238,0.7)]";

  return (
    <>
      <nav
        ref={wrapRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-all duration-300 ${
          scrolled
            ? 'border-white/10 bg-background/75 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]'
            : 'border-white/5 bg-background/60'
        }`}
      >
        {/* Top neon hairline */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="flex h-16 items-center justify-between px-6">
          {/* Left: Menu + Logo */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className={iconBtn}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <Logo variant="horizontal" height={36} className="hidden sm:block" />
              <Logo variant="round" height={36} className="sm:hidden" />
            </Link>
          </div>

          {/* Center: Search */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearch} className="group relative flex w-full items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 backdrop-blur-md transition-all focus-within:border-cyan-400/40 focus-within:bg-white/[0.07] focus-within:shadow-[0_0_28px_-6px_rgba(34,211,238,0.45)]">
              <Search className="h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-cyan-300" />
              <input
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search 900+ categories, apps, AI tools…"
              />
              <kbd className="hidden md:inline-flex items-center rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">⌘K</kbd>
            </form>
          </div>

          {/* Right */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`flex md:hidden ${iconBtn}`}
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Apply Now Dropdown */}
            <div className="relative flex">
              <button
                onClick={() => setOpenMenu(openMenu === 'apply' ? null : 'apply')}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:border-cyan-400/40 hover:text-foreground hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.5)]"
              >
                <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
                Apply Now
              </button>
              {openMenu === 'apply' && (
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
                  <div className="border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Select Role
                  </div>
                  <div className="p-1">
                    <Link
                      to="/reseller-apply"
                      onClick={() => setOpenMenu(null)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5 text-foreground"
                    >
                      <span className="font-medium">Reseller</span>
                      <span className="text-[9px] text-muted-foreground">30% commission</span>
                    </Link>
                    <Link
                      to="/franchise-apply"
                      onClick={() => setOpenMenu(null)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5 text-foreground"
                    >
                      <span className="font-medium">Franchise</span>
                      <span className="text-[9px] text-muted-foreground">50% commission</span>
                    </Link>
                    <Link
                      to="/vendor-apply"
                      onClick={() => setOpenMenu(null)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5 text-foreground"
                    >
                      <span className="font-medium">Vendor</span>
                      <span className="text-[9px] text-muted-foreground">40% commission</span>
                    </Link>
                    <Link
                      to="/influencer-apply"
                      onClick={() => setOpenMenu(null)}
                      className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs transition-colors hover:bg-white/5 text-foreground"
                    >
                      <span className="font-medium">Influencer</span>
                      <span className="text-[9px] text-muted-foreground">35% commission</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="mx-1 hidden md:block h-6 w-px bg-white/10" />

            {/* Language */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'lang' ? null : 'lang')}
                className={`${iconBtn} flex`}
                aria-label="Language"
              >
                <Globe className="h-4 w-4" />
                <span className="absolute -bottom-0.5 right-0 text-[8px] font-bold text-cyan-300">{activeLang.code.toUpperCase()}</span>
              </button>
              {openMenu === 'lang' && (
                <div className="absolute right-0 top-12 z-50 w-72 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
                  <div className="border-b border-white/10 p-2">
                    <div className="flex items-center gap-2 rounded-lg bg-white/5 px-2.5 py-1.5">
                      <Search className="h-3.5 w-3.5 text-muted-foreground" />
                      <input
                        autoFocus
                        value={langQuery}
                        onChange={e => setLangQuery(e.target.value)}
                        placeholder="Search 125+ languages…"
                        className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                      />
                    </div>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1">
                    {filteredLangs.map(l => (
                      <button
                        key={l.code}
                        onClick={() => pickLang(l.code)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-white/5 ${
                          l.code === lang ? 'text-cyan-300' : 'text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="font-medium">{l.label}</span>
                          <span className="text-[10px] uppercase text-muted-foreground">{l.code}</span>
                        </span>
                        {l.code === lang && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                    {filteredLangs.length === 0 && (
                      <p className="px-3 py-4 text-center text-xs text-muted-foreground">No language found</p>
                    )}
                  </div>
                  <div className="border-t border-white/10 px-3 py-2 text-[10px] text-muted-foreground">
                    🌍 Auto-detected from your region · Realtime translation
                  </div>
                </div>
              )}
            </div>

            {/* Currency */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'cur' ? null : 'cur')}
                className={`${iconBtn} flex`}
                aria-label="Currency"
              >
                <DollarSign className="h-4 w-4" />
                <span className="absolute -bottom-0.5 right-0 text-[8px] font-bold text-fuchsia-300">{activeCur.code}</span>
              </button>
              {openMenu === 'cur' && (
                <div className="absolute right-0 top-12 z-50 w-64 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
                  <div className="border-b border-white/10 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    Select currency · Live FX
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1">
                    {CURRENCIES.map(c => (
                      <button
                        key={c.code}
                        onClick={() => pickCurrency(c.code)}
                        className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-xs transition-colors hover:bg-white/5 ${
                          c.code === currency ? 'text-fuchsia-300' : 'text-foreground'
                        }`}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="flex h-6 w-7 items-center justify-center rounded-md border border-white/10 bg-white/5 text-xs font-bold">{c.symbol}</span>
                          <span className="font-medium">{c.code}</span>
                          <span className="text-[10px] text-muted-foreground">{c.label}</span>
                        </span>
                        {c.code === currency && <Check className="h-3.5 w-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Live Chat */}
            <button
              onClick={() => window.dispatchEvent(new Event('saashub:open-chat'))}
              className={iconBtn}
              aria-label="Live chat"
            >
              <MessageCircle className="h-4 w-4" />
              {unreadChat > 0 && <span className={badge}>{unreadChat}</span>}
            </button>

            {/* Wishlist */}
            <Link to="/dashboard/favorites" className={iconBtn} aria-label="Wishlist">
              <Heart className="h-4 w-4" />
              {wishlistCount > 0 && <span className={badge}>{wishlistCount}</span>}
            </Link>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === 'notif' ? null : 'notif')}
                className={iconBtn}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                {notifCount > 0 && <span className={badge}>{notifCount}</span>}
              </button>
              {openMenu === 'notif' && (
                <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
                  <div className="flex items-center justify-between border-b border-white/10 px-3 py-2.5">
                    <span className="text-xs font-semibold text-foreground">Notifications</span>
                    <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-medium text-cyan-300">{notifCount} new</span>
                  </div>
                  <div className="max-h-80 divide-y divide-white/5 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="flex gap-3 px-3 py-2.5 transition-colors hover:bg-white/5">
                          <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-gradient-to-br from-cyan-400 to-fuchsia-500 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-foreground">{n.title}</p>
                            <p className="truncate text-[10px] text-muted-foreground">{n.message}</p>
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="px-3 py-4 text-center text-xs text-muted-foreground">No notifications</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Cart */}
            <Link
              to="/cart"
              className={iconBtn}
              aria-label="Cart"
            >
              <ShoppingCart className="h-4 w-4" />
              {totalItems > 0 && <span className={badge}>{totalItems}</span>}
            </Link>

            {/* Profile */}
            <div className="relative ml-1">
              <button
                onClick={() => setOpenMenu(openMenu === 'profile' ? null : 'profile')}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] text-muted-foreground transition-all hover:border-cyan-400/40 hover:text-foreground hover:shadow-[0_0_18px_-4px_rgba(34,211,238,0.55)]"
                aria-label="Profile"
              >
                <User className="h-4 w-4" />
              </button>
              {openMenu === 'profile' && (
                <div className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-xl border border-white/10 bg-background/95 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.7)] backdrop-blur-2xl animate-fade-in">
                  <div className="border-b border-white/10 px-3 py-3">
                    <p className="text-xs font-semibold text-foreground">{isLoggedIn ? 'Signed in' : 'Welcome'}</p>
                    <p className="text-[10px] text-muted-foreground">{isLoggedIn ? (isAdmin ? 'Super Admin' : isReseller ? 'Reseller' : 'Member') : 'Sign in to personalize'}</p>
                  </div>
                  <div className="p-1">
                    {isLoggedIn ? (
                      <>
                        <Link to="/dashboard" onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-foreground transition-colors hover:bg-white/5">
                          <LayoutDashboard className="h-3.5 w-3.5" /> Dashboard
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-yellow-300 transition-colors hover:bg-yellow-500/10">
                            <Crown className="h-3.5 w-3.5" /> Boss Panel
                          </Link>
                        )}
                        {isReseller && !isAdmin && (
                          <Link to="/reseller/dashboard" onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-foreground transition-colors hover:bg-white/5">
                            <Users className="h-3.5 w-3.5" /> Reseller Panel
                          </Link>
                        )}
                        <button
                          onClick={() => { logout(); setOpenMenu(null); navigate('/'); }}
                          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
                        >
                          <LogOut className="h-3.5 w-3.5" /> Logout
                        </button>
                      </>
                    ) : (
                      <Link to="/login" onClick={() => setOpenMenu(null)} className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-xs text-foreground transition-colors hover:bg-white/5">
                        <LogIn className="h-3.5 w-3.5" /> Sign in
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile search */}
        {searchOpen && (
          <div className="border-t border-border bg-background px-6 py-3 md:hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 rounded-full bg-secondary px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                autoFocus
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={handleSearchKeyDown}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
                placeholder="Search apps..."
              />
              <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }}>
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* Mini Cart Popup */}
      {showMiniCart && totalItems > 0 && (
        <div className="fixed right-6 top-20 z-50 w-80 rounded-xl border border-border bg-card p-4 shadow-2xl">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground">Added to Cart</span>
            <button onClick={() => setShowMiniCart(false)}>
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
          {items.slice(-3).map(item => (
            <div key={item.product.id} className="mb-2 flex items-center justify-between rounded-lg bg-secondary p-2">
              <div className="flex items-center gap-2">
                <img src={item.product.thumbnail} alt="" className="h-8 w-8 rounded object-cover" />
                <div>
                  <p className="text-xs font-medium text-foreground">{item.product.name}</p>
                  <p className="text-[10px] text-muted-foreground">${item.plan === 'monthly' ? item.product.subscription.monthly + '/mo' : item.plan === 'yearly' ? item.product.subscription.yearly + '/yr' : item.product.price}</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.product.id)}>
                <X className="h-3 w-3 text-muted-foreground" />
              </button>
            </div>
          ))}
          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <span className="text-sm font-semibold text-foreground">${totalPrice}</span>
            <Link
              to="/cart"
              onClick={() => setShowMiniCart(false)}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}
    </>
  );
};