import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    /* ========================================
       ENTERPRISE BREAKPOINT SYSTEM
       Mobile-first approach
       ======================================== */
    screens: {
      /* Mobile Small: 360px+ */
      "mobile-sm": "360px",
      /* Mobile: 480px+ */
      "mobile": "480px",
      /* Tablet: 768px+ */
      "tablet": "768px",
      /* Laptop: 1024px+ */
      "laptop": "1024px",
      /* Desktop: 1280px+ */
      "desktop": "1280px",
      /* Wide: 1536px+ */
      "wide": "1536px",
      /* Ultra: 1920px+ */
      "ultra": "1920px",
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Space Grotesk", "system-ui", "sans-serif"],
      },
      spacing: {
        1: "var(--space-1)",
        2: "var(--space-2)",
        3: "var(--space-3)",
        4: "var(--space-4)",
        5: "var(--space-5)",
        6: "var(--space-6)",
        7: "var(--space-7)",
        8: "var(--space-8)",
        9: "var(--space-9)",
        10: "var(--space-10)",
        "enterprise-page": "var(--container-page)",
        "enterprise-dashboard": "var(--container-dashboard)",
        "enterprise-readable": "var(--container-readable)",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        mp: {
          success: "hsl(var(--mp-success))",
          warning: "hsl(var(--mp-warning))",
          error: "hsl(var(--mp-error))",
          info: "hsl(var(--mp-info))",
          gold: "hsl(var(--mp-gold))",
          purple: "hsl(var(--mp-purple))",
        },
        enterprise: {
          /* Semantic Surface System */
          surface: {
            base: "var(--surface-base)",
            raised: "var(--surface-raised)",
            card: "var(--surface-card)",
            elevated: "var(--surface-elevated)",
            floating: "var(--surface-floating)",
            overlay: "var(--surface-overlay)",
            glass: "var(--surface-glass)",
            dashboard: "var(--surface-dashboard)",
            input: "var(--surface-input)",
            hover: "var(--surface-hover)",
            active: "var(--surface-active)",
          },
          /* Semantic Text System */
          text: {
            primary: "var(--text-primary)",
            secondary: "var(--text-secondary)",
            muted: "var(--text-muted)",
            soft: "var(--text-soft)",
            disabled: "var(--text-disabled)",
            success: "var(--text-success)",
            warning: "var(--text-warning)",
            danger: "var(--text-danger)",
            info: "var(--text-info)",
            accent: "var(--text-accent)",
          },
          /* Semantic Border System */
          border: {
            soft: "var(--border-soft)",
            normal: "var(--border-normal)",
            strong: "var(--border-strong)",
            glow: "var(--border-glow)",
            focus: "var(--border-focus)",
            success: "var(--border-success)",
            warning: "var(--border-warning)",
            danger: "var(--border-danger)",
            accent: "var(--border-accent)",
          },
          /* Legacy token mappings (for compatibility) */
          bg: {
            primary: "var(--bg-primary)",
            secondary: "var(--bg-secondary)",
            card: "var(--bg-card)",
            elevated: "var(--bg-elevated)",
            overlay: "var(--bg-overlay)",
          },
          /* Brand Accents */
          accent: {
            cyan: "var(--accent-cyan)",
            fuchsia: "var(--accent-fuchsia)",
            emerald: "var(--accent-emerald)",
            warning: "var(--accent-warning)",
            danger: "var(--accent-danger)",
            info: "var(--accent-info)",
            gold: "var(--accent-gold)",
            purple: "var(--accent-purple)",
          },
        },
      },
      fontSize: {
        xs: ["var(--text-xs)", { lineHeight: "var(--leading-normal)" }],
        sm: ["var(--text-sm)", { lineHeight: "var(--leading-normal)" }],
        base: ["var(--text-base)", { lineHeight: "var(--leading-normal)" }],
        lg: ["var(--text-lg)", { lineHeight: "var(--leading-snug)" }],
        xl: ["var(--text-xl)", { lineHeight: "var(--leading-snug)" }],
        "2xl": ["var(--text-2xl)", { lineHeight: "var(--leading-tight)" }],
        "3xl": ["var(--text-3xl)", { lineHeight: "var(--leading-tight)" }],
        "4xl": ["var(--text-4xl)", { lineHeight: "var(--leading-tight)" }],
        "5xl": ["var(--text-5xl)", { lineHeight: "var(--leading-tight)" }],
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      boxShadow: {
        xs: "var(--shadow-xs)",
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        lg: "var(--shadow-lg)",
        xl: "var(--shadow-xl)",
        focus: "var(--shadow-focus)",
        glow: "var(--shadow-glow)",
      },
      transitionDuration: {
        fast: "var(--motion-fast)",
        normal: "var(--motion-normal)",
        slow: "var(--motion-slow)",
        slower: "var(--motion-slower)",
      },
      transitionTimingFunction: {
        standard: "var(--ease-standard)",
        emphasized: "var(--ease-emphasized)",
        enter: "var(--ease-enter)",
        exit: "var(--ease-exit)",
      },
      zIndex: {
        base: "var(--z-base)",
        raised: "var(--z-raised)",
        sticky: "var(--z-sticky)",
        dropdown: "var(--z-dropdown)",
        overlay: "var(--z-overlay)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        toast: "var(--z-toast)",
        tooltip: "var(--z-tooltip)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        /* Enterprise entrance animations */
        "fadeIn": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slideUp": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slideUpSm": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slideDown": {
          from: { opacity: "0", transform: "translateY(-20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scaleIn": {
          from: { opacity: "0", transform: "scale(0.95)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "slideLeft": {
          from: { opacity: "0", transform: "translateX(-20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slideRight": {
          from: { opacity: "0", transform: "translateX(20px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        /* Enterprise exit animations */
        "exitFade": {
          from: { opacity: "1" },
          to: { opacity: "0" },
        },
        "exitSlideUp": {
          from: { opacity: "1", transform: "translateY(0)" },
          to: { opacity: "0", transform: "translateY(-10px)" },
        },
        "exitScale": {
          from: { opacity: "1", transform: "scale(1)" },
          to: { opacity: "0", transform: "scale(0.95)" },
        },
        /* Loading animations */
        "skeletonShimmer": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "shimmerSlide": {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        "spin": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
        "pulseScale": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.95)" },
        },
        "loaderDots": {
          "0%, 80%, 100%": { transform: "scale(0)" },
          "40%": { transform: "scale(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        /* Enterprise entrance animations */
        "fade-in": "fadeIn 250ms cubic-bezier(0, 0, 0.2, 1) forwards",
        "fade-in-slow": "fadeIn 400ms cubic-bezier(0, 0, 0.2, 1) forwards",
        "slide-up": "slideUp 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up-sm": "slideUpSm 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-down": "slideDown 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scale-in": "scaleIn 250ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-left": "slideLeft 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-right": "slideRight 400ms cubic-bezier(0.16, 1, 0.3, 1) forwards",
        /* Enterprise exit animations */
        "exit-fade": "exitFade 200ms cubic-bezier(0.4, 0, 1, 1) forwards",
        "exit-slide-up": "exitSlideUp 200ms cubic-bezier(0.4, 0, 1, 1) forwards",
        "exit-scale": "exitScale 200ms cubic-bezier(0.4, 0, 1, 1) forwards",
        /* Loading animations */
        "skeleton": "skeletonShimmer 1.5s ease-in-out infinite",
        "shimmer": "shimmerSlide 1.5s ease-in-out infinite",
        "spin": "spin 1s linear infinite",
        "bounce": "bounce 1.4s ease-in-out infinite both",
        "pulse-scale": "pulseScale 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "loader-dots": "loaderDots 1.4s ease-in-out infinite both",
      },
      gridTemplateColumns: {
        /* Enterprise KPI grids */
        "kpi": "repeat(auto-fit, minmax(140px, 1fr))",
        "kpi-wide": "repeat(auto-fit, minmax(120px, 1fr))",
        /* Enterprise card grids */
        "cards": "repeat(auto-fit, minmax(280px, 1fr))",
        "cards-sm": "repeat(auto-fit, minmax(200px, 1fr))",
        "cards-lg": "repeat(auto-fit, minmax(320px, 1fr))",
        /* Dashboard layout */
        "dashboard": "repeat(12, minmax(0, 1fr))",
        /* Sidebar layouts */
        "sidebar": "16rem 1fr",
        "sidebar-collapsed": "4rem 1fr",
      },
      gridColumn: {
        "span-1": "span 1 / span 1",
        "span-2": "span 2 / span 2",
        "span-3": "span 3 / span 3",
        "span-4": "span 4 / span 4",
        "span-5": "span 5 / span 5",
        "span-6": "span 6 / span 6",
        "span-7": "span 7 / span 7",
        "span-8": "span 8 / span 8",
        "span-9": "span 9 / span 9",
        "span-10": "span 10 / span 10",
        "span-11": "span 11 / span 11",
        "span-12": "span 12 / span 12",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;
