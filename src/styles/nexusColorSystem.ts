/**
 * SOFTWARE VALA NEXUS
 * Enterprise Color System v1.0
 * 
 * Single Design Language for 70+ Modules
 * Datadog + Grafana + Linear + Vercel Enterprise Feel
 * Dark Premium Enterprise - No Consumer App Style
 */

// ============================================================================
// PRIMARY BRAND COLORS
// ============================================================================

export const NEXUS_COLORS = {
  // PRIMARY BRAND COLORS
  BRAND: {
    // Software Vala Blue - Main Brand Color
    blue: '#00D4FF',           // Buttons, Links, Active States, Charts, AI Elements
    // Software Vala Cyan - Premium Effects
    cyan: '#00FFF0',           // Glow Effects, Highlights, Premium Borders, Realtime Indicators
    // Software Vala Emerald - Success
    emerald: '#00E676',        // Success, Healthy Systems, Online Status, Revenue Growth
  },

  // ========================================================================
  // DARK FOUNDATION - BASE LAYERS
  // ========================================================================
  FOUNDATION: {
    mainBackground: '#050816',     // Main Background (darkest)
    pageBackground: '#0B1020',     // Page Background
    sidebarBackground: '#0A0F1C',  // Sidebar Background
    cardBackground: '#111827',     // Card/Component Background
    modalBackground: '#161F35',    // Modal/Overlay Background
  },

  // ========================================================================
  // TEXT SYSTEM
  // ========================================================================
  TEXT: {
    primary: '#FFFFFF',            // Primary Text (High Contrast)
    secondary: '#C7D2FE',          // Secondary Text (Good Contrast)
    muted: '#94A3B8',              // Muted Text (Low Contrast - Helper Text)
    disabled: '#64748B',           // Disabled Text (Very Low Contrast)
  },

  // ========================================================================
  // STATUS INDICATORS
  // ========================================================================
  STATUS: {
    success: '#00E676',            // Online, Healthy, Positive
    warning: '#F59E0B',            // Caution, Attention Needed
    danger: '#EF4444',             // Error, Failed
    critical: '#DC2626',           // Critical, Emergency
    info: '#00D4FF',               // Information, Alerts
  },

  // ========================================================================
  // AI SYSTEM - NEXUS INTELLIGENCE COLORS
  // ========================================================================
  AI: {
    primary: '#00D4FF',            // AI Primary (Blue)
    secondary: '#00FFF0',          // AI Secondary (Cyan)
    glow: '#38BDF8',               // AI Glow Effect
    premium: '#7C3AED',            // AI Premium (Purple)
  },

  // ========================================================================
  // MODULE SPECIFIC COLORS (for 70+ modules)
  // ========================================================================
  MODULES: {
    valaAI: '#00D4FF',             // Vala AI (Blue)
    aiAPIManager: '#7C3AED',       // AI API Manager (Purple)
    serverManager: '#06B6D4',      // Server Manager (Cyan)
    developmentManager: '#3B82F6', // Development Manager (Indigo)
    productManager: '#8B5CF6',     // Product Manager (Violet)
    taskManager: '#F59E0B',        // Task Manager (Amber)
    demoManager: '#10B981',        // Demo Manager (Emerald)
    leadManager: '#22C55E',        // Lead Manager (Green)
    salesManager: '#00E676',       // Sales Manager (Bright Green)
    marketingManager: '#EC4899',   // Marketing Manager (Pink)
    seoManager: '#A855F7',         // SEO Manager (Purple)
    supportManager: '#14B8A6',     // Support Manager (Teal)
    financeManager: '#F59E0B',     // Finance Manager (Amber)
    legalManager: '#EF4444',       // Legal Manager (Red)
    securityManager: '#DC2626',    // Security Manager (Dark Red)
  },

  // ========================================================================
  // CHART COLORS - 6 Series for Data Visualization
  // ========================================================================
  CHARTS: {
    series1: '#00D4FF',            // Blue (Primary)
    series2: '#00FFF0',            // Cyan (Secondary)
    series3: '#00E676',            // Emerald (Tertiary)
    series4: '#F59E0B',            // Amber (Quaternary)
    series5: '#EF4444',            // Red (Quinary)
    series6: '#8B5CF6',            // Purple (Senary)
  },

  // ========================================================================
  // GLOW SYSTEM - For Enterprise Premium Effects
  // ========================================================================
  GLOW: {
    blueGlow: 'rgba(0,212,255,0.35)',    // #00D4FF with 35% opacity
    cyanGlow: 'rgba(0,255,240,0.35)',    // #00FFF0 with 35% opacity
    greenGlow: 'rgba(0,230,118,0.35)',   // #00E676 with 35% opacity
    purpleGlow: 'rgba(124,58,237,0.35)', // #7C3AED with 35% opacity
    redGlow: 'rgba(239,68,68,0.35)',     // #EF4444 with 35% opacity
  },

  // ========================================================================
  // BORDERS & DIVIDERS
  // ========================================================================
  BORDERS: {
    subtle: 'rgba(200,213,254,0.1)',     // Very subtle
    light: 'rgba(200,213,254,0.2)',      // Light border
    premium: '#00FFF0',                  // Premium cyan border
    active: '#00D4FF',                   // Active blue border
  },

  // ========================================================================
  // SIDEBAR RULES
  // ========================================================================
  SIDEBAR: {
    background: '#0A0F1C',               // Sidebar background
    activeItem: '#00D4FF',               // Active menu item (blue)
    hover: '#111827',                    // Hover state
    icons: '#94A3B8',                    // Icon color (muted)
    activeIcons: '#00D4FF',              // Active icon color (blue)
    text: '#C7D2FE',                     // Text color (secondary)
  },

  // ========================================================================
  // SHADOWS - Enterprise Dark Theme
  // ========================================================================
  SHADOWS: {
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 4px 6px rgba(0,0,0,0.4)',
    lg: '0 10px 15px rgba(0,0,0,0.5)',
    xl: '0 20px 25px rgba(0,0,0,0.6)',
    glow: '0 0 20px rgba(0,212,255,0.2)',
  },

  // ========================================================================
  // TRANSPARENCY LEVELS
  // ========================================================================
  OPACITY: {
    disabled: 0.5,
    hover: 0.8,
    focus: 0.9,
  },
};

