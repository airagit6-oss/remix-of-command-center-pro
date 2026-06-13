import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Play, Eye, ShoppingBag,
  Sparkles, Star, Users, TrendingUp, Activity, Zap, Shield, BarChart3,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { heroSlides } from '@/lib/marketplaceData';
import { useAuth } from '@/contexts/AuthContext';

export const HeroBanner = () => {
  const [current, setCurrent] = useState(0);
  const { isLoggedIn, hasSubscription } = useAuth();
  const { t } = useTranslation('common');
  const [pulse, setPulse] = useState(0);
  const slide = heroSlides[current];

  useEffect(() => {
    const t = setInterval(() => setCurrent(p => (p + 1) % heroSlides.length), 7000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => setPulse(p => (p + 1) % 100), 1500);
    return () => clearInterval(t);
  }, []);

  const installCount = (slide.users * 1.7).toFixed(0);
  const aiScore = (88 + (slide.rating - 4) * 10).toFixed(0);

  return (
    <div className="relative h-[460px] w-full overflow-hidden lg:h-[520px] bg-gradient-to-br from-[hsl(220_30%_4%)] via-[hsl(230_25%_5%)] to-[hsl(260_30%_6%)]">
      {/* Cinematic background image with parallax blur */}
      <img
        src={slide.thumbnail}
        alt={slide.name}
        className="absolute inset-0 h-full w-full object-cover opacity-40 scale-110 blur-sm transition-all duration-1000"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

      {/* Ambient glow blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-cyan-500/15 blur-[120px] animate-pulse" />
      <div className="pointer-events-none absolute -bottom-32 right-1/3 h-[380px] w-[380px] rounded-full bg-fuchsia-500/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/4 right-10 h-[300px] w-[300px] rounded-full bg-emerald-400/10 blur-[100px]" />

      {/* Subtle grid mesh */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'linear-gradient(to right, hsl(190 100% 60% / 0.3) 1px, transparent 1px), linear-gradient(to bottom, hsl(190 100% 60% / 0.3) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content grid */}
      <div className="relative grid h-full grid-cols-1 items-center gap-6 px-6 lg:grid-cols-[1.1fr_1fr] lg:px-10">
        {/* LEFT: copy + CTAs */}
        <div key={slide.id} className="max-w-xl animate-fade-in">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-300 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              {slide.category}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-fuchsia-300 backdrop-blur-sm">
              <Sparkles className="h-3 w-3" /> {t('ai_recommended')}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-300 backdrop-blur-sm">
              <TrendingUp className="h-3 w-3" /> {t('trending')}
            </span>
          </div>

          <h1 className="font-display mb-3 text-4xl font-bold leading-tight text-foreground lg:text-5xl xl:text-6xl">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
              {slide.name}
            </span>
          </h1>
          <p className="mb-5 max-w-lg text-sm text-muted-foreground leading-relaxed lg:text-base">
            {slide.shortDescription}
          </p>

          {/* Stats strip */}
          <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300">
              <Star className="h-3.5 w-3.5 fill-amber-300" />
              <span className="font-semibold">{slide.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({slide.reviews})</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Users className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-semibold">{installCount}</span>
              <span className="text-muted-foreground">{t('installs')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-foreground/80">
              <Shield className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-muted-foreground">{t('enterprise_grade')}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={isLoggedIn && hasSubscription ? '/dashboard' : '/subscription'}
              className="group relative flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-fuchsia-500 px-6 py-3 text-sm font-semibold text-background shadow-[0_8px_32px_-8px_rgba(34,211,238,0.6)] transition-all hover:scale-[1.03] hover:shadow-[0_12px_40px_-8px_rgba(34,211,238,0.8)]"
            >
              <Play className="h-4 w-4" /> {t('access_now')}
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
            <Link
              to={`/product/${slide.id}`}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-medium text-foreground backdrop-blur-md transition-colors hover:border-cyan-400/40 hover:bg-white/10"
            >
              <Eye className="h-4 w-4" /> {t('view_details')}
            </Link>
            <Link
              to={`/checkout?productId=${slide.id}`}
              className="flex items-center gap-2 rounded-xl border border-fuchsia-400/30 px-6 py-3 text-sm font-medium text-fuchsia-200 transition-colors hover:bg-fuchsia-500/10"
            >
              <ShoppingBag className="h-4 w-4" /> {t('buy_now')}
            </Link>
          </div>

          {/* Dots */}
          <div className="mt-7 flex items-center gap-2">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${i === current ? 'w-10 bg-gradient-to-r from-cyan-400 to-fuchsia-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]' : 'w-4 bg-white/15 hover:bg-white/30'}`}
              />
            ))}
            <span className="ml-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {String(current + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
            </span>
          </div>
        </div>

        {/* RIGHT: animated dashboard preview */}
        <div className="relative hidden h-full items-center justify-center lg:flex">
          <div className="relative w-full max-w-[480px]">
            {/* Main glass dashboard panel */}
            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.02] p-5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-fuchsia-500/5" />

              {/* header */}
              <div className="relative mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-red-400/80" />
                  <div className="h-2 w-2 rounded-full bg-amber-400/80" />
                  <div className="h-2 w-2 rounded-full bg-emerald-400/80" />
                  <span className="ml-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                    {slide.name} · Live Console
                  </span>
                </div>
                <span className="flex items-center gap-1 text-[10px] text-emerald-300">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </span>
                  LIVE
                </span>
              </div>

              {/* KPI row */}
              <div className="relative grid grid-cols-3 gap-2">
                {[
                  { label: 'AI Score', value: aiScore, icon: Sparkles, color: 'text-fuchsia-300', bg: 'from-fuchsia-500/20' },
                  { label: 'Active', value: (1200 + pulse * 7).toLocaleString(), icon: Activity, color: 'text-cyan-300', bg: 'from-cyan-500/20' },
                  { label: 'Uptime', value: '99.99%', icon: Zap, color: 'text-emerald-300', bg: 'from-emerald-500/20' },
                ].map(k => (
                  <div key={k.label} className={`relative overflow-hidden rounded-lg border border-white/10 bg-gradient-to-br ${k.bg} to-transparent p-2.5`}>
                    <k.icon className={`mb-1 h-3 w-3 ${k.color}`} />
                    <div className="text-sm font-bold text-foreground tabular-nums">{k.value}</div>
                    <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{k.label}</div>
                  </div>
                ))}
              </div>

              {/* Mini chart */}
              <div className="relative mt-4 rounded-lg border border-white/10 bg-black/20 p-3">
                <div className="mb-2 flex items-center justify-between text-[10px]">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <BarChart3 className="h-3 w-3 text-cyan-400" /> Realtime Throughput
                  </span>
                  <span className="text-emerald-300">+{(12 + (pulse % 9)).toFixed(1)}%</span>
                </div>
                <svg viewBox="0 0 200 60" className="h-14 w-full">
                  <defs>
                    <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(190 100% 60%)" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="hsl(190 100% 60%)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d={`M0,${40 - (pulse % 8)} L20,${30 + (pulse % 6)} L40,${35 - (pulse % 10)} L60,${20 + (pulse % 5)} L80,${28 - (pulse % 7)} L100,${15 + (pulse % 8)} L120,${22 - (pulse % 6)} L140,${10 + (pulse % 4)} L160,${18 - (pulse % 5)} L180,${8 + (pulse % 3)} L200,${14 - (pulse % 4)} L200,60 L0,60 Z`}
                    fill="url(#hg)"
                  />
                  <path
                    d={`M0,${40 - (pulse % 8)} L20,${30 + (pulse % 6)} L40,${35 - (pulse % 10)} L60,${20 + (pulse % 5)} L80,${28 - (pulse % 7)} L100,${15 + (pulse % 8)} L120,${22 - (pulse % 6)} L140,${10 + (pulse % 4)} L160,${18 - (pulse % 5)} L180,${8 + (pulse % 3)} L200,${14 - (pulse % 4)}`}
                    fill="none"
                    stroke="hsl(190 100% 65%)"
                    strokeWidth="1.5"
                    className="drop-shadow-[0_0_6px_rgba(34,211,238,0.6)]"
                  />
                </svg>
              </div>
            </div>

            {/* Floating widget: activity */}
            <div className="absolute -left-6 -bottom-4 hidden w-[200px] rounded-xl border border-white/10 bg-gradient-to-br from-[hsl(220_30%_8%)] to-[hsl(260_30%_6%)] p-3 shadow-2xl backdrop-blur-xl xl:block animate-fade-in">
              <div className="mb-2 flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-fuchsia-500/20">
                  <Sparkles className="h-3.5 w-3.5 text-fuchsia-300" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-foreground">AI Insight</div>
                  <div className="text-[9px] text-muted-foreground">Updated now</div>
                </div>
              </div>
              <p className="text-[10px] leading-snug text-muted-foreground">
                Best for <span className="text-cyan-300">{slide.category.toLowerCase()}</span> teams scaling globally.
              </p>
            </div>

            {/* Floating widget: viewers */}
            <div className="absolute -right-4 -top-3 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-1.5 backdrop-blur-xl">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
              </span>
              <span className="text-[10px] font-medium text-foreground">
                {340 + (pulse % 60)} viewing now
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Arrows */}
      <button
        onClick={() => setCurrent(p => (p - 1 + heroSlides.length) % heroSlides.length)}
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-foreground backdrop-blur-md transition-all hover:scale-110 hover:border-cyan-400/40 hover:bg-black/60"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent(p => (p + 1) % heroSlides.length)}
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/40 text-foreground backdrop-blur-md transition-all hover:scale-110 hover:border-cyan-400/40 hover:bg-black/60"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};