// ============================================================================
// CSS VARIABLES - For Global Theme Application
// ============================================================================

export const generateCSSVariables = (): string => {
  return `
:root {
  /* Primary Brand Colors */
  --color-brand-blue: ${NEXUS_COLORS.BRAND.blue};
  --color-brand-cyan: ${NEXUS_COLORS.BRAND.cyan};
  --color-brand-emerald: ${NEXUS_COLORS.BRAND.emerald};

  /* Dark Foundation */
  --color-bg-main: ${NEXUS_COLORS.FOUNDATION.mainBackground};
  --color-bg-page: ${NEXUS_COLORS.FOUNDATION.pageBackground};
  --color-bg-sidebar: ${NEXUS_COLORS.FOUNDATION.sidebarBackground};
  --color-bg-card: ${NEXUS_COLORS.FOUNDATION.cardBackground};
  --color-bg-modal: ${NEXUS_COLORS.FOUNDATION.modalBackground};

  /* Text System */
  --color-text-primary: ${NEXUS_COLORS.TEXT.primary};
  --color-text-secondary: ${NEXUS_COLORS.TEXT.secondary};
  --color-text-muted: ${NEXUS_COLORS.TEXT.muted};
  --color-text-disabled: ${NEXUS_COLORS.TEXT.disabled};

  /* Status Indicators */
  --color-status-success: ${NEXUS_COLORS.STATUS.success};
  --color-status-warning: ${NEXUS_COLORS.STATUS.warning};
  --color-status-danger: ${NEXUS_COLORS.STATUS.danger};
  --color-status-critical: ${NEXUS_COLORS.STATUS.critical};
  --color-status-info: ${NEXUS_COLORS.STATUS.info};

  /* AI System */
  --color-ai-primary: ${NEXUS_COLORS.AI.primary};
  --color-ai-secondary: ${NEXUS_COLORS.AI.secondary};
  --color-ai-glow: ${NEXUS_COLORS.AI.glow};
  --color-ai-premium: ${NEXUS_COLORS.AI.premium};

  /* Glow Effects */
  --glow-blue: ${NEXUS_COLORS.GLOW.blueGlow};
  --glow-cyan: ${NEXUS_COLORS.GLOW.cyanGlow};
  --glow-green: ${NEXUS_COLORS.GLOW.greenGlow};
  --glow-purple: ${NEXUS_COLORS.GLOW.purpleGlow};
  --glow-red: ${NEXUS_COLORS.GLOW.redGlow};

  /* Sidebar */
  --sidebar-bg: ${NEXUS_COLORS.SIDEBAR.background};
  --sidebar-active: ${NEXUS_COLORS.SIDEBAR.activeItem};
  --sidebar-hover: ${NEXUS_COLORS.SIDEBAR.hover};
  --sidebar-icons: ${NEXUS_COLORS.SIDEBAR.icons};
  --sidebar-icons-active: ${NEXUS_COLORS.SIDEBAR.activeIcons};

  /* Shadows */
  --shadow-sm: ${NEXUS_COLORS.SHADOWS.sm};
  --shadow-md: ${NEXUS_COLORS.SHADOWS.md};
  --shadow-lg: ${NEXUS_COLORS.SHADOWS.lg};
  --shadow-xl: ${NEXUS_COLORS.SHADOWS.xl};
  --shadow-glow: ${NEXUS_COLORS.SHADOWS.glow};
}

/* NEXUS Enterprise Dark Theme - Base Styles */
* {
  color-scheme: dark;
}

body {
  background-color: var(--color-bg-main);
  color: var(--color-text-primary);
}

/* Primary Action Colors */
button, [role="button"], .btn {
  background-color: var(--color-brand-blue);
  color: var(--color-bg-main);
}

/* Links */
a {
  color: var(--color-brand-blue);
}

/* Card Components */
.card, [role="article"] {
  background-color: var(--color-bg-card);
  border-color: var(--color-border-light);
}

/* Sidebar Navigation */
.sidebar, nav[aria-label="Main navigation"] {
  background-color: var(--sidebar-bg);
}

/* Status Badges */
.status-success { color: var(--color-status-success); }
.status-warning { color: var(--color-status-warning); }
.status-danger { color: var(--color-status-danger); }
.status-critical { color: var(--color-status-critical); }
.status-info { color: var(--color-status-info); }
`;
};

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get module color by module name
 */
export const getModuleColor = (moduleName: string): string => {
  const moduleLower = moduleName.toLowerCase().replace(/\s+/g, '');
  return (NEXUS_COLORS.MODULES as any)[moduleLower] || NEXUS_COLORS.BRAND.blue;
};

/**
 * Get status color with optional opacity adjustment
 */
export const getStatusColor = (status: 'success' | 'warning' | 'danger' | 'critical' | 'info'): string => {
  return NEXUS_COLORS.STATUS[status];
};

/**
 * Get chart color by series index (1-6)
 */
export const getChartColor = (seriesIndex: 1 | 2 | 3 | 4 | 5 | 6): string => {
  const colors = [
    NEXUS_COLORS.CHARTS.series1,
    NEXUS_COLORS.CHARTS.series2,
    NEXUS_COLORS.CHARTS.series3,
    NEXUS_COLORS.CHARTS.series4,
    NEXUS_COLORS.CHARTS.series5,
    NEXUS_COLORS.CHARTS.series6,
  ];
  return colors[seriesIndex - 1];
};

/**
 * Apply glow effect (for premium elements)
 */
export const applyGlow = (color: 'blue' | 'cyan' | 'green' | 'purple' | 'red'): string => {
  return (NEXUS_COLORS.GLOW as any)[`${color}Glow`];
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================

export default NEXUS_COLORS;
